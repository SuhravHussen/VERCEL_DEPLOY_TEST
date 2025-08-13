import { useState, useRef, useCallback } from "react";

interface UseSimpleAudioPlayerReturn {
  isPlaying: boolean;
  currentAudioIndex: number;
  startPlayback: () => void;
  stopPlayback: () => void;
  forceStopPlayback: () => void;
}

export const useSimpleAudioPlayer = (
  audioUrls: string[]
): UseSimpleAudioPlayerReturn => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isStartingRef = useRef(false);
  const isForceStopped = useRef(false);

  const playAudioAtIndex = useCallback(
    (index: number) => {
      if (index >= audioUrls.length) {
        // All audio finished
        console.log("🎉 All audio files completed");
        isStartingRef.current = false; // Reset starting flag when all done
        setIsPlaying(false);
        setCurrentAudioIndex(0);
        return;
      }

      const audioUrl = audioUrls[index];
      console.log(
        `Playing audio ${index + 1}/${audioUrls.length}: ${audioUrl}`
      );

      // Create new audio element
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      setCurrentAudioIndex(index);

      // Flag to prevent duplicate event handling
      let hasMovedToNext = false;

      // When this audio ends successfully, play the next one
      const handleEnded = () => {
        if (hasMovedToNext) return;

        // Don't proceed to next audio if it was force stopped
        if (isForceStopped.current) {
          console.log(
            `🛑 Audio ${index + 1} was force stopped - not proceeding to next`
          );
          hasMovedToNext = true;
          isStartingRef.current = false;
          return;
        }

        hasMovedToNext = true;
        isStartingRef.current = false; // Reset starting flag when audio ends
        console.log(`✅ Finished audio ${index + 1}`);
        playAudioAtIndex(index + 1);
      };

      // Handle errors - only skip if it's a critical error
      const handleError = () => {
        if (hasMovedToNext) return;

        // Don't proceed to next audio if it was force stopped
        if (isForceStopped.current) {
          console.log(
            `🛑 Audio ${
              index + 1
            } error during force stop - not proceeding to next`
          );
          hasMovedToNext = true;
          isStartingRef.current = false;
          return;
        }

        // Log error details for debugging
        console.log(`ℹ️ Audio ${index + 1} error event:`, {
          error: audio.error?.code,
          message: audio.error?.message,
          networkState: audio.networkState,
          readyState: audio.readyState,
          currentTime: audio.currentTime,
        });

        // Only skip if it's a critical loading error
        if (audio.error?.code === 4 || audio.networkState === 3) {
          hasMovedToNext = true;
          isStartingRef.current = false; // Reset starting flag on critical error
          console.error(
            `❌ Critical error for audio ${index + 1}, skipping...`
          );
          playAudioAtIndex(index + 1);
        }
        // Otherwise, let the audio continue - the error might not be fatal
      };

      // Handle when audio is ready
      const handleCanPlay = () => {
        console.log(`🎵 Audio ${index + 1} is ready to play`);
        isStartingRef.current = false; // Audio successfully started
      };

      audio.addEventListener("ended", handleEnded);
      audio.addEventListener("error", handleError);
      audio.addEventListener("canplay", handleCanPlay);

      // Start playing
      audio.play().catch((error) => {
        if (hasMovedToNext) return;

        // Don't proceed to next audio if it was force stopped
        if (isForceStopped.current) {
          console.log(
            `🛑 Audio ${
              index + 1
            } play failed during force stop - not proceeding to next`
          );
          hasMovedToNext = true;
          isStartingRef.current = false;
          return;
        }

        hasMovedToNext = true;
        isStartingRef.current = false; // Reset starting flag on error
        console.error(`❌ Failed to start audio ${index + 1}:`, error);
        // Skip to next audio only if play() completely fails
        playAudioAtIndex(index + 1);
      });
    },
    [audioUrls]
  );

  const startPlayback = useCallback(() => {
    if (audioUrls.length === 0) {
      console.log("No audio files to play");
      return;
    }

    console.log("🚀 Starting sequential audio playback...");

    // Reset force stopped flag when starting fresh
    isForceStopped.current = false;
    isStartingRef.current = true;
    setIsPlaying(true);
    playAudioAtIndex(0);
  }, [audioUrls, playAudioAtIndex]);

  const stopPlayback = useCallback(() => {
    // Don't stop if we're in the middle of starting playback
    if (isStartingRef.current) {
      console.log("⚠️ Ignoring stop request - audio is starting up");
      return;
    }

    console.log("🛑 Stopping audio playback");

    // Reset force stopped flag for normal stop
    isForceStopped.current = false;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    setIsPlaying(false);
    setCurrentAudioIndex(0);
  }, []);

  const forceStopPlayback = useCallback(() => {
    console.log("🛑 Force stopping audio playback (bypassing starting check)");

    // Set force stopped flag to prevent auto-progression
    isForceStopped.current = true;
    isStartingRef.current = false; // Reset the starting flag

    if (audioRef.current) {
      // Remove event listeners to prevent ended event from triggering next audio
      const currentAudio = audioRef.current;
      currentAudio.removeEventListener("ended", () => {});
      currentAudio.removeEventListener("error", () => {});
      currentAudio.removeEventListener("canplay", () => {});

      // Stop the audio
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio.src = "";
    }

    setIsPlaying(false);
    setCurrentAudioIndex(0);

    console.log("🛑 Audio forcefully stopped - auto-progression disabled");
  }, []);

  return {
    isPlaying,
    currentAudioIndex,
    startPlayback,
    stopPlayback,
    forceStopPlayback,
  };
};
