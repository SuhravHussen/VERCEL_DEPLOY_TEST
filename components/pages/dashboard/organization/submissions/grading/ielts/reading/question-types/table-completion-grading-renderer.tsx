"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { TableCompletionGroup } from "@/types/exam/ielts-academic/reading/question/question";

type ManualGradeStatus = "correct" | "incorrect" | "auto";

interface ManualGrades {
  [questionNumber: number]: ManualGradeStatus;
}

interface TableCompletionGradingRendererProps {
  questionGroup: TableCompletionGroup;
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

  // Helper function to get question number from cellId
  const getQuestionNumber = (cellId: string): number => {
    const match = cellId.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };

  // Helper function to render table with highlighted cells
  const renderTableWithGaps = () => {
    if (
      !questionGroup.tableStructure ||
      questionGroup.tableStructure.length === 0
    ) {
      return (
        <div className="text-muted-foreground italic">
          Table structure not available
        </div>
      );
    }

    const createCellMap = () => {
      const cellMap = new Map();
      questionGroup.questions.forEach((question) => {
        const questionNumber = getQuestionNumber(question.cellId);
        const userAnswer = userAnswers.get(questionNumber) || "";
        const correctAnswer = question.correctAnswer;
        const isCorrect =
          userAnswer.toLowerCase().trim() ===
          correctAnswer.toLowerCase().trim();

        cellMap.set(question.cellId, {
          userAnswer,
          correctAnswer,
          isCorrect,
          questionNumber,
        });
      });
      return cellMap;
    };

    const cellMap = createCellMap();

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-border">
          {questionGroup.tableStructure.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => {
                const cellKey = `row${rowIndex}col${cellIndex}`;
                const cellData = cellMap.get(cellKey);

                // Check if this cell contains a gap marker
                const isGapCell = cell.includes("[") && cell.includes("]");

                if (isGapCell && cellData) {
                  const { userAnswer, isCorrect, questionNumber } = cellData;

                  return (
                    <td
                      key={cellIndex}
                      className="border border-border p-2 text-center"
                    >
                      <div
                        className={`px-2 py-1 rounded text-sm font-medium border ${
                          userAnswer
                            ? isCorrect
                              ? "bg-muted/30 text-foreground border-muted"
                              : "bg-destructive/10 text-destructive border-destructive/30"
                            : "bg-muted/20 text-muted-foreground border-muted"
                        }`}
                      >
                        {userAnswer || `[Q${questionNumber}]`}
                      </div>
                    </td>
                  );
                } else {
                  // Regular cell content
                  return (
                    <td
                      key={cellIndex}
                      className="border border-border p-2 text-sm"
                    >
                      {cell}
                    </td>
                  );
                }
              })}
            </tr>
          ))}
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="bg-muted/30 rounded-lg p-3 sm:p-4">
        <h4 className="font-medium text-foreground mb-3 text-sm sm:text-base">
          TABLE COMPLETION Questions
        </h4>

        <div className="text-xs sm:text-sm text-muted-foreground mb-3">
          <strong>Instructions:</strong> {questionGroup.instruction}
          {questionGroup.wordLimitText && (
            <div className="mt-1">
              <strong>Word Limit:</strong> {questionGroup.wordLimitText}
            </div>
          )}
        </div>

        {/* Word bank if available */}
        {questionGroup.options && (
          <div className="mb-4 p-3 bg-background rounded border">
            <div className="text-xs font-medium text-muted-foreground mb-2">
              Choose from:
            </div>
            <div className="flex flex-wrap gap-1">
              {questionGroup.options.map((option, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {option}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Table with gaps */}
        <div className="mb-6 p-4 bg-background rounded border">
          <div className="text-xs font-medium text-muted-foreground mb-3">
            Complete the table:
          </div>
          {renderTableWithGaps()}
        </div>

        {/* Individual question analysis */}
        <div className="space-y-3 sm:space-y-4">
          {questionGroup.questions.map((question) => {
            const questionNumber = getQuestionNumber(question.cellId);
            const userAnswer = userAnswers.get(questionNumber) || "";
            const correctAnswer = question.correctAnswer;
            const finalStatus = getFinalGradeStatus(questionNumber);
            const manualGrade = manualGrades[questionNumber];

            const userWordCount = userAnswer.trim()
              ? userAnswer.trim().split(/\s+/).length
              : 0;
            const isOverWordLimit = questionGroup.wordLimit
              ? userWordCount > questionGroup.wordLimit
              : false;

            return (
              <div
                key={questionNumber}
                className="bg-background rounded-lg border border-border p-3 sm:p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-sm">
                      Q{questionNumber}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      Cell {question.cellId}
                    </Badge>
                    {getStatusIcon(finalStatus)}
                    {getStatusBadge(finalStatus)}
                    {manualGrade && manualGrade !== "auto" && (
                      <Badge variant="outline" className="text-xs">
                        Manual
                      </Badge>
                    )}
                    {isOverWordLimit && (
                      <Badge variant="destructive" className="text-xs">
                        Over word limit
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground">
                        Student&apos;s Answer:
                      </div>
                      <div className="p-2 rounded border bg-muted/10 text-sm">
                        {userAnswer || (
                          <span className="italic text-muted-foreground">
                            No answer provided
                          </span>
                        )}
                        {questionGroup.wordLimit && userAnswer && (
                          <div
                            className={`text-xs mt-1 ${
                              isOverWordLimit
                                ? "text-destructive"
                                : "text-muted-foreground"
                            }`}
                          >
                            {userWordCount}/{questionGroup.wordLimit} words
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground">
                        Correct Answer:
                      </div>
                      <div className="p-2 rounded border bg-muted/30 border-muted text-sm font-medium">
                        {correctAnswer}
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
