import {
  IELTSListeningAudio,
  IELTSListeningQuestionGroup,
  IELTSListeningTestSection,
} from "@/types/exam/ielts-academic/listening/listening";

export interface CreateListeningTestDto {
  title: string;
  description: string;
  organizationSlug: string;
  difficulty: "easy" | "medium" | "hard";
  section_one: IELTSListeningTestSection;
  section_two: IELTSListeningTestSection;
  section_three: IELTSListeningTestSection;
  section_four: IELTSListeningTestSection;
  createdBy: string;
  status: "published" | "archived";
  totalQuestionCount?: number;
  timeLimit?: number;
  instructions?: string;
}

export interface CreateListeningTestSectionDto {
  audio: IELTSListeningAudio;
  questions: IELTSListeningQuestionGroup[];
}
