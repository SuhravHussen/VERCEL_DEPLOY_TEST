/**
 * Hook for creating IELTS Reading questions get all questions
 * it supports pagination and search and sorting
 */

import { QUERY_KEYS } from "@/hooks/query-keys";
import mockdb from "@/mockdb";
import { useQuery } from "@tanstack/react-query";

const fetchIeltsReadingTests = async (
  organizationId: number,
  page: number = 1,
  limit: number = 10,
  search: string = "",
  sort: "title" | "createdAt" = "createdAt",
  order: "asc" | "desc" = "desc"
) => {
  console.log("fetching ielts reading tests");
  console.log(organizationId, page, limit, search, sort, order);
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
  organizationId: number,
  page: number = 1,
  limit: number = 10,
  search: string = "",
  sort: "title" | "createdAt" = "createdAt",
  order: "asc" | "desc" = "desc"
) => {
  return useQuery({
    queryKey: [
      QUERY_KEYS.IELTS_READING.TESTS,
      organizationId,
      page,
      limit,
      search,
      sort,
      order,
    ],
    queryFn: () =>
      fetchIeltsReadingTests(organizationId, page, limit, search, sort, order),
  });
};
