"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Users,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Timer,
  MessageSquare,
  TrendingUp,
  Info,
} from "lucide-react";
import { ExamModel } from "@/types/exam/exam";
import { useOrganizationInstructors } from "@/hooks/organization/use-organization-instructors";
import { User } from "@/types/user";
import { TimeWindow } from "@/types/exam/exam";

interface SpeakingGroupStepProps {
  examData: Partial<ExamModel>;
  updateExamData: (updates: Partial<ExamModel>) => void;
  organizationId: number;
  onNext: () => void;
  onPrevious: () => void;
  isAdmin?: boolean;
}

export const SpeakingGroupStep: React.FC<SpeakingGroupStepProps> = ({
  examData,
  updateExamData,
  organizationId,
  onNext,
  onPrevious,
  isAdmin,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { instructors, isLoading } = useOrganizationInstructors({
    organizationId,
    initialPageSize: 50,
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // If admin mode is enabled, skip validation entirely
    if (isAdmin) {
      setErrors({});
      return true;
    }

    if (!examData.speaking_group?.time_windows?.length) {
      newErrors.time_windows = "At least one time window is required";
    }

    if (!examData.speaking_group?.assigned_instructors?.length) {
      newErrors.assigned_instructors =
        "At least one instructor must be assigned";
    }

    if (
      !examData.speaking_group?.session_per_student ||
      examData.speaking_group.session_per_student <= 0
    ) {
      newErrors.session_per_student = "Session duration must be greater than 0";
    }

    // Validate time windows
    examData.speaking_group?.time_windows?.forEach((window, index) => {
      if (!window.date) {
        newErrors[`time_window_${index}_date`] = "Date is required";
      }
      if (!window.start_time) {
        newErrors[`time_window_${index}_start_time`] = "Start time is required";
      }
      if (!window.end_time) {
        newErrors[`time_window_${index}_end_time`] = "End time is required";
      }
      if (
        window.start_time &&
        window.end_time &&
        window.start_time >= window.end_time
      ) {
        newErrors[`time_window_${index}_end_time`] =
          "End time must be after start time";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const handleSpeakingGroupChange = (field: string, value: unknown) => {
    updateExamData({
      // @ts-ignore
      speaking_group: {
        ...examData.speaking_group,
        [field]: value,
      },
    });

    // Clear error when user makes changes
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleInstructorToggle = (instructor: User, checked: boolean) => {
    const currentInstructors =
      examData.speaking_group?.assigned_instructors || [];

    let updatedInstructors;
    if (checked) {
      updatedInstructors = [...currentInstructors, instructor];
    } else {
      updatedInstructors = currentInstructors.filter(
        (i) => i.id !== instructor.id
      );
    }

    handleSpeakingGroupChange("assigned_instructors", updatedInstructors);
  };

  const isInstructorSelected = (instructorId: string) => {
    return (
      examData.speaking_group?.assigned_instructors?.some(
        (i) => i.id === instructorId
      ) || false
    );
  };

  const addTimeWindow = () => {
    const currentWindows = examData.speaking_group?.time_windows || [];
    const newWindow: TimeWindow = {
      id: `tw_${Date.now()}`,
      date: "",
      start_time: "",
      end_time: "",
    };

    handleSpeakingGroupChange("time_windows", [...currentWindows, newWindow]);
  };

  const removeTimeWindow = (index: number) => {
    const currentWindows = examData.speaking_group?.time_windows || [];
    const updatedWindows = currentWindows.filter((_, i) => i !== index);
    handleSpeakingGroupChange("time_windows", updatedWindows);
  };

  const updateTimeWindow = (
    index: number,
    field: keyof TimeWindow,
    value: string
  ) => {
    const currentWindows = examData.speaking_group?.time_windows || [];
    const updatedWindows = [...currentWindows];
    updatedWindows[index] = {
      ...updatedWindows[index],
      [field]: value,
    };

    handleSpeakingGroupChange("time_windows", updatedWindows);

    // Clear specific time window errors
    const errorKey = `time_window_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  // Calculate sessions that can fit in a time window with instructor count
  const calculateSessionsInWindow = (
    window: TimeWindow,
    sessionDuration: number,
    instructorCount: number = 0
  ) => {
    if (
      !window.start_time ||
      !window.end_time ||
      !sessionDuration ||
      sessionDuration <= 0
    ) {
      return {
        canFit: 0,
        totalMinutes: 0,
        utilization: 0,
        sessionsPerInstructor: 0,
        totalCapacity: 0,
        instructorCount: 0,
      };
    }

    try {
      // Parse time strings (assuming format like "09:00 AM" or "09:00")
      const parseTime = (timeStr: string) => {
        // Convert 12-hour format to 24-hour if needed
        const [time, modifier] = timeStr.split(" ");
        // eslint-disable-next-line prefer-const
        let [hours, minutes] = time.split(":").map(Number);

        if (modifier) {
          if (modifier === "PM" && hours !== 12) hours += 12;
          if (modifier === "AM" && hours === 12) hours = 0;
        }

        return hours * 60 + minutes; // Convert to minutes since midnight
      };

      const startMinutes = parseTime(window.start_time);
      const endMinutes = parseTime(window.end_time);

      // Handle case where end time is next day (e.g., start at 11 PM, end at 2 AM)
      const totalMinutes =
        endMinutes > startMinutes
          ? endMinutes - startMinutes
          : 24 * 60 - startMinutes + endMinutes;

      const sessionsPerInstructor = Math.floor(totalMinutes / sessionDuration);
      const totalCapacity = sessionsPerInstructor * instructorCount;
      const utilizationMinutes = sessionsPerInstructor * sessionDuration;
      const utilization =
        totalMinutes > 0 ? (utilizationMinutes / totalMinutes) * 100 : 0;

      return {
        canFit: sessionsPerInstructor, // Sessions per instructor
        totalMinutes,
        utilization: Math.round(utilization),
        sessionsPerInstructor,
        totalCapacity, // Total sessions across all instructors
        instructorCount,
      };
    } catch (error) {
      console.warn("Error calculating sessions:", error);
      return {
        canFit: 0,
        totalMinutes: 0,
        utilization: 0,
        sessionsPerInstructor: 0,
        totalCapacity: 0,
        instructorCount: 0,
      };
    }
  };

  // Calculate total capacity across all windows
  const calculateTotalCapacity = () => {
    const sessionDuration = examData.speaking_group?.session_per_student || 0;
    const instructorCount =
      examData.speaking_group?.assigned_instructors?.length || 0;
    const windows = examData.speaking_group?.time_windows || [];

    let totalCapacity = 0;
    windows.forEach((window) => {
      const calculation = calculateSessionsInWindow(
        window,
        sessionDuration,
        instructorCount
      );
      totalCapacity += calculation.totalCapacity;
    });

    return totalCapacity;
  };

  const selectedInstructorsCount =
    examData.speaking_group?.assigned_instructors?.length || 0;
  const timeWindowsCount = examData.speaking_group?.time_windows?.length || 0;
  const totalCapacity = calculateTotalCapacity();
  const sessionDuration = examData.speaking_group?.session_per_student || 20;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 px-2 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full mb-4">
            <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 sm:mb-3">
            Speaking Group Setup
            {isAdmin && (
              <Badge variant="secondary" className="ml-3 text-xs">
                Optional (Admin Mode)
              </Badge>
            )}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Configure speaking test time windows and assign instructors for
            individual student sessions. Each student will have a one-on-one
            speaking assessment with an instructor.
            {isAdmin && (
              <span className="block mt-2 text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                ⚡ Admin mode: You can skip this step and complete the exam
                without speaking setup.
              </span>
            )}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
          <Card className="border-2 border-border/50 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-4 sm:p-6 text-center">
              <Timer className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                Session Duration
              </p>
              <p className="text-lg sm:text-2xl font-bold text-foreground">
                {sessionDuration}
                <span className="text-xs font-normal text-muted-foreground ml-1">
                  min
                </span>
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-4 sm:p-6 text-center">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                Instructors
              </p>
              <p className="text-lg sm:text-2xl font-bold text-foreground">
                {selectedInstructorsCount}
                <span className="text-xs font-normal text-muted-foreground ml-1">
                  assigned
                </span>
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-4 sm:p-6 text-center">
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                Time Windows
              </p>
              <p className="text-lg sm:text-2xl font-bold text-foreground">
                {timeWindowsCount}
                <span className="text-xs font-normal text-muted-foreground ml-1">
                  scheduled
                </span>
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-4 sm:p-6 text-center">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                Total Capacity
              </p>
              <p className="text-lg sm:text-2xl font-bold text-foreground">
                {totalCapacity}
                <span className="text-xs font-normal text-muted-foreground ml-1">
                  sessions
                </span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-10">
          {/* Session Configuration */}
          <div className="xl:col-span-1">
            <Card className="border-2 border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl text-foreground flex items-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                    <Timer className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  Session Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className=" dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start space-x-3">
                    <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                        Speaking Test Format
                      </h4>
                      <p className="text-xs text-blue-800 dark:text-blue-200">
                        Each student will have a one-on-one speaking assessment
                        with an instructor. Standard IELTS speaking tests take
                        11-14 minutes.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="session_duration"
                    className="text-sm sm:text-base font-medium text-foreground flex items-center"
                  >
                    Session Duration (minutes)
                    <span className="text-destructive ml-1">*</span>
                  </Label>
                  <Input
                    id="session_duration"
                    type="number"
                    value={examData.speaking_group?.session_per_student || 20}
                    onChange={(e) =>
                      handleSpeakingGroupChange(
                        "session_per_student",
                        parseInt(e.target.value) || 0
                      )
                    }
                    placeholder="20"
                    min="10"
                    max="60"
                    className={`h-11 sm:h-12 ${
                      errors.session_per_student
                        ? "border-destructive ring-destructive/20"
                        : ""
                    }`}
                  />
                  {errors.session_per_student && (
                    <div className="flex items-center space-x-2 text-destructive">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <p className="text-sm">{errors.session_per_student}</p>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Includes assessment time and transition between students
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Time Windows Configuration */}
          <div className="xl:col-span-2">
            <Card className="border-2 border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl text-foreground flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-3">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    Time Windows
                    {timeWindowsCount > 0 && (
                      <Badge variant="secondary" className="ml-3 text-xs">
                        {timeWindowsCount} configured
                      </Badge>
                    )}
                  </div>
                  <Button
                    onClick={addTimeWindow}
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Window
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {errors.time_windows && (
                  <div className="flex items-center space-x-2 text-destructive">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <p className="text-sm">{errors.time_windows}</p>
                  </div>
                )}

                <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-none">
                  {examData.speaking_group?.time_windows?.map(
                    (window, index) => (
                      <Card
                        key={window.id || index}
                        className="border-2 border-muted/50 shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">
                                {index + 1}
                              </div>
                              <h4 className="font-medium text-sm sm:text-base text-foreground">
                                Time Window {index + 1}
                              </h4>
                            </div>
                            <Button
                              onClick={() => removeTimeWindow(index)}
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <Label className="text-sm font-medium text-foreground flex items-center mb-2">
                                <Calendar className="w-4 h-4 mr-2" />
                                Date
                                <span className="text-destructive ml-1">*</span>
                              </Label>
                              <DatePicker
                                value={
                                  window.date
                                    ? new Date(window.date)
                                    : undefined
                                }
                                onChange={(date) =>
                                  updateTimeWindow(
                                    index,
                                    "date",
                                    date ? date.toISOString().split("T")[0] : ""
                                  )
                                }
                                placeholder="Select date"
                                minDate={new Date()}
                                className={`w-full h-11 sm:h-12 ${
                                  errors[`time_window_${index}_date`]
                                    ? "border-destructive ring-destructive/20"
                                    : ""
                                }`}
                              />
                              {errors[`time_window_${index}_date`] && (
                                <div className="flex items-center space-x-2 text-destructive mt-2">
                                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                  <p className="text-xs">
                                    {errors[`time_window_${index}_date`]}
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium text-foreground flex items-center mb-2">
                                  Start Time
                                  <span className="text-destructive ml-1">
                                    *
                                  </span>
                                </Label>
                                <TimePicker
                                  value={window.start_time}
                                  onChange={(time) =>
                                    updateTimeWindow(index, "start_time", time)
                                  }
                                  placeholder="Start time"
                                  format="12h"
                                  className={`w-full h-11 sm:h-12 ${
                                    errors[`time_window_${index}_start_time`]
                                      ? "border-destructive ring-destructive/20"
                                      : ""
                                  }`}
                                />
                                {errors[`time_window_${index}_start_time`] && (
                                  <div className="flex items-center space-x-2 text-destructive mt-2">
                                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                    <p className="text-xs">
                                      {
                                        errors[
                                          `time_window_${index}_start_time`
                                        ]
                                      }
                                    </p>
                                  </div>
                                )}
                              </div>

                              <div>
                                <Label className="text-sm font-medium text-foreground flex items-center mb-2">
                                  End Time
                                  <span className="text-destructive ml-1">
                                    *
                                  </span>
                                </Label>
                                <TimePicker
                                  value={window.end_time}
                                  onChange={(time) =>
                                    updateTimeWindow(index, "end_time", time)
                                  }
                                  placeholder="End time"
                                  format="12h"
                                  className={`w-full h-11 sm:h-12 ${
                                    errors[`time_window_${index}_end_time`]
                                      ? "border-destructive ring-destructive/20"
                                      : ""
                                  }`}
                                />
                                {errors[`time_window_${index}_end_time`] && (
                                  <div className="flex items-center space-x-2 text-destructive mt-2">
                                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                    <p className="text-xs">
                                      {errors[`time_window_${index}_end_time`]}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Session Calculation Display */}
                            {window.start_time &&
                              window.end_time &&
                              examData.speaking_group?.session_per_student && (
                                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                                  {(() => {
                                    const sessionDuration =
                                      examData.speaking_group
                                        .session_per_student;
                                    const instructorCount =
                                      examData.speaking_group
                                        ?.assigned_instructors?.length || 0;
                                    const calculation =
                                      calculateSessionsInWindow(
                                        window,
                                        sessionDuration,
                                        instructorCount
                                      );

                                    if (instructorCount === 0) {
                                      return (
                                        <div className="flex items-center space-x-2 text-amber-600">
                                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                          <span className="text-sm">
                                            Assign instructors to see session
                                            capacity
                                          </span>
                                        </div>
                                      );
                                    }

                                    if (
                                      calculation.sessionsPerInstructor === 0
                                    ) {
                                      return (
                                        <div className="flex items-center space-x-2 text-amber-600">
                                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                          <span className="text-sm">
                                            Time window too short for{" "}
                                            {sessionDuration}-minute sessions
                                          </span>
                                        </div>
                                      );
                                    }

                                    return (
                                      <div className="space-y-3">
                                        <div className="flex items-center space-x-2 mb-2">
                                          <CheckCircle2 className="w-4 h-4 text-primary" />
                                          <span className="text-sm font-medium text-foreground">
                                            Session Capacity
                                          </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                          <div className="text-center p-2 bg-background/50 rounded">
                                            <p className="text-muted-foreground text-xs mb-1">
                                              Total Sessions
                                            </p>
                                            <p className="font-bold text-primary text-lg">
                                              {calculation.totalCapacity}
                                            </p>
                                          </div>

                                          <div className="text-center p-2 bg-background/50 rounded">
                                            <p className="text-muted-foreground text-xs mb-1">
                                              Per Instructor
                                            </p>
                                            <p className="font-bold text-foreground text-lg">
                                              {
                                                calculation.sessionsPerInstructor
                                              }
                                            </p>
                                          </div>
                                        </div>

                                        {calculation.totalMinutes %
                                          sessionDuration >
                                          0 && (
                                          <div className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/20 rounded p-2">
                                            {calculation.totalMinutes %
                                              sessionDuration}{" "}
                                            minutes unused - consider adjusting
                                            times
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })()}
                                </div>
                              )}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  )}

                  {(!examData.speaking_group?.time_windows ||
                    examData.speaking_group.time_windows.length === 0) && (
                    <div className="text-center py-12 px-4">
                      <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        No time windows configured
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Add time windows to schedule speaking test sessions for
                        your students.
                      </p>
                      <Button
                        onClick={addTimeWindow}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Time Window
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Instructor Assignment */}
        <Card className="border-2 border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 mb-8 sm:mb-10">
          <CardHeader className="pb-4 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl text-foreground flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                </div>
                Assign Instructors
                {selectedInstructorsCount > 0 && (
                  <Badge variant="secondary" className="ml-3 text-xs">
                    {selectedInstructorsCount} selected
                  </Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <div className="space-y-3">
              <Label className="text-sm sm:text-base font-medium text-foreground flex items-center">
                Select Instructors
                <span className="text-destructive ml-1">*</span>
              </Label>
              {errors.assigned_instructors && (
                <div className="flex items-center space-x-2 text-destructive">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <p className="text-sm">{errors.assigned_instructors}</p>
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse flex items-center space-x-4 p-3 rounded-lg bg-muted/30"
                  >
                    <div className="w-5 h-5 bg-muted rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-2/3"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="max-h-80 sm:max-h-96 overflow-y-auto scrollbar-none border border-border/50 rounded-lg">
                  {instructors.map((instructor, index) => (
                    <div
                      key={instructor.id}
                      className={`flex items-center space-x-4 p-4 hover:bg-muted/30 transition-colors ${
                        index !== instructors.length - 1
                          ? "border-b border-border/30"
                          : ""
                      } ${
                        isInstructorSelected(instructor.id)
                          ? "bg-primary/5 border-primary/20"
                          : ""
                      }`}
                    >
                      <Checkbox
                        id={`speaking-instructor-${instructor.id}`}
                        checked={isInstructorSelected(instructor.id)}
                        onCheckedChange={(checked) =>
                          handleInstructorToggle(instructor, checked as boolean)
                        }
                        className="flex-shrink-0"
                      />
                      <Label
                        htmlFor={`speaking-instructor-${instructor.id}`}
                        className="text-foreground cursor-pointer flex-1 min-w-0"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-sm sm:text-base truncate">
                              {instructor.name}
                            </div>
                            <div className="text-xs sm:text-sm text-muted-foreground truncate">
                              {instructor.email}
                            </div>
                          </div>
                          {isInstructorSelected(instructor.id) && (
                            <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-1 sm:mt-0 sm:ml-2" />
                          )}
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>

                {instructors.length === 0 && (
                  <div className="text-center py-8 px-4">
                    <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm sm:text-base">
                      No instructors available. Please add instructors to your
                      organization first.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Selected Instructors Summary */}
            {selectedInstructorsCount > 0 && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 sm:p-5">
                <div className="flex items-center space-x-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <p className="text-sm sm:text-base font-medium text-foreground">
                    Selected Instructors ({selectedInstructorsCount})
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {examData.speaking_group?.assigned_instructors?.map(
                    (instructor) => (
                      <div
                        key={instructor.id}
                        className="text-xs sm:text-sm text-muted-foreground bg-background/50 rounded px-3 py-2"
                      >
                        <div className="font-medium">{instructor.name}</div>
                        <div className="text-xs opacity-75">
                          {instructor.email}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-border/50">
          <Button
            onClick={onPrevious}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto border-border text-foreground hover:bg-muted transition-all duration-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous Step
          </Button>
          <Button
            onClick={handleNext}
            size="lg"
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Next Step
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
