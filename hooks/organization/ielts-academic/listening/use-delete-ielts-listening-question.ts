"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import mockdb from "@/mockdb";
import { QUERY_KEYS } from "@/hooks/query-keys";

/**
 * Hook for deleting IELTS Listening questions
 */
export const useDeleteIeltsListeningQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (questionId: string) => {
      // Mock implementation - in a real app this would be an API call
      const result = mockdb.deleteIeltsListeningQuestion(questionId);

      if (!result) {
        throw new Error("Question not found or could not be deleted");
      }

      return Promise.resolve(result);
    },
    onSuccess: (data, questionId) => {
      // Invalidate all related queries
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.IELTS_LISTENING.QUESTIONS],
      });

      // Remove the specific question from cache
      queryClient.removeQueries({
        queryKey: [QUERY_KEYS.IELTS_LISTENING.QUESTIONS, "single", questionId],
      });

      // Also invalidate any paginated queries that might contain this question
      queryClient.invalidateQueries({
        predicate: (query) => {
          return (
            Array.isArray(query.queryKey) &&
            query.queryKey[0] === QUERY_KEYS.IELTS_LISTENING.QUESTIONS
          );
        },
      });
    },
    onError: (error) => {
      console.error("Failed to delete listening question:", error);
    },
  });
};

export default useDeleteIeltsListeningQuestion;
