import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/hooks/query-keys";

interface AddStudentToExamParams {
  examId: string;
  studentEmail: string;
}

// Mock function to add a student to an exam
const addStudentToExam = async ({
  examId,
  studentEmail,
}: AddStudentToExamParams): Promise<void> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // For mock purposes, just simulate success
  // In a real app, this would make an API call to register the student by email
  console.log(`Mock: Adding student ${studentEmail} to exam ${examId}`);

  // Simulate potential error (uncomment to test error handling)
  // if (Math.random() > 0.8) {
  //   throw new Error("Failed to add student to exam");
  // }
};

export const useAddStudentToExam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addStudentToExam,
    onSuccess: (_, { examId }) => {
      // Invalidate and refetch exam students data
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.EXAM_STUDENTS.BY_EXAM(examId),
      });
    },
  });
};
