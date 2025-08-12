"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { ListeningNoteCompletionGroup } from "@/types/exam/ielts-academic/listening/listening";

type ManualGradeStatus = "correct" | "incorrect" | "auto";

interface ManualGrades {
  [questionNumber: number]: ManualGradeStatus;
}

interface NoteCompletionGradingRendererProps {
  questionGroup: ListeningNoteCompletionGroup;
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
  const getQuestionNumber = (gapId: string): number => {
    // Extract number from gapId (e.g., "gap_1" -> 1)
    const match = gapId.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };

  const getAutoGradeStatus = (
    gapId: string
  ): "correct" | "incorrect" | "unanswered" => {
    const questionNumber = getQuestionNumber(gapId);
    const question = questionGroup.questions.find((q) => q.gapId === gapId);
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

  const getManualGradeStatus = (gapId: string): ManualGradeStatus => {
    const questionNumber = getQuestionNumber(gapId);
    return manualGrades[questionNumber] || "auto";
  };

  const renderManualGradingControls = (gapId: string) => {
    const questionNumber = getQuestionNumber(gapId);
    const manualStatus = getManualGradeStatus(gapId);
    const autoStatus = getAutoGradeStatus(gapId);
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

  const renderNoteTextWithGaps = () => {
    if (!questionGroup.noteText) {
      return null;
    }

    // Split the note text by gap placeholders
    const parts = questionGroup.noteText.split(/(\{\{gap_\d+\}\})/);

    return (
      <div className="text-xs leading-relaxed space-y-2">
        {parts.map((part, index) => {
          const gapMatch = part.match(/\{\{(gap_\d+)\}\}/);
          if (gapMatch) {
            const gapId = gapMatch[1];
            const questionNumber = getQuestionNumber(gapId);
            const userAnswer = userAnswers.get(questionNumber) || "";
            const finalStatus = getFinalGradeStatus(questionNumber);

            return (
              <span key={index} className="inline-flex items-center">
                <Input
                  value={userAnswer}
                  className={`inline-block w-16 h-5 text-center border-b border-x-0 border-t-0 rounded-none bg-transparent text-xs mx-1 ${
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
                  <CheckCircle className="h-2.5 w-2.5 text-primary ml-1" />
                )}
                {finalStatus === "incorrect" && (
                  <XCircle className="h-2.5 w-2.5 text-destructive ml-1" />
                )}
                {finalStatus === "unanswered" && (
                  <div className="h-2.5 w-2.5 rounded-full border border-muted-foreground/50 ml-1" />
                )}
              </span>
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
    <div className="space-y-2">
      {/* Word limit instruction */}
      {questionGroup.wordLimit && (
        <div className="bg-muted/50 p-1.5 rounded text-xs text-muted-foreground">
          {questionGroup.wordLimitText ||
            `Write NO MORE THAN ${questionGroup.wordLimit} WORDS for each answer.`}
        </div>
      )}

      {/* Note structure header */}
      <div className="text-xs font-medium text-foreground mb-2">
        Complete the notes below
      </div>

      {/* Note text with gaps */}
      {questionGroup.noteText && (
        <div className="border border-border rounded p-3 bg-card">
          {renderNoteTextWithGaps()}
        </div>
      )}

      {/* Individual questions for grading controls */}
      <div className="space-y-2">
        {questionGroup.questions.map((question) => {
          const questionNumber = getQuestionNumber(question.gapId);
          const finalStatus = getFinalGradeStatus(questionNumber);
          const userAnswer = userAnswers.get(questionNumber) || "";

          return (
            <div
              key={question.gapId}
              id={`question-${questionNumber}`}
              data-question={questionNumber}
              className="space-y-1.5 p-2 rounded border border-border hover:border-border/80 transition-colors"
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="font-medium text-foreground text-xs">
                  Gap {questionNumber} ({question.gapId})
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
                {renderManualGradingControls(question.gapId)}
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
