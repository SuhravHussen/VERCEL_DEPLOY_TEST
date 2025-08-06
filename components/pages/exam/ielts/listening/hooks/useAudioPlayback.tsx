"use client";
import { useState, useRef, useCallback } from "react";

interface UseAudioPlaybackProps {
  audioUrls: string[];
  onPartChange: (part: number) => void;
}

export function useAudioPlayback({
  audioUrls,
  onPartChange,
}: UseAudioPlaybackProps) {
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = useCallback((audioUrl: string, audioIndex: number) => {
    return new Promise<void>((resolve, reject) => {
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.addEventListener("loadeddata", () => {
        console.log(`Starting audio for section ${audioIndex + 1}`);
        setIsAudioPlaying(true);
        audio.play().catch(reject);
      });

      audio.addEventListener("ended", () => {
        console.log(`Finished audio for section ${audioIndex + 1}`);
        setIsAudioPlaying(false);
        resolve();
      });

      audio.addEventListener("error", (e) => {
        console.error(`Error playing audio for section ${audioIndex + 1}:`, e);
        setIsAudioPlaying(false);
        reject(e);
      });

      audio.load();
    });
  }, []);

  const startSequentialAudioPlayback = useCallback(async () => {
    if (audioUrls.length === 0) {
      console.log("No audio files found");
      return;
    }

    for (let i = 0; i < audioUrls.length; i++) {
      try {
        setCurrentAudioIndex(i);
        onPartChange(i + 1);

        await playAudio(audioUrls[i], i);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Failed to play audio ${i + 1}:`, error);
        continue;
      }
    }

    console.log("All audio files have finished playing");
    setIsAudioPlaying(false);
    setCurrentAudioIndex(-1);
  }, [audioUrls, playAudio, onPartChange]);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    setIsAudioPlaying(false);
  }, []);

  return {
    currentAudioIndex,
    isAudioPlaying,
    startSequentialAudioPlayback,
    stopAudio,
    audioRef,
  };
}
