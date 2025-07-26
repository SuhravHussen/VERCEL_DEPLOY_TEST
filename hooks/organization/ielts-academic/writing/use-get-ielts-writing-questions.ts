"use client";

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/hooks/query-keys";
import { IELTSWritingTask } from "@/types/exam/ielts-academic/writing/writing";
import mockdb from "@/mockdb";

interface GetIeltsWritingQuestionsResponse {
  questions: IELTSWritingTask[];
  totalPages: number;
  currentPage: number;
  totalQuestions: number;
}

/**
 * Hook to fetch IELTS Writing questions
 * @param organizationId - Organization ID
 * @param page - Page number
 * @param limit - Number of items per page
 * @param search - Search term
 * @param sortBy - Field to sort by
 * @param sortOrder - Sort order (asc or desc)
 * @param status - Filter by status
 * @param taskType - Filter by task type ("task_1" or "task_2")
 * @returns Query result with questions data
 */
export function useGetIeltsWritingQuestions(
  organizationId: number,
  page: number = 1,
  limit: number = 10,
  search: string = "",
  sortBy: string = "createdAt",
  sortOrder: "asc" | "desc" = "desc",
  status?: string,
  taskType?: "task_1" | "task_2"
): UseQueryResult<GetIeltsWritingQuestionsResponse, Error> {
  return useQuery({
    queryKey: [
      QUERY_KEYS.IELTS_WRITING.QUESTIONS,
      organizationId,
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      status,
      taskType,
    ],
    queryFn: async () => {
      // Get questions from mockdb
      const allQuestions = mockdb.ieltsWritingQuestions;

      // Filter by task type if specified
      let filteredQuestions = taskType
        ? allQuestions.filter((q) => q.taskType === taskType)
        : allQuestions;

      // Filter by search term if provided
      if (search) {
        const searchLower = search.toLowerCase();
        filteredQuestions = filteredQuestions.filter(
          (question) =>
            question.instruction.toLowerCase().includes(searchLower) ||
            question.prompt.toLowerCase().includes(searchLower)
        );
      }

      // Sort questions
      filteredQuestions.sort((a, b) => {
        if (sortBy === "instruction") {
          return sortOrder === "asc"
            ? a.instruction.localeCompare(b.instruction)
            : b.instruction.localeCompare(a.instruction);
        } else {
          // Default sort by createdAt (assuming it exists, fallback to id)
          return sortOrder === "asc"
            ? a.id.toString().localeCompare(b.id.toString())
            : b.id.toString().localeCompare(a.id.toString());
        }
      });

      // Calculate pagination
      const totalQuestions = filteredQuestions.length;
      const totalPages = Math.ceil(totalQuestions / limit) || 1;
      const startIndex = (page - 1) * limit;
      const paginatedQuestions = filteredQuestions.slice(
        startIndex,
        startIndex + limit
      );

      return {
        questions: paginatedQuestions,
        totalPages,
        currentPage: page,
        totalQuestions,
      };
    },
  });
}
