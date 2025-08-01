import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/hooks/query-keys";
import mockdb from "@/mockdb";
import { RegisteredExam } from "@/types/registered-exam";

interface UseGetRegisteredExamsProps {
  userId: string;
  enabled?: boolean;
  page?: number;
  pageSize?: number;
}

interface PaginatedRegisteredExams {
  exams: RegisteredExam[];
  totalExams: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export function useGetRegisteredExams({
  userId,
  enabled = true,
  page = 1,
  pageSize = 6,
}: UseGetRegisteredExamsProps) {
  return useQuery({
    queryKey: [
      ...QUERY_KEYS.REGISTERED_EXAMS.BY_USER(userId),
      "paginated",
      page,
      pageSize,
    ],
    queryFn: async (): Promise<PaginatedRegisteredExams> => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const allRegisteredExams = mockdb.getRegisteredExamsByUser(userId);
      const totalExams = allRegisteredExams.length;
      const totalPages = Math.ceil(totalExams / pageSize);

      // Calculate pagination
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const exams = allRegisteredExams.slice(startIndex, endIndex);

      return {
        exams,
        totalExams,
        totalPages,
        currentPage: page,
        pageSize,
      };
    },
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useGetRegisteredExamById(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.REGISTERED_EXAMS.BY_ID(id),
    queryFn: async (): Promise<RegisteredExam | undefined> => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      const registeredExam = mockdb.getRegisteredExamById(id);
      return registeredExam;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
