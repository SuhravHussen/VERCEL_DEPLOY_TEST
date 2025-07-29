"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import mockdb from "@/mockdb";
import { QUERY_KEYS } from "@/hooks/query-keys";
import { CreateListeningTestDto } from "@/types/dto/ielts/listening/listening.dto";

/**
 * Hook for updating IELTS Listening tests
 */
export const useUpdateIeltsListeningTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updateData: {
      testId: string;
      testData: CreateListeningTestDto;
    }) => {
      // Mock implementation - in a real app this would be an API call
      const { testId, testData } = updateData;

      const result = mockdb.updateIeltsListeningTest(testId, testData);

      if (!result) {
        throw new Error("Test not found");
      }

      return Promise.resolve(result);
    },
    onSuccess: (data, variables) => {
      // Invalidate all listening tests queries
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.IELTS_LISTENING.TESTS],
      });

      // Invalidate the specific test query
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.IELTS_LISTENING.TEST_BY_ID(variables.testId),
      });

      // Also invalidate any paginated queries that might contain this test
      queryClient.invalidateQueries({
        predicate: (query) => {
          return (
            Array.isArray(query.queryKey) &&
            query.queryKey[0] === QUERY_KEYS.IELTS_LISTENING.TESTS
          );
        },
      });
    },
    onError: (error) => {
      console.error("Failed to update listening test:", error);
    },
  });
};

export default useUpdateIeltsListeningTest;
