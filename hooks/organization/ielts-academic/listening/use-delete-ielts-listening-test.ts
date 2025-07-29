"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import mockdb from "@/mockdb";
import { QUERY_KEYS } from "@/hooks/query-keys";

/**
 * Hook for deleting IELTS Listening tests
 */
export const useDeleteIeltsListeningTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (testId: string) => {
      // Mock implementation - in a real app this would be an API call
      const result = mockdb.deleteIeltsListeningTest(testId);

      if (!result) {
        throw new Error("Test not found or could not be deleted");
      }

      return Promise.resolve(result);
    },
    onSuccess: (data, testId) => {
      // Invalidate all listening tests queries
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.IELTS_LISTENING.TESTS],
      });

      // Remove the specific test query from cache
      queryClient.removeQueries({
        queryKey: QUERY_KEYS.IELTS_LISTENING.TEST_BY_ID(testId),
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
      console.error("Failed to delete listening test:", error);
    },
  });
};

export default useDeleteIeltsListeningTest;
