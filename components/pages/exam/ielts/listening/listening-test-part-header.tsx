interface ListeningTestPartHeaderProps {
  currentPart: number;
  isAudioPlaying: boolean;
  currentAudioIndex: number;
  audioUrlsLength: number;
}

export default function ListeningTestPartHeader({
  currentPart,
  isAudioPlaying,
  currentAudioIndex,
  audioUrlsLength,
}: ListeningTestPartHeaderProps) {
  return (
    <div className="bg-background border-b border-border px-3 sm:px-6 lg:px-8 py-2 sm:py-3 flex-shrink-0 w-full">
      <div className="w-full max-w-none">
        <div className="flex items-center justify-between mb-0.5 sm:mb-1">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
            Part {currentPart}
          </h1>

          {isAudioPlaying && (
            <div className="flex items-center gap-2 text-sm text-primary">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              Playing Audio {currentAudioIndex + 1} of {audioUrlsLength}
            </div>
          )}
        </div>
        <p className="text-muted-foreground text-sm sm:text-base">
          Read the following text and answer the questions{" "}
          {(currentPart - 1) * 10 + 1} - {currentPart * 10}.
        </p>
      </div>
    </div>
  );
}
