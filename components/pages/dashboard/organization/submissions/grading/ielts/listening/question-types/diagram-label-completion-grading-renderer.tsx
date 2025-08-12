"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { ListeningDiagramLabelCompletionGroup } from "@/types/exam/ielts-academic/listening/listening";
import Image from "next/image";

type ManualGradeStatus = "correct" | "incorrect" | "auto";

interface ManualGrades {
  [questionNumber: number]: ManualGradeStatus;
}

interface DiagramLabelCompletionGradingRendererProps {
  questionGroup: ListeningDiagramLabelCompletionGroup;
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

export default function DiagramLabelCompletionGradingRenderer({
  questionGroup,
  userAnswers,
  manualGrades,
  onManualGradeChange,
  getFinalGradeStatus,
}: DiagramLabelCompletionGradingRendererProps) {
  const getQuestionNumber = (labelId: string): number => {
    // Extract number from labelId (e.g., "label_1" -> 1)
    const match = labelId.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };

  const getAutoGradeStatus = (
    labelId: string
  ): "correct" | "incorrect" | "unanswered" => {
    const questionNumber = getQuestionNumber(labelId);
    const question = questionGroup.questions.find((q) => q.labelId === labelId);
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

  const getManualGradeStatus = (labelId: string): ManualGradeStatus => {
    const questionNumber = getQuestionNumber(labelId);
    return manualGrades[questionNumber] || "auto";
  };

  const renderManualGradingControls = (labelId: string) => {
    const questionNumber = getQuestionNumber(labelId);
    const manualStatus = getManualGradeStatus(labelId);
    const autoStatus = getAutoGradeStatus(labelId);
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

  const renderDiagramWithLabels = () => {
    if (!questionGroup.diagramImage || !questionGroup.inputPositions) {
      return (
        <div className="text-xs text-muted-foreground italic p-4 text-center">
          No diagram image or input positions available
        </div>
      );
    }

    return (
      <div className="relative max-w-4xl mx-auto">
        <Image
          src={questionGroup.diagramImage}
          alt="Diagram"
          width={800}
          height={600}
          className="w-full h-auto"
        />

        {/* Render label input fields at specified positions */}
        {questionGroup.inputPositions.map((position) => {
          const questionNumber = getQuestionNumber(position.labelId);
          const userAnswer = userAnswers.get(questionNumber) || "";
          const finalStatus = getFinalGradeStatus(questionNumber);

          return (
            <div
              key={position.labelId}
              className="absolute"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                transform: "translate(-50%, -50%)",
                zIndex: 10,
              }}
            >
              <div className="flex items-center space-x-1 bg-white/90 rounded p-1 border border-border shadow-sm">
                <span className="text-xs font-medium text-foreground">
                  {questionNumber}
                </span>
                <Input
                  value={userAnswer}
                  className={`w-12 sm:w-16 md:w-20 h-5 sm:h-6 text-center text-xs ${
                    finalStatus === "correct"
                      ? "border-primary text-primary"
                      : finalStatus === "incorrect"
                      ? "border-destructive text-destructive"
                      : "border-muted-foreground/50 text-muted-foreground"
                  }`}
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
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-2 sm:space-y-4">
      {/* Word limit instruction */}
      {questionGroup.wordLimit && (
        <div className="bg-muted/50 p-1.5 sm:p-3 rounded text-xs sm:text-sm text-muted-foreground">
          {questionGroup.wordLimitText ||
            `Write NO MORE THAN ${questionGroup.wordLimit} WORDS for each answer.`}
        </div>
      )}

      {/* Diagram header */}
      <div className="text-xs sm:text-sm font-medium text-foreground mb-2">
        Label the diagram below
      </div>

      {/* Diagram content */}
      <div className="border border-border rounded p-2 sm:p-4 md:p-6 bg-card">
        {renderDiagramWithLabels()}
      </div>

      {/* Individual questions for grading controls */}
      <div className="space-y-2">
        {questionGroup.questions.map((question) => {
          const questionNumber = getQuestionNumber(question.labelId);
          const finalStatus = getFinalGradeStatus(questionNumber);
          const userAnswer = userAnswers.get(questionNumber) || "";

          return (
            <div
              key={question.labelId}
              id={`question-${questionNumber}`}
              data-question={questionNumber}
              className="space-y-1.5 p-2 rounded border border-border hover:border-border/80 transition-colors"
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="font-medium text-foreground text-xs">
                  Label {questionNumber} ({question.labelId})
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
                {renderManualGradingControls(question.labelId)}
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
