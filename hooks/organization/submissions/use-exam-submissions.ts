import { useQuery } from "@tanstack/react-query";
import { ExamSubmission, SubmissionStatus } from "@/types/exam/exam-submission";
import { QUERY_KEYS } from "@/hooks/query-keys";
import { mockExamSubmissions } from "@/mockdata/mockExamSubmissions";

interface SubmissionFilters {
  status?: SubmissionStatus | "all";
  sortBy?: "student_name" | "updated_at" | "status" | "overall_score";
  sortOrder?: "asc" | "desc";
  searchQuery?: string;
}

interface PaginationParams {
  page: number;
  pageSize: number;
}

interface ExamSubmissionsResult {
  submissions: ExamSubmission[];
  totalSubmissions: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
}

export function useExamSubmissions(
  examId: string,
  pagination: PaginationParams,
  filters: SubmissionFilters = {}
): ExamSubmissionsResult {
  const {
    data: result,
    isLoading,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.EXAM_SUBMISSIONS.BY_EXAM_PAGINATED(
      examId,
      pagination.page,
      pagination.pageSize,
      filters
    ),
    queryFn: async (): Promise<{
      submissions: ExamSubmission[];
      totalSubmissions: number;
      totalPages: number;
    }> => {
      if (!examId) {
        throw new Error("Exam ID is required");
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Filter submissions by exam ID
      let filteredSubmissions = mockExamSubmissions.filter(
        (submission) => submission.exam_id === examId
      );

      // Apply status filter
      if (filters.status && filters.status !== "all") {
        filteredSubmissions = filteredSubmissions.filter(
          (submission) => submission.status === filters.status
        );
      }

      // Apply search filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filteredSubmissions = filteredSubmissions.filter(
          (submission) =>
            submission.student?.name?.toLowerCase().includes(query) ||
            submission.student?.email?.toLowerCase().includes(query) ||
            submission.id.toLowerCase().includes(query)
        );
      }

      // Apply sorting
      if (filters.sortBy) {
        filteredSubmissions.sort((a, b) => {
          let aValue: string | number | Date;
          let bValue: string | number | Date;

          switch (filters.sortBy) {
            case "student_name":
              aValue = a.student?.name || "";
              bValue = b.student?.name || "";
              break;
            case "updated_at":
              aValue = new Date(a.updated_at);
              bValue = new Date(b.updated_at);
              break;
            case "status":
              aValue = a.status;
              bValue = b.status;
              break;
            case "overall_score":
              aValue = a.grades?.overall_score || 0;
              bValue = b.grades?.overall_score || 0;
              break;
            default:
              aValue = a.created_at;
              bValue = b.created_at;
          }

          if (aValue < bValue) return filters.sortOrder === "asc" ? -1 : 1;
          if (aValue > bValue) return filters.sortOrder === "asc" ? 1 : -1;
          return 0;
        });
      }

      const totalSubmissions = filteredSubmissions.length;
      const totalPages = Math.ceil(totalSubmissions / pagination.pageSize);

      // Apply pagination
      const startIndex = (pagination.page - 1) * pagination.pageSize;
      const endIndex = startIndex + pagination.pageSize;
      const paginatedSubmissions = filteredSubmissions.slice(
        startIndex,
        endIndex
      );

      return {
        submissions: paginatedSubmissions,
        totalSubmissions,
        totalPages,
      };
    },
    enabled: !!examId,
    staleTime: 1000 * 60 * 2, // Consider data fresh for 2 minutes
    gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
  });

  return {
    submissions: result?.submissions || [],
    totalSubmissions: result?.totalSubmissions || 0,
    totalPages: result?.totalPages || 0,
    isLoading,
    error: error?.message || null,
  };
}

export function useExamSubmissionStats(examId: string) {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["exam-submission-stats", examId],
    queryFn: async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 200));

      const submissions = mockExamSubmissions.filter(
        (submission) => submission.exam_id === examId
      );

      const statusCounts = submissions.reduce((acc, submission) => {
        acc[submission.status] = (acc[submission.status] || 0) + 1;
        return acc;
      }, {} as Record<SubmissionStatus, number>);

      // Count section-specific submissions
      const listeningSubmissions = submissions.filter(
        (submission) => submission.listening_submission
      ).length;

      const readingSubmissions = submissions.filter(
        (submission) => submission.reading_submission
      ).length;

      const writingSubmissions = submissions.filter(
        (submission) => submission.writing_submission
      ).length;

      const speakingSubmissions = submissions.filter(
        (submission) => submission.speaking_submission
      ).length;

      const gradedSubmissions = submissions.filter(
        (submission) => submission.grades?.overall_band_score
      );

      const needsGrading = submissions.filter(
        (submission) => submission.requires_manual_grading
      ).length;

      const averageBandScore =
        gradedSubmissions.length > 0
          ? gradedSubmissions.reduce(
              (sum, submission) =>
                sum + (submission.grades?.overall_band_score || 0),
              0
            ) / gradedSubmissions.length
          : 0;

      return {
        totalSubmissions: submissions.length,
        listeningSubmissions,
        readingSubmissions,
        writingSubmissions,
        speakingSubmissions,
        statusCounts,
        averageBandScore: Math.round(averageBandScore * 10) / 10,
        gradedCount: gradedSubmissions.length,
        needsGrading,
        pendingGrading: needsGrading, // Keep for backward compatibility
      };
    },
    enabled: !!examId,
    staleTime: 1000 * 60 * 5,
  });

  return {
    stats: stats || {
      totalSubmissions: 0,
      listeningSubmissions: 0,
      readingSubmissions: 0,
      writingSubmissions: 0,
      speakingSubmissions: 0,
      statusCounts: {} as Record<SubmissionStatus, number>,
      averageBandScore: 0,
      gradedCount: 0,
      needsGrading: 0,
      pendingGrading: 0,
    },
    isLoading,
  };
}
