import { useQuery } from "@tanstack/react-query";
import { ExamSubmission } from "@/types/exam/exam-submission";
import { QUERY_KEYS } from "@/hooks/query-keys";
import { mockExamSubmissions } from "@/mockdata/mockExamSubmissions";

export function useSubmissionDetails(submissionId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.EXAM_SUBMISSIONS.BY_ID(submissionId),
    queryFn: async (): Promise<ExamSubmission> => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const submission = mockExamSubmissions.find((s) => s.id === submissionId);
      if (!submission) {
        throw new Error(`Submission with ID ${submissionId} not found`);
      }

      return submission;
    },
    enabled: !!submissionId,
  });
}
