"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

// Dynamically import JitsiMeeting component to avoid SSR issues
const JitsiMeeting = dynamic(
  () => import("@jitsi/react-sdk").then((mod) => mod.JitsiMeeting),
  { ssr: false }
);

export default function JitsiMeetPage() {
  const [mounted, setMounted] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isTestAudioPlaying, setIsTestAudioPlaying] = useState(false);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  const [recordingStatus, setRecordingStatus] = useState("idle");

  const isInstructor = true; // Set to true for testing - can be changed manually
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioContextRef = React.useRef<AudioContext | null>(null);

  const testAudioFiles = [
    "/audio/listening_test_section1.mp3",
    "/audio/listening_test_section2.mp3",
    "/audio/listening_test_secton3.mp3",
    "/audio/listening_test_section4.mp3",
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  const downloadRecording = (blobUrl: string) => {
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `screen-recording-${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const playTestAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(testAudioFiles[currentAudioIndex]);
    audioRef.current = audio;

    audio.addEventListener("ended", () => {
      setIsTestAudioPlaying(false);
      // Auto-play next audio file
      const nextIndex = (currentAudioIndex + 1) % testAudioFiles.length;
      setCurrentAudioIndex(nextIndex);
      setTimeout(() => {
        if (isTestAudioPlaying) {
          playTestAudio();
        }
      }, 1000);
    });

    audio.addEventListener("play", () => {
      setIsTestAudioPlaying(true);
    });

    audio.addEventListener("pause", () => {
      setIsTestAudioPlaying(false);
    });

    audio.play().catch(console.error);
  };

  const stopTestAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsTestAudioPlaying(false);
  };

  const changeTestAudio = (index: number) => {
    setCurrentAudioIndex(index);
    if (isTestAudioPlaying) {
      playTestAudio();
    }
  };

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg font-medium">Loading Jitsi Meet...</div>
      </div>
    );
  }

  const startCustomRecording = async () => {
    try {
      setRecordingStatus("acquiring_media");

      // Get screen capture with system audio
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true, // This captures system audio
        selfBrowserSurface: "include",
      } as DisplayMediaStreamOptions & { selfBrowserSurface?: "include" | "exclude" });

      // Get microphone audio
      const micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      // Create audio context for mixing
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      // Create audio destination (this will be our mixed audio output)
      const mixedAudioDestination = audioContext.createMediaStreamDestination();

      // Create gain nodes for volume control
      const screenAudioGain = audioContext.createGain();
      const micAudioGain = audioContext.createGain();

      // Create sources from streams
      if (screenStream.getAudioTracks().length > 0) {
        const screenAudioSource =
          audioContext.createMediaStreamSource(screenStream);
        screenAudioSource
          .connect(screenAudioGain)
          .connect(mixedAudioDestination);
      }

      if (micStream.getAudioTracks().length > 0) {
        const micAudioSource = audioContext.createMediaStreamSource(micStream);
        micAudioSource.connect(micAudioGain).connect(mixedAudioDestination);
      }

      // Create final recording stream
      const recordingStream = new MediaStream();

      // Add video track from screen
      screenStream.getVideoTracks().forEach((track) => {
        recordingStream.addTrack(track);
      });

      // Add mixed audio track
      mixedAudioDestination.stream.getAudioTracks().forEach((track) => {
        recordingStream.addTrack(track);
      });

      console.log(
        "Recording stream tracks:",
        recordingStream.getTracks().length
      );

      // Create MediaRecorder
      let mimeType = "video/webm;codecs=vp9";
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "video/webm;codecs=vp8";
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = "video/webm";
        }
      }

      const mediaRecorder = new MediaRecorder(recordingStream, {
        mimeType,
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: 2500000,
      });

      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType.split(";")[0] });
        const url = URL.createObjectURL(blob);

        // Auto-download the recording
        downloadRecording(url);

        setIsRecording(false);
        setRecordingStatus("stopped");

        // Clean up streams
        screenStream.getTracks().forEach((track) => track.stop());
        micStream.getTracks().forEach((track) => track.stop());
        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }

        // Clean up the blob URL after download
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      };

      mediaRecorder.start(1000);
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setRecordingStatus("recording");

      console.log("Recording started with mixed audio");
    } catch (error) {
      console.error("Recording error:", error);
      setRecordingStatus("idle");
      alert(
        `Failed to start recording: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const stopCustomRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Fluency Checker - Jitsi Meet Test</h1>
        <div className="flex items-center gap-3">
          <span className="text-xs opacity-80">Status: {recordingStatus}</span>

          {/* Screen Recording Button */}
          <Button
            onClick={isRecording ? stopCustomRecording : startCustomRecording}
            variant={isRecording ? "destructive" : "secondary"}
            size="sm"
            className={isRecording ? "animate-pulse" : ""}
            disabled={recordingStatus === "acquiring_media"}
          >
            {isRecording
              ? "Stop Recording"
              : recordingStatus === "acquiring_media"
              ? "Acquiring Media..."
              : "Start Recording"}
          </Button>

          {/* Test Audio Controls */}
          <div className="flex items-center gap-2">
            <Button
              onClick={isTestAudioPlaying ? stopTestAudio : playTestAudio}
              variant={isTestAudioPlaying ? "destructive" : "outline"}
              size="sm"
            >
              {isTestAudioPlaying ? "Stop Audio" : "Play Test Audio"}
            </Button>
            <select
              value={currentAudioIndex}
              onChange={(e) => changeTestAudio(Number(e.target.value))}
              className="text-xs px-2 py-1 rounded border bg-white text-black"
            >
              {testAudioFiles.map((file, index) => (
                <option key={index} value={index}>
                  Section {index + 1}
                </option>
              ))}
            </select>
          </div>

          {/* Open Drawer Button - Only show if instructor */}
          {isInstructor && (
            <Button
              onClick={() => setDrawerOpen(true)}
              variant="secondary"
              size="sm"
            >
              Open Instructor Panel
            </Button>
          )}
        </div>
      </div>
      <div id="jitsi-container" className="flex-1">
        <JitsiMeeting
          domain={process.env.NEXT_PUBLIC_JITSI_DOMAIN || "localhost:8443"}
          roomName="fluency-checker-test-room"
          jwt="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJteWFwcGlkIiwiaXNzIjoibXlhcHBpZCIsInN1YiI6IioiLCJyb29tIjoiKiIsImlhdCI6MTc1NDg5NDY4NSwibmJmIjoxNzU0Mzg2OTIwLCJleHAiOjE3NTY2NDc3MjAsImNvbnRleHQiOnsidXNlciI6eyJhZmZpbGlhdGlvbiI6Im1lbWJlciJ9fX0.q7ErE7mN2u4toKoHvQNGVxiIhSZBP1kbj71bdNdLuFA"
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

      {/* Instructor Drawer - Only show if isInstructor is true */}
      {isInstructor && (
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerContent className="h-[450px]">
            <DrawerHeader>
              <DrawerTitle>Instructor Controls</DrawerTitle>
              <DrawerDescription>
                Test drawer for instructor functionality with recording controls
              </DrawerDescription>
            </DrawerHeader>
            <div className="flex-1 p-4">
              <div className="space-y-4">
                <div className="p-4 bg-gray-100 rounded-lg">
                  <h3 className="font-semibold mb-2">Recording Controls</h3>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      size="sm"
                      onClick={
                        isRecording ? stopCustomRecording : startCustomRecording
                      }
                      variant={isRecording ? "destructive" : "default"}
                      className={isRecording ? "animate-pulse" : ""}
                      disabled={recordingStatus === "acquiring_media"}
                    >
                      {isRecording
                        ? "Stop Screen Recording"
                        : recordingStatus === "acquiring_media"
                        ? "Acquiring Media..."
                        : "Start Screen Recording"}
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-gray-100 rounded-lg">
                  <h3 className="font-semibold mb-2">Test Audio Controls</h3>
                  <div className="flex gap-2 flex-wrap items-center">
                    <Button
                      size="sm"
                      onClick={
                        isTestAudioPlaying ? stopTestAudio : playTestAudio
                      }
                      variant={isTestAudioPlaying ? "destructive" : "outline"}
                    >
                      {isTestAudioPlaying ? "Stop Audio" : "Play Test Audio"}
                    </Button>
                    <select
                      value={currentAudioIndex}
                      onChange={(e) => changeTestAudio(Number(e.target.value))}
                      className="text-xs px-2 py-1 rounded border bg-white text-black"
                    >
                      {testAudioFiles.map((file, index) => (
                        <option key={index} value={index}>
                          Section {index + 1}
                        </option>
                      ))}
                    </select>
                    <span className="text-xs text-gray-600">
                      {isTestAudioPlaying ? "🎵 Playing" : "🔇 Stopped"}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-gray-100 rounded-lg">
                  <h3 className="font-semibold mb-2">Session Controls</h3>
                  <div className="flex gap-2 flex-wrap">
                    <Button size="sm" variant="outline">
                      Mute All
                    </Button>
                    <Button size="sm" variant="outline">
                      End Session
                    </Button>
                    <Button size="sm" variant="outline">
                      Share Screen
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-gray-100 rounded-lg">
                  <h3 className="font-semibold mb-2">Participant List</h3>
                  <div className="text-sm text-gray-600">
                    • Test User 1 (Student)
                    <br />
                    • Test User 2 (Student)
                    <br />• You (Instructor)
                  </div>
                </div>

                <div className="p-4 bg-gray-100 rounded-lg">
                  <h3 className="font-semibold mb-2">Assessment Tools</h3>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Score Speaking
                    </Button>
                    <Button size="sm" variant="outline">
                      Take Notes
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t">
              <DrawerClose asChild>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setDrawerOpen(false)}
                >
                  Close Instructor Panel
                </Button>
              </DrawerClose>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}
