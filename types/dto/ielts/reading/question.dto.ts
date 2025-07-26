import { IELTSReadingQuestionGroup } from "@/types/exam/ielts-academic/reading/question/question";

export interface CreateQuestionGroupDto {
  passage: {
    title: string;
    content: string;
    difficulty: "easy" | "medium" | "hard";
  };
  questions: IELTSReadingQuestionGroup[];
}
