import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/hooks/query-keys";
import { User } from "@/types/user";
import { mockUsers } from "@/mockdata/mockUsers";

// Mock function to get students registered for an exam
const getExamStudents = async (examId: string): Promise<User[]> => {
  console.log("examId", examId);
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // For mock purposes, return users with role "USER" as students
  // In a real app, this would be an API call to get students registered for this specific exam

  return mockUsers;
};

export const useExamStudents = (examId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.EXAM_STUDENTS.BY_EXAM(examId),
    queryFn: () => getExamStudents(examId),
    enabled: !!examId,
  });
};
