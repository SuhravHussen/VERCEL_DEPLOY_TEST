"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import mockdb from "@/mockdb";
import { QUERY_KEYS } from "@/hooks/query-keys";
import { IELTSReadingQuestionGroup } from "@/types/exam/ielts-academic/reading/question/question";
import { CreateQuestionGroupDto } from "@/types/dto/ielts/reading/question.dto";

/**
 * Hook for creating IELTS Reading questions
 */
export const useCreateIeltsReadingQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (questionData: CreateQuestionGroupDto) =>
      Promise.resolve(
        mockdb.createIeltsReadingQuestion(
          questionData as unknown as IELTSReadingQuestionGroup
        )
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.IELTS_READING.QUESTIONS],
      });
    },
    onError: (error) => {
      console.error("Failed to create reading question:", error);
    },
  });
};

export default useCreateIeltsReadingQuestion;
