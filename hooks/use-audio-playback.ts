import { useState, useRef } from "react";

export interface UseAudioPlaybackReturn {
  currentAudioIndex: number;
  isAudioPlaying: boolean;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  startSequentialAudioPlayback: () => void;
  stopAudio: () => void;
  playCurrentAudio: () => void;
  hasAudioItems: boolean;
}

export const useAudioPlayback = (
  audioItems: Array<{ url: string; sectionId: number }>
): UseAudioPlaybackReturn => {
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isStartingPlayback, setIsStartingPlayback] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playNextAudio = (index: number) => {
    if (index >= audioItems.length) {
      console.log("All audio files have finished playing");
      setIsAudioPlaying(false);
      setIsStartingPlayback(false);
      setCurrentAudioIndex(-1);
      return;
    }

    // Stop and cleanup any previous audio first
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeEventListener("ended", () => {});
      audioRef.current.removeEventListener("error", () => {});
      audioRef.current.removeEventListener("canplaythrough", () => {});
      audioRef.current.src = "";
    }

    const audioItem = audioItems[index];
    console.log(
      `[${index + 1}/${audioItems.length}] Playing audio for section ${
        audioItem.sectionId
      }`
    );

    setCurrentAudioIndex(index);

    // Create new audio element
    const audio = new Audio();
    audioRef.current = audio;

    // Set up event listeners
    const handleEnded = () => {
      console.log(`Finished audio for section ${audioItem.sectionId}`);
      setIsAudioPlaying(false);
      setIsStartingPlayback(false);

      // Play next audio after a 1 second delay
      setTimeout(() => {
        playNextAudio(index + 1);
      }, 1000);
    };

    const handleError = (e: Event) => {
      console.error(
        `Error playing audio for section ${audioItem.sectionId}:`,
        e
      );
      setIsAudioPlaying(false);
      setIsStartingPlayback(false);

      // Try next audio even if current one fails
      setTimeout(() => {
        playNextAudio(index + 1);
      }, 1000);
    };

    const handleCanPlayThrough = () => {
      console.log(
        `Audio loaded for section ${audioItem.sectionId}, starting playback...`
      );
      setIsAudioPlaying(true);
      setIsStartingPlayback(false); // Playback successfully started
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    audio.addEventListener("canplaythrough", handleCanPlayThrough);

    // Fix GitHub raw URLs format if needed
    const correctedUrl =
      audioItem.url.includes("github.com") && audioItem.url.includes("/raw/")
        ? audioItem.url
            .replace("github.com", "raw.githubusercontent.com")
            .replace("/raw/master/", "/master/")
        : audioItem.url;

    // Set source and play immediately (this MUST happen in the user interaction)
    audio.src = correctedUrl;
    audio.play().catch((error) => {
      console.error(
        `Failed to play audio for section ${audioItem.sectionId}:`,
        error
      );
      setIsAudioPlaying(false);
      setIsStartingPlayback(false);

      // Try next audio even if current one fails
      setTimeout(() => {
        playNextAudio(index + 1);
      }, 1000);
    });
  };

  const startSequentialAudioPlayback = () => {
    console.log("Starting sequential audio playback...");

    // Prevent multiple concurrent playback attempts
    if (isStartingPlayback || isAudioPlaying) {
      console.log("Audio playback already in progress, ignoring request");
      return;
    }

    if (audioItems.length === 0) {
      console.log("No audio files found - nothing to play");
      return;
    }

    setIsStartingPlayback(true);
    console.log("Audio items to play:", audioItems);

    // Start playing the first audio immediately (in user interaction context)
    playNextAudio(0);
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      // Remove all event listeners to prevent memory leaks
      audioRef.current.removeEventListener("ended", () => {});
      audioRef.current.removeEventListener("error", () => {});
      audioRef.current.removeEventListener("canplaythrough", () => {});
      audioRef.current.src = "";
      audioRef.current = null;
    }
    setIsAudioPlaying(false);
    setIsStartingPlayback(false);
    setCurrentAudioIndex(-1);
  };

  const playCurrentAudio = () => {
    if (currentAudioIndex >= 0 && currentAudioIndex < audioItems.length) {
      playNextAudio(currentAudioIndex);
    } else {
      // Start from the beginning if no current audio
      startSequentialAudioPlayback();
    }
  };

  return {
    currentAudioIndex,
    isAudioPlaying,
    audioRef,
    startSequentialAudioPlayback,
    stopAudio,
    playCurrentAudio,
    hasAudioItems: audioItems.length > 0,
  };
};
