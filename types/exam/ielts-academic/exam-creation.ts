import { ExamModel } from "../exam";

// Step configuration for the exam creation stepper
export interface ExamCreationStep {
  id: number;
  title: string;
  description: string;
}

// Base props for all step components
export interface BaseStepProps {
  examData: Partial<ExamModel>;
  updateExamData: (updates: Partial<ExamModel>) => void;
  organizationId: number;
  isEditMode?: boolean;
  examId?: string;
  isAdmin?: boolean;
}

// Navigation props for steps
export interface StepNavigationProps {
  onNext: () => void;
  onPrevious: () => void;
}

export interface NavigableStepProps
  extends BaseStepProps,
    StepNavigationProps {}

export interface BasicInfoStepProps extends BaseStepProps {
  onNext: () => void;
}

export interface PreviewStepProps extends BaseStepProps {
  onPrevious: () => void;
}

// Stepper state management
export interface StepperState {
  currentStep: number;
  completedSteps: number[];
  steps: ExamCreationStep[];
}

// Session calculation result
export interface SessionCalculationResult {
  canFit: number;
  totalMinutes: number;
  utilization: number;
  sessionsPerInstructor: number;
  totalCapacity: number;
  instructorCount: number;
}

// Form validation error types
export type ValidationErrors = Record<string, string>;

// Test selection types
export type TestType = "listening" | "reading" | "writing";

export interface TestStats {
  totalQuestions: number;
  totalSections: number;
  averageQuestionsPerSection: number;
  difficultyBreakdown: Record<string, number>;
  questionTypes: Record<string, number>;
  sectionStats: unknown[];
}
