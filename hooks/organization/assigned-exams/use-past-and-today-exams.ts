import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../query-keys";
import { mockIELTSExams } from "@/mockdata/mockIeltsExam";
import { ExamModel, ExamFilters } from "@/types/exam/exam";

interface UsePastAndTodayExamsParams {
  organizationId: string;
  page?: number;
  pageSize?: number;
  filters?: ExamFilters;
}

interface UsePastAndTodayExamsResult {
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

// Mock function to simulate fetching exams that are today or already passed
async function fetchPastAndTodayExams(
  organizationId: string,
  filters: ExamFilters = {}
): Promise<ExamModel[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Get all exams and filter to those that are today or past
  const allExams = [...mockIELTSExams];
  const now = new Date();
  now.setHours(23, 59, 59, 999); // End of today

  // Filter to exams that are today or already passed
  let pastAndTodayExams = allExams.filter((exam) => {
    if (exam.lrw_group?.exam_date) {
      const examDate = new Date(exam.lrw_group.exam_date);
      return examDate <= now;
    }
    // If no date, consider it as past/today
    return true;
  });

  // Apply additional filters
  if (filters.examType && filters.examType !== "all") {
    pastAndTodayExams = pastAndTodayExams.filter(
      (exam) =>
        exam.type_of_exam.toLowerCase() === filters.examType?.toLowerCase()
    );
  }

  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    pastAndTodayExams = pastAndTodayExams.filter(
      (exam) =>
        exam.title.toLowerCase().includes(query) ||
        exam.description?.toLowerCase().includes(query)
    );
  }

  // Sort by latest first (reverse chronological for past exams)
  pastAndTodayExams.sort((a, b) => {
    const dateA = new Date(a.lrw_group?.exam_date || a.created_at || "");
    const dateB = new Date(b.lrw_group?.exam_date || b.created_at || "");
    return dateB.getTime() - dateA.getTime(); // Latest first
  });

  return pastAndTodayExams;
}

export function usePastAndTodayExams({
  organizationId,
  page = 1,
  pageSize = 6,
  filters = {},
}: UsePastAndTodayExamsParams): UsePastAndTodayExamsResult {
  // Fetch all past and today exams with filters applied
  const {
    data: allExams = [],
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: [
      ...QUERY_KEYS.ASSIGNED_EXAMS.BY_ORGANIZATION_FILTERED(
        organizationId,
        filters
      ),
      "past-and-today",
    ],
    queryFn: () => fetchPastAndTodayExams(organizationId, filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!organizationId,
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
    error: queryError ? "Failed to load past and today exams" : null,
    refetch,
  };
}
