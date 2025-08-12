"use client";

import { useParams } from "next/navigation";
import { ExamType } from "@/types/exam/exam";
import { SectionGrade } from "@/types/exam/exam-submission";
import { useExamDetails } from "@/hooks/organization/ielts-academic/exam/use-exam-details";
import { useSubmissionDetails } from "@/hooks/organization/submissions/use-submission-details";
import {
  useSaveListeningGrades,
  useSaveReadingGrades,
  useSaveWritingGrades,
  useSaveSpeakingGrades,
  SectionGradingData,
} from "@/hooks/organization/submissions/use-save-section-grades";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Calendar,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { IELTSGradingSection } from "@/components/pages/dashboard/organization/submissions/grading/ielts-grading-section";
import type {
  WritingGradeData,
  SpeakingGradeData,
} from "@/components/pages/dashboard/organization/submissions/grading/ielts-grading-section";
import { NotImplementedYet } from "@/components/pages/dashboard/organization/submissions/not-implemented-yet";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-client";
import { isAssigned, isAssignedToLRW } from "@/lib/exam-utils";

export default function SubmissionGradingPage() {
  const params = useParams();
  const examId = params?.examId as string;
  const submissionId = params?.submissionId as string;
  const organizationId = params?.id as string;
  const user = getCurrentUser();

  const {
    exam,
    isLoading: examLoading,
    error: examError,
  } = useExamDetails(examId);

  const {
    data: submission,
    isLoading: submissionLoading,
    error: submissionError,
  } = useSubmissionDetails(submissionId);

  // Save hooks for each section
  const saveListeningGrades = useSaveListeningGrades();
  const saveReadingGrades = useSaveReadingGrades();
  const saveWritingGrades = useSaveWritingGrades();
  const saveSpeakingGrades = useSaveSpeakingGrades();

  // Handler for saving section grades with teacher inputs (band score and feedback only)
  const handleSaveGrades = (
    section: string,
    gradeData: SectionGrade,
    writingData?: WritingGradeData,
    speakingData?: SpeakingGradeData
  ) => {
    const sectionGradingData: SectionGradingData = {
      submission_id: submissionId,
      section: section as "listening" | "reading" | "writing" | "speaking",
      section_feedback:
        section === "speaking"
          ? speakingData?.feedback ?? gradeData.feedback
          : section === "writing"
          ? writingData?.overall_feedback ?? gradeData.feedback
          : gradeData.feedback,
      band_score:
        section === "speaking"
          ? speakingData?.band_score ?? gradeData.band_score
          : section === "writing"
          ? writingData?.overall_band_score ?? gradeData.band_score
          : gradeData.band_score,
      graded_by: gradeData.graded_by || "current-instructor-id",

      // Include IELTS writing criteria if this is a writing section
      ...(section === "writing" && writingData
        ? {
            task_1_achievement: writingData.task_1_achievement,
            task_1_coherence_cohesion: writingData.task_1_coherence_cohesion,
            task_1_lexical_resource: writingData.task_1_lexical_resource,
            task_1_grammatical_range: writingData.task_1_grammatical_range,
            task_1_feedback: writingData.task_1_feedback,
            task_1_band_score: writingData.task_1_band_score,
            task_2_achievement: writingData.task_2_achievement,
            task_2_coherence_cohesion: writingData.task_2_coherence_cohesion,
            task_2_lexical_resource: writingData.task_2_lexical_resource,
            task_2_grammatical_range: writingData.task_2_grammatical_range,
            task_2_feedback: writingData.task_2_feedback,
            task_2_band_score: writingData.task_2_band_score,
          }
        : {}),

      // Include IELTS speaking criteria if this is a speaking section
      ...(section === "speaking" && speakingData
        ? {
            coherence_and_cohesion: speakingData.coherence_and_cohesion,
            lexical_resource: speakingData.lexical_resource,
            grammatical_range_and_accuracy:
              speakingData.grammatical_range_and_accuracy,
            pronunciation: speakingData.pronunciation,
          }
        : {}),
    };

    console.log(`🎯 Teacher is saving ${section} grades:`, {
      section,
      teacherInputs: {
        feedback: gradeData.feedback,
        bandScore: gradeData.band_score,
        gradedBy: gradeData.graded_by,
      },
      speakingSpecificData: section === "speaking" ? speakingData : null,
      writingSpecificData: section === "writing" ? writingData : null,
      finalSectionFeedback: sectionGradingData.section_feedback,
      finalBandScore: sectionGradingData.band_score,
      fullGradingData: sectionGradingData,
    });

    // Call appropriate save mutation based on section
    switch (section) {
      case "listening":
        saveListeningGrades.mutate(sectionGradingData);
        break;
      case "reading":
        saveReadingGrades.mutate(sectionGradingData);
        break;
      case "writing":
        saveWritingGrades.mutate(sectionGradingData);
        break;
      case "speaking":
        saveSpeakingGrades.mutate(sectionGradingData);
        break;
      default:
        console.error("Unknown section:", section);
    }
  };

  if (examLoading || submissionLoading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="space-y-4">
          <div className="h-8 bg-muted animate-pulse rounded" />
          <div className="h-32 bg-muted animate-pulse rounded" />
          <div className="h-64 bg-muted animate-pulse rounded" />
        </div>
      </div>
    );
  }

  if (examError || submissionError || !exam || !submission) {
    return (
      <div className="container mx-auto p-2 sm:p-4">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <p>
              {examError ||
                submissionError?.message ||
                "Exam or submission not found"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-100 text-blue-800";
      case "under_review":
        return "bg-yellow-100 text-yellow-800";
      case "graded":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Determine available sections based on exam data and user assignments
  const availableSections = [];

  if (exam && user) {
    // Check if user is assigned to LRW group for LRW sections
    const isUserAssignedToLRW = isAssignedToLRW(exam, user.id);

    // Check if user is assigned to speaking group for speaking section
    const isUserAssignedToSpeaking = isAssigned(exam, user.id);

    // Only add LRW sections if user is assigned to LRW group and tests exist
    if (isUserAssignedToLRW) {
      if (exam.listening_test) availableSections.push("listening");
      if (exam.reading_test) availableSections.push("reading");
      if (exam.writing_test) availableSections.push("writing");
    }

    // Only add speaking section if user is assigned to speaking group and speaking group exists
    if (isUserAssignedToSpeaking && exam.speaking_group) {
      availableSections.push("speaking");
    }
  }

  return (
    <div className="container mx-auto p-2 sm:p-4 lg:p-6 space-y-4 md:space-y-6">
      {/* Back Navigation */}
      <div className="mb-6">
        <Link
          href={`/dashboard/organization/${organizationId}/assigned-exams/submissions/${examId}`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Submissions
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-3 md:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
              Grade Submission
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              {exam.title} - {submission.student?.name}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(submission.status)}>
              {submission.status.replace("_", " ")}
            </Badge>
          </div>
        </div>

        {/* Submission Info */}
        <div className="bg-muted/30 rounded-lg p-3 md:p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            Submission Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-medium truncate">
                  {submission.student?.name}
                </p>
                <p className="text-muted-foreground truncate">
                  {submission.student?.email}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-medium">Last Updated</p>
                <p className="text-muted-foreground truncate">
                  {formatDateTime(submission.updated_at)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="font-medium">Available Sections</p>
                <p className="text-muted-foreground">
                  {availableSections.length} sections
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="font-medium">Overall Band</p>
                <p className="text-muted-foreground">
                  {submission.grades?.overall_band_score
                    ? `${submission.grades.overall_band_score.toFixed(1)}`
                    : "Not graded"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grading Content */}
      {exam && submission && exam.type_of_exam === ExamType.IELTS ? (
        availableSections.length > 0 ? (
          <Tabs
            defaultValue={availableSections[0]}
            className="space-y-3 md:space-y-4"
          >
            <TabsList
              className="grid w-full"
              style={{
                gridTemplateColumns: `repeat(${availableSections.length}, 1fr)`,
              }}
            >
              {availableSections.map((section) => (
                <TabsTrigger
                  key={section}
                  value={section}
                  className="capitalize"
                >
                  {section}
                </TabsTrigger>
              ))}
            </TabsList>

            {availableSections.map((section) => (
              <TabsContent key={section} value={section}>
                <IELTSGradingSection
                  section={
                    section as "listening" | "reading" | "writing" | "speaking"
                  }
                  exam={exam}
                  submission={submission}
                  onSaveGrades={handleSaveGrades}
                />
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="bg-muted/30 rounded-lg p-6 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No Grading Access
            </h3>
            <p className="text-muted-foreground">
              You are not assigned to grade any sections of this exam. Please
              contact your administrator if you believe this is an error.
            </p>
          </div>
        )
      ) : (
        <NotImplementedYet examType={exam?.type_of_exam || "unknown"} />
      )}
    </div>
  );
}
