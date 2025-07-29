import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IELTSExamModel } from "@/types/exam/ielts-academic/exam";
import { QUERY_KEYS } from "@/hooks/query-keys";
import { CreateExamData } from "./use-add-exam";
import mockdb from "@/mockdb";

interface UpdateExamData extends CreateExamData {
  id: string;
}

export const useUpdateExam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (examData: UpdateExamData): Promise<IELTSExamModel> => {
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
      const updatedExam: IELTSExamModel = {
        ...mockdb.ieltsExams[existingExamIndex],
        ...examData,
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

      // Invalidate organization-specific queries if needed
      // queryClient.invalidateQueries({ queryKey: QUERY_KEYS.IELTS_EXAM.BY_ORGANIZATION(organizationId) });
    },
  });
};
