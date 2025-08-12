"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { ListeningSentenceCompletionGroup } from "@/types/exam/ielts-academic/listening/listening";

type ManualGradeStatus = "correct" | "incorrect" | "auto";

interface ManualGrades {
  [questionNumber: number]: ManualGradeStatus;
}

interface SentenceCompletionGradingRendererProps {
  questionGroup: ListeningSentenceCompletionGroup;
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

export default function SentenceCompletionGradingRenderer({
  questionGroup,
  userAnswers,
  manualGrades,
  onManualGradeChange,
  getFinalGradeStatus,
}: SentenceCompletionGradingRendererProps) {
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

  const renderSentenceWithBlank = (
    sentence: string,
    questionNumber: number
  ) => {
    const userAnswer = userAnswers.get(questionNumber) || "";
    const finalStatus = getFinalGradeStatus(questionNumber);

    // Split sentence by underscores or common blank patterns
    const parts = sentence.split(/(_+|\[.*?\]|\.\.\.|___)/);

    return (
      <div className="flex flex-wrap items-center gap-1 text-xs sm:text-sm leading-relaxed">
        {parts.map((part, index) => {
          if (part.match(/^(_+|\[.*?\]|\.\.\.|___)$/)) {
            return (
              <div key={index} className="inline-flex items-center gap-1">
                <Input
                  value={userAnswer}
                  className={`inline-block w-16 sm:w-20 md:w-24 h-5 sm:h-6 text-center border-b border-x-0 border-t-0 rounded-none bg-transparent focus:border-primary text-foreground font-medium px-0.5 text-xs ${
                    finalStatus === "correct"
                      ? "border-primary text-primary"
                      : finalStatus === "incorrect"
                      ? "border-destructive text-destructive"
                      : "border-muted-foreground/50 text-muted-foreground"
                  }`}
                  placeholder={`${questionNumber}`}
                  disabled
                />
                <div className="inline-flex items-center justify-center shrink-0">
                  {finalStatus === "correct" && (
                    <CheckCircle className="h-2.5 w-2.5 text-primary" />
                  )}
                  {finalStatus === "incorrect" && (
                    <XCircle className="h-2.5 w-2.5 text-destructive" />
                  )}
                  {finalStatus === "unanswered" && (
                    <div className="h-2.5 w-2.5 rounded-full border border-muted-foreground/50" />
                  )}
                </div>
              </div>
            );
          }
          return (
            <span key={index} className="text-foreground">
              {part}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-2 sm:space-y-3">
      {/* Word limit instruction */}
      {questionGroup.wordLimit && (
        <div className="bg-muted/50 p-1.5 sm:p-3 rounded text-xs sm:text-sm text-muted-foreground">
          {questionGroup.wordLimitText ||
            `Write NO MORE THAN ${questionGroup.wordLimit} WORDS for each answer.`}
        </div>
      )}

      {/* Questions */}
      <div className="space-y-2 sm:space-y-3">
        {questionGroup.questions.map((question) => {
          const finalStatus = getFinalGradeStatus(question.number);
          const userAnswer = userAnswers.get(question.number) || "";

          return (
            <div
              key={question.number}
              id={`question-${question.number}`}
              data-question={question.number}
              className="space-y-1.5 p-2 sm:p-3 rounded border border-border hover:border-border/80 transition-colors scroll-mt-20"
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-2">
                <Label className="font-medium text-foreground text-xs sm:text-sm">
                  {question.number}.
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

              {/* Sentence with filled blank */}
              <div className="ml-2 sm:ml-0">
                {renderSentenceWithBlank(
                  question.sentenceWithBlank,
                  question.number
                )}
              </div>

              {/* Manual Grading Controls */}
              <div className="ml-2 sm:ml-0">
                {renderManualGradingControls(question.number)}
              </div>

              {/* Answer comparison - Only show if incorrect or unanswered */}
              {finalStatus !== "correct" && (
                <div className="mt-1.5 pt-1.5 border-t border-border/50 text-xs space-y-0.5 ml-2 sm:ml-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <span className="text-muted-foreground">Student:</span>
                    {userAnswer ? (
                      <span className="text-destructive font-medium">
                        &quot;{userAnswer}&quot;
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic">
                        No answer
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <span className="text-muted-foreground">Correct:</span>
                    <span className="text-primary font-medium">
                      &quot;{question.correctAnswer}&quot;
                    </span>
                  </div>

                  {/* Word count check if applicable */}
                  {questionGroup.wordLimit && userAnswer && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 pt-0.5">
                      <span className="text-muted-foreground">Word count:</span>
                      <span
                        className={`font-medium ${
                          userAnswer.trim().split(/\s+/).length <=
                          questionGroup.wordLimit
                            ? "text-primary"
                            : "text-destructive"
                        }`}
                      >
                        {userAnswer.trim().split(/\s+/).length} /{" "}
                        {questionGroup.wordLimit}
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
