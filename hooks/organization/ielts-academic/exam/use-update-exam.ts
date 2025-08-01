import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ExamModel } from "@/types/exam/exam";
import { QUERY_KEYS } from "@/hooks/query-keys";
import { CreateExamData } from "./use-add-exam";
import mockdb from "@/mockdb";

interface UpdateExamData extends CreateExamData {
  id: string;
}

export const useUpdateExam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (examData: UpdateExamData): Promise<ExamModel> => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Find the existing exam
      const existingExamIndex = mockdb.ieltsExams.findIndex(
        (exam) => exam.id === examData.id
      );

      if (existingExamIndex === -1) {
        throw new Error("Exam not found");
      }

      // Update the exam
      const updatedExam: ExamModel = {
        ...mockdb.ieltsExams[existingExamIndex],
        ...examData,
        is_published:
          examData.is_published ??
          mockdb.ieltsExams[existingExamIndex].is_published,
        registration_deadline:
          examData.registration_deadline ??
          mockdb.ieltsExams[existingExamIndex].registration_deadline,
        updated_at: new Date().toISOString(),
      };

      mockdb.ieltsExams[existingExamIndex] = updatedExam;

      return updatedExam;
    },
    onSuccess: (updatedExam) => {
      // Invalidate all exam-related queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.IELTS_EXAM.LIST });
      queryClient.invalidateQueries({ queryKey: ["ielts-exams", "paginated"] });

      // Invalidate specific exam queries
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.IELTS_EXAM.BY_ID(updatedExam.id),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.IELTS_EXAM.DETAILS(updatedExam.id),
      });

      // Invalidate organization all exams queries
      queryClient.invalidateQueries({
        queryKey: ["all-exams"],
        exact: false,
      });

      // Invalidate organization-specific queries if needed
      // queryClient.invalidateQueries({ queryKey: QUERY_KEYS.IELTS_EXAM.BY_ORGANIZATION(organizationId) });
    },
  });
};
