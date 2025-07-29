"use client";

import { useQuery } from "@tanstack/react-query";
import mockdb from "@/mockdb";
import { QUERY_KEYS } from "@/hooks/query-keys";
import { IELTSReadingQuestionGroup } from "@/types/exam/ielts-academic/reading/question/question";

/**
 * Hook for getting a single IELTS Reading question by ID
 */
export const useGetIeltsReadingQuestionById = (questionId: string) => {
  return useQuery<IELTSReadingQuestionGroup>({
    queryKey: QUERY_KEYS.IELTS_READING.QUESTION_BY_ID(questionId),
    queryFn: () => {
      const question = mockdb.getIeltsReadingQuestionById(questionId);

      if (!question) {
        throw new Error("Question not found");
      }

      return question;
    },
    enabled: !!questionId,
  });
};

export default useGetIeltsReadingQuestionById;
