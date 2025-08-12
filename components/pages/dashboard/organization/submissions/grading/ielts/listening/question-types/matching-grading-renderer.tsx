"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { ListeningMatchingGroup } from "@/types/exam/ielts-academic/listening/listening";

type ManualGradeStatus = "correct" | "incorrect" | "auto";

interface ManualGrades {
  [questionNumber: number]: ManualGradeStatus;
}

interface MatchingGradingRendererProps {
  questionGroup: ListeningMatchingGroup;
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

export default function MatchingGradingRenderer({
  questionGroup,
  userAnswers,
  manualGrades,
  onManualGradeChange,
  getFinalGradeStatus,
}: MatchingGradingRendererProps) {
  const getAutoGradeStatus = (
    questionNumber: number
  ): "correct" | "incorrect" | "unanswered" => {
    const question = questionGroup.questions.find(
      (q) => q.number === questionNumber
    );
    const userAnswer = userAnswers.get(questionNumber) || "";

    if (!userAnswer.trim()) return "unanswered";
    if (!question) return "incorrect";

    // Check if user answer matches correct answer (case-insensitive)
    const userAnswerNormalized = userAnswer.trim().toLowerCase();
    const correctAnswerNormalized = question.correctMatch.trim().toLowerCase();

    return userAnswerNormalized === correctAnswerNormalized
      ? "correct"
      : "incorrect";
  };

  const getManualGradeStatus = (questionNumber: number): ManualGradeStatus => {
    return manualGrades[questionNumber] || "auto";
  };

  const renderManualGradingControls = (questionNumber: number) => {
    const manualStatus = getManualGradeStatus(questionNumber);
    const autoStatus = getAutoGradeStatus(questionNumber);
    const finalStatus = getFinalGradeStatus(questionNumber);

    return (
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 mt-1.5">
        <span className="text-xs text-muted-foreground">Grade:</span>

        <div className="flex flex-wrap gap-1">
          <Button
            size="sm"
            variant={finalStatus === "correct" ? "default" : "outline"}
            onClick={() => onManualGradeChange(questionNumber, "correct")}
            className="h-6 px-2 text-xs flex-shrink-0"
          >
            <CheckCircle className="h-3 w-3 sm:mr-1" />
            <span className="hidden sm:inline">Correct</span>
          </Button>

          <Button
            size="sm"
            variant={finalStatus === "incorrect" ? "default" : "outline"}
            onClick={() => onManualGradeChange(questionNumber, "incorrect")}
            className="h-6 px-2 text-xs flex-shrink-0"
          >
            <XCircle className="h-3 w-3 sm:mr-1" />
            <span className="hidden sm:inline">Incorrect</span>
          </Button>

          <Button
            size="sm"
            variant={manualStatus === "auto" ? "default" : "outline"}
            onClick={() => onManualGradeChange(questionNumber, "auto")}
            className="h-6 px-2 text-xs flex-shrink-0"
          >
            <RotateCcw className="h-3 w-3 sm:mr-1" />
            <span className="hidden sm:inline">Auto</span>
            <span className="hidden md:inline">
              {" "}
              {autoStatus === "unanswered" ? "(None)" : `(${autoStatus})`}
            </span>
          </Button>

          {manualStatus !== "auto" && (
            <div className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded flex-shrink-0">
              Manual
            </div>
          )}
        </div>
      </div>
    );
  };

  const getOptionLabel = (option: string) => {
    if (!questionGroup.options) return option;
    const index = questionGroup.options.findIndex((opt) => opt === option);
    return index >= 0
      ? `${String.fromCharCode(65 + index)} - ${option}`
      : option;
  };

  return (
    <div className="space-y-2">
      {/* Instructions */}
      <div className="bg-muted/50 p-1.5 rounded text-xs text-muted-foreground">
        Match each question with the correct option
      </div>

      {/* Options display */}
      {questionGroup.options && (
        <div className="border border-border rounded p-2 bg-card">
          <div className="text-xs font-medium text-foreground mb-1.5">
            Options:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-xs">
            {questionGroup.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-1">
                <span className="font-medium text-muted-foreground">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-foreground">{option}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Questions */}
      <div className="space-y-2">
        {questionGroup.questions.map((question) => {
          const finalStatus = getFinalGradeStatus(question.number);
          const userAnswer = userAnswers.get(question.number) || "";

          return (
            <div
              key={question.number}
              id={`question-${question.number}`}
              data-question={question.number}
              className="space-y-1.5 p-2 rounded border border-border hover:border-border/80 transition-colors"
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-2">
                <Label className="font-medium text-foreground text-xs">
                  {question.number}. {question.prompt}
                </Label>
                <div className="flex items-center shrink-0">
                  {finalStatus === "correct" && (
                    <CheckCircle className="h-3 w-3 text-primary" />
                  )}
                  {finalStatus === "incorrect" && (
                    <XCircle className="h-3 w-3 text-destructive" />
                  )}
                  {finalStatus === "unanswered" && (
                    <div className="h-3 w-3 rounded-full border border-muted-foreground/50" />
                  )}
                </div>
              </div>

              {/* Student Match Display */}
              <div className="ml-2">
                <div
                  className={`p-2 rounded border text-xs ${
                    finalStatus === "correct"
                      ? "border-primary/50 bg-primary/5 text-primary"
                      : finalStatus === "incorrect"
                      ? "border-destructive/50 bg-destructive/5 text-destructive"
                      : "border-muted-foreground/50 bg-muted/30 text-muted-foreground"
                  }`}
                >
                  {userAnswer ? (
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Matched to:</span>
                      <span>{getOptionLabel(userAnswer)}</span>
                    </div>
                  ) : (
                    <span className="italic">No match selected</span>
                  )}
                </div>
              </div>

              {/* Manual Grading Controls */}
              <div className="ml-2">
                {renderManualGradingControls(question.number)}
              </div>

              {/* Answer comparison - Only show if incorrect or unanswered */}
              {finalStatus !== "correct" && (
                <div className="mt-1.5 pt-1.5 border-t border-border/50 text-xs space-y-0.5 ml-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Student Match:
                    </span>
                    {userAnswer ? (
                      <span className="text-destructive font-medium">
                        {getOptionLabel(userAnswer)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic">
                        No match
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Correct Match:
                    </span>
                    <span className="text-primary font-medium">
                      {getOptionLabel(question.correctMatch)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
