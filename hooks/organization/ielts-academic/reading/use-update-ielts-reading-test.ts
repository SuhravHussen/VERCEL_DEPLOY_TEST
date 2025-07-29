"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import mockdb from "@/mockdb";
import { QUERY_KEYS } from "@/hooks/query-keys";
import { IELTSReadingTest } from "@/types/exam/ielts-academic/reading/test/test";
import { CreateReadingTestDto } from "@/types/dto/ielts/reading/test.dto";

/**
 * Hook for updating IELTS Reading tests
 */
export const useUpdateIeltsReadingTest = (testId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (testData: CreateReadingTestDto) => {
      return new Promise<IELTSReadingTest>((resolve, reject) => {
        try {
          const updatedTest = mockdb.updateIeltsReadingTest(
            testId,
            testData as unknown as Partial<IELTSReadingTest>
          );

          if (!updatedTest) {
            reject(new Error("Test not found"));
            return;
          }

          resolve(updatedTest);
        } catch (error) {
          reject(error);
        }
      });
    },
    onSuccess: () => {
      // Invalidate all tests lists (with any parameters)
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.IELTS_READING.TESTS],
      });
      // Invalidate the specific test query
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.IELTS_READING.TEST_BY_ID(testId),
      });
    },
    onError: (error) => {
      console.error("Failed to update reading test:", error);
    },
  });
};

export default useUpdateIeltsReadingTest;
