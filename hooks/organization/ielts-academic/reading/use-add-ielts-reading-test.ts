"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import mockdb from "@/mockdb";
import { QUERY_KEYS } from "@/hooks/query-keys";

import { CreateReadingTestDto } from "@/types/dto/ielts/reading/test.dto";

/**
 * Hook for creating IELTS Reading questions
 */
export const useCreateIeltsReadingTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (testData: CreateReadingTestDto) =>
      Promise.resolve(mockdb.createIeltsReadingTest(testData)),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.IELTS_READING.TESTS],
      });
    },
    onError: (error) => {
      console.error("Failed to create reading question:", error);
    },
  });
};

export default useCreateIeltsReadingTest;
