"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { ListeningMultipleChoiceGroup } from "@/types/exam/ielts-academic/listening/listening";

type ManualGradeStatus = "correct" | "incorrect" | "auto";

interface ManualGrades {
  [questionNumber: number]: ManualGradeStatus;
}

interface MultipleChoiceGradingRendererProps {
  questionGroup: ListeningMultipleChoiceGroup;
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

export default function MultipleChoiceGradingRenderer({
  questionGroup,
  userAnswers,
  manualGrades,
  onManualGradeChange,
  getFinalGradeStatus,
}: MultipleChoiceGradingRendererProps) {
  const getAutoGradeStatus = (
    questionNumber: number
  ): "correct" | "incorrect" | "unanswered" => {
    const question = questionGroup.questions.find(
      (q) => q.number === questionNumber
    );
    const userAnswer = userAnswers.get(questionNumber) || "";

    if (!userAnswer.trim()) return "unanswered";
    if (!question) return "incorrect";

    return userAnswer === question.answer ? "correct" : "incorrect";
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
    <div className="space-y-2 sm:space-y-3">
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

              {/* Options with student answer highlighted */}
              <div className="ml-2 sm:ml-0 space-y-1">
                {question.options.map((option, index) => {
                  const optionLabel = String.fromCharCode(65 + index); // A, B, C, D
                  const isUserSelected = userAnswer === optionLabel;
                  const isCorrectAnswer = question.answer === optionLabel;

                  return (
                    <div
                      key={index}
                      className={`flex items-start space-x-2 p-1.5 sm:p-2 rounded border transition-colors text-xs sm:text-sm ${
                        isUserSelected && isCorrectAnswer
                          ? "border-primary bg-primary/5"
                          : isUserSelected
                          ? "border-destructive bg-destructive/5"
                          : isCorrectAnswer
                          ? "border-primary/50 bg-primary/5"
                          : "border-border hover:border-border/80"
                      }`}
                    >
                      <div
                        className={`flex items-center justify-center w-5 h-5 rounded-full border text-xs font-medium shrink-0 ${
                          isUserSelected && isCorrectAnswer
                            ? "border-primary text-primary bg-primary/10"
                            : isUserSelected
                            ? "border-destructive text-destructive bg-destructive/10"
                            : isCorrectAnswer
                            ? "border-primary/50 text-primary bg-primary/5"
                            : "border-muted-foreground/50 text-muted-foreground"
                        }`}
                      >
                        {optionLabel}
                      </div>
                      <span
                        className={`flex-1 ${
                          isUserSelected && isCorrectAnswer
                            ? "text-primary"
                            : isUserSelected
                            ? "text-destructive"
                            : isCorrectAnswer
                            ? "text-primary"
                            : "text-foreground"
                        }`}
                      >
                        {option}
                      </span>
                      <div className="flex items-center space-x-1 shrink-0">
                        {isUserSelected && (
                          <div className="text-xs px-1 py-0.5 rounded bg-secondary text-secondary-foreground">
                            Student
                          </div>
                        )}
                        {isCorrectAnswer && (
                          <div className="text-xs px-1 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                            Correct
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Manual Grading Controls */}
              <div className="ml-2 sm:ml-0">
                {renderManualGradingControls(question.number)}
              </div>

              {/* Answer summary - Only show if incorrect or unanswered */}
              {finalStatus !== "correct" && (
                <div className="mt-1.5 pt-1.5 border-t border-border/50 text-xs space-y-0.5 ml-2 sm:ml-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <span className="text-muted-foreground">
                      Student selected:
                    </span>
                    {userAnswer ? (
                      <span className="text-destructive font-medium">
                        {userAnswer} -{" "}
                        {question.options[userAnswer.charCodeAt(0) - 65]}
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic">
                        No answer selected
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <span className="text-muted-foreground">
                      Correct answer:
                    </span>
                    <span className="text-primary font-medium">
                      {question.answer} -{" "}
                      {question.options[question.answer.charCodeAt(0) - 65]}
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
