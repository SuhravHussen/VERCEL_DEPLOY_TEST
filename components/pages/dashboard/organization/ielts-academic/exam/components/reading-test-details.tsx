import React from "react";
import { BookOpen, Target, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IELTSReadingTestSection } from "@/types/exam/ielts-academic/reading/question/question";
import { addQuestionNumbering } from "@/lib/addQuestionNumbering";

interface ReadingTestDetailsProps {
  numberedSections: IELTSReadingTestSection[];
  stats: ReturnType<typeof addQuestionNumbering>;
}

export function ReadingTestDetails({
  numberedSections,
  stats,
}: ReadingTestDetailsProps) {
  const difficultyColors = {
    easy: "bg-green-50 text-green-700 border-green-200",
    medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
    hard: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <div className="space-y-6">
      {/* Reading Test Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Reading Test Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {stats.summary.totalPassages}
              </div>
              <div className="text-sm text-muted-foreground">Passages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {stats.summary.totalQuestions}
              </div>
              <div className="text-sm text-muted-foreground">Questions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {stats.summary.averageQuestionsPerPassage}
              </div>
              <div className="text-sm text-muted-foreground">
                Avg per Passage
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">60</div>
              <div className="text-sm text-muted-foreground">Minutes</div>
            </div>
          </div>

          {/* Difficulty Breakdown */}
          <div className="mt-6">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Difficulty Distribution
            </h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(stats.summary.difficultyBreakdown).map(
                ([difficulty, count]) => (
                  <Badge
                    key={difficulty}
                    variant="outline"
                    className={
                      difficultyColors[
                        difficulty as keyof typeof difficultyColors
                      ]
                    }
                  >
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}:{" "}
                    {count}
                  </Badge>
                )
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Passages */}
      <div className="space-y-6">
        {numberedSections.map((section, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">
                  Passage {index + 1}:{" "}
                  {section.passage?.title || `Reading Section ${index + 1}`}
                </CardTitle>
                <div className="flex gap-2">
                  <Badge
                    variant="outline"
                    className={
                      difficultyColors[
                        section.passage
                          ?.difficulty as keyof typeof difficultyColors
                      ] || "bg-gray-50 text-gray-700 border-gray-200"
                    }
                  >
                    {section.passage?.difficulty || "Unknown"}
                  </Badge>
                  <Badge variant="secondary">
                    {stats.passageStats[index]?.questionCount || 0} questions
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Passage Text */}
              {section.passage?.content && (
                <div className="prose prose-sm max-w-none">
                  <div className="bg-muted/30 p-4 rounded-lg border">
                    <h4 className="font-semibold mb-2">Passage Text</h4>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {section.passage.content}
                    </div>
                  </div>
                </div>
              )}

              {/* Questions Summary */}
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Questions (
                  {stats.passageStats[index]?.questionRange ||
                    `Section ${index + 1}`}
                  )
                </h4>

                {section.questions && section.questions.length > 0 ? (
                  section.questions.map((questionGroup, groupIndex) => (
                    <div
                      key={groupIndex}
                      className="border rounded-lg p-4 bg-muted/10"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h5 className="font-medium capitalize">
                          {questionGroup.questionType?.replace(/_/g, " ") ||
                            "Questions"}
                        </h5>
                        <Badge variant="outline" className="text-xs">
                          {Array.isArray(questionGroup.questions)
                            ? questionGroup.questions.length
                            : 0}{" "}
                          questions
                        </Badge>
                      </div>

                      {questionGroup.instruction && (
                        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                          <strong>Instructions:</strong>{" "}
                          {questionGroup.instruction}
                        </div>
                      )}

                      <div className="text-sm text-muted-foreground">
                        This question group contains{" "}
                        {Array.isArray(questionGroup.questions)
                          ? questionGroup.questions.length
                          : 0}{" "}
                        questions of type:{" "}
                        {questionGroup.questionType?.replace(/_/g, " ")}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-4">
                    No questions available for this passage.
                  </div>
                )}
              </div>

              {/* Question Type Summary */}
              {stats.passageStats[index]?.questionTypes && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Question Type Summary</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(
                      stats.passageStats[index].questionTypes
                    ).map(([type, count]) => (
                      <Badge key={type} variant="outline" className="text-xs">
                        {type.replace(/_/g, " ")}: {count}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {numberedSections.length === 0 && (
        <Card className="p-8 text-center">
          <div className="text-muted-foreground">
            <BookOpen className="mx-auto h-12 w-12 mb-4" />
            <p>No reading test sections available.</p>
          </div>
        </Card>
      )}
    </div>
  );
}
