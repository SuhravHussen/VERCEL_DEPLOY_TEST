import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/hooks/query-keys";
import mockdb from "@/mockdb";
import { IELTSListeningTest } from "@/types/exam/ielts-academic/listening/listening";

async function fetchIELTSListeningTestById(
  organizationSlug: string,
  testId: string
): Promise<IELTSListeningTest | null> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const test = mockdb.getIeltsListeningTestById(testId);

  if (!test) {
    return null;
  }

  return test;
}

export function useGetIeltsListeningTestById(
  organizationSlug: string,
  testId: string
) {
  const queryKey = QUERY_KEYS.IELTS_LISTENING.TEST_BY_ID(testId);

  return useQuery({
    queryKey,
    queryFn: () => fetchIELTSListeningTestById(organizationSlug, testId),
    enabled: !!testId, // Only run the query if testId is provided
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep unused data in cache for 10 minutes
  });
}
