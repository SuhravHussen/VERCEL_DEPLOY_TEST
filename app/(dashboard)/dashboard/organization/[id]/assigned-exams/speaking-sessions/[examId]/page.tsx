"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useExamDetails } from "@/hooks/organization/ielts-academic/exam/use-exam-details";
import { useInstructorSpeakingSessions } from "@/hooks/organization/speaking-sessions/use-instructor-speaking-sessions";
import { useUpdateSessionStatus } from "@/hooks/organization/speaking-sessions/use-update-session-status";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToasts } from "@/components/ui/toast";

import {
  SpeakingSessionsHeader,
  SpeakingSessionsStats,
  TimeWindowsList,
  SpeakingSessionsList,
  SpeakingSessionsLoading,
  SpeakingSessionsError,
  SpeakingGradeDialog,
} from "@/components/pages/dashboard/organization/speaking-sessions";

import { SpeakingSession } from "@/types/exam/speaking-session";

export default function SpeakingSessions() {
  const params = useParams();
  const examId = params?.examId as string;

  // For testing purposes, using instructor_001 as current user
  const currentInstructorId = "instructor_001";

  // Timer state to force re-renders for live status updates
  const [, setCurrentTime] = useState(Date.now());

  // Grade dialog state
  const [gradeDialogOpen, setGradeDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] =
    useState<SpeakingSession | null>(null);

  // Initialize hooks
  const { success, error } = useToasts();
  const { updateStatus, isUpdating } = useUpdateSessionStatus();

  // Update every minute to check for live status changes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const {
    exam,
    isLoading: examLoading,
    error: examError,
  } = useExamDetails(examId);
  const {
    sessions,
    isLoading: sessionsLoading,
    error: sessionsError,
    totalSessions,
    scheduledSessions,
    completedSessions,
    cancelledSessions,
  } = useInstructorSpeakingSessions({
    examId,
    instructorId: currentInstructorId,
  });

  // Loading state
  if (examLoading || sessionsLoading) {
    return <SpeakingSessionsLoading />;
  }

  // Error states
  if (examError || sessionsError) {
    return (
      <SpeakingSessionsError
        error={examError || sessionsError || "An unknown error occurred"}
      />
    );
  }

  if (!exam) {
    return <SpeakingSessionsError error="Exam not found" type="not-found" />;
  }

  // Handle session status updates
  const handleStatusUpdate = async (
    sessionId: string,
    status: "cancelled" | "completed"
  ) => {
    if (!sessionId) return;

    try {
      await updateStatus({ sessionId, status });
      success(`Session ${status} successfully!`);
    } catch {
      error(
        `Failed to ${status === "cancelled" ? "cancel" : "complete"} session`
      );
    }
  };

  // Handle grade dialog
  const handleOpenGradeDialog = (session: SpeakingSession) => {
    setSelectedSession(session);
    setGradeDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8">
        {/* Header */}
        <SpeakingSessionsHeader examTitle={exam.title} />

        {/* Stats Cards */}
        <SpeakingSessionsStats
          totalSessions={totalSessions}
          scheduledSessions={scheduledSessions}
          completedSessions={completedSessions}
          cancelledSessions={cancelledSessions}
        />

        {/* Main Content */}
        <Tabs defaultValue="time-windows" className="space-y-6">
          <TabsList>
            <TabsTrigger value="time-windows">Assigned Times</TabsTrigger>
            <TabsTrigger value="sessions">My Sessions</TabsTrigger>
          </TabsList>

          {/* Time Windows Tab */}
          <TabsContent value="time-windows" className="space-y-4 sm:space-y-6">
            <TimeWindowsList timeWindows={exam.speaking_group?.time_windows} />
          </TabsContent>

          {/* Sessions Tab */}
          <TabsContent value="sessions" className="space-y-4 sm:space-y-6">
            <SpeakingSessionsList
              sessions={sessions}
              isUpdating={isUpdating}
              onStatusUpdate={handleStatusUpdate}
              onOpenGradeDialog={handleOpenGradeDialog}
            />
          </TabsContent>
        </Tabs>

        {/* Grade Dialog */}
        {selectedSession && (
          <SpeakingGradeDialog
            open={gradeDialogOpen}
            onOpenChange={setGradeDialogOpen}
            session={selectedSession}
          />
        )}
      </div>
    </div>
  );
}
