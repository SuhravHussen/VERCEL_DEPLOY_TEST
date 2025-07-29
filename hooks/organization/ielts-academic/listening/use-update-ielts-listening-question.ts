"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import mockdb from "@/mockdb";
import { QUERY_KEYS } from "@/hooks/query-keys";
import {
  IELTSListeningQuestionGroup,
  IELTSListeningTestSection,
} from "@/types/exam/ielts-academic/listening/listening";
import { CreateListeningTestSectionDto } from "@/types/dto/ielts/listening/listening.dto";

/**
 * Hook for updating IELTS Listening questions
 */
export const useUpdateIeltsListeningQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updateData: {
      questionId: string;
      audio: CreateListeningTestSectionDto["audio"];
      questions: IELTSListeningQuestionGroup[];
    }) => {
      // Mock implementation - in a real app this would be an API call
      const { questionId, audio, questions } = updateData;

      // Find and update the question in mockdb
      const allQuestions = mockdb.ieltsListeningQuestions;
      const questionIndex = allQuestions.findIndex((q) =>
        q.questions.some((questionGroup) => questionGroup.id === questionId)
      );

      if (questionIndex === -1) {
        throw new Error("Question not found");
      }

      // Update the question
      const updatedQuestion: IELTSListeningTestSection = {
        audio,
        questions,
      };

      mockdb.ieltsListeningQuestions[questionIndex] = updatedQuestion;

      return Promise.resolve(updatedQuestion);
    },
    onSuccess: (data, variables) => {
      // Invalidate all listening questions queries
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.IELTS_LISTENING.QUESTIONS],
      });

      // Invalidate the specific question query
      queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEYS.IELTS_LISTENING.QUESTIONS,
          "single",
          variables.questionId,
        ],
      });

      // Also invalidate any paginated queries that might contain this question
      queryClient.invalidateQueries({
        predicate: (query) => {
          return (
            Array.isArray(query.queryKey) &&
            query.queryKey[0] === QUERY_KEYS.IELTS_LISTENING.QUESTIONS
          );
        },
      });
    },
    onError: (error) => {
      console.error("Failed to update listening question:", error);
    },
  });
};

export default useUpdateIeltsListeningQuestion;
