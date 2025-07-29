"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import mockdb from "@/mockdb";
import { QUERY_KEYS } from "@/hooks/query-keys";

/**
 * Hook for deleting IELTS Reading tests
 */
export const useDeleteIeltsReadingTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (testId: string) => {
      return new Promise<boolean>((resolve, reject) => {
        try {
          const deleted = mockdb.deleteIeltsReadingTest(testId);

          if (!deleted) {
            reject(new Error("Test not found or could not be deleted"));
            return;
          }

          resolve(true);
        } catch (error) {
          reject(error);
        }
      });
    },
    onSuccess: (_, testId) => {
      // Invalidate all tests lists (with any parameters)
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.IELTS_READING.TESTS],
      });
      // Invalidate the specific test query (in case someone is viewing it)
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.IELTS_READING.TEST_BY_ID(testId),
      });
    },
    onError: (error) => {
      console.error("Failed to delete reading test:", error);
    },
  });
};

export default useDeleteIeltsReadingTest;
