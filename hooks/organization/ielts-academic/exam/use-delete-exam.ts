import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/hooks/query-keys";
import mockdb from "@/mockdb";

export const useDeleteExam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (examId: string): Promise<void> => {
      try {
        console.log("Attempting to delete exam with ID:", examId);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Check if mockdb and ieltsExams exist
        if (!mockdb || !mockdb.ieltsExams) {
          throw new Error("Mock database or ieltsExams array not found");
        }

        console.log("Total exams before deletion:", mockdb.ieltsExams.length);

        // Find the exam to delete
        const examIndex = mockdb.ieltsExams.findIndex(
          (exam) => exam.id === examId
        );

        console.log("Exam index found:", examIndex);

        if (examIndex === -1) {
          throw new Error(`Exam with ID ${examId} not found`);
        }

        // Remove the exam from the mock database
        const deletedExam = mockdb.ieltsExams.splice(examIndex, 1);
        console.log("Successfully deleted exam:", deletedExam[0]?.title);
        console.log("Total exams after deletion:", mockdb.ieltsExams.length);
      } catch (error) {
        console.error("Error in delete mutation function:", error);
        throw error; // Re-throw to trigger onError
      }
    },
    onSuccess: (_, examId) => {
      console.log("Delete mutation succeeded, invalidating queries...");

      // Invalidate all exam-related queries using query key prefixes
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.IELTS_EXAM.LIST,
      });

      // Invalidate all paginated queries (this will match any paginated query regardless of parameters)
      queryClient.invalidateQueries({
        queryKey: ["ielts-exams", "paginated"],
        exact: false, // This allows partial matching
      });

      // Invalidate specific exam details
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.IELTS_EXAM.BY_ID(examId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.IELTS_EXAM.DETAILS(examId),
      });

      // Also invalidate any queries that start with "ielts-exams" to be safe
      queryClient.invalidateQueries({
        queryKey: ["ielts-exams"],
        exact: false,
      });

      // Invalidate organization all exams queries
      queryClient.invalidateQueries({
        queryKey: ["all-exams"],
        exact: false,
      });

      console.log("Successfully invalidated exam queries after deletion");
    },
    onError: (error) => {
      console.error("Delete mutation failed:", error);
    },
  });
};
