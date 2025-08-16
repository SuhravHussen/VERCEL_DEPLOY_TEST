import {
  IELTSReadingQuestionGroup,
  IELTSReadingPassage,
} from "@/types/exam/ielts-academic/reading/question/question";

export interface IELTSReadingTestSection {
  passage?: IELTSReadingPassage;
  questions: IELTSReadingQuestionGroup[];
}

export interface FormData {
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  instructions: string;
  timeLimit: number;
  section_one: IELTSReadingTestSection | null;
  section_two: IELTSReadingTestSection | null;
  section_three: IELTSReadingTestSection | null;
}

export interface StepperContextType {
  stepperRef: React.RefObject<HTMLDivElement & IStepperMethods>;
}

// Types for the subcomponents
export interface TestDetailsStepProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

export interface TestSectionsStepProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  organizationSlug: string;
}

export interface TestPreviewStepProps {
  formData: FormData;
  onSave: () => void;
  isSaving: boolean;
  isEditing?: boolean;
}

export interface PassageCardProps {
  group: {
    passage?: {
      id: string;
      title: string;
      content: string;
      difficulty: string;
      organizationId?: number;
    };
    questions: Record<string, unknown>[];
  };
  isSelected: boolean;
  sectionNumber: number | null;
  onSelect: () => void;
}

export interface SelectedPassageDisplayProps {
  section: number;
  formData: FormData;
  clearSelection: (section: number) => void;
}

export interface CreateTestPageClientProps {
  organizationSlug: string;
}

// Add the IStepperMethods interface since it's used in StepperContextType
export interface IStepperMethods {
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
}
