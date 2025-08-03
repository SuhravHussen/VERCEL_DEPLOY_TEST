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
    <div className="flex h-[68px] w-full items-center justify-between gap-1.5 overflow-x-auto rounded-b-md bg-background p-2 shadow-sm md:h-[72px] md:gap-2 md:px-4 md:py-3 xl:gap-6 xl:px-8 border-t border-border">
      {parts.map((partId) => {
        const isActive = currentPart === partId;
        const progress = partProgress[partId];
        const questionNumbers = partQuestionNumbers[partId] || [];

        if (isActive) {
          // Active part - show question numbers
          return (
            <div
              key={partId}
              className="flex h-full w-full cursor-pointer select-none items-center justify-center rounded-sm border border-border md:px-2 p-0.5 bg-secondary/50"
            >
              <div className="flex items-center gap-0.5 max-md:flex-col-reverse md:gap-1">
                <span className="min-w-11 text-sm font-semibold max-md:hidden xl:min-w-12 xl:text-base text-foreground">
                  Part {partId}
                </span>
                <span className="min-w-8 text-center md:hidden text-foreground">
                  P{partId}
                </span>
              </div>
              <div className="flex items-center justify-center gap-1 max-md:flex-wrap md:gap-1 md:pl-2 xl:gap-2 xl:pl-4">
                {questionNumbers.map((questionNum) => {
                  const isAnswered = isQuestionAnswered(questionNum);

                  return (
                    <span
                      key={questionNum}
                      className={`flex items-center justify-center h-5 min-w-5 select-none text-nowrap rounded border px-1 text-sm hover:bg-accent hover:text-accent-foreground md:h-6 md:px-1.5 md:text-sm cursor-pointer transition-colors ${
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
          );
        } else {
          // Inactive part - show progress
          return (
            <div
              key={partId}
              className="flex w-full cursor-pointer select-none items-center justify-center rounded-sm border border-border hover:bg-accent hover:text-accent-foreground md:px-2 h-full py-1 max-md:max-w-12 transition-colors"
              onClick={() => onPartChange(partId)}
            >
              <div className="flex items-center gap-0.5 max-md:flex-col-reverse md:gap-1">
                <span className="min-w-11 text-sm font-semibold max-md:hidden xl:min-w-12 xl:text-base text-foreground">
                  Part {partId}
                </span>
                <span className="min-w-8 text-center md:hidden text-foreground">
                  P{partId}
                </span>
              </div>
              {progress && (
                <div className="flex select-none items-center max-md:hidden text-muted-foreground">
                  :{" "}
                  <span className="line-clamp-1 xl:pl-2">
                    {progress.answered} of {progress.total} Questions
                  </span>
                </div>
              )}
            </div>
          );
        }
      })}
    </div>
  );
}
