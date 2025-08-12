"use client";

import React, { useEffect, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useRegisteredExam } from "@/hooks/organization/use-registered-exam";
import { useScreenRecording } from "@/hooks/use-screen-recording";
import { Spinner } from "@/components/ui/spinner-1";
import { generateJitsiToken } from "@/server-actions/jitsi/generate-token";
import {
  SpeakingTestHeader,
  SpeakingGradingDrawer,
} from "@/components/pages/exam/ielts/speaking";

// Dynamically import JitsiMeeting component to avoid SSR issues
const JitsiMeeting = dynamic(
  () => import("@jitsi/react-sdk").then((mod) => mod.JitsiMeeting),
  { ssr: false }
);

function SpeakingTestPageContent() {
  const [mounted, setMounted] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentUserId] = useState("1"); // Manually set user ID for now
  const [jitsiToken, setJitsiToken] = useState<string | null>(null);
  const [tokenLoading, setTokenLoading] = useState(false);

  const searchParams = useSearchParams();
  const registrationId = searchParams.get("regId");

  const { registeredExam, isLoading, error } = useRegisteredExam({
    registrationId: registrationId || "",
  });

  // User role logic
  const isAssignedTeacher = React.useMemo(() => {
    if (
      !registeredExam?.exam?.speaking_group?.assigned_instructors ||
      !currentUserId
    ) {
      return false;
    }
    return registeredExam.exam.speaking_group.assigned_instructors.some(
      (instructor) => instructor.id === currentUserId
    );
  }, [registeredExam, currentUserId]);

  const isStudent = registeredExam?.user?.id === currentUserId;

  const currentUser = React.useMemo(() => {
    if (!registeredExam) return null;
    if (isStudent) return registeredExam.user;
    if (isAssignedTeacher) {
      return registeredExam.exam.speaking_group?.assigned_instructors.find(
        (instructor) => instructor.id === currentUserId
      );
    }
    return null;
  }, [registeredExam, isStudent, isAssignedTeacher, currentUserId]);

  // Recording functionality
  const { isRecording, recordingStatus, toggleRecording } = useScreenRecording({
    studentName: registeredExam?.user?.name,
  });

  // Generate Jitsi JWT token using server action
  useEffect(() => {
    const generateToken = async () => {
      if (!currentUser || !registrationId) return;

      setTokenLoading(true);
      try {
        const token = await generateJitsiToken({
          user: {
            name: currentUser.name || "Unknown User",
            email: currentUser.email || "user@example.com",
            affiliation: isAssignedTeacher ? "owner" : "member",
          },
          expiresIn: "2h",
        });
        setJitsiToken(token);
      } catch (error) {
        console.error("Failed to generate Jitsi token:", error);
        setJitsiToken(null);
      } finally {
        setTokenLoading(false);
      }
    };

    generateToken();
  }, [currentUser, registrationId, isAssignedTeacher]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size={24} />
        <div className="ml-2 text-lg font-medium">Loading Speaking Test...</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size={24} />
        <div className="ml-2 text-lg font-medium">Loading exam details...</div>
      </div>
    );
  }

  if (error || !registeredExam) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-gray-600">
            {error || "Registered exam not found"}
          </p>
        </div>
      </div>
    );
  }

  if (!isStudent && !isAssignedTeacher) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p className="text-gray-600">
            You don&apos;t have permission to access this speaking test.
          </p>
        </div>
      </div>
    );
  }

  if (tokenLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size={24} />
        <div className="ml-2 text-lg font-medium">
          Preparing meeting room...
        </div>
      </div>
    );
  }

  if (!jitsiToken) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-red-600 mb-2">
            Meeting Setup Failed
          </h1>
          <p className="text-gray-600">
            Unable to prepare the meeting room. Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  const speakingSession = registeredExam.speaking_session;

  const student = registeredExam.user;

  return (
    <div className="h-screen bg-transparent">
      <SpeakingTestHeader
        studentName={student.name}
        speakingSession={speakingSession}
        isAssignedTeacher={isAssignedTeacher}
        isRecording={isRecording}
        recordingStatus={recordingStatus}
        onToggleRecording={toggleRecording}
        onOpenGrading={
          isAssignedTeacher ? () => setDrawerOpen(true) : undefined
        }
      />

      {/* Meeting Container */}
      <main className="h-full overflow-hidden">
        <div id="jitsi-container" className="h-full w-full">
          <JitsiMeeting
            domain={process.env.NEXT_PUBLIC_JITSI_DOMAIN || "localhost:8443"}
            roomName={`ielts-speaking-${registrationId}`}
            jwt={jitsiToken}
            getIFrameRef={(iframeRef) => {
              iframeRef.style.height = "100%";
              iframeRef.style.width = "100%";
            }}
            configOverwrite={{
              prejoinPageEnabled: false,
              startWithAudioMuted: !isAssignedTeacher,
              enableWelcomePage: false,
              disableRecording: true,
              recordingService: {
                enabled: false,
                sharingEnabled: false,
              },
              toolbarButtons: [
                "microphone",
                "camera",
                "desktop",
                "fullscreen",
                "fodeviceselection",
                "hangup",
                "profile",
                "chat",
                "etherpad",
                "sharedvideo",
                "settings",
                "raisehand",
                "videoquality",
                "filmstrip",
                "invite",
                "feedback",
                "stats",
                "shortcuts",
                "tileview",
                "videobackgroundblur",
                "download",
                "help",
                "mute-everyone",
              ],
            }}
            onApiReady={() => {
              console.log("Jitsi Meet API ready for speaking test");
            }}
            onReadyToClose={() => {
              console.log("Speaking test session ready to close");
            }}
          />
        </div>
      </main>

      {/* Grading Drawer for Teachers */}
      {isAssignedTeacher && (
        <SpeakingGradingDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          student={student}
          speakingSession={speakingSession}
        />
      )}
    </div>
  );
}

export default function IELTSSpeakingTestPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Spinner size={24} />
          <div className="ml-2 text-lg font-medium">
            Loading Speaking Test...
          </div>
        </div>
      }
    >
      <SpeakingTestPageContent />
    </Suspense>
  );
}
