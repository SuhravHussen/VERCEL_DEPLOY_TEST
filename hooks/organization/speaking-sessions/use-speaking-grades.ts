import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/hooks/query-keys";
import { SectionGrade } from "@/types/exam/exam-submission";

interface SpeakingGradeData {
  sessionId: string;
  grade: SectionGrade;
}

// Hook to get current speaking grade
export function useGetSpeakingGrade(sessionId: string) {
  const {
    data: grade,
    isLoading,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.GRADING.SAVE_SPEAKING(sessionId),
    queryFn: async (): Promise<SectionGrade | null> => {
      if (!sessionId) return null;

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // For demo, return null (no existing grade)
      // In real implementation, this would fetch from API
      return null;
    },
    enabled: !!sessionId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  return {
    grade,
    isLoading,
    error: error?.message || null,
    hasGrade: grade !== null,
  };
}

// Hook to add a new speaking grade
export function useAddSpeakingGrade() {
  const queryClient = useQueryClient();

  const {
    mutateAsync: addGrade,
    isPending: isAdding,
    error,
  } = useMutation({
    mutationFn: async ({ sessionId, grade }: SpeakingGradeData): Promise<void> => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate random success/error for demo
      if (Math.random() > 0.85) {
        throw new Error("Failed to add speaking grade");
      }

      // In real implementation, this would make an API call
      console.log(`Speaking grade added for session ${sessionId}:`, grade);
    },
    onSuccess: (_, { sessionId }) => {
      // Invalidate and refetch grade data
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.GRADING.SAVE_SPEAKING(sessionId),
      });
      // Also invalidate session data to update UI
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ORGANIZATION.SPEAKING_SESSIONS.INSTRUCTOR(sessionId, ""),
      });
    },
  });

  return {
    addGrade,
    isAdding,
    error: error?.message || null,
  };
}

// Hook to update existing speaking grade
export function useUpdateSpeakingGrade() {
  const queryClient = useQueryClient();

  const {
    mutateAsync: updateGrade,
    isPending: isUpdating,
    error,
  } = useMutation({
    mutationFn: async ({ sessionId, grade }: SpeakingGradeData): Promise<void> => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1800));

      // Simulate random success/error for demo
      if (Math.random() > 0.85) {
        throw new Error("Failed to update speaking grade");
      }

      // In real implementation, this would make an API call
      console.log(`Speaking grade updated for session ${sessionId}:`, grade);
    },
    onSuccess: (_, { sessionId }) => {
      // Invalidate and refetch grade data
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.GRADING.SAVE_SPEAKING(sessionId),
      });
      // Also invalidate session data to update UI
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ORGANIZATION.SPEAKING_SESSIONS.INSTRUCTOR(sessionId, ""),
      });
    },
  });

  return {
    updateGrade,
    isUpdating,
    error: error?.message || null,
  };
}

