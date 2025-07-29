"use client";

import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { QUERY_KEYS } from "@/hooks/query-keys";
import mockdb from "@/mockdb";

interface DeleteIeltsWritingQuestionOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface DeleteWritingQuestionParams {
  organizationId: number;
  questionId: string;
}

/**
 * Hook to delete an IELTS Writing question
 */
export function useDeleteIeltsWritingQuestion(
  options?: DeleteIeltsWritingQuestionOptions
): UseMutationResult<void, Error, DeleteWritingQuestionParams> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ questionId }: DeleteWritingQuestionParams) => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const success = mockdb.deleteIeltsWritingQuestion(questionId);

      if (!success) {
        throw new Error(
          "Failed to delete IELTS Writing question - question not found"
        );
      }
    },
    onSuccess: () => {
      // Invalidate questions list query to refetch
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.IELTS_WRITING.QUESTIONS],
      });

      // Call onSuccess callback if provided
      if (options?.onSuccess) {
        options.onSuccess();
      }
    },
    onError: (error) => {
      // Call onError callback if provided
      if (options?.onError) {
        options.onError(error);
      }
    },
  });
}
