import { useQuery } from "@tanstack/react-query";
import { SpeakingSession } from "@/types/exam/speaking-session";
import { QUERY_KEYS } from "@/hooks/query-keys";
import { mockInstructorSpeakingSessions } from "@/mockdata/mockInstructorSpeakingSessions";

interface UseInstructorSpeakingSessionsParams {
  examId: string;
  instructorId?: string;
}

interface InstructorSpeakingSessionsResult {
  sessions: SpeakingSession[];
  isLoading: boolean;
  error: string | null;
  totalSessions: number;
  scheduledSessions: number;
  completedSessions: number;
  cancelledSessions: number;
}

export function useInstructorSpeakingSessions({
  examId,
  instructorId,
}: UseInstructorSpeakingSessionsParams): InstructorSpeakingSessionsResult {
  const {
    data: sessions = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.ORGANIZATION.SPEAKING_SESSIONS.INSTRUCTOR(
      examId,
      instructorId || ""
    ),
    queryFn: async (): Promise<SpeakingSession[]> => {
      if (!examId) {
        throw new Error("Exam ID is required");
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      // For now, return all sessions from mock data since instructor ID won't match
      // In real implementation, this would filter by instructorId and examId
      return mockInstructorSpeakingSessions.filter(
        (session) => session.exam_id === examId
      );
    },
    enabled: !!examId,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 10, // Keep in cache for 10 minutes
  });

  // Calculate session statistics
  const totalSessions = sessions.length;
  const scheduledSessions = sessions.filter(
    (session) => session.status === "scheduled"
  ).length;
  const completedSessions = sessions.filter(
    (session) => session.status === "completed"
  ).length;
  const cancelledSessions = sessions.filter(
    (session) => session.status === "cancelled"
  ).length;

  return {
    sessions,
    isLoading,
    error: error?.message || null,
    totalSessions,
    scheduledSessions,
    completedSessions,
    cancelledSessions,
  };
}
