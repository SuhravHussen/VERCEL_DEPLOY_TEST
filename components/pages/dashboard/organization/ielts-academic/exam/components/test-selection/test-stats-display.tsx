"use client";

import { Badge } from "@/components/ui/badge";
import { TestStats } from "@/types/exam/ielts-academic/exam-creation";

interface TestStatsDisplayProps {
  stats: TestStats;
  testType: "listening" | "reading";
}

export const TestStatsDisplay: React.FC<TestStatsDisplayProps> = ({ stats, testType }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "hard":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const sectionLabel = testType === "listening" ? "audios" : "passages";

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-medium text-foreground">
            {stats.totalQuestions} questions
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">
            {stats.totalSections} {sectionLabel}
          </span>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        <span>
          Avg: {stats.averageQuestionsPerSection} questions per {testType === "listening" ? "audio" : "passage"}
        </span>
      </div>

      {Object.keys(stats.difficultyBreakdown).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(stats.difficultyBreakdown).map(([difficulty, count]) => (
            <Badge
              key={difficulty}
              variant="outline"
              className={getDifficultyColor(difficulty)}
            >
              {difficulty}: {count}
            </Badge>
          ))}
        </div>
      )}

      {Object.keys(stats.questionTypes).length > 0 && (
        <div className="text-xs text-muted-foreground">
          <span className="font-medium">Types: </span>
          {Object.entries(stats.questionTypes)
            .slice(0, 3)
            .map(([type, count]) => `${type} (${count})`)
            .join(", ")}
          {Object.keys(stats.questionTypes).length > 3 && "..."}
        </div>
      )}
    </div>
  );
};
