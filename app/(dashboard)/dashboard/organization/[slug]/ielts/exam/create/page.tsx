"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExamCreationStep } from "@/types/exam/ielts-academic/exam-creation";
import { useState } from "react";

// Import custom components and hooks
import { ExamStepper } from "../../../../../../../../components/pages/dashboard/organization/ielts-academic/exam/components/shared/exam-stepper";
import { StepRenderer } from "../../../../../../../../components/pages/dashboard/organization/ielts-academic/exam/components/shared/step-renderer";
import { useStepperState } from "../../../../../../../../components/pages/dashboard/organization/ielts-academic/exam/hooks/use-stepper-state";
import { useExamData } from "../../../../../../../../components/pages/dashboard/organization/ielts-academic/exam/hooks/use-exam-data";

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
    description: "Review and create",
  },
];

const CreateExamPage: React.FC = () => {
  const params = useParams();
  const organizationSlug = params.slug as string;

  // Admin state - default to false, regular users must select all tests
  const [isAdmin] = useState(true);

  // Custom hooks for state management
  const { examData, updateExamData } = useExamData();
  const { currentStep, completedSteps, steps, handleNext, handlePrevious } =
    useStepperState(EXAM_CREATION_STEPS);

  return (
    <div className="container mx-auto py-6 px-2 md:px-4 ">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Create IELTS Academic Exam
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Set up a new IELTS Academic exam with multiple test components
        </p>
      </div>

      <Card className="border border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-xl text-foreground">
            Exam Creation Process
          </CardTitle>
        </CardHeader>
        <CardContent className="p-1 md:p-6">
          <ExamStepper
            steps={steps}
            currentStep={currentStep}
            completedSteps={completedSteps}
          />

          <StepRenderer
            currentStep={currentStep}
            examData={examData}
            updateExamData={updateExamData}
            organizationSlug={organizationSlug}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isAdmin={isAdmin}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateExamPage;
