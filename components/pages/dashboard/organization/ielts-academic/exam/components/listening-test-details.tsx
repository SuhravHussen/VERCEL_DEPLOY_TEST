import React from "react";
import { Headphones, Target, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IELTSListeningTestSection } from "@/types/exam/ielts-academic/listening/listening";
import { addListeningQuestionNumbering } from "@/lib/addListeningQuestionNumbering";
import { AudioPlayer } from "./audio-player";

interface ListeningTestDetailsProps {
  numberedSections: IELTSListeningTestSection[];
  stats: ReturnType<typeof addListeningQuestionNumbering>;
}

export function ListeningTestDetails({
  numberedSections,
  stats,
}: ListeningTestDetailsProps) {
  const difficultyColors = {
    easy: "bg-green-50 text-green-700 border-green-200",
    medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
    hard: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <div className="space-y-6">
      {/* Listening Test Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Headphones className="h-5 w-5" />
            Listening Test Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {stats.summary.totalAudios}
              </div>
              <div className="text-sm text-muted-foreground">
                Audio Sections
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {stats.summary.totalQuestions}
              </div>
              <div className="text-sm text-muted-foreground">Questions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {stats.summary.averageQuestionsPerAudio}
              </div>
              <div className="text-sm text-muted-foreground">Avg per Audio</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">30</div>
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

      {/* Individual Audio Sections */}
      <div className="space-y-6">
        {numberedSections.map((section, index) => (
          <div key={index} className="space-y-4">
            {/* Audio Player */}
            <AudioPlayer audio={section.audio} sectionNumber={index + 1} />

            {/* Questions for this section */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">
                    Section {index + 1} Questions
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge
                      variant="outline"
                      className={
                        difficultyColors[
                          section.audio
                            ?.difficulty as keyof typeof difficultyColors
                        ] || "bg-gray-50 text-gray-700 border-gray-200"
                      }
                    >
                      {section.audio?.difficulty || "Unknown"}
                    </Badge>
                    <Badge variant="secondary">
                      {stats.audioStats[index]?.questionCount || 0} questions
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Questions (
                    {stats.audioStats[index]?.questionRange ||
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

                        {questionGroup.questionType && (
                          <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                            <strong>Question Type:</strong>{" "}
                            {questionGroup.questionType.replace(/_/g, " ")}
                          </div>
                        )}

                        <div className="text-sm text-muted-foreground">
                          This question group contains{" "}
                          {Array.isArray(questionGroup.questions)
                            ? questionGroup.questions.length
                            : 0}{" "}
                          questions of type:{" "}
                          {questionGroup.questionType?.replace(/_/g, " ") ||
                            "Unknown"}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-4">
                      No questions available for this audio section.
                    </div>
                  )}
                </div>

                {/* Question Type Summary */}
                {stats.audioStats[index]?.questionTypes && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">
                      Question Type Summary
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(
                        stats.audioStats[index].questionTypes
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
          </div>
        ))}
      </div>

      {numberedSections.length === 0 && (
        <Card className="p-8 text-center">
          <div className="text-muted-foreground">
            <Headphones className="mx-auto h-12 w-12 mb-4" />
            <p>No listening test sections available.</p>
          </div>
        </Card>
      )}
    </div>
  );
}
