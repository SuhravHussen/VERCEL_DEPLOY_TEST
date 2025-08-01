import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ExamModel, ExamType } from "@/types/exam/exam";
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
  type_of_exam: ExamType;
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
  max_students?: number;
  registration_deadline?: string;
  is_published?: boolean;
  is_practice_exam?: boolean;
}

export const useAddExam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateExamData): Promise<ExamModel> => {
      // Simulate API call
      const newExam: ExamModel = {
        id: `exam-${Date.now()}`,
        title: data.title,
        description: data.description,
        type_of_exam: data.type_of_exam,
        price: data.price,
        is_free: data.is_free,
        currency: data.currency,
        listening_test: data.listening_test,
        reading_test: data.reading_test,
        writing_test: data.writing_test,
        lrw_group: data.lrw_group,
        speaking_group: data.speaking_group,
        max_students: data.max_students,
        registration_deadline: data.registration_deadline,
        is_published: data.is_published || true,
        is_practice_exam: data.is_practice_exam || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Add to mock database
      mockdb.ieltsExams.push(newExam);

      return newExam;
    },
    onSuccess: () => {
      // Invalidate exam queries to refetch data
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.IELTS_EXAM.LIST,
      });

      // Invalidate organization all exams queries
      queryClient.invalidateQueries({
        queryKey: ["all-exams"],
        exact: false,
      });
    },
  });
};
