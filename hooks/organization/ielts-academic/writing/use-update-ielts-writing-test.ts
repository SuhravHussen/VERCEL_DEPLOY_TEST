"use client";

import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { QUERY_KEYS } from "@/hooks/query-keys";
import { IELTSWritingTest } from "@/types/exam/ielts-academic/writing/writing";
import mockdb from "@/mockdb";

interface UpdateIeltsWritingTestOptions {
  onSuccess?: (data: IELTSWritingTest) => void;
  onError?: (error: Error) => void;
}

interface UpdateWritingTestParams {
  testId: string;
  organizationId: number;
  testData: Partial<IELTSWritingTest>;
}

/**
 * Hook to update an IELTS Writing test
 */
export function useUpdateIeltsWritingTest(
  options?: UpdateIeltsWritingTestOptions
): UseMutationResult<IELTSWritingTest, Error, UpdateWritingTestParams> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ testId, testData }: UpdateWritingTestParams) => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const updatedTest = mockdb.updateIeltsWritingTest(testId, testData);

      if (!updatedTest) {
        throw new Error("Failed to update IELTS Writing test - test not found");
      }

      return updatedTest;
    },
    onSuccess: (data, variables) => {
      // Invalidate all tests-related queries (including paginated and filtered ones)
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.IELTS_WRITING.TESTS],
      });

      // Invalidate the specific test query to ensure edit pages show updated data
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.IELTS_WRITING.TEST_BY_ID(variables.testId),
      });

      // Call onSuccess callback if provided
      if (options?.onSuccess) {
        options.onSuccess(data);
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
