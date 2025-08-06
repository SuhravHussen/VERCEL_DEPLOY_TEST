"use client";

interface BottomNavProps {
  currentPart: number;
  onPartChange: (part: number) => void;
  partProgress: Record<number, { total: number; answered: number }>;
  answers?: Record<string, string | string[]>; // Update to match parent component format (q1, q2, etc.)
  onQuestionJump?: (questionNumber: number) => void; // Add question jump handler
  partQuestionNumbers: Record<number, number[]>; // Add actual question numbers for each part
}

export default function ListeningTestBottomNav({
  currentPart,
  onPartChange,
  partProgress,
  answers = {},
  onQuestionJump,
  partQuestionNumbers,
}: BottomNavProps) {
  // Check if a question is actually answered by the user
  const isQuestionAnswered = (questionNum: number): boolean => {
    const questionKey = `q${questionNum}`;
    const answer = answers[questionKey];
    if (Array.isArray(answer)) {
      return answer.length > 0 && answer.some((a) => a.trim() !== "");
    }
    return answer !== undefined && answer !== null && answer.trim() !== "";
  };

  const parts = [1, 2, 3, 4];

  return (
    <div className="flex h-[68px] w-full items-center gap-1 overflow-hidden rounded-b-md bg-background p-2 shadow-sm md:h-[72px] md:gap-2 md:px-4 md:py-3 xl:gap-6 xl:px-8 border-t border-border">
      {parts.map((partId) => {
        const isActive = currentPart === partId;
        const progress = partProgress[partId];
        const questionNumbers = partQuestionNumbers[partId] || [];

        if (isActive) {
          // Active part - show question numbers with horizontal scroll
          return (
            <div
              key={partId}
              className="flex h-full min-w-0 flex-1 cursor-pointer select-none items-center rounded-sm border border-border bg-secondary/50 overflow-hidden"
            >
              {/* Part label - more compact on mobile */}
              <div className="flex-shrink-0 px-2 md:px-3">
                <div className="flex items-center">
                  <span className="text-xs font-semibold text-foreground md:hidden">
                    P{partId}
                  </span>
                  <span className="hidden text-sm font-semibold text-foreground md:inline xl:text-base">
                    Part {partId}
                  </span>
                </div>
              </div>

              {/* Question numbers - horizontal scroll container */}
              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide px-1 py-1 md:gap-1.5 md:px-2">
                  {questionNumbers.map((questionNum) => {
                    const isAnswered = isQuestionAnswered(questionNum);

                    return (
                      <span
                        key={questionNum}
                        className={`flex-shrink-0 flex items-center justify-center h-5 min-w-[20px] px-1 select-none text-nowrap rounded border text-xs hover:bg-accent hover:text-accent-foreground md:h-6 md:min-w-[24px] md:px-1.5 md:text-sm cursor-pointer transition-colors ${
                          isAnswered
                            ? "bg-chart-3 border-chart-3 text-white"
                            : "border-border bg-background text-muted-foreground hover:border-accent"
                        }`}
                        onClick={() => {
                          if (onQuestionJump) {
                            onQuestionJump(questionNum);
                          }
                        }}
                      >
                        {questionNum}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        } else {
          // Inactive part - show progress (more compact)
          return (
            <div
              key={partId}
              className="flex h-full w-16 flex-shrink-0 cursor-pointer select-none items-center justify-center rounded-sm border border-border hover:bg-accent hover:text-accent-foreground md:w-20 md:px-2 transition-colors"
              onClick={() => onPartChange(partId)}
            >
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-xs font-medium text-foreground">
                  P{partId}
                </span>
                {progress && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">
                      {progress.answered}/{progress.total}
                    </span>
                    <div className="h-1 w-6 rounded-full bg-secondary md:w-8">
                      <div
                        className="h-1 rounded-full bg-chart-3 transition-all"
                        style={{
                          width: `${
                            progress.total
                              ? Math.round(
                                  (progress.answered / progress.total) * 100
                                )
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        }
      })}
    </div>
  );
}
