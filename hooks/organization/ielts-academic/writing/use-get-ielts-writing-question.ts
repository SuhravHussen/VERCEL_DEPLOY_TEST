"use client";

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/hooks/query-keys";
import { IELTSWritingTask } from "@/types/exam/ielts-academic/writing/writing";
import mockdb from "@/mockdb";

/**
 * Hook to fetch a single IELTS Writing question by ID
 * @param organizationId - Organization ID
 * @param questionId - Question ID
 * @returns Query result with question data
 */
export function useGetIeltsWritingQuestion(
  organizationSlug: string,
  questionId: string
): UseQueryResult<IELTSWritingTask, Error> {
  return useQuery({
    queryKey: QUERY_KEYS.IELTS_WRITING.QUESTION_BY_ID(questionId),
    queryFn: async () => {
      // Get question from mockdb
      const question = mockdb.ieltsWritingQuestions.find(
        (q) => q.id === questionId
      );

      if (!question) {
        throw new Error("Question not found");
      }

      return question;
    },
    enabled: !!questionId && !!organizationSlug,
  });
}
