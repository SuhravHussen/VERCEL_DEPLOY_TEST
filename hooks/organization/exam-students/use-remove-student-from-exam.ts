import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/hooks/query-keys";

interface RemoveStudentFromExamParams {
  examId: string;
  studentId: string;
}

// Mock function to remove a student from an exam
const removeStudentFromExam = async ({
  examId,
  studentId,
}: RemoveStudentFromExamParams): Promise<void> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  // For mock purposes, just simulate success
  // In a real app, this would make an API call to unregister the student
  console.log(`Mock: Removing student ${studentId} from exam ${examId}`);

  // Simulate potential error (uncomment to test error handling)
  // if (Math.random() > 0.9) {
  //   throw new Error("Failed to remove student from exam");
  // }
};

export const useRemoveStudentFromExam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeStudentFromExam,
    onSuccess: (_, { examId }) => {
      // Invalidate and refetch exam students data
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.EXAM_STUDENTS.BY_EXAM(examId),
      });
    },
  });
};
