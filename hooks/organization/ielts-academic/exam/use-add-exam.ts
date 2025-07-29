import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IELTSExamModel } from "@/types/exam/ielts-academic/exam";
import { IELTSListeningTest } from "@/types/exam/ielts-academic/listening/listening";
import { IELTSReadingTest } from "@/types/exam/ielts-academic/reading/test/test";
import { IELTSWritingTest } from "@/types/exam/ielts-academic/writing/writing";
import { User } from "@/types/user";
import { Currency } from "@/types/currency";
import { QUERY_KEYS } from "@/hooks/query-keys";
import mockdb from "@/mockdb";

export interface CreateExamData {
  title: string;
  description?: string;
  listening_test: IELTSListeningTest;
  reading_test: IELTSReadingTest;
  writing_test: IELTSWritingTest;
  price: number;
  is_free: boolean;
  currency: Currency;
  lrw_group: {
    exam_date: string;
    listening_time_start: string;
    reading_time_start: string;
    writing_time_start: string;
    assigned_instructors: User[];
  };
  speaking_group: {
    time_windows: Array<{
      id: string;
      date: string;
      start_time: string;
      end_time: string;
    }>;
    assigned_instructors: User[];
    session_per_student: number;
  };
  max_students: number;
  registration_deadline?: string;
  is_active?: boolean;
}

export const useAddExam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (examData: CreateExamData): Promise<IELTSExamModel> => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create the exam using mockdb
      const newExam = mockdb.createIeltsExam({
        ...examData,
        is_active: examData.is_active ?? true,
        registration_deadline:
          examData.registration_deadline ||
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      });

      return newExam;
    },
    onSuccess: () => {
      // Invalidate all exam-related queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.IELTS_EXAM.LIST });
      queryClient.invalidateQueries({ queryKey: ["ielts-exams", "paginated"] });
      // Invalidate organization-specific queries if needed
      // queryClient.invalidateQueries({ queryKey: QUERY_KEYS.IELTS_EXAM.BY_ORGANIZATION(organizationId) });
    },
  });
};
