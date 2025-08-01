import { useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ExamModel } from "@/types/exam/exam";
import { QUERY_KEYS } from "@/hooks/query-keys";
import mockdb from "@/mockdb";

interface UseUserOrganizationExamsParams {
  organizationId: string;
  page?: number;
  pageSize?: number;
  sortBy?: "date" | "price" | "title";
  sortOrder?: "asc" | "desc";
  priceFilter?: "all" | "free" | "paid";
}

interface UseUserOrganizationExamsResult {
  exams: ExamModel[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
}

const fetchOrganizationExams = async (
  organizationId: string,
  sortBy: "date" | "price" | "title" = "date",
  sortOrder: "asc" | "desc" = "asc",
  priceFilter: "all" | "free" | "paid" = "all"
) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Get all exams from mockdb
  const allExams = mockdb.getIeltsExams();

  // Filter exams by registration deadline (only show future exams)
  const now = new Date();
  const activeExams = allExams.filter((exam) => {
    if (!exam.registration_deadline) return true; // If no deadline, show it
    return new Date(exam.registration_deadline) > now;
  });

  // Filter by price
  let filteredExams = activeExams;
  if (priceFilter === "free") {
    filteredExams = activeExams.filter((exam) => exam.is_free);
  } else if (priceFilter === "paid") {
    filteredExams = activeExams.filter((exam) => !exam.is_free);
  }

  // Sort exams
  const sortedExams = [...filteredExams].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "date":
        const dateA = new Date(a?.lrw_group?.exam_date || "");
        const dateB = new Date(b?.lrw_group?.exam_date || "");
        comparison = dateA.getTime() - dateB.getTime();
        break;
      case "price":
        comparison = a.price - b.price;
        break;
      case "title":
        comparison = a.title.localeCompare(b.title);
        break;
      default:
        comparison = 0;
    }

    return sortOrder === "desc" ? -comparison : comparison;
  });

  return sortedExams;
};

export function useUserOrganizationExams({
  organizationId,
  page = 1,
  pageSize = 6,
  sortBy = "date",
  sortOrder = "asc",
  priceFilter = "all",
}: UseUserOrganizationExamsParams): UseUserOrganizationExamsResult {
  const {
    data: allExams = [],
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: [
      ...QUERY_KEYS.IELTS_EXAM.BY_ORGANIZATION(organizationId),
      { sortBy, sortOrder, priceFilter },
    ],
    queryFn: () =>
      fetchOrganizationExams(organizationId, sortBy, sortOrder, priceFilter),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const { paginatedExams, totalCount, totalPages } = useMemo(() => {
    const count = allExams.length;
    const pages = Math.ceil(count / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginated = allExams.slice(startIndex, endIndex);

    return {
      paginatedExams: paginated,
      totalCount: count,
      totalPages: pages,
    };
  }, [allExams, page, pageSize]);

  return {
    exams: paginatedExams,
    totalCount,
    totalPages,
    currentPage: page,
    isLoading,
    error: queryError ? "Failed to load exams" : null,
  };
}

/**
 * Utility hook to invalidate organization exams queries
 * Use this in mutation hooks for create/update/delete exam operations
 *
 * @example
 * ```typescript
 * const { invalidateOrganizationExams } = useInvalidateOrganizationExams();
 *
 * const createExamMutation = useMutation({
 *   mutationFn: createExam,
 *   onSuccess: () => {
 *     invalidateOrganizationExams(organizationId);
 *   }
 * });
 * ```
 */
export function useInvalidateOrganizationExams() {
  const queryClient = useQueryClient();

  const invalidateOrganizationExams = (organizationId: string) => {
    // Invalidate all organization exam queries for this organization
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.IELTS_EXAM.BY_ORGANIZATION(organizationId),
    });
  };

  const invalidateAllExamQueries = () => {
    // Invalidate all exam-related queries
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.IELTS_EXAM.LIST,
    });
  };

  return {
    invalidateOrganizationExams,
    invalidateAllExamQueries,
  };
}
