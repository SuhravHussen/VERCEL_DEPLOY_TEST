import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/hooks/query-keys";
import { IELTSWritingTest } from "@/types/exam/ielts-academic/writing/writing";
import mockdb from "@/mockdb";

interface GetIeltsWritingTestsResponse {
  tests: IELTSWritingTest[];
  totalPages: number;
  currentPage: number;
  totalTests: number;
}

/**
 * Hook to fetch IELTS Writing tests
 * @param organizationId - Organization ID
 * @param page - Page number
 * @param limit - Number of items per page
 * @param search - Search term
 * @param sortBy - Field to sort by
 * @param sortOrder - Sort order (asc or desc)
 * @param status - Filter by status
 * @returns Query result with tests data
 */
export function useGetIeltsWritingTests(
  organizationSlug: string,
  page: number = 1,
  limit: number = 10,
  search: string = "",
  sortBy: string = "createdAt",
  sortOrder: "asc" | "desc" = "desc",
  status?: string
): UseQueryResult<GetIeltsWritingTestsResponse, Error> {
  return useQuery({
    queryKey: [
      QUERY_KEYS.IELTS_WRITING.TESTS,
      organizationSlug,
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      status,
    ],
    queryFn: async () => {
      // Get tests from mockdb
      const allTests = mockdb.getIeltsWritingTests();

      return {
        tests: allTests,
        totalPages: 10,
        currentPage: page,
        totalTests: allTests.length,
      };
    },
  });
}
