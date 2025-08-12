import { useQuery } from "@tanstack/react-query";
import { RegisteredExam } from "@/types/registered-exam";
import { registeredExams } from "@/mockdata/mockRegisteredExam";

interface UseRegisteredExamParams {
  registrationId: string;
}

interface UseRegisteredExamResult {
  registeredExam: RegisteredExam | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

// Mock function to fetch registered exam by ID
async function fetchRegisteredExamById(
  registrationId: string
): Promise<RegisteredExam | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Find the registered exam by ID
  const registeredExam = registeredExams.find(
    (exam) => exam.id === registrationId
  );

  if (!registeredExam) {
    return null;
  }

  return registeredExam;
}

export function useRegisteredExam({
  registrationId,
}: UseRegisteredExamParams): UseRegisteredExamResult {
  const {
    data: registeredExam = null,
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["registered-exam", registrationId],
    queryFn: () => fetchRegisteredExamById(registrationId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!registrationId,
  });

  return {
    registeredExam,
    isLoading,
    error: queryError ? "Failed to load registered exam" : null,
    refetch,
  };
}
