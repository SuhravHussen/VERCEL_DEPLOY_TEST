"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import mockdb from "@/mockdb";
import { QUERY_KEYS } from "@/hooks/query-keys";

/**
 * Hook for deleting IELTS Reading questions
 */
export const useDeleteIeltsReadingQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (questionId: string) => {
      return new Promise<boolean>((resolve, reject) => {
        try {
          const deleted = mockdb.deleteIeltsReadingQuestion(questionId);

          if (!deleted) {
            reject(new Error("Question not found or could not be deleted"));
            return;
          }

          resolve(true);
        } catch (error) {
          reject(error);
        }
      });
    },
    onSuccess: (_, questionId) => {
      // Invalidate all questions lists (with any parameters)
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.IELTS_READING.QUESTIONS],
      });
      // Invalidate the specific question query (in case someone is viewing it)
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.IELTS_READING.QUESTION_BY_ID(questionId),
      });
    },
    onError: (error) => {
      console.error("Failed to delete reading question:", error);
    },
  });
};

export default useDeleteIeltsReadingQuestion;
