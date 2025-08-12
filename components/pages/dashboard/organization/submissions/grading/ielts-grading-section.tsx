"use client";

import React, {
  useState,
  useEffect,
  Suspense,
  lazy,
  Component,
  ErrorInfo,
  ReactNode,
} from "react";
import { ExamModel } from "@/types/exam/exam";
import {
  ExamSubmission,
  SectionGrade,
  WritingSubmission,
  SpeakingSubmission,
} from "@/types/exam/exam-submission";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  CheckCircle,
  AlertCircle,
  Save,
  Loader2,
} from "lucide-react";
import { IELTSListeningTest } from "@/types/exam/ielts-academic/listening/listening";
import { IELTSReadingTest } from "@/types/exam/ielts-academic/reading/test/test";
import { IELTSWritingTest } from "@/types/exam/ielts-academic/writing/writing";

// Lazy load the grading renderers for better code splitting
const ListeningGradingRenderer = lazy(
  () => import("./ielts/listening/listening-grading-renderer")
);
const ReadingGradingRenderer = lazy(
  () => import("./ielts/reading/reading-grading-renderer")
);
const WritingGradingRendererNew = lazy(
  () => import("./ielts/writing/writing-grading-renderer-new")
);
const SpeakingGradingRendererNew = lazy(
  () => import("./ielts/speaking/speaking-grading-renderer-new")
);

// Import types from the lazy-loaded components
import type { WritingGradeData } from "./ielts/writing/writing-grading-renderer-new";
import type { SpeakingGradeData } from "./ielts/speaking/speaking-grading-renderer-new";
import { getCurrentUser } from "@/lib/auth-client";
import { isAssigned, isAssignedToLRW } from "@/lib/exam-utils";

// Re-export types for backwards compatibility
export type { WritingGradeData, SpeakingGradeData };

interface IELTSGradingSectionProps {
  section: "listening" | "reading" | "writing" | "speaking";
  exam: ExamModel;
  submission: ExamSubmission;
  onSaveGrades?: (
    section: string,
    gradeData: SectionGrade,
    writingData?: WritingGradeData,
    speakingData?: SpeakingGradeData
  ) => void;
}

// Component configuration constants
const SECTION_CONFIG = {
  listening: {
    icon: Headphones,
    color: "text-blue-700",
    maxScore: 40,
  },
  reading: {
    icon: BookOpen,
    color: "text-green-700",
    maxScore: 40,
  },
  writing: {
    icon: PenTool,
    color: "text-purple-700",
    maxScore: 9, // Band score for writing
  },
  speaking: {
    icon: Mic,
    color: "text-orange-700",
    maxScore: 9, // Band score for speaking
  },
} as const;

// Loading fallback component
const GradingRendererSkeleton = ({ section }: { section: string }) => (
  <div className="flex items-center justify-center py-12">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        Loading {section} grading interface...
      </p>
    </div>
  </div>
);

// Simple Error Boundary for lazy loading
class GradingRendererErrorBoundary extends Component<
  { children: ReactNode; section: string },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; section: string }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(
      `Error in ${this.props.section} grading renderer:`,
      error,
      errorInfo
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center text-red-600 py-8">
          <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <h3 className="text-sm font-medium mb-1">
            Failed to load {this.props.section} grading
          </h3>
          <p className="text-xs max-w-md mx-auto">
            There was an error loading the grading interface. Please refresh the
            page.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Custom hook for section data management
const useSectionData = (
  section: IELTSGradingSectionProps["section"],
  exam: ExamModel,
  submission: ExamSubmission
) => {
  return {
    test: (() => {
      switch (section) {
        case "listening":
          return exam.listening_test;
        case "reading":
          return exam.reading_test;
        case "writing":
          return exam.writing_test;
        case "speaking":
          return exam.speaking_group;
        default:
          return null;
      }
    })(),
    submissionData: (() => {
      switch (section) {
        case "listening":
          return submission.listening_submission;
        case "reading":
          return submission.reading_submission;
        case "writing":
          return submission.writing_submission;
        case "speaking":
          return submission.speaking_submission;
        default:
          return null;
      }
    })(),
  };
};

// Custom hook for completion status
const useCompletionStatus = (
  section: IELTSGradingSectionProps["section"],
  submission: ExamSubmission,
  sectionSubmission: unknown
) => {
  if (!sectionSubmission) return "not_started";

  // Check if section is already graded
  const existingGrade = submission.grades?.[section];
  if (existingGrade) {
    if (section === "writing" && "overall" in existingGrade) {
      return existingGrade.overall ||
        existingGrade.task_1 ||
        existingGrade.task_2
        ? "graded"
        : "completed";
    } else if ("feedback" in existingGrade || "band_score" in existingGrade) {
      return "graded";
    }
  }

  // For listening, check if answers exist
  if (
    section === "listening" &&
    typeof sectionSubmission === "object" &&
    sectionSubmission !== null &&
    "answers" in sectionSubmission &&
    Array.isArray((sectionSubmission as { answers?: unknown[] }).answers)
  ) {
    return (sectionSubmission as { answers: unknown[] }).answers.length > 0
      ? "completed"
      : "not_started";
  }

  return "completed";
};

export function IELTSGradingSection({
  section,
  exam,
  submission,
  onSaveGrades,
}: IELTSGradingSectionProps) {
  const config = SECTION_CONFIG[section];
  const { test, submissionData } = useSectionData(section, exam, submission);
  const completionStatus = useCompletionStatus(
    section,
    submission,
    submissionData
  );

  // Security check: Verify user has permission to grade this section
  const user = getCurrentUser();
  const hasPermission = user
    ? (() => {
        if (section === "speaking") {
          return isAssigned(exam, user.id);
        } else {
          // listening, reading, writing sections require LRW assignment
          return isAssignedToLRW(exam, user.id);
        }
      })()
    : false;

  // Teacher input states
  const [feedback, setFeedback] = useState("");
  const [bandScore, setBandScore] = useState<string>("");
  const [writingGradeData, setWritingGradeData] =
    useState<WritingGradeData | null>(null);
  const [speakingGradeData, setSpeakingGradeData] =
    useState<SpeakingGradeData | null>(null);

  // Initialize form data from existing grades
  useEffect(() => {
    const existingGrade = submission.grades?.[section];
    if (existingGrade) {
      if (section === "writing" && "overall" in existingGrade) {
        const overallGrade = existingGrade.overall;
        if (overallGrade) {
          setFeedback(overallGrade.feedback || "");
          setBandScore(overallGrade.band_score?.toString() || "");
        }
      } else if ("feedback" in existingGrade) {
        setFeedback(existingGrade.feedback || "");
        setBandScore(existingGrade.band_score?.toString() || "");
      }
    }
  }, [section, submission.grades]);

  // Utility functions
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getTimeSpent = () => {
    if (!submissionData) return 0;
    if ("time_spent" in submissionData) {
      return submissionData.time_spent || 0;
    }
    return 0;
  };

  const getStatusBadge = () => {
    const badgeConfigs = {
      graded: {
        className: "text-blue-700 border-blue-200 bg-blue-50 text-xs",
        icon: CheckCircle,
        label: "Graded",
      },
      completed: {
        className: "text-green-700 border-green-200 text-xs",
        icon: CheckCircle,
        label: "Completed",
      },
      not_started: {
        className: "text-muted-foreground border-muted-foreground/30 text-xs",
        icon: AlertCircle,
        label: "Not Started",
      },
    };

    const config = badgeConfigs[completionStatus];
    const IconComponent = config.icon;

    return (
      <Badge variant="outline" className={config.className}>
        <IconComponent className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const handleSaveGrades = () => {
    const gradeData: SectionGrade = {
      score: 0,
      max_score: config.maxScore,
      band_score: bandScore ? parseFloat(bandScore) : undefined,
      feedback: feedback || undefined,
      graded_by: "current-instructor-id",
      graded_at: new Date().toISOString(),
    };

    if (section === "writing" && writingGradeData) {
      onSaveGrades?.(section, gradeData, writingGradeData);
    } else if (section === "speaking" && speakingGradeData) {
      onSaveGrades?.(section, gradeData, undefined, speakingGradeData);
    } else {
      onSaveGrades?.(section, gradeData);
    }
  };

  // Show access denied message if user doesn't have permission
  if (!hasPermission) {
    return (
      <div className="bg-muted/20 rounded-lg border border-border/50">
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-md bg-red-50 border border-red-200">
              <config.icon className={`h-4 w-4 text-red-600`} />
            </div>
            <div>
              <h3 className="text-base font-semibold capitalize text-red-700">
                {section} Section - Access Denied
              </h3>
              <p className="text-xs text-red-600 mt-0.5">
                Insufficient grading permissions
              </p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-red-800 mb-2">
                  No Grading Access
                </h4>
                <p className="text-sm text-red-700 mb-3">
                  You are not assigned to grade the {section} section of this
                  exam.
                  {section === "speaking"
                    ? " Only instructors assigned to the speaking group can grade speaking sections."
                    : " Only instructors assigned to the LRW group can grade listening, reading, and writing sections."}
                </p>
                <p className="text-xs text-red-600">
                  Contact your exam administrator if you believe this is an
                  error.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/20 rounded-lg border border-border/50">
      {/* Header Section */}
      <SectionHeader
        section={section}
        config={config}
        statusBadge={getStatusBadge()}
        timeSpent={formatTime(getTimeSpent())}
        onSave={handleSaveGrades}
      />

      <div className="px-3 md:px-4 pb-3 md:pb-4">
        {/* Teacher Grading Form - only show for non-speaking and non-writing sections */}
        {section !== "speaking" && section !== "writing" && (
          <>
            <TeacherGradingForm
              section={section}
              completionStatus={completionStatus}
              feedback={feedback}
              setFeedback={setFeedback}
              bandScore={bandScore}
              setBandScore={setBandScore}
            />

            <div className="h-px bg-border/30 mb-4" />
          </>
        )}

        {/* Section Content with Lazy Loading */}
        <Suspense fallback={<GradingRendererSkeleton section={section} />}>
          <GradingRendererErrorBoundary section={section}>
            <SectionContentRenderer
              section={section}
              test={test}
              submissionData={submissionData}
              onWritingGradesChange={setWritingGradeData}
              onSpeakingGradesChange={setSpeakingGradeData}
              submission={submission}
            />
          </GradingRendererErrorBoundary>
        </Suspense>
      </div>
    </div>
  );
}

// Extracted Header Component
const SectionHeader = ({
  section,
  config,
  statusBadge,
  timeSpent,
  onSave,
}: {
  section: string;
  config: (typeof SECTION_CONFIG)[keyof typeof SECTION_CONFIG];
  statusBadge: React.ReactElement;
  timeSpent: string;
  onSave: () => void;
}) => (
  <div className="p-3 md:p-4 pb-2 md:pb-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-md bg-background/80 border border-border/30">
          <config.icon className={`h-4 w-4 ${config.color}`} />
        </div>
        <div>
          <h3 className={`text-base font-semibold capitalize ${config.color}`}>
            {section} Section
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Grading and analysis
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {statusBadge}
        <div className="text-right">
          <div className="text-xs font-medium text-muted-foreground">
            {timeSpent}
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="text-xs h-7 px-2"
          onClick={onSave}
        >
          <Save className="h-3 w-3 mr-1" />
          Save
        </Button>
      </div>
    </div>
  </div>
);

// Extracted Teacher Grading Form Component
const TeacherGradingForm = ({
  section,
  completionStatus,
  feedback,
  setFeedback,
  bandScore,
  setBandScore,
}: {
  section: string;
  completionStatus: string;
  feedback: string;
  setFeedback: (value: string) => void;
  bandScore: string;
  setBandScore: (value: string) => void;
}) => (
  <div className="mb-6 p-3 md:p-4 bg-muted/30 rounded-lg border border-border/50">
    <div className="flex items-center justify-between mb-3">
      <h4 className="text-sm font-medium text-foreground">Section Grading</h4>
      {completionStatus === "graded" && (
        <Badge
          variant="outline"
          className="text-xs text-blue-600 border-blue-200 bg-blue-50"
        >
          Editing existing grade
        </Badge>
      )}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
      {/* Band Score Selection */}
      <div className="space-y-2">
        <Label
          htmlFor={`band-score-${section}`}
          className="text-xs font-medium"
        >
          IELTS Band Score
        </Label>
        <Select value={bandScore} onValueChange={setBandScore}>
          <SelectTrigger className="w-full h-8 text-xs">
            <SelectValue placeholder="Select band score..." />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-1 p-2">
              {[
                1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0,
                7.5, 8.0, 8.5, 9.0,
              ].map((score) => (
                <SelectItem
                  key={score}
                  value={score.toString()}
                  className="text-center p-2 min-w-[50px] cursor-pointer hover:bg-accent"
                >
                  <span className="font-medium text-xs">
                    {score.toFixed(1)}
                  </span>
                </SelectItem>
              ))}
            </div>
          </SelectContent>
        </Select>
      </div>

      {/* Section Feedback */}
      <div className="space-y-2">
        <Label htmlFor={`feedback-${section}`} className="text-xs font-medium">
          Section Feedback
        </Label>
        <Textarea
          id={`feedback-${section}`}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder={`Provide feedback for the ${section} section...`}
          className="min-h-[60px] md:min-h-[80px] text-xs resize-none"
        />
      </div>
    </div>
  </div>
);

// Extracted Section Content Renderer
const SectionContentRenderer = ({
  section,
  test,
  submissionData,
  onWritingGradesChange,
  onSpeakingGradesChange,
  submission,
}: {
  section: string;
  test: IELTSListeningTest | IELTSReadingTest | IELTSWritingTest | unknown;
  submissionData:
    | WritingSubmission
    | { answers?: { question_number: number; answer: string }[] }
    | unknown;
  onWritingGradesChange?: (data: WritingGradeData) => void;
  onSpeakingGradesChange?: (data: SpeakingGradeData) => void;
  submission: ExamSubmission;
}) => {
  // Handle writing section separately for better type safety
  if (section === "writing") {
    const writingTest = test as IELTSWritingTest;
    const writingSubmission = submissionData as WritingSubmission;

    if (!writingTest || !writingSubmission) {
      return (
        <div className="text-center text-muted-foreground py-8">
          <p className="text-sm">Writing test data not available</p>
        </div>
      );
    }

    return (
      <WritingGradingRendererNew
        test={writingTest}
        userSubmission={writingSubmission}
        onGradesChange={onWritingGradesChange}
        existingGrades={submission.grades?.writing}
      />
    );
  }

  if (!test || !submissionData) {
    const config = SECTION_CONFIG[section as keyof typeof SECTION_CONFIG];
    return (
      <div className="text-center py-8 text-muted-foreground">
        <config.icon className="h-12 w-12 mx-auto mb-3 opacity-30" />
        <h3 className="text-sm font-medium mb-1">
          No {section} data available
        </h3>
        <p className="text-xs max-w-md mx-auto">
          This section was not included in the exam or the student did not
          complete it.
        </p>
      </div>
    );
  }

  switch (section) {
    case "listening":
      return (
        <ListeningGradingRenderer
          test={test as IELTSListeningTest}
          userAnswers={
            (
              submissionData as {
                answers?: { question_number: number; answer: string }[];
              }
            )?.answers || []
          }
        />
      );

    case "reading":
      return (
        <ReadingGradingRenderer
          test={test as IELTSReadingTest}
          userAnswers={
            (
              submissionData as {
                answers?: { question_number: number; answer: string }[];
              }
            )?.answers || []
          }
        />
      );

    case "speaking":
      const speakingSubmission = submissionData as SpeakingSubmission;

      if (!speakingSubmission) {
        return (
          <div className="text-center py-8 text-muted-foreground">
            <Mic className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <h3 className="text-sm font-medium mb-1">
              No speaking data available
            </h3>
            <p className="text-xs max-w-md mx-auto">
              This section was not included in the exam or the student did not
              complete it.
            </p>
          </div>
        );
      }

      return (
        <SpeakingGradingRendererNew
          submission={speakingSubmission}
          existingGrade={submission.grades?.speaking}
          onGradeChange={onSpeakingGradesChange}
        />
      );

    default:
      return null;
  }
};
