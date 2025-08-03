import React from "react";

interface AudioStatusProps {
  isAudioPlaying: boolean;
  currentAudioIndex: number;
  totalAudioCount: number;
}

const AudioStatus = React.memo(
  ({
    isAudioPlaying,
    currentAudioIndex,
    totalAudioCount,
  }: AudioStatusProps) => {
    if (!isAudioPlaying) return null;

    return (
      <div className="flex items-center gap-2 text-sm text-primary">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        Playing Audio {currentAudioIndex + 1} of {totalAudioCount}
      </div>
    );
  }
);

AudioStatus.displayName = "AudioStatus";

export default AudioStatus;
