import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../query-keys";
import { mockIELTSExams } from "@/mockdata/mockIeltsExam";
import { ExamModel, ExamStatsData } from "@/types/exam/exam";

interface UseAssignedExamsStatsParams {
  organizationId: string;
}

interface UseAssignedExamsStatsResult {
  stats: ExamStatsData;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

// Mock function to simulate fetching all assigned exams for stats calculation
async function fetchAllAssignedExamsForStats(
  organizationId: string
): Promise<ExamModel[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Return all mock IELTS exams without any filters
  // In a real implementation, this would fetch all exams assigned to the organization with organizationId
  // For now, organizationId is acknowledged but not used in mock data
  return mockIELTSExams.filter(() => !!organizationId); // Simple way to use organizationId parameter
}

// Calculate comprehensive exam statistics
const calculateAssignedExamsStats = (exams: ExamModel[]): ExamStatsData => {
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
    // Count by exam type
    if (stats.totalByType.hasOwnProperty(exam.type_of_exam)) {
      stats.totalByType[exam.type_of_exam]++;
    }

    // Count free/paid exams
    if (exam.is_free) {
      stats.freeExams++;
    } else {
      stats.paidExams++;
    }

    // Count upcoming exams (future dates)
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

export function useAssignedExamsStats({
  organizationId,
}: UseAssignedExamsStatsParams): UseAssignedExamsStatsResult {
  // Fetch all assigned exams without any filters for stats calculation
  const {
    data: allExams = [],
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: [
      ...QUERY_KEYS.ASSIGNED_EXAMS.BY_ORGANIZATION(organizationId),
      "stats-only",
    ],
    queryFn: () => fetchAllAssignedExamsForStats(organizationId),
    staleTime: 10 * 60 * 1000, // 10 minutes - longer cache for stats
    gcTime: 15 * 60 * 1000, // 15 minutes
    enabled: !!organizationId,
  });

  // Calculate stats from all exams
  const stats = useMemo(
    () => calculateAssignedExamsStats(allExams),
    [allExams]
  );

  return {
    stats,
    isLoading,
    error: queryError ? "Failed to load exam statistics" : null,
    refetch,
  };
}
