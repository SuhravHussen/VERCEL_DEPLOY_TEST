"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { MatchingHeadingsGroup } from "@/types/exam/ielts-academic/reading/question/question";

type ManualGradeStatus = "correct" | "incorrect" | "auto";

interface ManualGrades {
  [questionNumber: number]: ManualGradeStatus;
}

interface MatchingHeadingsGradingRendererProps {
  questionGroup: MatchingHeadingsGroup;
  userAnswers: Map<number, string>;
  manualGrades: ManualGrades;
  onManualGradeChange: (
    questionNumber: number,
    status: ManualGradeStatus
  ) => void;
  getFinalGradeStatus: (
    questionNumber: number
  ) => "correct" | "incorrect" | "unanswered";
}

export default function MatchingHeadingsGradingRenderer({
  questionGroup,
  userAnswers,
  manualGrades,
  onManualGradeChange,
  getFinalGradeStatus,
}: MatchingHeadingsGradingRendererProps) {
  const getStatusIcon = (status: "correct" | "incorrect" | "unanswered") => {
    switch (status) {
      case "correct":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "incorrect":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "unanswered":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: "correct" | "incorrect" | "unanswered") => {
    switch (status) {
      case "correct":
        return (
          <Badge className="bg-green-100 text-green-800 text-xs">Correct</Badge>
        );
      case "incorrect":
        return (
          <Badge className="bg-red-100 text-red-800 text-xs">Incorrect</Badge>
        );
      case "unanswered":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 text-xs">
            Unanswered
          </Badge>
        );
    }
  };

  // Helper function to find heading text by label
  const getHeadingText = (label: string): string => {
    if (!questionGroup.headings) return label;
    const heading = questionGroup.headings.find(
      (h) => h.startsWith(label + ".") || h.startsWith(label + " ")
    );
    return heading || label;
  };

  // Create a mapping of headings with their labels
  const headingsWithLabels =
    questionGroup.headings?.map((heading, index) => {
      const label = String.fromCharCode(97 + index); // 'a', 'b', 'c', etc.
      return { label, text: heading };
    }) || [];

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="bg-muted/30 rounded-lg p-3 sm:p-4">
        <h4 className="font-medium text-foreground mb-3 text-sm sm:text-base">
          MATCHING HEADINGS Questions
        </h4>

        <div className="text-xs sm:text-sm text-muted-foreground mb-3">
          <strong>Instructions:</strong> {questionGroup.instruction}
        </div>

        {/* Available headings list */}
        {questionGroup.headings && (
          <div className="mb-4 p-3 bg-background rounded border">
            <div className="text-xs font-medium text-muted-foreground mb-3">
              List of headings:
            </div>
            <div className="space-y-2">
              {headingsWithLabels.map((heading) => (
                <div key={heading.label} className="flex items-start space-x-2">
                  <Badge variant="outline" className="text-xs shrink-0 mt-0.5">
                    {heading.label}
                  </Badge>
                  <span className="text-xs text-foreground leading-relaxed">
                    {heading.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3 sm:space-y-4">
          {questionGroup.questions.map((question, index) => {
            // For matching headings, we need to derive the question number
            // Since the type doesn't have a 'number' field, we'll use index + a base number
            const questionNumber = index + 1; // Adjust this based on your numbering system
            const userAnswer = userAnswers.get(questionNumber) || "";
            const correctAnswer = question.correctHeading;
            const finalStatus = getFinalGradeStatus(questionNumber);
            const manualGrade = manualGrades[questionNumber];

            return (
              <div
                key={index}
                className="bg-background rounded-lg border border-border p-3 sm:p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-sm">
                      Q{questionNumber}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {question.paragraph}
                    </Badge>
                    {getStatusIcon(finalStatus)}
                    {getStatusBadge(finalStatus)}
                    {manualGrade && manualGrade !== "auto" && (
                      <Badge variant="outline" className="text-xs">
                        Manual
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="mb-3">
                      <div className="text-xs font-medium text-muted-foreground mb-2">
                        Select the heading for paragraph {question.paragraph}:
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {/* Student's Answer */}
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-muted-foreground">
                          Student&apos;s Answer:
                        </div>
                        <div className="p-3 rounded border bg-muted/10">
                          {userAnswer ? (
                            <div className="space-y-2">
                              <Badge
                                className={`text-sm ${
                                  userAnswer.toLowerCase() ===
                                  correctAnswer.toLowerCase()
                                    ? "bg-muted/30 text-foreground"
                                    : "bg-destructive/10 text-destructive"
                                }`}
                              >
                                {userAnswer}
                              </Badge>
                              <div className="text-xs text-muted-foreground">
                                {getHeadingText(userAnswer)}
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground italic text-sm">
                              No answer provided
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Correct Answer */}
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-muted-foreground">
                          Correct Answer:
                        </div>
                        <div className="p-3 rounded border bg-muted/30 border-muted">
                          <div className="space-y-2">
                            <Badge className="bg-muted/30 text-foreground text-sm">
                              {correctAnswer}
                            </Badge>
                            <div className="text-xs text-muted-foreground">
                              {getHeadingText(correctAnswer)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium">Auto-check:</span>{" "}
                      {userAnswer.toLowerCase().trim() ===
                      correctAnswer.toLowerCase().trim()
                        ? "Match"
                        : "No match"}
                    </div>

                    <div className="flex items-center space-x-1">
                      <Button
                        size="sm"
                        variant={
                          manualGrade === "correct" ? "default" : "outline"
                        }
                        onClick={() =>
                          onManualGradeChange(questionNumber, "correct")
                        }
                        className="text-xs h-7 px-2"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Correct
                      </Button>
                      <Button
                        size="sm"
                        variant={
                          manualGrade === "incorrect" ? "default" : "outline"
                        }
                        onClick={() =>
                          onManualGradeChange(questionNumber, "incorrect")
                        }
                        className="text-xs h-7 px-2"
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        Incorrect
                      </Button>
                      <Button
                        size="sm"
                        variant={
                          !manualGrade || manualGrade === "auto"
                            ? "default"
                            : "outline"
                        }
                        onClick={() =>
                          onManualGradeChange(questionNumber, "auto")
                        }
                        className="text-xs h-7 px-2"
                      >
                        Auto
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
