/**
 * Hook for creating IELTS Reading questions get all questions
 * it supports pagination and search and sorting
 */

import { QUERY_KEYS } from "@/hooks/query-keys";
import mockdb from "@/mockdb";
import { useQuery } from "@tanstack/react-query";

const fetchIeltsReadingTests = async (
  organizationSlug: string,
  page: number = 1,
  limit: number = 10,
  search: string = "",
  sort: "title" | "createdAt" = "createdAt",
  order: "asc" | "desc" = "desc"
) => {
  const tests = mockdb.getIeltsReadingTests();

  if (tests.length === 0) {
    return {
      tests: [],
      totalPages: 0,
      totalQuestions: 0,
      currentPage: page,
      limit,
      search,
      sort,
      order,
    };
  }
  return {
    tests,
    totalPages: Math.ceil(tests.length / limit),
    totalTests: tests.length,
    currentPage: page,
    limit,
    search,
    sort,
    order,
  };
};

export const useGetIeltsReadingTests = (
  organizationSlug: string,
  page: number = 1,
  limit: number = 10,
  search: string = "",
  sort: "title" | "createdAt" = "createdAt",
  order: "asc" | "desc" = "desc"
) => {
  return useQuery({
    queryKey: [
      QUERY_KEYS.IELTS_READING.TESTS,
      organizationSlug,
      page,
      limit,
      search,
      sort,
      order,
    ],
    queryFn: () =>
      fetchIeltsReadingTests(
        organizationSlug,
        page,
        limit,
        search,
        sort,
        order
      ),
  });
};
