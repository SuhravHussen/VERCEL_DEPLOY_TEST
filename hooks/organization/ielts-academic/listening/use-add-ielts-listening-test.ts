import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateListeningTestDto } from "@/types/dto/ielts/listening/listening.dto";
import { QUERY_KEYS } from "@/hooks/query-keys";
import mockdb from "@/mockdb";

export default function useCreateIeltsListeningTest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateListeningTestDto) => {
      // Mock implementation - in a real app this would be an API call
      const newTest = mockdb.createIeltsListeningTest(data);
      return Promise.resolve(newTest);
    },
    onSuccess: () => {
      // Invalidate all listening tests queries
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.IELTS_LISTENING.TESTS],
      });

      // Also invalidate any paginated queries
      queryClient.invalidateQueries({
        predicate: (query) => {
          return (
            Array.isArray(query.queryKey) &&
            query.queryKey[0] === QUERY_KEYS.IELTS_LISTENING.TESTS
          );
        },
      });
    },
    onError: (error) => {
      console.error("Failed to create listening test:", error);
    },
  });
}
