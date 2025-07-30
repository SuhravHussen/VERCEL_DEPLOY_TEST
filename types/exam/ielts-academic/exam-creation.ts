import { IELTSExamModel, AdminIELTSExamModel } from "./exam";

// Step configuration for the exam creation stepper
export interface ExamCreationStep {
  id: number;
  title: string;
  description: string;
}

// Base props for all step components
export interface BaseStepProps {
  examData: Partial<IELTSExamModel> | Partial<AdminIELTSExamModel>;
  updateExamData: (
    updates: Partial<IELTSExamModel> | Partial<AdminIELTSExamModel>
  ) => void;
  organizationId: number;
  isEditMode?: boolean;
  examId?: string;
  isAdmin?: boolean; // New field to track if user is admin
}

// Navigation props for steps
export interface StepNavigationProps {
  onNext: () => void;
  onPrevious: () => void;
}

// Props for steps that require navigation
export interface NavigableStepProps
  extends BaseStepProps,
    StepNavigationProps {}

// Props for the basic info step (no previous button)
export interface BasicInfoStepProps extends BaseStepProps {
  onNext: () => void;
}

// Props for the preview step (no next button)
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
