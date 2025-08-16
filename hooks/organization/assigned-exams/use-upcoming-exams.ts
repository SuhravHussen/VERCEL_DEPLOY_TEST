import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../query-keys";
import { mockIELTSExams } from "@/mockdata/mockIeltsExam";
import { ExamModel, ExamFilters } from "@/types/exam/exam";

interface UseUpcomingExamsParams {
  organizationSlug: string;
  page?: number;
  pageSize?: number;
  filters?: ExamFilters;
}

interface UseUpcomingExamsResult {
  exams: ExamModel[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

// Mock function to simulate fetching upcoming exams (future dates)
async function fetchUpcomingExams(
  organizationSlug: string,
  filters: ExamFilters = {}
): Promise<ExamModel[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Get all exams and filter to upcoming ones
  const allExams = [...mockIELTSExams];
  const now = new Date();

  // Filter to upcoming exams (future dates only)
  let upcomingExams = allExams.filter((exam) => {
    if (exam.lrw_group?.exam_date) {
      const examDate = new Date(exam.lrw_group.exam_date);
      return examDate > now;
    }
    // If no date, don't consider it as upcoming
    return false;
  });

  // Apply additional filters
  if (filters.examType && filters.examType !== "all") {
    upcomingExams = upcomingExams.filter(
      (exam) =>
        exam.type_of_exam.toLowerCase() === filters.examType?.toLowerCase()
    );
  }

  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    upcomingExams = upcomingExams.filter(
      (exam) =>
        exam.title.toLowerCase().includes(query) ||
        exam.description?.toLowerCase().includes(query)
    );
  }

  // Sort by earliest first (chronological for future exams)
  upcomingExams.sort((a, b) => {
    const dateA = new Date(a.lrw_group?.exam_date || a.created_at || "");
    const dateB = new Date(b.lrw_group?.exam_date || b.created_at || "");
    return dateA.getTime() - dateB.getTime(); // Earliest first
  });

  return upcomingExams;
}

export function useUpcomingExams({
  organizationSlug,
  page = 1,
  pageSize = 6,
  filters = {},
}: UseUpcomingExamsParams): UseUpcomingExamsResult {
  // Fetch all upcoming exams with filters applied
  const {
    data: allExams = [],
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: [
      ...QUERY_KEYS.ASSIGNED_EXAMS.BY_ORGANIZATION_FILTERED(
        organizationSlug,
        filters
      ),
      "upcoming",
    ],
    queryFn: () => fetchUpcomingExams(organizationSlug, filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!organizationSlug,
  });

  // Calculate pagination
  const paginationData = useMemo(() => {
    const totalCount = allExams.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const validPage = Math.max(1, Math.min(page, totalPages || 1));

    const startIndex = (validPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedExams = allExams.slice(startIndex, endIndex);

    return {
      exams: paginatedExams,
      totalCount,
      totalPages,
      currentPage: validPage,
      hasNextPage: validPage < totalPages,
      hasPreviousPage: validPage > 1,
    };
  }, [allExams, page, pageSize]);

  return {
    ...paginationData,
    isLoading,
    error: queryError ? "Failed to load upcoming exams" : null,
    refetch,
  };
}
