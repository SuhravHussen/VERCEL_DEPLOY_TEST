import { useState, useCallback } from "react";
import { ExamCreationStep, StepperState } from "@/types/exam/ielts-academic/exam-creation";

interface UseStepperStateReturn extends StepperState {
  handleNext: () => void;
  handlePrevious: () => void;
  markStepCompleted: (stepId: number) => void;
  setCurrentStep: (step: number) => void;
}

export const useStepperState = (initialSteps: ExamCreationStep[]): UseStepperStateReturn => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const markStepCompleted = useCallback((stepId: number) => {
    setCompletedSteps((prev) => {
      if (!prev.includes(stepId)) {
        return [...prev, stepId];
      }
      return prev;
    });
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep < initialSteps.length) {
      markStepCompleted(currentStep);
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, initialSteps.length, markStepCompleted]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  return {
    currentStep,
    completedSteps,
    steps: initialSteps,
    handleNext,
    handlePrevious,
    markStepCompleted,
    setCurrentStep,
  };
};
