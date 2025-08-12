"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { ListeningShortAnswerGroup } from "@/types/exam/ielts-academic/listening/listening";

type ManualGradeStatus = "correct" | "incorrect" | "auto";

interface ManualGrades {
  [questionNumber: number]: ManualGradeStatus;
}

interface ShortAnswerGradingRendererProps {
  questionGroup: ListeningShortAnswerGroup;
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

export default function ShortAnswerGradingRenderer({
  questionGroup,
  userAnswers,
  manualGrades,
  onManualGradeChange,
  getFinalGradeStatus,
}: ShortAnswerGradingRendererProps) {
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
    const correctAnswerNormalized = question.correctAnswer.trim().toLowerCase();

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

  return (
    <div className="space-y-2">
      {/* Word limit instruction */}
      {questionGroup.maxWords && (
        <div className="bg-muted/50 p-1.5 rounded text-xs text-muted-foreground">
          {questionGroup.wordLimitText ||
            `Write NO MORE THAN ${questionGroup.maxWords} WORDS for each answer.`}
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
                  {question.number}. {question.question}
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

              {/* Student Answer Display */}
              <div className="ml-2">
                <Textarea
                  value={userAnswer}
                  className={`text-xs min-h-12 resize-none ${
                    finalStatus === "correct"
                      ? "border-primary/50 text-primary"
                      : finalStatus === "incorrect"
                      ? "border-destructive/50 text-destructive"
                      : "border-muted-foreground/50 text-muted-foreground"
                  }`}
                  placeholder="No answer provided"
                  disabled
                />
              </div>

              {/* Manual Grading Controls */}
              <div className="ml-2">
                {renderManualGradingControls(question.number)}
              </div>

              {/* Answer comparison - Only show if incorrect or unanswered */}
              {finalStatus !== "correct" && (
                <div className="mt-1.5 pt-1.5 border-t border-border/50 text-xs space-y-0.5 ml-2">
                  <div className="space-y-1">
                    <div>
                      <span className="text-muted-foreground font-medium">
                        Student Answer:
                      </span>
                      {userAnswer ? (
                        <div className="mt-0.5 p-1.5 bg-destructive/5 border border-destructive/20 rounded text-destructive">
                          {userAnswer}
                        </div>
                      ) : (
                        <div className="mt-0.5 text-muted-foreground italic">
                          No answer provided
                        </div>
                      )}
                    </div>
                    <div>
                      <span className="text-muted-foreground font-medium">
                        Correct Answer:
                      </span>
                      <div className="mt-0.5 p-1.5 bg-primary/5 border border-primary/20 rounded text-primary">
                        {question.correctAnswer}
                      </div>
                    </div>
                  </div>

                  {/* Word count check if applicable */}
                  {questionGroup.maxWords && userAnswer && (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-muted-foreground">Word count:</span>
                      <span
                        className={`font-medium ${
                          userAnswer
                            .trim()
                            .split(/\s+/)
                            .filter((word) => word.length > 0).length <=
                          questionGroup.maxWords
                            ? "text-primary"
                            : "text-destructive"
                        }`}
                      >
                        {
                          userAnswer
                            .trim()
                            .split(/\s+/)
                            .filter((word) => word.length > 0).length
                        }{" "}
                        / {questionGroup.maxWords}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
