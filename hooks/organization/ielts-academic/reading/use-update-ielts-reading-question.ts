"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import mockdb from "@/mockdb";
import { QUERY_KEYS } from "@/hooks/query-keys";
import { IELTSReadingQuestionGroup } from "@/types/exam/ielts-academic/reading/question/question";
import { CreateQuestionGroupDto } from "@/types/dto/ielts/reading/question.dto";

/**
 * Hook for updating IELTS Reading questions
 */
export const useUpdateIeltsReadingQuestion = (questionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (questionData: CreateQuestionGroupDto) => {
      return new Promise<IELTSReadingQuestionGroup>((resolve, reject) => {
        try {
          const updatedQuestion = mockdb.updateIeltsReadingQuestion(
            questionId,
            questionData as unknown as Partial<IELTSReadingQuestionGroup>
          );

          if (!updatedQuestion) {
            reject(new Error("Question not found"));
            return;
          }

          resolve(updatedQuestion);
        } catch (error) {
          reject(error);
        }
      });
    },
    onSuccess: () => {
      // Invalidate all questions lists (with any parameters)
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.IELTS_READING.QUESTIONS],
      });
      // Invalidate the specific question query
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.IELTS_READING.QUESTION_BY_ID(questionId),
      });
    },
    onError: (error) => {
      console.error("Failed to update reading question:", error);
    },
  });
};

export default useUpdateIeltsReadingQuestion;
