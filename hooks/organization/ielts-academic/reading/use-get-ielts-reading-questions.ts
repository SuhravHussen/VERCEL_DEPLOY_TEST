/**
 * Hook for creating IELTS Reading questions get all questions
 * it supports pagination and search and sorting
 */

import { QUERY_KEYS } from "@/hooks/query-keys";
import mockdb from "@/mockdb";
import { useQuery } from "@tanstack/react-query";

const fetchIeltsReadingQuestions = async (
  organizationSlug: string,
  page: number = 1,
  limit: number = 10,
  search: string = "",
  sort: "passageTitle" | "questionType" | "createdAt" = "createdAt",
  order: "asc" | "desc" = "desc"
) => {
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
  organizationSlug: string,
  page: number = 1,
  limit: number = 10,
  search: string = "",
  sort: "passageTitle" | "questionType" | "createdAt" = "createdAt",
  order: "asc" | "desc" = "desc"
) => {
  return useQuery({
    queryKey: [
      QUERY_KEYS.IELTS_READING.QUESTIONS,
      organizationSlug,
      page,
      limit,
      search,
      sort,
      order,
    ],
    queryFn: () =>
      fetchIeltsReadingQuestions(
        organizationSlug,
        page,
        limit,
        search,
        sort,
        order
      ),
  });
};
