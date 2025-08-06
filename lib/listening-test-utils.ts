import { IELTSListeningTest } from "@/types/exam/ielts-academic/listening/listening";
import { PartProgress, PartQuestionNumbers } from "@/types/listening-test";

interface Section {
  questions?: QuestionGroup[];
  audio?: { audioUrl?: string };
}

interface QuestionGroup {
  id?: string;
  questionType?: string;
  questions?: Array<{ number?: number; gapId?: string }>;
}

export const calculatePartProgress = (
  sections: Array<{ id: number; section: Section }>,
  answers: Record<string, string | string[]>
): PartProgress => {
  return sections.reduce((acc, { id, section }) => {
    const questions = section.questions || [];
    let totalQuestions = 0;
    let answeredQuestions = 0;

    questions.forEach((group: QuestionGroup) => {
      const groupQuestions =
        (group as { questions?: Array<{ number?: number; gapId?: string }> })
          .questions || [];

      groupQuestions.forEach((question) => {
        totalQuestions++;
        const questionId = `q${question.number || question.gapId}`;
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
          answeredQuestions = Math.min(answeredQuestions + 1, totalQuestions);
        }
      }
    });

    acc[id] = { total: totalQuestions, answered: answeredQuestions };
    return acc;
  }, {} as PartProgress);
};

export const extractPartQuestionNumbers = (
  sections: Array<{ id: number; section: Section }>
): PartQuestionNumbers => {
  return sections.reduce((acc, { id, section }) => {
    const questions = section.questions || [];
    const questionNumbers: number[] = [];

    questions.forEach((group: QuestionGroup) => {
      const groupQuestions =
        (group as { questions?: Array<{ number?: number; gapId?: string }> })
          .questions || [];

      groupQuestions.forEach((question) => {
        if (question.number) {
          questionNumbers.push(question.number);
        }
      });
    });

    // Sort question numbers in ascending order
    questionNumbers.sort((a, b) => a - b);
    acc[id] = questionNumbers;
    return acc;
  }, {} as PartQuestionNumbers);
};

export const convertListeningTestToSections = (
  listeningTest: IELTSListeningTest
) => {
  return [
    { id: 1, section: listeningTest.section_one },
    { id: 2, section: listeningTest.section_two },
    { id: 3, section: listeningTest.section_three },
    { id: 4, section: listeningTest.section_four },
  ];
};

export const getAudioUrls = (
  sections: Array<{ id: number; section: Section }>
): string[] => {
  return sections
    .map(({ section }) => section.audio?.audioUrl)
    .filter((url): url is string => !!url);
};

export const getAudioUrlsWithSectionMapping = (
  sections: Array<{ id: number; section: Section }>
): Array<{ url: string; sectionId: number }> => {
  return sections
    .map(({ id, section }) => ({
      url: section.audio?.audioUrl,
      sectionId: id,
    }))
    .filter((item): item is { url: string; sectionId: number } => !!item.url);
};
