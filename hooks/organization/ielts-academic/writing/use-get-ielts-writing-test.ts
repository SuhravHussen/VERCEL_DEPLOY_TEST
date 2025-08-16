"use client";

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/hooks/query-keys";
import { IELTSWritingTest } from "@/types/exam/ielts-academic/writing/writing";
import mockdb from "@/mockdb";

/**
 * Hook to fetch a single IELTS Writing test by ID
 * @param organizationId - Organization ID
 * @param testId - Test ID
 * @returns Query result with test data
 */
export function useGetIeltsWritingTest(
  organizationSlug: string,
  testId: string
): UseQueryResult<IELTSWritingTest, Error> {
  return useQuery({
    queryKey: QUERY_KEYS.IELTS_WRITING.TEST_BY_ID(testId),
    queryFn: async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Get test from mockdb
      const test = mockdb.getIeltsWritingTestById(testId);

      if (!test) {
        throw new Error("Test not found");
      }

      return test;
    },
    enabled: !!testId && !!organizationSlug,
  });
}
