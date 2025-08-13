/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Global audio manager utility for stopping all audio on the page
 * This provides a centralized way to manage audio cleanup
 */

export class AudioManager {
  private static instance: AudioManager;
  private cleanupCallbacks: Set<() => void> = new Set();

  private constructor() {}

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  /**
   * Register a cleanup callback that will be called when stopping all audio
   */
  registerCleanup(callback: () => void): () => void {
    this.cleanupCallbacks.add(callback);

    // Return a function to unregister the callback
    return () => {
      this.cleanupCallbacks.delete(callback);
    };
  }

  /**
   * Stop all audio on the page using multiple methods
   */
  stopAllAudio(): void {
    console.log("🚨 AudioManager: Stopping all audio");

    // Call all registered cleanup callbacks
    this.cleanupCallbacks.forEach((callback) => {
      try {
        callback();
      } catch (error) {
        console.error("Error in audio cleanup callback:", error);
      }
    });

    // Stop all HTML audio elements
    if (typeof window !== "undefined") {
      const audioElements = document.querySelectorAll("audio");
      console.log(
        `🚨 AudioManager: Found ${audioElements.length} audio elements`
      );

      audioElements.forEach((audio, index) => {
        try {
          audio.pause();
          audio.currentTime = 0;
          audio.src = "";
          console.log(`🚨 AudioManager: Stopped audio element ${index + 1}`);
        } catch (error) {
          console.error(`Error stopping audio element ${index + 1}:`, error);
        }
      });

      // Stop all video elements as well (in case they have audio)
      const videoElements = document.querySelectorAll("video");
      videoElements.forEach((video, index) => {
        try {
          video.pause();
          video.currentTime = 0;
          console.log(`🚨 AudioManager: Stopped video element ${index + 1}`);
        } catch (error) {
          console.error(`Error stopping video element ${index + 1}:`, error);
        }
      });

      // Try to stop Web Audio API contexts
      if ((window as any).webkitAudioContext || (window as any).AudioContext) {
        // This is a more aggressive approach - we could store audio contexts if needed
        console.log("🚨 AudioManager: Web Audio API detected");
      }
    }
  }

  /**
   * Clear all registered cleanup callbacks
   */
  clearCallbacks(): void {
    this.cleanupCallbacks.clear();
  }
}

// Export a singleton instance
export const audioManager = AudioManager.getInstance();

// Export a simple function for easy use
export const stopAllAudio = () => audioManager.stopAllAudio();
