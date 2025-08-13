"use client";

import { useRef, useCallback } from "react";
import NavigationGuard from "@/components/NavigationGuard";
import { audioManager } from "@/lib/audio-manager";

interface ListeningTestWrapperProps {
  children: React.ReactNode;
}

export default function ListeningTestWrapper({
  children,
}: ListeningTestWrapperProps) {
  const audioCleanupRef = useRef<(() => void) | null>(null);

  const handleBeforeLeave = useCallback(() => {
    console.log("🚨 ListeningTestWrapper: handleBeforeLeave called");

    // Use the audio manager to stop all audio
    audioManager.stopAllAudio();

    // Also call any registered cleanup function as backup
    if (audioCleanupRef.current) {
      console.log("🚨 Calling registered cleanup function");
      audioCleanupRef.current();
    }
  }, []);

  // Expose the cleanup ref to child components through a global
  if (typeof window !== "undefined") {
    const globalWindow = window as typeof window & {
      __listeningTestCleanup?: (cleanupFn: (() => void) | null) => void;
    };
    globalWindow.__listeningTestCleanup = (cleanupFn: (() => void) | null) => {
      audioCleanupRef.current = cleanupFn;
    };
  }

  return (
    <NavigationGuard
      message="Are you sure you want to leave the exam?"
      exitPath="/dashboard"
      onBeforeLeave={handleBeforeLeave}
    >
      {children}
    </NavigationGuard>
  );
}
