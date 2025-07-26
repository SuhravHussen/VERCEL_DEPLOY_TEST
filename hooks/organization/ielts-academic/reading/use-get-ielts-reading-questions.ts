/**
 * Hook for creating IELTS Reading questions get all questions
 * it supports pagination and search and sorting
 */

import { QUERY_KEYS } from "@/hooks/query-keys";
import mockdb from "@/mockdb";
import { useQuery } from "@tanstack/react-query";

const fetchIeltsReadingQuestions = async (
  organizationId: number,
  page: number = 1,
  limit: number = 10,
  search: string = "",
  sort: "passageTitle" | "questionType" | "createdAt" = "createdAt",
  order: "asc" | "desc" = "desc"
) => {
  console.log(organizationId, page, limit, search, sort, order);
  const questions = mockdb.getIeltsReadingQuestions();

  if (questions.length === 0) {
    return {
      questions: [],
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
    questions,
    totalPages: Math.ceil(questions.length / limit),
    totalQuestions: questions.length,
    currentPage: page,
    limit,
    search,
    sort,
    order,
  };
};

export const useGetIeltsReadingQuestions = (
  organizationId: number,
  page: number = 1,
  limit: number = 10,
  search: string = "",
  sort: "passageTitle" | "questionType" | "createdAt" = "createdAt",
  order: "asc" | "desc" = "desc"
) => {
  return useQuery({
    queryKey: [
      QUERY_KEYS.IELTS_READING.QUESTIONS,
      organizationId,
      page,
      limit,
      search,
      sort,
      order,
    ],
    queryFn: () =>
      fetchIeltsReadingQuestions(
        organizationId,
        page,
        limit,
        search,
        sort,
        order
      ),
  });
};
