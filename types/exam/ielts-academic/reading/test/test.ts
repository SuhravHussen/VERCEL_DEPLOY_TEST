import { IELTSReadingTestSection } from "../question/question";

// Represents a section in an IELTS Reading test

export interface IELTSReadingTest {
  id: string;
  title: string;
  description?: string;
  organizationId: number;
  difficulty: "easy" | "medium" | "hard";
  createdAt: string;
  updatedAt: string;
  section_one: IELTSReadingTestSection;
  section_two: IELTSReadingTestSection;
  section_three: IELTSReadingTestSection;
  createdBy: string;
  status: "published" | "archived";
  totalQuestionCount?: number; // Should be exactly 40 for a valid test
  timeLimit?: number; // In minutes, typically 60 for IELTS Reading
  instructions?: string;
}
