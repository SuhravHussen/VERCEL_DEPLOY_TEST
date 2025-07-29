"use client";

import { useQuery } from "@tanstack/react-query";
import mockdb from "@/mockdb";
import { QUERY_KEYS } from "@/hooks/query-keys";
import { IELTSReadingTest } from "@/types/exam/ielts-academic/reading/test/test";

/**
 * Hook for getting a single IELTS Reading test by ID
 */
export const useGetIeltsReadingTestById = (testId: string) => {
  return useQuery<IELTSReadingTest>({
    queryKey: QUERY_KEYS.IELTS_READING.TEST_BY_ID(testId),
    queryFn: () => {
      const test = mockdb.getIeltsReadingTestById(testId);

      if (!test) {
        throw new Error("Test not found");
      }

      return test;
    },
    enabled: !!testId,
  });
};

export default useGetIeltsReadingTestById;
