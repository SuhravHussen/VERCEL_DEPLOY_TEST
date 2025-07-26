"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import mockdb from "@/mockdb";
import { QUERY_KEYS } from "@/hooks/query-keys";
import { IELTSListeningQuestionGroup } from "@/types/exam/ielts-academic/listening/listening";
import { CreateListeningTestSectionDto } from "@/types/dto/ielts/listening/listening.dto";

/**
 * Hook for creating IELTS Listening questions
 */
export const useCreateIeltsListeningQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // For mock purposes we'll just use the question group directly
    // In a real app, we'd have a proper API call with the CreateListeningTestSectionDto
    mutationFn: (questionData: {
      audio: CreateListeningTestSectionDto["audio"];
      questions: IELTSListeningQuestionGroup[];
    }) =>
      Promise.resolve(
        // Mock implementation - would be an API call in a real app
        mockdb.createIeltsListeningQuestion(questionData)
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.IELTS_LISTENING.QUESTIONS],
      });
    },
    onError: (error) => {
      console.error("Failed to create listening question:", error);
    },
  });
};

export default useCreateIeltsListeningQuestion;
