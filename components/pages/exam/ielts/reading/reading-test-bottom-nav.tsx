"use client";

interface ReadingTestBottomNavProps {
  currentSection: number;
  onSectionChange: (section: number) => void;
  sectionProgress: Record<number, { total: number; answered: number }>;
  answers?: Record<string, string | string[]>;
  onQuestionJump?: (questionNumber: number) => void;
  sectionQuestionNumbers: Record<number, number[]>;
}

export default function ReadingTestBottomNav({
  currentSection,
  onSectionChange,
  sectionProgress,
  answers = {},
  onQuestionJump,
  sectionQuestionNumbers,
}: ReadingTestBottomNavProps) {
  // Check if a question is actually answered by the user
  const isQuestionAnswered = (questionNum: number): boolean => {
    const questionKey = `q${questionNum}`;
    const answer = answers[questionKey];
    if (Array.isArray(answer)) {
      return answer.length > 0 && answer.some((a) => a.trim() !== "");
    }
    return answer !== undefined && answer !== null && answer.trim() !== "";
  };

  const sections = [1, 2, 3];

  return (
    <div className="flex h-[68px] w-full items-center gap-1 overflow-hidden rounded-b-md bg-background p-2 shadow-sm md:h-[72px] md:gap-2 md:px-4 md:py-3 xl:gap-6 xl:px-8 border-t border-border">
      {sections.map((sectionId) => {
        const isActive = currentSection === sectionId;
        const progress = sectionProgress[sectionId];
        const questionNumbers = sectionQuestionNumbers[sectionId] || [];

        if (isActive) {
          // Active section - show question numbers with horizontal scroll
          return (
            <div
              key={sectionId}
              className="flex h-full min-w-0 flex-1 cursor-pointer select-none items-center rounded-sm border border-border bg-secondary/50 overflow-hidden"
            >
              {/* Section label - more compact on mobile */}
              <div className="flex-shrink-0 px-2 md:px-3">
                <div className="flex items-center">
                  <span className="text-xs font-semibold text-foreground md:hidden">
                    S{sectionId}
                  </span>
                  <span className="hidden text-sm font-semibold text-foreground md:inline xl:text-base">
                    Section {sectionId}
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
          // Inactive section - show progress (more compact)
          return (
            <div
              key={sectionId}
              className="flex h-full w-16 flex-shrink-0 cursor-pointer select-none items-center justify-center rounded-sm border border-border p-1 hover:bg-accent hover:text-accent-foreground md:w-20 md:px-2"
              onClick={() => onSectionChange(sectionId)}
            >
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-xs font-medium text-muted-foreground">
                  S{sectionId}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">
                    {progress?.answered || 0}/{progress?.total || 0}
                  </span>
                  <div className="h-1 w-6 rounded-full bg-secondary md:w-8">
                    <div
                      className="h-1 rounded-full bg-chart-3 transition-all"
                      style={{
                        width: `${
                          progress?.total
                            ? Math.round(
                                (progress.answered / progress.total) * 100
                              )
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
}
