"use client";
import { useMemo } from "react";
import { IELTSListeningTest } from "@/types/exam/ielts-academic/listening/listening";

interface UseTestDataProps {
  listeningTest: IELTSListeningTest;
  answers: Record<string, string | string[]>;
}

export function useTestData({ listeningTest, answers }: UseTestDataProps) {
  // Convert sections to array format - memoized for performance
  const sections = useMemo(
    () => [
      { id: 1, section: listeningTest.section_one },
      { id: 2, section: listeningTest.section_two },
      { id: 3, section: listeningTest.section_three },
      { id: 4, section: listeningTest.section_four },
    ],
    [listeningTest]
  );

  // Get all audio URLs in order - memoized
  const audioUrls = useMemo(
    () =>
      sections
        .map(({ section }) => section.audio?.audioUrl)
        .filter((url): url is string => !!url),
    [sections]
  );

  // Calculate part progress using actual numbered questions - memoized
  const partProgress = useMemo(
    () =>
      sections.reduce((acc, { id, section }) => {
        const questions = section.questions || [];
        let totalQuestions = 0;
        let answeredQuestions = 0;

        questions.forEach((group) => {
          const groupQuestions =
            (
              group as {
                questions?: Array<{ number?: number; gapId?: string }>;
              }
            ).questions || [];

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
              answeredQuestions = Math.min(
                answeredQuestions + 1,
                totalQuestions
              );
            }
          }
        });

        acc[id] = { total: totalQuestions, answered: answeredQuestions };
        return acc;
      }, {} as Record<number, { total: number; answered: number }>),
    [sections, answers]
  );

  // Extract actual question numbers for each part - memoized
  const partQuestionNumbers = useMemo(
    () =>
      sections.reduce((acc, { id, section }) => {
        const questions = section.questions || [];
        const questionNumbers: number[] = [];

        questions.forEach((group) => {
          const groupQuestions =
            (
              group as {
                questions?: Array<{ number?: number; gapId?: string }>;
              }
            ).questions || [];

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
      }, {} as Record<number, number[]>),
    [sections]
  );

  // Get current section data - memoized with currentPart as dependency will be handled in parent
  const getCurrentSectionData = useMemo(
    () => (currentPart: number) => {
      const currentSection = sections[currentPart - 1]?.section;
      return {
        currentSection,
        currentQuestions: currentSection?.questions || [],
      };
    },
    [sections]
  );

  return {
    sections,
    audioUrls,
    partProgress,
    partQuestionNumbers,
    getCurrentSectionData,
  };
}
