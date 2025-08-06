import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../query-keys";
import { mockIELTSExams } from "@/mockdata/mockIeltsExam";
import { ExamModel, ExamFilters, ExamStatsData } from "@/types/exam/exam";

interface UseOrganizationAssignedExamsParams {
  organizationId: string;
  page?: number;
  pageSize?: number;
  filters?: ExamFilters;
}

interface UseOrganizationAssignedExamsResult {
  exams: ExamModel[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  stats: ExamStatsData;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

// Mock function to simulate fetching assigned exams
async function fetchOrganizationAssignedExams(
  organizationId: string,
  filters: ExamFilters = {}
): Promise<ExamModel[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // For now, return all mock IELTS exams
  // In a real implementation, this would filter by organizationId and user assignments
  let filteredExams = [...mockIELTSExams];

  // Apply filters
  if (filters.examType && filters.examType !== "all") {
    filteredExams = filteredExams.filter(
      (exam) =>
        exam.type_of_exam.toLowerCase() === filters.examType?.toLowerCase()
    );
  }

  if (filters.priceFilter && filters.priceFilter !== "all") {
    if (filters.priceFilter === "free") {
      filteredExams = filteredExams.filter((exam) => exam.is_free);
    } else if (filters.priceFilter === "paid") {
      filteredExams = filteredExams.filter((exam) => !exam.is_free);
    }
  }

  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filteredExams = filteredExams.filter(
      (exam) =>
        exam.title.toLowerCase().includes(query) ||
        exam.description?.toLowerCase().includes(query)
    );
  }

  // Apply sorting
  const sortBy = filters.sortBy || "date";
  const sortOrder = filters.sortOrder || "desc";

  filteredExams.sort((a, b) => {
    let aValue: string | number | Date;
    let bValue: string | number | Date;

    switch (sortBy) {
      case "date":
        aValue = new Date(a.lrw_group?.exam_date || a.created_at || "");
        bValue = new Date(b.lrw_group?.exam_date || b.created_at || "");
        break;
      case "price":
        aValue = a.price;
        bValue = b.price;
        break;
      case "title":
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case "created_at":
        aValue = new Date(a.created_at || "");
        bValue = new Date(b.created_at || "");
        break;
      default:
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
    }

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return filteredExams;
}

// Calculate exam statistics
const calculateExamStats = (exams: ExamModel[]): ExamStatsData => {
  const stats: ExamStatsData = {
    totalExams: exams.length,
    totalByType: {
      ielts: 0,
      toefl: 0,
      gre: 0,
      sat: 0,
      gmat: 0,
    },
    freeExams: 0,
    paidExams: 0,
    upcomingExams: 0,
    publishedExams: 0,
  };

  const now = new Date();

  exams.forEach((exam) => {
    // Count by type
    if (stats.totalByType.hasOwnProperty(exam.type_of_exam)) {
      stats.totalByType[exam.type_of_exam]++;
    }

    // Count free/paid
    if (exam.is_free) {
      stats.freeExams++;
    } else {
      stats.paidExams++;
    }

    // Count upcoming exams
    if (exam.lrw_group?.exam_date) {
      const examDate = new Date(exam.lrw_group.exam_date);
      if (examDate > now) {
        stats.upcomingExams++;
      }
    }

    // Count published exams
    if (exam.is_published) {
      stats.publishedExams++;
    }
  });

  return stats;
};

export function useOrganizationAssignedExams({
  organizationId,
  page = 1,
  pageSize = 12,
  filters = {},
}: UseOrganizationAssignedExamsParams): UseOrganizationAssignedExamsResult {
  // Fetch all assigned exams with filters applied
  const {
    data: allExams = [],
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.ASSIGNED_EXAMS.BY_ORGANIZATION_FILTERED(
      organizationId,
      filters
    ),
    queryFn: () => fetchOrganizationAssignedExams(organizationId, filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!organizationId,
  });

  // Calculate pagination and stats
  const paginationData = useMemo(() => {
    const totalCount = allExams.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const validPage = Math.max(1, Math.min(page, totalPages || 1));

    const startIndex = (validPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedExams = allExams.slice(startIndex, endIndex);

    const stats = calculateExamStats(allExams);

    return {
      exams: paginatedExams,
      totalCount,
      totalPages,
      currentPage: validPage,
      hasNextPage: validPage < totalPages,
      hasPreviousPage: validPage > 1,
      stats,
    };
  }, [allExams, page, pageSize]);

  return {
    ...paginationData,
    isLoading,
    error: queryError ? "Failed to load assigned exams" : null,
    refetch,
  };
}

/**
 * Hook for fetching assigned exam statistics only (without pagination)
 */
export function useOrganizationAssignedExamStats(organizationId: string) {
  const {
    data: allExams = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.ASSIGNED_EXAMS.BY_ORGANIZATION(organizationId),
    queryFn: () => fetchOrganizationAssignedExams(organizationId),
    staleTime: 5 * 60 * 1000,
    enabled: !!organizationId,
  });

  const stats = useMemo(() => calculateExamStats(allExams), [allExams]);

  return {
    stats,
    isLoading,
    error: error ? "Failed to load exam statistics" : null,
  };
}
