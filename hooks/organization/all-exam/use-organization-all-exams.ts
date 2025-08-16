"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { QUERY_KEYS } from "@/hooks/query-keys";
import {
  ExamModel,
  ExamFilters,
  ExamType,
  ExamStatsData,
} from "@/types/exam/exam";
import mockdb from "@/mockdb";

export interface UseOrganizationAllExamsParams {
  organizationSlug: string;
  page?: number;
  pageSize?: number;
  filters?: ExamFilters;
}

export interface UseOrganizationAllExamsResult {
  // Data
  exams: ExamModel[];
  totalCount: number;
  totalPages: number;
  currentPage: number;

  // Pagination info
  hasNextPage: boolean;
  hasPreviousPage: boolean;

  // Stats
  stats: ExamStatsData;

  // Loading states
  isLoading: boolean;
  error: string | null;

  // Utilities
  refetch: () => void;
}

const fetchOrganizationAllExams = async (
  organizationSlug: string,
  filters?: ExamFilters
): Promise<ExamModel[]> => {
  // Simulate API delay for realistic behavior
  await new Promise((resolve) => setTimeout(resolve, 400));

  return mockdb.getAllExamsByOrganization(organizationSlug, filters);
};

const calculateExamStats = (exams: ExamModel[]): ExamStatsData => {
  const now = new Date();

  const stats: ExamStatsData = {
    totalExams: exams.length,
    totalByType: {
      [ExamType.IELTS]: 0,
      [ExamType.TOEFL]: 0,
      [ExamType.GRE]: 0,
      [ExamType.SAT]: 0,
      [ExamType.GMAT]: 0,
    },
    freeExams: 0,
    paidExams: 0,
    upcomingExams: 0,
    publishedExams: 0,
  };

  exams.forEach((exam) => {
    // Count by type
    if (exam.type_of_exam in stats.totalByType) {
      stats.totalByType[exam.type_of_exam]++;
    }

    // Count by price
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

export function useOrganizationAllExams({
  organizationSlug,
  page = 1,
  pageSize = 12,
  filters = {},
}: UseOrganizationAllExamsParams): UseOrganizationAllExamsResult {
  // Fetch all exams with filters applied
  const {
    data: allExams = [],
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.ALL_EXAMS.BY_ORGANIZATION_FILTERED(
      organizationSlug,
      filters
    ),
    queryFn: () => fetchOrganizationAllExams(organizationSlug, filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!organizationSlug,
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
    error: queryError ? "Failed to load exams" : null,
    refetch,
  };
}

/**
 * Hook for fetching exam statistics only (without pagination)
 */
export function useOrganizationExamStats(organizationId: string) {
  const {
    data: allExams = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.ALL_EXAMS.BY_ORGANIZATION(organizationId),
    queryFn: () => fetchOrganizationAllExams(organizationId),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!organizationId,
  });

  const stats = useMemo(() => calculateExamStats(allExams), [allExams]);

  return {
    stats,
    isLoading,
    error: error ? "Failed to load exam statistics" : null,
  };
}

/**
 * Utility hook to get available exam types for the organization
 */
export function useAvailableExamTypes(organizationId: string) {
  const { data: allExams = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.ALL_EXAMS.BY_ORGANIZATION(organizationId),
    queryFn: () => fetchOrganizationAllExams(organizationId),
    staleTime: 15 * 60 * 1000, // 15 minutes
    enabled: !!organizationId,
  });

  const availableTypes = useMemo(() => {
    const types = new Set(allExams.map((exam) => exam.type_of_exam));
    return Array.from(types);
  }, [allExams]);

  return {
    availableTypes,
    isLoading,
  };
}
