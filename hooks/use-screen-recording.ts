"use client";

import { useState, useRef, useCallback } from "react";

interface UseScreenRecordingProps {
  studentName?: string;
}

interface RecordingFile {
  blob: Blob;
  filename: string;
  handle?: FileSystemFileHandle;
}

export function useScreenRecording({
  studentName,
}: UseScreenRecordingProps = {}) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState<
    "idle" | "acquiring_media" | "recording" | "stopped"
  >("idle");
  const [selectedFile, setSelectedFile] = useState<RecordingFile | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const recordingChunksRef = useRef<BlobPart[]>([]);

  // Function to show file picker and get save location
  const selectSavePath =
    useCallback(async (): Promise<RecordingFile | null> => {
      try {
        // Check if File System Access API is supported
        if ("showSaveFilePicker" in window) {
          // Create readable date/time string
          const now = new Date();
          const dateStr = now.toISOString().split("T")[0]; // YYYY-MM-DD
          const timeStr = now.toTimeString().split(" ")[0].replace(/:/g, "-"); // HH-MM-SS

          // Get student name (sanitize for filename)
          const sanitizedStudentName = (studentName || "student")
            .replace(/[^a-zA-Z0-9]/g, "-")
            .replace(/-+/g, "-")
            .toLowerCase();

          const suggestedName = `${sanitizedStudentName}-${dateStr}-${timeStr}.webm`;

          const fileHandle = await (window as any).showSaveFilePicker({
            suggestedName,
            types: [
              {
                description: "Video files",
                accept: {
                  "video/webm": [".webm"],
                },
              },
            ],
          });

          return {
            blob: new Blob(), // Will be filled later
            filename: suggestedName,
            handle: fileHandle,
          };
        } else {
          // Fallback for browsers that don't support File System Access API
          // Create readable date/time string
          const now = new Date();
          const dateStr = now.toISOString().split("T")[0]; // YYYY-MM-DD
          const timeStr = now.toTimeString().split(" ")[0].replace(/:/g, "-"); // HH-MM-SS

          // Get student name (sanitize for filename)
          const sanitizedStudentName = (studentName || "student")
            .replace(/[^a-zA-Z0-9]/g, "-")
            .replace(/-+/g, "-")
            .toLowerCase();

          const filename = `${sanitizedStudentName}-${dateStr}-${timeStr}.webm`;

          return {
            blob: new Blob(), // Will be filled later
            filename,
            handle: undefined,
          };
        }
      } catch (error) {
        if ((error as any).name !== "AbortError") {
          console.error("Error selecting save path:", error);
        }
        return null;
      }
    }, [studentName]);

  // Function to save recording to selected path or download
  const saveRecording = useCallback(
    async (blob: Blob, recordingFile: RecordingFile) => {
      try {
        if (recordingFile.handle && "createWritable" in recordingFile.handle) {
          // Use File System Access API to write to the selected file
          const writableStream = await (
            recordingFile.handle as any
          ).createWritable();
          await writableStream.write(blob);
          await writableStream.close();
          console.log("Recording saved to selected location");
        } else {
          // Fallback: trigger download
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = recordingFile.filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(url), 1000);
          console.log("Recording downloaded as", recordingFile.filename);
        }
      } catch (error) {
        console.error("Error saving recording:", error);
        // Fallback to download if saving fails
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = recordingFile.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    },
    []
  );

  const startRecording = useCallback(async () => {
    try {
      setRecordingStatus("acquiring_media");

      // First, ask user to select save location
      const recordingFile = await selectSavePath();
      if (!recordingFile) {
        setRecordingStatus("idle");
        return; // User cancelled file selection
      }

      setSelectedFile(recordingFile);

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

      // Clear previous chunks
      recordingChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordingChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(recordingChunksRef.current, {
          type: mimeType.split(";")[0],
        });

        // Save recording to selected path or download
        if (selectedFile) {
          await saveRecording(blob, selectedFile);
        }

        setIsRecording(false);
        setRecordingStatus("stopped");
        setSelectedFile(null);

        // Clean up streams
        screenStream.getTracks().forEach((track) => track.stop());
        micStream.getTracks().forEach((track) => track.stop());
        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }

        // Clear chunks
        recordingChunksRef.current = [];
      };

      mediaRecorder.start(1000);
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setRecordingStatus("recording");

      console.log("Recording started with mixed audio");
    } catch (error) {
      console.error("Recording error:", error);
      setRecordingStatus("idle");
      setSelectedFile(null);
      alert(
        `Failed to start recording: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }, [selectSavePath, saveRecording]);

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

  // Force stop and save recording (useful for auto-stop scenarios)
  const forceStopAndSave = useCallback(() => {
    if (isRecording && mediaRecorderRef.current) {
      stopRecording();
    }
  }, [isRecording, stopRecording]);

  return {
    isRecording,
    recordingStatus,
    startRecording,
    stopRecording,
    toggleRecording,
    forceStopAndSave,
  };
}
