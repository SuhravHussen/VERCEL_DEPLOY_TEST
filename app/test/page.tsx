"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import JitsiMeeting component to avoid SSR issues
const JitsiMeeting = dynamic(
  () => import("@jitsi/react-sdk").then((mod) => mod.JitsiMeeting),
  { ssr: false }
);

export default function JitsiMeetPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg font-medium">Loading Jitsi Meet...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-blue-600 text-white p-4">
        <h1 className="text-xl font-bold">Fluency Checker - Jitsi Meet Test</h1>
      </div>
      <div id="jitsi-container" className="flex-1">
        <JitsiMeeting
          domain="localhost:8443"
          roomName="fluency-checker-test-room"
          jwt="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJteWFwcGlkIiwiaXNzIjoibXlhcHBpZCIsInN1YiI6IioiLCJyb29tIjoiKiIsImlhdCI6MTc1MzYzMDEwNiwibmJmIjoxNzUzNjE2MTAwLCJleHAiOjE3NTM5NzYxMDAsImNvbnRleHQiOnsidXNlciI6eyJpZCI6IjEyMzQ1Njc4IiwibmFtZSI6InNvdXJvdiIsImVtYWlsIjoic3VocmF2c2hhbkBnbWFpbC5jb20iLCJhZmZpbGlhdGlvbiI6Im1lbWJlciJ9fX0.33hVxNx8PGt3ULEIJJElROhE96L18MfvhKrWBsekj7s"
          getIFrameRef={(iframeRef) => {
            iframeRef.style.height = "100%";
            iframeRef.style.width = "100%";
          }}
          configOverwrite={{
            prejoinPageEnabled: false,
            startWithAudioMuted: true,
            enableWelcomePage: false,
          }}
          onApiReady={() => {
            console.log("Jitsi Meet API ready");
            // You can control the meeting using the API if needed
          }}
          onReadyToClose={() => {
            console.log("Jitsi Meet ready to close");
          }}
        />
      </div>
    </div>
  );
}
