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
      const { organizationId } = questionData;

      const response = await fetch(
        `/api/organizations/${organizationId}/ielts-academic/writing/questions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(questionData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to create IELTS Writing question"
        );
      }

      return await response.json();
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
