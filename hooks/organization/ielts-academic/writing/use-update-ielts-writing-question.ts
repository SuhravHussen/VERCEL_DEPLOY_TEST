"use client";

import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { QUERY_KEYS } from "@/hooks/query-keys";
import {
  CreateAcademicTask1Dto,
  CreateGeneralTask1Dto,
  CreateTask2Dto,
} from "@/types/dto/ielts/writing/writing.dto";
import { IELTSWritingTask } from "@/types/exam/ielts-academic/writing/writing";
import mockdb from "@/mockdb";

// Union type for updating writing questions
export type UpdateWritingQuestionDto =
  | (CreateAcademicTask1Dto & { organizationId: number; questionId: string })
  | (CreateGeneralTask1Dto & { organizationId: number; questionId: string })
  | (CreateTask2Dto & { organizationId: number; questionId: string });

interface UpdateIeltsWritingQuestionOptions {
  onSuccess?: (data: IELTSWritingTask) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook to update an IELTS Writing question
 */
export function useUpdateIeltsWritingQuestion(
  options?: UpdateIeltsWritingQuestionOptions
): UseMutationResult<IELTSWritingTask, Error, UpdateWritingQuestionDto> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (questionData: UpdateWritingQuestionDto) => {
      const { questionId, ...updateData } = questionData;

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const updatedQuestion = mockdb.updateIeltsWritingQuestion(
        questionId,
        updateData
      );

      if (!updatedQuestion) {
        throw new Error(
          "Failed to update IELTS Writing question - question not found"
        );
      }

      return updatedQuestion;
    },
    onSuccess: (data, variables) => {
      // Invalidate questions list query to refetch
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.IELTS_WRITING.QUESTIONS],
      });

      // Invalidate the specific question query
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.IELTS_WRITING.QUESTION_BY_ID(variables.questionId),
      });

      // Call onSuccess callback if provided
      if (options?.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error) => {
      // Call onError callback if provided
      if (options?.onError) {
        options.onError(error);
      }
    },
  });
}
