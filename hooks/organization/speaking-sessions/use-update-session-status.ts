import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/hooks/query-keys";

interface UpdateSessionStatusParams {
  sessionId: string;
  status: "cancelled" | "completed";
}

interface UpdateSessionStatusResult {
  updateStatus: (params: UpdateSessionStatusParams) => Promise<void>;
  isUpdating: boolean;
  error: string | null;
}

export function useUpdateSessionStatus(): UpdateSessionStatusResult {
  const queryClient = useQueryClient();

  const {
    mutateAsync: updateStatus,
    isPending: isUpdating,
    error,
  } = useMutation({
    mutationFn: async ({ sessionId, status }: UpdateSessionStatusParams): Promise<void> => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate random success/error for demo
      if (Math.random() > 0.8) {
        throw new Error(`Failed to update session status to ${status}`);
      }

      // In real implementation, this would make an API call
      console.log(`Session ${sessionId} status updated to ${status}`);
    },
    onSuccess: (_, { sessionId }) => {
      // Invalidate and refetch session data
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ORGANIZATION.SPEAKING_SESSIONS.INSTRUCTOR(sessionId, ""),
      });
    },
  });

  return {
    updateStatus,
    isUpdating,
    error: error?.message || null,
  };
}

