"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { ListeningTableCompletionGroup } from "@/types/exam/ielts-academic/listening/listening";

type ManualGradeStatus = "correct" | "incorrect" | "auto";

interface ManualGrades {
  [questionNumber: number]: ManualGradeStatus;
}

interface TableCompletionGradingRendererProps {
  questionGroup: ListeningTableCompletionGroup;
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

export default function TableCompletionGradingRenderer({
  questionGroup,
  userAnswers,
  manualGrades,
  onManualGradeChange,
  getFinalGradeStatus,
}: TableCompletionGradingRendererProps) {
  const getQuestionNumber = (cellId: string): number => {
    // Extract number from cellId (e.g., "cell_1" -> 1)
    const match = cellId.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };

  const getAutoGradeStatus = (
    cellId: string
  ): "correct" | "incorrect" | "unanswered" => {
    const questionNumber = getQuestionNumber(cellId);
    const question = questionGroup.questions.find((q) => q.cellId === cellId);
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

  const getManualGradeStatus = (cellId: string): ManualGradeStatus => {
    const questionNumber = getQuestionNumber(cellId);
    return manualGrades[questionNumber] || "auto";
  };

  const renderManualGradingControls = (cellId: string) => {
    const questionNumber = getQuestionNumber(cellId);
    const manualStatus = getManualGradeStatus(cellId);
    const autoStatus = getAutoGradeStatus(cellId);
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

  const renderTable = () => {
    if (
      !questionGroup.tableStructure ||
      questionGroup.tableStructure.length === 0
    ) {
      return (
        <div className="text-xs text-muted-foreground italic">
          No table structure available
        </div>
      );
    }

    return (
      <div className="overflow-auto">
        <table className="w-full border-collapse border border-border text-xs">
          <tbody>
            {questionGroup.tableStructure.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => {
                  // Check if this cell is a fillable gap
                  const cellPattern = /\{\{(cell_\d+)\}\}/;
                  const match = cell.match(cellPattern);

                  if (match) {
                    const cellId = match[1];
                    const questionNumber = getQuestionNumber(cellId);
                    const userAnswer = userAnswers.get(questionNumber) || "";
                    const finalStatus = getFinalGradeStatus(questionNumber);

                    return (
                      <td
                        key={cellIndex}
                        className="border border-border p-1 text-center"
                      >
                        <div className="flex items-center justify-center space-x-1">
                          <Input
                            value={userAnswer}
                            className={`w-16 h-6 text-center text-xs ${
                              finalStatus === "correct"
                                ? "border-primary text-primary"
                                : finalStatus === "incorrect"
                                ? "border-destructive text-destructive"
                                : "border-muted-foreground/50 text-muted-foreground"
                            }`}
                            placeholder={`${questionNumber}`}
                            disabled
                          />
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
                      </td>
                    );
                  }

                  // Regular cell content
                  return (
                    <td
                      key={cellIndex}
                      className="border border-border p-2 text-center bg-muted/30"
                    >
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      {/* Word limit instruction */}
      {questionGroup.wordLimit && (
        <div className="bg-muted/50 p-1.5 rounded text-xs text-muted-foreground">
          {questionGroup.wordLimitText ||
            `Write NO MORE THAN ${questionGroup.wordLimit} WORDS for each answer.`}
        </div>
      )}

      {/* Table structure header */}
      <div className="text-xs font-medium text-foreground mb-2">
        Complete the table below
      </div>

      {/* Table with filled answers */}
      <div className="border border-border rounded p-2 bg-card">
        {renderTable()}
      </div>

      {/* Individual questions for grading controls */}
      <div className="space-y-2">
        {questionGroup.questions.map((question) => {
          const questionNumber = getQuestionNumber(question.cellId);
          const finalStatus = getFinalGradeStatus(questionNumber);
          const userAnswer = userAnswers.get(questionNumber) || "";

          return (
            <div
              key={question.cellId}
              id={`question-${questionNumber}`}
              data-question={questionNumber}
              className="space-y-1.5 p-2 rounded border border-border hover:border-border/80 transition-colors"
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="font-medium text-foreground text-xs">
                  Cell {questionNumber} ({question.cellId})
                </div>
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

              {/* Manual Grading Controls */}
              <div className="ml-2">
                {renderManualGradingControls(question.cellId)}
              </div>

              {/* Answer comparison - Only show if incorrect or unanswered */}
              {finalStatus !== "correct" && (
                <div className="mt-1.5 pt-1.5 border-t border-border/50 text-xs space-y-0.5 ml-2">
                  <div className="flex items-center justify-between">
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
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Correct:</span>
                    <span className="text-primary font-medium">
                      &quot;{question.correctAnswer}&quot;
                    </span>
                  </div>

                  {/* Word count check if applicable */}
                  {questionGroup.wordLimit && userAnswer && (
                    <div className="flex items-center justify-between pt-0.5">
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
