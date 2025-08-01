"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Check,
  Calendar,
  Clock,
  DollarSign,
  BookOpen,
  Users,
  CheckCircle2,
  AlertCircle,
  Eye,
  Loader2,
  FileText,
  Timer,
  MapPin,
} from "lucide-react";
import { CurrencySymbols, Currency } from "@/types/currency";
import { IELTSListeningTest } from "@/types/exam/ielts-academic/listening/listening";
import { IELTSReadingTest } from "@/types/exam/ielts-academic/reading/test/test";
import { IELTSWritingTest } from "@/types/exam/ielts-academic/writing/writing";
import { useAddExam } from "@/hooks/organization/ielts-academic/exam/use-add-exam";
import { useUpdateExam } from "@/hooks/organization/ielts-academic/exam/use-update-exam";
import { useToasts } from "@/components/ui/toast";
import { PreviewStepProps } from "@/types/exam/ielts-academic/exam-creation";
import { ExamType } from "@/types/exam/exam";

export const PreviewStep: React.FC<PreviewStepProps> = ({
  examData,
  onPrevious,
  isEditMode,
  examId,
  isAdmin,
}) => {
  const addExamMutation = useAddExam();
  const updateExamMutation = useUpdateExam();
  const toast = useToasts();

  const handleSubmitExam = async () => {
    console.log(examData);
    try {
      // Validate required fields - different rules for admin vs regular users
      if (!examData.title) {
        toast.error(
          `Please provide an exam title before ${
            isEditMode ? "updating" : "creating"
          } the exam.`
        );
        return;
      }

      // For non-admin users, require all tests
      if (!isAdmin) {
        if (
          !examData.listening_test ||
          !examData.reading_test ||
          !examData.writing_test
        ) {
          toast.error(
            `Please complete all required fields before ${
              isEditMode ? "updating" : "creating"
            } the exam.`
          );
          return;
        }

        if (!examData.lrw_group?.exam_date) {
          toast.error(
            `Please set the exam date before ${
              isEditMode ? "updating" : "creating"
            } the exam.`
          );
          return;
        }
      }

      const examPayload = {
        title: examData.title!,
        description: examData.description,
        listening_test: examData.listening_test as IELTSListeningTest,
        reading_test: examData.reading_test as IELTSReadingTest,
        writing_test: examData.writing_test as IELTSWritingTest,
        price: examData.price || 0,
        is_free: examData.is_free || false,
        currency: examData.currency as Currency,
        type_of_exam: (examData.type_of_exam as ExamType) || ExamType.IELTS,
        lrw_group: examData.lrw_group || {
          exam_date: "",
          listening_time_start: "",
          reading_time_start: "",
          writing_time_start: "",
          assigned_instructors: [],
        },
        speaking_group: examData.speaking_group
          ? {
              ...examData.speaking_group,
              time_windows:
                examData.speaking_group.time_windows?.map((window) => ({
                  ...window,
                  id:
                    window.id ||
                    `window-${Date.now()}-${Math.random()
                      .toString(36)
                      .substr(2, 9)}`,
                })) || [],
            }
          : {
              time_windows: [],
              assigned_instructors: [],
              session_per_student: 20,
            },
        max_students: examData.max_students || 50,
        registration_deadline: examData.registration_deadline,
        is_published: true,
        is_practice_exam: examData.is_practice_exam || false,
      };

      if (isEditMode && examId) {
        // Update existing exam
        await updateExamMutation.mutateAsync({
          ...examPayload,
          id: examId,
        });
        toast.success("Exam updated successfully!");
      } else {
        // Create new exam
        await addExamMutation.mutateAsync(examPayload);
        toast.success("Exam created successfully!");
      }

      // You could redirect to the exam list or exam details page here
      // router.push(`/dashboard/organization/${organizationId}/ielts/exam`);
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} exam:`,
        error
      );
      toast.error(
        `Failed to ${isEditMode ? "update" : "create"} exam. Please try again.`
      );
    }
  };

  // Validation helpers - different rules for admin vs regular users
  const missingItems: string[] = [];

  // Title is always required
  if (!examData.title) missingItems.push("Exam title");

  // For non-admin users, require all tests and time settings
  if (!isAdmin) {
    if (!examData.listening_test) missingItems.push("Listening test selection");
    if (!examData.reading_test) missingItems.push("Reading test selection");
    if (!examData.writing_test) missingItems.push("Writing test selection");
    if (!examData.lrw_group?.exam_date) missingItems.push("LRW exam date");
    if (!examData.lrw_group?.listening_time_start)
      missingItems.push("Listening start time");
    if (!examData.lrw_group?.reading_time_start)
      missingItems.push("Reading start time");
    if (!examData.lrw_group?.writing_time_start)
      missingItems.push("Writing start time");
    if (!examData.speaking_group?.time_windows?.length)
      missingItems.push("Speaking time windows");
  }

  const isComplete = missingItems.length === 0;

  // Format currency symbol
  const currencySymbol = examData.currency
    ? CurrencySymbols[examData.currency]
    : "$";

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format time
  const formatTime = (timeString: string) => {
    if (!timeString) return "Not set";
    return timeString;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 px-2 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full mb-4">
            <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 sm:mb-3">
            {isEditMode ? "Review & Update Exam" : "Review & Create Exam"}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Please review all the details carefully before{" "}
            {isEditMode ? "updating" : "creating"} your IELTS Academic exam.{" "}
            {isEditMode ? "Changes will be saved and" : "Once created,"} the
            exam will be available for student registration.
          </p>
        </div>

        {/* Validation Status */}
        {!isComplete && (
          <div className="mb-6 sm:mb-8">
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 sm:p-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-2">
                    Please complete the following items before{" "}
                    {isEditMode ? "updating" : "creating"} the exam:
                  </h4>
                  <ul className="text-xs sm:text-sm text-amber-800 dark:text-amber-200 space-y-1">
                    {missingItems.map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-10">
          {/* Basic Information */}
          <Card className="border-2 border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl text-foreground flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                </div>
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                  Title
                </p>
                <p className="font-medium text-sm sm:text-base text-foreground">
                  {examData.title || (
                    <span className="text-destructive flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Not set
                    </span>
                  )}
                </p>
              </div>

              {examData.description && (
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                    Description
                  </p>
                  <p className="text-sm sm:text-base text-foreground line-clamp-3">
                    {examData.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                    Max Students
                  </p>
                  <p className="font-medium text-sm sm:text-base text-foreground">
                    {examData.max_students || "50"} students
                  </p>
                </div>

                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                    Status
                  </p>
                  <div className="space-y-1">
                    <Badge variant="secondary" className="text-xs">
                      Active
                    </Badge>
                    {examData.is_practice_exam && (
                      <Badge variant="outline" className="text-xs block">
                        Practice Exam
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="border-2 border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl text-foreground flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                </div>
                Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                  Exam Type
                </p>
                <Badge
                  variant={examData.is_free ? "secondary" : "default"}
                  className="text-sm px-3 py-1"
                >
                  {examData.is_free ? "Free Exam" : "Paid Exam"}
                </Badge>
              </div>

              {!examData.is_free && (
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="text-center">
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                      Exam Fee
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-foreground">
                      {currencySymbol} {examData.price || 0}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      per student
                    </p>
                  </div>
                </div>
              )}

              {examData.registration_deadline && (
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                    Registration Deadline
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {formatDate(examData.registration_deadline)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Selected Tests */}
          <Card className="border-2 border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 lg:col-span-2 xl:col-span-1">
            <CardHeader className="pb-4 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl text-foreground flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-3">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
                </div>
                Selected Tests
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  label: "Listening Test",
                  test: examData.listening_test as IELTSListeningTest,
                  color: "green",
                },
                {
                  label: "Reading Test",
                  test: examData.reading_test as IELTSReadingTest,
                  color: "blue",
                },
                {
                  label: "Writing Test",
                  test: examData.writing_test as IELTSWritingTest,
                  color: "purple",
                },
              ].map(({ label, test, color }) => (
                <div
                  key={label}
                  className="p-3 rounded-lg bg-muted/30 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-muted-foreground font-medium">
                      {label}
                    </span>
                    {test ? (
                      <CheckCircle2
                        className={`h-4 w-4 text-${color}-500 flex-shrink-0`}
                      />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                    )}
                  </div>
                  <div className="min-w-0">
                    {test ? (
                      <p
                        className="text-xs sm:text-sm font-medium text-foreground break-words leading-relaxed"
                        title={test.title}
                      >
                        {test.title}
                      </p>
                    ) : (
                      <p className="text-xs sm:text-sm text-destructive">
                        Not selected
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Schedule Information */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-10">
          {/* LRW Schedule */}
          <Card className="border-2 border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl text-foreground flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mr-3">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400" />
                </div>
                LRW Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <p className="text-xs sm:text-sm font-medium text-foreground">
                    Exam Date
                  </p>
                </div>
                <p className="text-sm sm:text-base font-semibold text-foreground">
                  {examData.lrw_group?.exam_date ? (
                    formatDate(examData.lrw_group.exam_date)
                  ) : (
                    <span className="text-destructive flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Not set
                    </span>
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                  Test Schedule
                </p>
                <div className="space-y-3">
                  {[
                    {
                      label: "Listening",
                      time: examData.lrw_group?.listening_time_start,
                      color:
                        "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
                    },
                    {
                      label: "Reading",
                      time: examData.lrw_group?.reading_time_start,
                      color:
                        "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
                    },
                    {
                      label: "Writing",
                      time: examData.lrw_group?.writing_time_start,
                      color:
                        "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300",
                    },
                  ].map(({ label, time, color }, index) => (
                    <div
                      key={label}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${color}`}
                        >
                          {index + 1}
                        </div>
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          {label}
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-foreground">
                        {formatTime(time || "")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      LRW Instructors
                    </span>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {examData.lrw_group?.assigned_instructors?.length || 0}{" "}
                    assigned
                  </span>
                </div>
                {examData.lrw_group?.assigned_instructors?.length === 0 && (
                  <p className="text-xs text-destructive mt-2 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    No instructors assigned
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Speaking Setup */}
          <Card className="border-2 border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl text-foreground flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mr-3">
                  <Timer className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                Speaking Setup
                {isAdmin && (
                  <Badge variant="secondary" className="ml-3 text-xs">
                    Optional (Admin Mode)
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 rounded-lg p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">
                    Session Duration
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-foreground">
                    {examData.speaking_group?.session_per_student || 0}
                    <span className="text-xs font-normal text-muted-foreground ml-1">
                      min
                    </span>
                  </p>
                </div>

                <div className="bg-muted/30 rounded-lg p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">
                    Instructors
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-foreground">
                    {examData.speaking_group?.assigned_instructors?.length || 0}
                    <span className="text-xs font-normal text-muted-foreground ml-1">
                      assigned
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Time Windows
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {examData.speaking_group?.time_windows?.length || 0} windows
                  </Badge>
                </div>

                <div className="max-h-48 overflow-y-auto scrollbar-none">
                  {examData.speaking_group?.time_windows?.length ? (
                    <div className="space-y-2">
                      {examData.speaking_group.time_windows.map(
                        (window, index) => (
                          <div
                            key={window.id || index}
                            className="bg-primary/5 border border-primary/20 rounded-lg p-3"
                          >
                            <div className="flex items-center space-x-2 mb-1">
                              <MapPin className="w-3 h-3 text-primary" />
                              <span className="text-xs font-medium text-foreground">
                                {formatDate(window.date)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {formatTime(window.start_time)} -{" "}
                                {formatTime(window.end_time)}
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Timer className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                      <p className="text-xs sm:text-sm text-destructive flex items-center justify-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {isAdmin
                          ? "Speaking setup skipped (Admin mode)"
                          : "No time windows configured"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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
            onClick={handleSubmitExam}
            disabled={
              addExamMutation.isPending ||
              updateExamMutation.isPending ||
              !isComplete
            }
            size="lg"
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {addExamMutation.isPending || updateExamMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditMode ? "Updating Exam..." : "Creating Exam..."}
              </>
            ) : (
              <>
                {isEditMode ? "Update Exam" : "Create Exam"}
                <Check className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
