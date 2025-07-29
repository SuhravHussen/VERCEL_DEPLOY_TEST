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

// Union type for creating writing questions
export type CreateWritingQuestionDto =
  | (CreateAcademicTask1Dto & { organizationId: number })
  | (CreateGeneralTask1Dto & { organizationId: number })
  | (CreateTask2Dto & { organizationId: number });

interface AddIeltsWritingQuestionOptions {
  onSuccess?: (data: IELTSWritingTask) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook to create an IELTS Writing question
 */
export function useCreateIeltsWritingQuestion(
  options?: AddIeltsWritingQuestionOptions
): UseMutationResult<IELTSWritingTask, Error, CreateWritingQuestionDto> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (questionData: CreateWritingQuestionDto) => {
      const { organizationId, ...createData } = questionData;

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newQuestion = mockdb.createIeltsWritingQuestion(createData);

      return newQuestion;
    },
    onSuccess: (data) => {
      // Invalidate questions list query to refetch
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.IELTS_WRITING.QUESTIONS],
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
