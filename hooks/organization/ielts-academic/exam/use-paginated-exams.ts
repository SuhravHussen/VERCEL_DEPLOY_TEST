import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { IELTSExamModel } from "@/types/exam/ielts-academic/exam";
import { QUERY_KEYS } from "@/hooks/query-keys";
import mockdb from "@/mockdb";

interface UsePaginatedExamsProps {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
}

interface PaginatedExamsResult {
  exams: IELTSExamModel[];
  totalExams: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  error: Error | null;
}

export function usePaginatedExams({
  page = 1,
  pageSize = 6,
  searchQuery = "",
}: UsePaginatedExamsProps = {}): PaginatedExamsResult {
  const {
    data: allExams = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.IELTS_EXAM.PAGINATED(page, pageSize, searchQuery),
    queryFn: async (): Promise<IELTSExamModel[]> => {
      console.log("fetching exams");
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockdb.getIeltsExams();
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 10, // Keep in cache for 10 minutes
  });

  // Filter and paginate data
  const paginationData = useMemo(() => {
    // Filter exams based on search query
    let filteredExams = allExams;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredExams = allExams.filter(
        (exam) =>
          exam.title.toLowerCase().includes(query) ||
          exam.description?.toLowerCase().includes(query) ||
          exam.id.toLowerCase().includes(query)
      );
    }

    // Calculate pagination
    const totalExams = filteredExams.length;
    const totalPages = Math.ceil(totalExams / pageSize);
    const currentPage = Math.max(1, Math.min(page, totalPages));

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const exams = filteredExams.slice(startIndex, endIndex);

    return {
      exams,
      totalExams,
      totalPages,
      currentPage,
      pageSize,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    };
  }, [allExams, searchQuery, page, pageSize]);

  return {
    ...paginationData,
    isLoading,
    error: error as Error | null,
  };
}
