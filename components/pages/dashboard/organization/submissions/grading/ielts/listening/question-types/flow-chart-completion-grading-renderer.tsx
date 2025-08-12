"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { ListeningFlowChartCompletionGroup } from "@/types/exam/ielts-academic/listening/listening";
import Image from "next/image";

type ManualGradeStatus = "correct" | "incorrect" | "auto";

interface ManualGrades {
  [questionNumber: number]: ManualGradeStatus;
}

interface FlowChartCompletionGradingRendererProps {
  questionGroup: ListeningFlowChartCompletionGroup;
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

export default function FlowChartCompletionGradingRenderer({
  questionGroup,
  userAnswers,
  manualGrades,
  onManualGradeChange,
  getFinalGradeStatus,
}: FlowChartCompletionGradingRendererProps) {
  const getQuestionNumber = (stepId: string): number => {
    // Extract number from stepId (e.g., "step_1" -> 1)
    const match = stepId.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };

  const getAutoGradeStatus = (
    stepId: string
  ): "correct" | "incorrect" | "unanswered" => {
    const questionNumber = getQuestionNumber(stepId);
    const question = questionGroup.questions.find((q) => q.stepId === stepId);
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

  const getManualGradeStatus = (stepId: string): ManualGradeStatus => {
    const questionNumber = getQuestionNumber(stepId);
    return manualGrades[questionNumber] || "auto";
  };

  const renderManualGradingControls = (stepId: string) => {
    const questionNumber = getQuestionNumber(stepId);
    const manualStatus = getManualGradeStatus(stepId);
    const autoStatus = getAutoGradeStatus(stepId);
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

  const renderImageBasedChart = () => {
    if (!questionGroup.chartImage || !questionGroup.inputPositions) {
      return (
        <div className="text-xs text-muted-foreground italic p-4 text-center">
          No chart image or input positions available
        </div>
      );
    }

    return (
      <div className="relative max-w-4xl mx-auto">
        <Image
          src={questionGroup.chartImage}
          alt="Flow Chart"
          width={800}
          height={600}
          className="w-full h-auto"
        />

        {/* Overlay input positions */}
        {questionGroup.inputPositions.map((position) => {
          const questionNumber = getQuestionNumber(position.stepId);
          const userAnswer = userAnswers.get(questionNumber) || "";
          const finalStatus = getFinalGradeStatus(questionNumber);

          return (
            <div
              key={position.stepId}
              className="absolute"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                transform: "translate(-50%, -50%)",
                zIndex: 10,
              }}
            >
              <div className="inline-flex items-center gap-1">
                <Input
                  value={userAnswer}
                  className={`w-12 sm:w-16 md:w-20 h-5 sm:h-6 md:h-7 text-center text-xs bg-white text-black font-medium px-1 ${
                    finalStatus === "correct"
                      ? "border-primary text-primary"
                      : finalStatus === "incorrect"
                      ? "border-destructive text-destructive"
                      : "border-muted-foreground/50 text-muted-foreground"
                  }`}
                  style={{ border: "2px dashed black" }}
                  placeholder={`${questionNumber}`}
                  disabled
                />
                {/* Status indicator */}
                <div className="inline-flex items-center justify-center shrink-0 bg-white/90 rounded p-0.5">
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
            </div>
          );
        })}
      </div>
    );
  };

  const renderTextBasedChart = () => {
    if (!questionGroup.textSteps || questionGroup.textSteps.length === 0) {
      return (
        <div className="text-xs text-muted-foreground italic p-4 text-center">
          No text steps available
        </div>
      );
    }

    return (
      <div className="p-2 sm:p-4 bg-muted/20 rounded-lg">
        <div className="flex flex-col items-center space-y-2 sm:space-y-4 max-w-2xl mx-auto">
          {questionGroup.textSteps
            .sort((a, b) => a.stepNumber - b.stepNumber)
            .map((step, index) => {
              if (!step.isGap) {
                return (
                  <div
                    key={step.stepId}
                    className="bg-white text-black rounded-lg border-2 border-gray-300 p-2 sm:p-4 w-full max-w-md shadow-sm"
                  >
                    <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-xs shrink-0">
                        {step.stepNumber}
                      </div>
                      <span className="text-center">
                        {step.textBefore} {step.textAfter}
                      </span>
                    </div>
                  </div>
                );
              }

              const questionNumber = getQuestionNumber(step.stepId);
              const userAnswer = userAnswers.get(questionNumber) || "";
              const finalStatus = getFinalGradeStatus(questionNumber);
              const isLast = index === questionGroup.textSteps!.length - 1;

              return (
                <div
                  key={step.stepId}
                  className="flex flex-col items-center w-full"
                >
                  {/* Step Content */}
                  <div className="bg-white text-black rounded-lg border-2 border-gray-300 p-2 sm:p-4 w-full max-w-md shadow-sm">
                    <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm">
                      {/* Step Number */}
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-xs shrink-0">
                        {step.stepNumber}
                      </div>

                      {/* Step Content */}
                      <div className="flex-1 flex items-center justify-center space-x-2 flex-wrap">
                        {step.textBefore && (
                          <span className="text-center text-xs sm:text-sm">
                            {step.textBefore}
                          </span>
                        )}

                        <div className="min-w-[80px] sm:min-w-[100px] md:min-w-[120px] h-6 sm:h-8 relative">
                          <Input
                            value={userAnswer}
                            className={`w-full h-full text-center text-xs bg-white text-black font-medium px-1 sm:px-3 ${
                              finalStatus === "correct"
                                ? "border-primary text-primary"
                                : finalStatus === "incorrect"
                                ? "border-destructive text-destructive"
                                : "border-muted-foreground/50 text-muted-foreground"
                            }`}
                            style={{ border: "2px dashed black" }}
                            placeholder={`${questionNumber}`}
                            disabled
                          />
                          <div className="absolute -right-6 top-1/2 transform -translate-y-1/2">
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

                        {step.textAfter && (
                          <span className="text-center text-xs sm:text-sm">
                            {step.textAfter}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Arrow Down (if not last step) */}
                  {!isLast && (
                    <div className="flex justify-center py-1 sm:py-2">
                      <svg
                        className="w-4 h-4 sm:w-6 sm:h-6 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    );
  };

  const renderFallbackChart = () => {
    return (
      <div className="space-y-2 sm:space-y-4">
        {questionGroup.questions.map((question, index) => {
          const isLast = index === questionGroup.questions.length - 1;
          const questionNumber = getQuestionNumber(question.stepId);
          const userAnswer = userAnswers.get(questionNumber) || "";
          const finalStatus = getFinalGradeStatus(questionNumber);

          return (
            <div
              key={question.stepId}
              className="flex items-center space-x-2 sm:space-x-4"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-xs sm:text-sm">
                {index + 1}
              </div>
              <div className="flex-1 flex items-center space-x-2 sm:space-x-3">
                <span className="text-foreground text-xs sm:text-sm">
                  Step {index + 1}:
                </span>

                <div className="min-w-[60px] sm:min-w-[80px] md:min-w-[100px] h-5 sm:h-6 md:h-7 relative">
                  <Input
                    value={userAnswer}
                    className={`w-full h-full text-center text-xs bg-white text-black font-medium px-1 sm:px-3 ${
                      finalStatus === "correct"
                        ? "border-primary text-primary"
                        : finalStatus === "incorrect"
                        ? "border-destructive text-destructive"
                        : "border-muted-foreground/50 text-muted-foreground"
                    }`}
                    style={{ border: "2px dashed black" }}
                    placeholder={`${questionNumber}`}
                    disabled
                  />
                  <div className="absolute -right-6 top-1/2 transform -translate-y-1/2">
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
              </div>
              {!isLast && (
                <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
                  <div className="w-0.5 h-6 sm:h-8 bg-border"></div>
                  <div className="absolute w-2 h-2 sm:w-3 sm:h-3 border-r-2 border-b-2 border-border transform rotate-45 translate-y-1 sm:translate-y-2"></div>
                </div>
              )}
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

      {/* Flow chart header */}
      <div className="text-xs sm:text-sm font-medium text-foreground mb-2">
        Complete the flow chart below
      </div>

      {/* Flow chart content */}
      <div className="border border-border rounded p-2 sm:p-4 md:p-6 bg-card">
        {questionGroup.chartType === "image"
          ? renderImageBasedChart()
          : questionGroup.chartType === "text"
          ? renderTextBasedChart()
          : renderFallbackChart()}
      </div>

      {/* Individual questions for grading controls */}
      <div className="space-y-2">
        {questionGroup.questions.map((question) => {
          const questionNumber = getQuestionNumber(question.stepId);
          const finalStatus = getFinalGradeStatus(questionNumber);
          const userAnswer = userAnswers.get(questionNumber) || "";

          return (
            <div
              key={question.stepId}
              id={`question-${questionNumber}`}
              data-question={questionNumber}
              className="space-y-1.5 p-2 rounded border border-border hover:border-border/80 transition-colors"
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="font-medium text-foreground text-xs">
                  Step {questionNumber} ({question.stepId})
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
                {renderManualGradingControls(question.stepId)}
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
