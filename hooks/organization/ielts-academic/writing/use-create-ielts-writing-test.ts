import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { QUERY_KEYS } from "@/hooks/query-keys";
import { IELTSWritingTest } from "@/types/exam/ielts-academic/writing/writing";
import mockdb from "@/mockdb";
import { CreateIELTSWritingTestDto } from "@/types/dto/ielts/writing/writing.dto";

interface CreateIeltsWritingTestOptions {
  onSuccess?: (data: IELTSWritingTest) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook to create an IELTS Writing test
 */
export function useCreateIeltsWritingTest(
  options?: CreateIeltsWritingTestOptions
): UseMutationResult<IELTSWritingTest, Error, IELTSWritingTest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (testData: IELTSWritingTest) => {
      // Create test in mockdb
      try {
        // Convert to CreateIELTSWritingTestDto format
        const testDto: CreateIELTSWritingTestDto = {
          title: testData.title,
          description: testData.description,
          organizationId: testData.organizationId,
          testType: testData.testType,
          difficulty: testData.difficulty,
          task1: testData.task1,
          task2: testData.task2,
          totalTimeLimit: testData.totalTimeLimit,
          instructions: testData.instructions,
          generalInstructions: testData.generalInstructions,
        };

        // Create test in mockdb
        const createdTest = mockdb.createIeltsWritingTest(testDto);
        return createdTest;
      } catch (err) {
        console.error("Error creating IELTS Writing test:", err);
        throw new Error("Failed to create IELTS Writing test");
      }
    },
    onSuccess: (data) => {
      // Invalidate all tests-related queries (including paginated and filtered ones)
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.IELTS_WRITING.TESTS],
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
