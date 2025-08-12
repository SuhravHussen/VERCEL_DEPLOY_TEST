"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { NoteCompletionGroup } from "@/types/exam/ielts-academic/reading/question/question";

type ManualGradeStatus = "correct" | "incorrect" | "auto";

interface ManualGrades {
  [questionNumber: number]: ManualGradeStatus;
}

interface NoteCompletionGradingRendererProps {
  questionGroup: NoteCompletionGroup;
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

export default function NoteCompletionGradingRenderer({
  questionGroup,
  userAnswers,
  manualGrades,
  onManualGradeChange,
  getFinalGradeStatus,
}: NoteCompletionGradingRendererProps) {
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

  // Helper function to get question number from gapId
  const getQuestionNumber = (gapId: string): number => {
    const match = gapId.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };

  // Helper function to render notes with highlighted gaps
  const renderNotesWithGaps = () => {
    if (!questionGroup.noteText) {
      return (
        <div className="text-muted-foreground italic">
          Note text not available
        </div>
      );
    }

    let noteText = questionGroup.noteText;

    // Replace each gap with the user's answer or placeholder
    questionGroup.questions.forEach((question) => {
      const questionNumber = getQuestionNumber(question.gapId);
      const userAnswer = userAnswers.get(questionNumber) || "";
      const correctAnswer = question.correctAnswer || "";
      const isCorrect =
        userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();

      const gapPattern = new RegExp(`\\[${question.gapId}\\]`, "g");
      const replacement = `<span class="gap-fill ${
        userAnswer ? (isCorrect ? "gap-correct" : "gap-incorrect") : "gap-empty"
      }" data-question="${questionNumber}">${
        userAnswer || `[${questionNumber}]`
      }</span>`;

      noteText = noteText.replace(gapPattern, replacement);
    });

    return (
      <div
        className="note-content text-sm leading-relaxed"
        dangerouslySetInnerHTML={{ __html: noteText }}
      />
    );
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <style jsx>{`
        .gap-fill {
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 500;
          display: inline-block;
          min-width: 60px;
          text-align: center;
          border: 1px solid;
        }
        .gap-correct {
          background-color: #dcfce7;
          border-color: #bbf7d0;
          color: #166534;
        }
        .gap-incorrect {
          background-color: #fef2f2;
          border-color: #fecaca;
          color: #991b1b;
        }
        .gap-empty {
          background-color: #fefce8;
          border-color: #fde68a;
          color: #92400e;
        }
      `}</style>

      <div className="bg-muted/30 rounded-lg p-3 sm:p-4">
        <h4 className="font-medium text-foreground mb-3 text-sm sm:text-base">
          NOTE COMPLETION Questions
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

        {/* Notes with gaps */}
        <div className="mb-6 p-4 bg-background rounded border">
          <div className="text-xs font-medium text-muted-foreground mb-3">
            Complete the notes:
          </div>
          <div className="bg-muted/20 border-l-4 border-accent p-3 rounded-r">
            {renderNotesWithGaps()}
          </div>
        </div>

        {/* Individual question analysis */}
        <div className="space-y-3 sm:space-y-4">
          {questionGroup.questions.map((question) => {
            const questionNumber = getQuestionNumber(question.gapId);
            const userAnswer = userAnswers.get(questionNumber) || "";
            const correctAnswer = question.correctAnswer || "";
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
                      Gap {question.gapId}
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
                        {correctAnswer || "Not specified"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium">Auto-check:</span>{" "}
                      {correctAnswer &&
                      userAnswer.toLowerCase().trim() ===
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
