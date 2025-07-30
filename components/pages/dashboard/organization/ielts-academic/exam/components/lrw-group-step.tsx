"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Users,
  Info,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  IELTSExamModel,
  AdminIELTSExamModel,
} from "@/types/exam/ielts-academic/exam";
import { useOrganizationInstructors } from "@/hooks/organization/use-organization-instructors";
import { User } from "@/types/user";

interface LRWGroupStepProps {
  examData: Partial<IELTSExamModel> | Partial<AdminIELTSExamModel>;
  updateExamData: (
    updates: Partial<IELTSExamModel> | Partial<AdminIELTSExamModel>
  ) => void;
  organizationId: number;
  onNext: () => void;
  onPrevious: () => void;
  isAdmin?: boolean;
}

export const LRWGroupStep: React.FC<LRWGroupStepProps> = ({
  examData,
  updateExamData,
  organizationId,
  onNext,
  onPrevious,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isAdmin,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { instructors, isLoading } = useOrganizationInstructors({
    organizationId,
    initialPageSize: 50,
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!examData.lrw_group?.exam_date) {
      newErrors.exam_date = "Exam date is required";
    }

    // Only validate time slots for tests that have been selected
    if (examData.listening_test && !examData.lrw_group?.listening_time_start) {
      newErrors.listening_time_start = "Listening start time is required";
    }

    if (examData.reading_test && !examData.lrw_group?.reading_time_start) {
      newErrors.reading_time_start = "Reading start time is required";
    }

    if (examData.writing_test && !examData.lrw_group?.writing_time_start) {
      newErrors.writing_time_start = "Writing start time is required";
    }

    if (!examData.lrw_group?.assigned_instructors?.length) {
      newErrors.assigned_instructors =
        "At least one instructor must be assigned";
    }

    // Validate time sequence only for selected tests
    const selectedTests = [];
    if (examData.listening_test && examData.lrw_group?.listening_time_start) {
      selectedTests.push({
        type: "listening",
        time: new Date(`2000-01-01T${examData.lrw_group.listening_time_start}`),
        timeField: "listening_time_start",
      });
    }
    if (examData.reading_test && examData.lrw_group?.reading_time_start) {
      selectedTests.push({
        type: "reading",
        time: new Date(`2000-01-01T${examData.lrw_group.reading_time_start}`),
        timeField: "reading_time_start",
      });
    }
    if (examData.writing_test && examData.lrw_group?.writing_time_start) {
      selectedTests.push({
        type: "writing",
        time: new Date(`2000-01-01T${examData.lrw_group.writing_time_start}`),
        timeField: "writing_time_start",
      });
    }

    // Sort by time and validate sequence
    selectedTests.sort((a, b) => a.time.getTime() - b.time.getTime());

    // Check if the order matches expected sequence: listening -> reading -> writing
    const expectedOrder = ["listening", "reading", "writing"];
    let lastExpectedIndex = -1;

    for (const test of selectedTests) {
      const currentIndex = expectedOrder.indexOf(test.type);
      if (currentIndex <= lastExpectedIndex) {
        newErrors[test.timeField] = `${
          test.type.charAt(0).toUpperCase() + test.type.slice(1)
        } must be scheduled in the correct order`;
      }
      lastExpectedIndex = currentIndex;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const handleLRWGroupChange = (field: string, value: unknown) => {
    updateExamData({
      // @ts-ignore
      lrw_group: {
        ...examData.lrw_group,
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
    const currentInstructors = examData.lrw_group?.assigned_instructors || [];

    let updatedInstructors;
    if (checked) {
      updatedInstructors = [...currentInstructors, instructor];
    } else {
      updatedInstructors = currentInstructors.filter(
        (i) => i.id !== instructor.id
      );
    }

    handleLRWGroupChange("assigned_instructors", updatedInstructors);
  };

  const isInstructorSelected = (instructorId: string) => {
    return (
      examData.lrw_group?.assigned_instructors?.some(
        (i) => i.id === instructorId
      ) || false
    );
  };

  const selectedInstructorsCount =
    examData.lrw_group?.assigned_instructors?.length || 0;
  const hasTimeErrors =
    errors.listening_time_start ||
    errors.reading_time_start ||
    errors.writing_time_start;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 px-2 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full mb-4">
            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 sm:mb-3">
            LRW Group Schedule
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Configure the exam date and time schedule for Listening, Reading,
            and Writing tests. Ensure proper time sequencing for smooth exam
            flow.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-6 sm:space-y-8">
          {/* Schedule Configuration Card */}
          <Card className="border-2 border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl text-foreground flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                Schedule Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 sm:space-y-8">
              {/* Exam Date */}
              <div className="space-y-3">
                <Label
                  htmlFor="exam_date"
                  className="text-sm sm:text-base font-medium text-foreground flex items-center"
                >
                  Exam Date
                  <span className="text-destructive ml-1">*</span>
                </Label>
                <DatePicker
                  value={
                    examData.lrw_group?.exam_date
                      ? new Date(examData.lrw_group.exam_date)
                      : undefined
                  }
                  onChange={(date) =>
                    handleLRWGroupChange(
                      "exam_date",
                      date ? date.toISOString().split("T")[0] : ""
                    )
                  }
                  placeholder="Select exam date"
                  minDate={new Date()}
                  className={`w-full h-11 sm:h-12 ${
                    errors.exam_date
                      ? "border-destructive ring-destructive/20"
                      : ""
                  }`}
                />
                {errors.exam_date && (
                  <div className="flex items-center space-x-2 text-destructive">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <p className="text-sm">{errors.exam_date}</p>
                  </div>
                )}
              </div>

              {/* Time Sequence Info */}
              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 sm:p-5 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                      Test Sequence Requirements
                    </h4>
                    <ul className="text-xs sm:text-sm text-blue-800 dark:text-blue-200 space-y-1">
                      <li>
                        • Tests must be scheduled in order: Listening → Reading
                        → Writing
                      </li>
                      <li>• Allow sufficient break time between each test</li>
                      <li>
                        • Standard durations: Listening (30min), Reading
                        (60min), Writing (60min)
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Test Times Grid */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 text-sm sm:text-base text-muted-foreground">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium">Test Start Times</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  {/* Listening Time - Only show if listening test is selected */}
                  {examData.listening_test && (
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-foreground flex items-center">
                        <div className="w-6 h-6 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full flex items-center justify-center text-xs font-bold mr-2">
                          1
                        </div>
                        Listening Start
                        <span className="text-destructive ml-1">*</span>
                      </Label>
                      <TimePicker
                        value={examData.lrw_group?.listening_time_start || ""}
                        onChange={(time) =>
                          handleLRWGroupChange("listening_time_start", time)
                        }
                        placeholder="Select time"
                        format="12h"
                        className={`w-full h-11 sm:h-12 ${
                          errors.listening_time_start
                            ? "border-destructive ring-destructive/20"
                            : ""
                        }`}
                      />
                      {errors.listening_time_start && (
                        <div className="flex items-center space-x-2 text-destructive">
                          <AlertCircle className="w-3 h-3 flex-shrink-0" />
                          <p className="text-xs">
                            {errors.listening_time_start}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Reading Time - Only show if reading test is selected */}
                  {examData.reading_test && (
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-foreground flex items-center">
                        <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full flex items-center justify-center text-xs font-bold mr-2">
                          2
                        </div>
                        Reading Start
                        <span className="text-destructive ml-1">*</span>
                      </Label>
                      <TimePicker
                        value={examData.lrw_group?.reading_time_start || ""}
                        onChange={(time) =>
                          handleLRWGroupChange("reading_time_start", time)
                        }
                        placeholder="Select time"
                        format="12h"
                        className={`w-full h-11 sm:h-12 ${
                          errors.reading_time_start
                            ? "border-destructive ring-destructive/20"
                            : ""
                        }`}
                      />
                      {errors.reading_time_start && (
                        <div className="flex items-center space-x-2 text-destructive">
                          <AlertCircle className="w-3 h-3 flex-shrink-0" />
                          <p className="text-xs">{errors.reading_time_start}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Writing Time - Only show if writing test is selected */}
                  {examData.writing_test && (
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-foreground flex items-center">
                        <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full flex items-center justify-center text-xs font-bold mr-2">
                          3
                        </div>
                        Writing Start
                        <span className="text-destructive ml-1">*</span>
                      </Label>
                      <TimePicker
                        value={examData.lrw_group?.writing_time_start || ""}
                        onChange={(time) =>
                          handleLRWGroupChange("writing_time_start", time)
                        }
                        placeholder="Select time"
                        format="12h"
                        className={`w-full h-11 sm:h-12 ${
                          errors.writing_time_start
                            ? "border-destructive ring-destructive/20"
                            : ""
                        }`}
                      />
                      {errors.writing_time_start && (
                        <div className="flex items-center space-x-2 text-destructive">
                          <AlertCircle className="w-3 h-3 flex-shrink-0" />
                          <p className="text-xs">{errors.writing_time_start}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {hasTimeErrors && (
                  <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-destructive">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <p className="text-sm font-medium">
                        Please ensure all times are set and in proper sequence
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Instructor Assignment Card */}
          <Card className="border-2 border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl text-foreground flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  Assign Instructors
                </div>
                {selectedInstructorsCount > 0 && (
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {selectedInstructorsCount} selected
                  </div>
                )}
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
                          id={`instructor-${instructor.id}`}
                          checked={isInstructorSelected(instructor.id)}
                          onCheckedChange={(checked) =>
                            handleInstructorToggle(
                              instructor,
                              checked as boolean
                            )
                          }
                          className="flex-shrink-0"
                        />
                        <Label
                          htmlFor={`instructor-${instructor.id}`}
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {examData.lrw_group?.assigned_instructors?.map(
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
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 sm:pt-10">
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
