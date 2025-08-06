import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../query-keys";
import { mockIELTSExams } from "@/mockdata/mockIeltsExam";
import { ExamModel, ExamFilters } from "@/types/exam/exam";

interface UseNeedsGradingExamsParams {
  organizationId: string;
  page?: number;
  pageSize?: number;
  filters?: ExamFilters;
}

interface UseNeedsGradingExamsResult {
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

// Mock function to simulate fetching exams that need grading
async function fetchNeedsGradingExams(
  organizationId: string,
  filters: ExamFilters = {}
): Promise<ExamModel[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Get all exams and filter to those that need grading
  const allExams = [...mockIELTSExams];
  const now = new Date();

  // Filter to exams that need grading (past dates)
  let needsGradingExams = allExams.filter((exam) => {
    if (exam.lrw_group?.exam_date) {
      const examDate = new Date(exam.lrw_group.exam_date);
      return examDate <= now;
    }
    // If no date, consider it as needs grading
    return true;
  });

  // Apply additional filters
  if (filters.examType && filters.examType !== "all") {
    needsGradingExams = needsGradingExams.filter(
      (exam) =>
        exam.type_of_exam.toLowerCase() === filters.examType?.toLowerCase()
    );
  }

  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    needsGradingExams = needsGradingExams.filter(
      (exam) =>
        exam.title.toLowerCase().includes(query) ||
        exam.description?.toLowerCase().includes(query)
    );
  }

  // Sort by latest first (reverse chronological for past exams)
  needsGradingExams.sort((a, b) => {
    const dateA = new Date(a.lrw_group?.exam_date || a.created_at || "");
    const dateB = new Date(b.lrw_group?.exam_date || b.created_at || "");
    return dateB.getTime() - dateA.getTime(); // Latest first
  });

  return needsGradingExams;
}

export function useNeedsGradingExams({
  organizationId,
  page = 1,
  pageSize = 6,
  filters = {},
}: UseNeedsGradingExamsParams): UseNeedsGradingExamsResult {
  // Fetch all needs grading exams with filters applied
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
      "needs-grading",
    ],
    queryFn: () => fetchNeedsGradingExams(organizationId, filters),
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
    error: queryError ? "Failed to load exams that need grading" : null,
    refetch,
  };
}
