import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateListeningTestDto } from "@/types/dto/ielts/listening/listening.dto";
import { QUERY_KEYS } from "@/hooks/query-keys";

export default function useCreateIeltsListeningTest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateListeningTestDto) => {
      // In a real application, this would be an API call
      // Example:
      // const response = await fetch('/api/ielts-listening/tests', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      // return response.json();

      // For now, just mock the API call with a delay
      return new Promise((resolve) => {
        console.log("Creating IELTS Listening Test:", data);
        setTimeout(() => {
          resolve({
            success: true,
            data: { ...data, id: Math.random().toString(36).substring(7) },
          });
        }, 1000);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.IELTS_LISTENING.TESTS],
      });
    },
  });
}
