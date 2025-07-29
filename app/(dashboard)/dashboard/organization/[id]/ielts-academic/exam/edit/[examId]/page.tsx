"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExamCreationStep } from "@/types/exam/ielts-academic/exam-creation";
import { useExamDetails } from "@/hooks/organization/ielts-academic/exam/use-exam-details";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Import custom components and hooks
import { ExamStepper } from "../../../../../../../../../components/pages/dashboard/organization/ielts-academic/exam/components/shared/exam-stepper";
import { StepRenderer } from "../../../../../../../../../components/pages/dashboard/organization/ielts-academic/exam/components/shared/step-renderer";
import { useStepperState } from "../../../../../../../../../components/pages/dashboard/organization/ielts-academic/exam/hooks/use-stepper-state";
import { useExamData } from "../../../../../../../../../components/pages/dashboard/organization/ielts-academic/exam/hooks/use-exam-data";

// Define exam creation steps
const EXAM_CREATION_STEPS: ExamCreationStep[] = [
  {
    id: 1,
    title: "Basic Information",
    description: "Exam details & pricing",
  },
  {
    id: 2,
    title: "Select Tests",
    description: "Choose L/R/W tests",
  },
  {
    id: 3,
    title: "LRW Schedule",
    description: "Set L/R/W schedule",
  },
  {
    id: 4,
    title: "Speaking Setup",
    description: "Configure speaking sessions",
  },
  {
    id: 5,
    title: "Preview",
    description: "Review and update",
  },
];

const EditExamPage: React.FC = () => {
  const params = useParams();
  const organizationId = parseInt(params.id as string);
  const examId = params.examId as string;

  // Fetch existing exam data
  const { exam, isLoading, error } = useExamDetails(examId);

  // Custom hooks for state management - only initialize when exam data is available
  const { examData, updateExamData } = useExamData(exam || undefined);
  const { currentStep, completedSteps, steps, handleNext, handlePrevious } =
    useStepperState(EXAM_CREATION_STEPS);

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-2 md:px-4">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Card className="border border-border">
          <CardHeader className="border-b border-border">
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="p-1 md:p-6">
            <Skeleton className="h-32 w-full mb-4" />
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error || !exam) {
    return (
      <div className="container mx-auto py-6 px-2 md:px-4">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Edit IELTS Academic Exam
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Edit an existing IELTS Academic exam
          </p>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || "Exam not found. Please check the exam ID and try again."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-2 md:px-4">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Edit IELTS Academic Exam
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Update the existing IELTS Academic exam: {exam.title}
        </p>
      </div>

      <Card className="border border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-xl text-foreground">
            Exam Update Process
          </CardTitle>
        </CardHeader>
        <CardContent className="p-1 md:p-6">
          <ExamStepper
            steps={steps}
            currentStep={currentStep}
            completedSteps={completedSteps}
          />

          {/* Only render StepRenderer when exam data is available */}
          {exam && (
            <StepRenderer
              currentStep={currentStep}
              examData={examData}
              updateExamData={updateExamData}
              organizationId={organizationId}
              onNext={handleNext}
              onPrevious={handlePrevious}
              isEditMode={true}
              examId={examId}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EditExamPage;
