import { RefObject } from "react";
import { IStepperMethods } from "@/components/ui/stepper";
import {
  IELTSListeningAudio,
  IELTSListeningQuestionGroup,
  IELTSListeningTestSection,
} from "@/types/exam/ielts-academic/listening/listening";

export interface CreateListeningTestPageClientProps {
  organizationId: number;
}

export interface FormData {
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  instructions: string;
  timeLimit: number;
  section_one: IELTSListeningTestSection | null;
  section_two: IELTSListeningTestSection | null;
  section_three: IELTSListeningTestSection | null;
  section_four: IELTSListeningTestSection | null;
}

export interface TestDetailsStepProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

export interface TestSectionsStepProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  organizationId: number;
}

export interface TestPreviewStepProps {
  formData: FormData;
  onSave: () => Promise<void>;
  isSaving: boolean;
  submitButtonText?: string;
}

export interface StepperContextType {
  stepperRef: RefObject<HTMLDivElement & IStepperMethods>;
}

// Audio stat type from addListeningQuestionNumbering
export interface AudioStat {
  audioNumber: number;
  audioTitle: string;
  difficulty: string;
  questionCount: number;
  questionRange: string;
  questionTypes: Record<string, number>;
}

export interface AudioCardProps {
  audio: IELTSListeningAudio;
  questions: IELTSListeningQuestionGroup[];
  isSelected?: boolean;
  onClick?: () => void;
  // Optional audio stats, if not provided will be calculated internally
  stats?: AudioStat;
}

export interface SelectedAudioDisplayProps {
  audio: IELTSListeningAudio | null;
  onRemove: () => void;
}
