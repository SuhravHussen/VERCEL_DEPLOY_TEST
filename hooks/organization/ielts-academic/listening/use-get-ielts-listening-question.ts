import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/hooks/query-keys";
import mockdb from "@/mockdb";
import { IELTSListeningTestSection } from "@/types/exam/ielts-academic/listening/listening";

async function fetchIELTSListeningQuestionById(
  questionId: string
): Promise<IELTSListeningTestSection | null> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const question = mockdb.getIeltsListeningQuestionById(questionId);

  if (!question) {
    return null;
  }

  return question;
}

export function useGetIeltsListeningQuestion(questionId: string) {
  const queryKey = [QUERY_KEYS.IELTS_LISTENING.QUESTIONS, "single", questionId];

  return useQuery({
    queryKey,
    queryFn: () => fetchIELTSListeningQuestionById(questionId),
    enabled: !!questionId, // Only run the query if questionId is provided
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep unused data in cache for 10 minutes
  });
}
