"use client";

import { Badge } from "@/components/ui/badge";

interface WritingTestBottomNavProps {
  currentTask: "task1" | "task2";
  onTaskChange: (task: "task1" | "task2") => void;
  task1WordCount: number;
  task2WordCount: number;
  task1MinWords: number;
  task2MinWords: number;
}

export default function WritingTestBottomNav({
  currentTask,
  onTaskChange,
  task1WordCount,
  task2WordCount,
  task1MinWords,
  task2MinWords,
}: WritingTestBottomNavProps) {
  const getWordCountStatus = (wordCount: number, minWords: number) => {
    if (wordCount >= minWords) return "complete";
    if (wordCount >= minWords * 0.8) return "warning";
    return "incomplete";
  };

  const task1Status = getWordCountStatus(task1WordCount, task1MinWords);
  const task2Status = getWordCountStatus(task2WordCount, task2MinWords);

  const tasks = [
    {
      id: "task1" as const,
      label: "Task 1",
      wordCount: task1WordCount,
      minWords: task1MinWords,
      status: task1Status,
      timeRecommendation: "~20 min",
    },
    {
      id: "task2" as const,
      label: "Task 2",
      wordCount: task2WordCount,
      minWords: task2MinWords,
      status: task2Status,
      timeRecommendation: "~40 min",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "complete":
        return "bg-green-100 text-green-800 border-green-200";
      case "warning":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  return (
    <div className="flex h-[68px] w-full items-center gap-1 overflow-hidden rounded-b-md bg-background p-2 shadow-sm md:h-[72px] md:gap-2 md:px-4 md:py-3 xl:gap-6 xl:px-8 border-t border-border">
      {tasks.map((task) => {
        const isActive = currentTask === task.id;
        const progressPercentage = Math.min(
          (task.wordCount / task.minWords) * 100,
          100
        );

        return (
          <div
            key={task.id}
            onClick={() => onTaskChange(task.id)}
            className={`flex h-full flex-1 cursor-pointer select-none items-center rounded-sm border transition-colors ${
              isActive
                ? "border-primary bg-primary/10"
                : "border-border bg-card hover:bg-muted/50"
            }`}
          >
            <div className="flex flex-1 items-center justify-between px-3 md:px-4">
              {/* Task Info */}
              <div className="flex items-center gap-2 md:gap-3">
                <div className="flex flex-col">
                  <span
                    className={`text-sm font-semibold ${
                      isActive ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {task.label}
                  </span>
                  <span className="text-xs text-muted-foreground hidden sm:block">
                    {task.timeRecommendation}
                  </span>
                </div>
              </div>

              {/* Word Count & Progress */}
              <div className="flex items-center gap-2 md:gap-3">
                {/* Word count badge */}
                <Badge
                  variant="outline"
                  className={`text-xs px-2 py-1 ${getStatusColor(task.status)}`}
                >
                  <span className="font-medium">
                    {task.wordCount}/{task.minWords}
                  </span>
                </Badge>

                {/* Progress bar - hidden on mobile */}
                <div className="hidden md:flex items-center gap-2">
                  <div className="w-16 bg-muted rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        task.status === "complete"
                          ? "bg-green-500"
                          : task.status === "warning"
                          ? "bg-orange-500"
                          : "bg-gray-400"
                      }`}
                      style={{
                        width: `${progressPercentage}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground min-w-[3rem]">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Overall Progress Summary */}
      <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-muted/30 rounded-sm border border-border">
        <div className="text-xs text-muted-foreground">
          <span className="font-medium">Total:</span>
        </div>
        <div className="text-xs">
          <span className="font-semibold text-foreground">
            {task1WordCount + task2WordCount}
          </span>
          <span className="text-muted-foreground">
            /{task1MinWords + task2MinWords} words
          </span>
        </div>
        <div className="flex gap-1">
          <div
            className={`w-2 h-2 rounded-full ${
              task1Status === "complete"
                ? "bg-green-500"
                : task1Status === "warning"
                ? "bg-orange-500"
                : "bg-gray-400"
            }`}
          />
          <div
            className={`w-2 h-2 rounded-full ${
              task2Status === "complete"
                ? "bg-green-500"
                : task2Status === "warning"
                ? "bg-orange-500"
                : "bg-gray-400"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
