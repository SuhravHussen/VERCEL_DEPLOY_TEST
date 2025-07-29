"use client";

import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { QUERY_KEYS } from "@/hooks/query-keys";
import mockdb from "@/mockdb";

interface DeleteIeltsWritingTestOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface DeleteWritingTestParams {
  organizationId: number;
  testId: string;
}

/**
 * Hook to delete an IELTS Writing test
 */
export function useDeleteIeltsWritingTest(
  options?: DeleteIeltsWritingTestOptions
): UseMutationResult<void, Error, DeleteWritingTestParams> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ testId }: DeleteWritingTestParams) => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const success = mockdb.deleteIeltsWritingTest(testId);

      if (!success) {
        throw new Error("Failed to delete IELTS Writing test - test not found");
      }
    },
    onSuccess: (_, variables) => {
      // Invalidate all tests-related queries (including paginated and filtered ones)
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.IELTS_WRITING.TESTS],
      });

      // Remove the specific test from cache since it no longer exists
      queryClient.removeQueries({
        queryKey: QUERY_KEYS.IELTS_WRITING.TEST_BY_ID(variables.testId),
      });

      // Call onSuccess callback if provided
      options?.onSuccess?.();
    },
    onError: (error) => {
      // Call onError callback if provided
      options?.onError?.(error);
    },
  });
}
