"use client";

import { useState, useRef, useCallback } from "react";

interface UseScreenRecordingProps {
  studentName?: string;
}

export function useScreenRecording({
  studentName,
}: UseScreenRecordingProps = {}) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState<
    "idle" | "acquiring_media" | "recording" | "stopped"
  >("idle");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const downloadRecording = useCallback(
    (blobUrl: string) => {
      const a = document.createElement("a");
      a.href = blobUrl;

      // Create readable date/time string
      const now = new Date();
      const dateStr = now.toISOString().split("T")[0]; // YYYY-MM-DD
      const timeStr = now.toTimeString().split(" ")[0].replace(/:/g, "-"); // HH-MM-SS

      // Get student name (sanitize for filename)
      const sanitizedStudentName = (studentName || "student")
        .replace(/[^a-zA-Z0-9]/g, "-")
        .replace(/-+/g, "-")
        .toLowerCase();

      a.download = `${sanitizedStudentName}-${dateStr}-${timeStr}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    [studentName]
  );

  const startRecording = useCallback(async () => {
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
  }, [downloadRecording]);

  const stopRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, stopRecording, startRecording]);

  return {
    isRecording,
    recordingStatus,
    startRecording,
    stopRecording,
    toggleRecording,
  };
}
