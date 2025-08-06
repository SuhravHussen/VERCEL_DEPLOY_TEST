import { IELTSReadingTest } from "@/types/exam/ielts-academic/reading/test/test";
import { IELTSReadingTestSection } from "@/types/exam/ielts-academic/reading/question/question";

export interface ReadingSection {
  id: number;
  section: IELTSReadingTestSection;
}

export function convertReadingTestToSections(
  readingTest: IELTSReadingTest
): ReadingSection[] {
  // Convert sections to array format - sections are now pre-numbered from server
  const sections = [
    readingTest.section_one,
    readingTest.section_two,
    readingTest.section_three,
  ];

  return [
    { id: 1, section: sections[0] },
    { id: 2, section: sections[1] },
    { id: 3, section: sections[2] },
  ];
}

export function calculateSectionProgress(
  sections: ReadingSection[],
  answers: Record<string, string | string[]>
): Record<number, { total: number; answered: number }> {
  return sections.reduce((acc, { id, section }) => {
    const questions = section.questions || [];
    let totalQuestions = 0;
    let answeredQuestions = 0;

    questions.forEach((group) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const groupQuestions = (group as any).questions || [];
      totalQuestions += groupQuestions.length || 1;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      groupQuestions.forEach((question: any) => {
        const questionId = `q${
          question.number ||
          question.gapId ||
          question.cellId ||
          question.stepId ||
          question.labelId
        }`;
        if (answers[questionId]) {
          answeredQuestions++;
        }
      });

      // Handle group-level answers for multiple choice multiple answers
      if (group.questionType === "multiple_choice_multiple_answers") {
        const groupAnswers = answers[`group_${group.id}`];
        if (
          groupAnswers &&
          Array.isArray(groupAnswers) &&
          groupAnswers.length > 0
        ) {
          answeredQuestions++;
        }
        totalQuestions = 1;
      }
    });

    acc[id] = { total: totalQuestions, answered: answeredQuestions };
    return acc;
  }, {} as Record<number, { total: number; answered: number }>);
}

export function extractSectionQuestionNumbers(
  sections: ReadingSection[]
): Record<number, number[]> {
  return sections.reduce((acc, { id, section }) => {
    const questions = section.questions || [];
    const questionNumbers: number[] = [];

    questions.forEach((group) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const groupQuestions = (group as any).questions || [];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      groupQuestions.forEach((question: any) => {
        if (question.number) {
          questionNumbers.push(question.number);
        }
      });
    });

    acc[id] = questionNumbers.sort((a, b) => a - b);
    return acc;
  }, {} as Record<number, number[]>);
}
