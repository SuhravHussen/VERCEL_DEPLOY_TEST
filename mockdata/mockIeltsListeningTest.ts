import {
  IELTSListeningTest,
  IELTSListeningTestSection,
} from "@/types/exam/ielts-academic/listening/listening";
import { ieltsListeningTestSections } from "./mockIeltsListeningQuestion";

export const ieltsListeningTest: IELTSListeningTest[] = [
  {
    id: "ielts-listening-test-001",
    title: "IELTS Listening Test",
    description: "IELTS Listening Test",
    organizationId: 1,
    difficulty: "medium",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    section_one: ieltsListeningTestSections[0] as IELTSListeningTestSection,
    section_two: ieltsListeningTestSections[1] as IELTSListeningTestSection,
    section_three: ieltsListeningTestSections[2] as IELTSListeningTestSection,
    section_four: ieltsListeningTestSections[3] as IELTSListeningTestSection,
    createdBy: "admin",
    status: "published",
    totalQuestionCount: 40,
    timeLimit: 30,
    instructions: "IELTS Listening Test",
  },
];
