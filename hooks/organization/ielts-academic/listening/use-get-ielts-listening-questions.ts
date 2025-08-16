import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/hooks/query-keys";
import mockdb from "@/mockdb";
import { IELTSListeningTestSection } from "@/types/exam/ielts-academic/listening/listening";

async function fetchIELTSListeningQuestions({
  search = "",
  sortBy = "createdAt",
  sortOrder = "desc",
  page = 1,
  limit = 10,
}): Promise<{
  questions: IELTSListeningTestSection[];
  totalPages: number;
  totalItems: number;
}> {
  console.log(page, limit, search, sortBy, sortOrder);
  // Simulate network delay to show loading states
  await new Promise((resolve) => setTimeout(resolve, 300));

  const paginatedQuestions = mockdb.getIeltsListeningQuestions();

  // Filter questions based on search term if provided
  let filteredQuestions = paginatedQuestions;
  if (search) {
    const searchLower = search.toLowerCase();
    filteredQuestions = paginatedQuestions.filter(
      (item) =>
        item.audio.title.toLowerCase().includes(searchLower) ||
        item.questions.some(
          (q) =>
            q.questionType.toLowerCase().includes(searchLower) ||
            q.instruction.toLowerCase().includes(searchLower)
        )
    );
  }

  // Sort questions if sortBy is provided
  if (sortBy) {
    filteredQuestions = [...filteredQuestions].sort((a, b) => {
      if (sortBy === "audioTitle") {
        return sortOrder === "asc"
          ? a.audio.title.localeCompare(b.audio.title)
          : b.audio.title.localeCompare(a.audio.title);
      }

      if (sortBy === "questionType") {
        return sortOrder === "asc"
          ? a.questions[0]?.questionType.localeCompare(
              b.questions[0]?.questionType || ""
            )
          : b.questions[0]?.questionType.localeCompare(
              a.questions[0]?.questionType || ""
            );
      }

      // Default: sort by createdAt (mock implementation)
      return sortOrder === "asc" ? -1 : 1;
    });
  }

  return {
    questions: filteredQuestions,
    totalPages: 10,
    totalItems: filteredQuestions.length,
  };
}

export function useGetIeltsListeningQuestions(
  organizationSlug: string,
  page: number,
  limit: number,
  search?: string,
  sortBy?: "audioTitle" | "questionType" | "createdAt",
  sortOrder?: "asc" | "desc"
) {
  const [isFetching, setIsFetching] = useState(false);

  // Create a stable query key for caching
  const queryKey = [
    QUERY_KEYS.IELTS_LISTENING.QUESTIONS,
    organizationSlug,
    page,
    limit,
    search || "",
    sortBy || "createdAt",
    sortOrder || "desc",
  ];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      setIsFetching(true);
      try {
        const response = await fetchIELTSListeningQuestions({
          search,
          sortBy,
          sortOrder,
          page,
          limit,
        });
        return response;
      } finally {
        setIsFetching(false);
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep unused data in cache for 10 minutes
  });

  return {
    ...query,
    isFetching,
    isLoading: query.isLoading, // Separate loading and fetching states
  };
}
