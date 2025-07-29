"use client";

import {
  InteractiveStepper,
  InteractiveStepperItem,
  InteractiveStepperTrigger,
  InteractiveStepperIndicator,
  InteractiveStepperTitle,
  InteractiveStepperDescription,
  InteractiveStepperSeparator,
} from "@/components/ui/stepper";
import { ExamCreationStep } from "@/types/exam/ielts-academic/exam-creation";

interface ExamStepperProps {
  steps: ExamCreationStep[];
  currentStep: number;
  completedSteps: number[];
}

export const ExamStepper: React.FC<ExamStepperProps> = ({
  steps,
  currentStep,
  completedSteps,
}) => {
  return (
    <div className="overflow-x-auto pb-2 scrollbar-none">
      <InteractiveStepper
        defaultValue={currentStep}
        orientation="horizontal"
        className="min-w-max"
      >
        {steps.map((step) => (
          <InteractiveStepperItem
            key={step.id}
            completed={completedSteps.includes(step.id)}
            disabled={step.id !== currentStep && !completedSteps.includes(step.id)}
            className="flex-1"
          >
            <InteractiveStepperTrigger className="w-full">
              <InteractiveStepperIndicator className="bg-primary border border-border text-primary-foreground" />
              <div className="ml-3">
                <InteractiveStepperTitle className="text-foreground">
                  {step.title}
                </InteractiveStepperTitle>
                <InteractiveStepperDescription className="text-muted-foreground">
                  {step.description}
                </InteractiveStepperDescription>
              </div>
            </InteractiveStepperTrigger>
            <InteractiveStepperSeparator className="bg-border" />
          </InteractiveStepperItem>
        ))}
      </InteractiveStepper>
    </div>
  );
};
