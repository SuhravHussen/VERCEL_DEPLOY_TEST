/* eslint-disable @next/next/no-img-element */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { FlowChartCompletionGroup } from "@/types/exam/ielts-academic/reading/question/question";

type ManualGradeStatus = "correct" | "incorrect" | "auto";

interface ManualGrades {
  [questionNumber: number]: ManualGradeStatus;
}

interface FlowChartCompletionGradingRendererProps {
  questionGroup: FlowChartCompletionGroup;
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

  // Helper function to get question number from stepId
  const getQuestionNumber = (stepId: string): number => {
    const match = stepId.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };

  const renderImageChart = () => {
    if (!questionGroup.chartImage) return null;

    return (
      <div className="relative max-w-4xl mx-auto">
        <img
          src={questionGroup.chartImage}
          alt="Flow chart"
          className="w-full h-auto rounded border"
        />
        {/* Render input positions over the image with grading colors */}
        {questionGroup.inputPositions?.map((position) => {
          const question = questionGroup.questions.find(
            (q) => q.stepId === position.stepId
          );
          if (!question) return null;

          const questionNumber = getQuestionNumber(question.stepId);
          const userAnswer = userAnswers.get(questionNumber) || "";
          const correctAnswer = question.correctAnswer;
          const isCorrect =
            userAnswer.toLowerCase().trim() ===
            correctAnswer.toLowerCase().trim();

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
              <div
                className={`w-12 sm:w-16 md:w-20 h-5 sm:h-6 md:h-7 rounded-sm flex items-center justify-center text-xs font-medium overflow-hidden border-2 ${
                  userAnswer
                    ? isCorrect
                      ? "bg-muted/30 text-foreground border-muted"
                      : "bg-destructive/10 text-destructive border-destructive/30"
                    : "bg-muted/20 text-muted-foreground border-muted"
                }`}
              >
                <span className="truncate px-1">
                  {userAnswer || `Q${questionNumber}`}
                </span>
              </div>
            </div>
          );
        }) || null}
      </div>
    );
  };

  const renderTextChart = () => {
    if (!questionGroup.textSteps) return null;

    return (
      <div className="p-4 bg-muted/20 rounded-lg">
        <div className="flex flex-col items-center space-y-4 max-w-2xl mx-auto">
          {questionGroup.textSteps
            .sort((a, b) => a.stepNumber - b.stepNumber)
            .map((step, index) => {
              const questionNumber = getQuestionNumber(step.stepId);
              const userAnswer = userAnswers.get(questionNumber) || "";
              const question = questionGroup.questions.find(
                (q) => q.stepId === step.stepId
              );
              const correctAnswer = question?.correctAnswer || "";
              const isCorrect =
                userAnswer.toLowerCase().trim() ===
                correctAnswer.toLowerCase().trim();
              const isLast = index === questionGroup.textSteps!.length - 1;

              return (
                <div
                  key={step.stepId}
                  className="flex flex-col items-center w-full"
                >
                  {/* Step Content */}
                  <div className="bg-white text-black rounded-lg border-2  p-4 w-full max-w-md shadow-sm">
                    <div className="flex items-center justify-center space-x-2 text-sm sm:text-base">
                      {/* Step Number */}
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-xs shrink-0">
                        {step.stepNumber}
                      </div>

                      {/* Step Content */}
                      <div className="flex-1 flex items-center justify-center space-x-2 flex-wrap">
                        {step.textBefore && (
                          <span className="text-center">{step.textBefore}</span>
                        )}

                        {step.isGap && (
                          <div className="min-w-[100px] sm:min-w-[120px] h-8">
                            <div
                              className={`w-full h-full rounded border flex items-center justify-center text-xs font-medium ${
                                userAnswer
                                  ? isCorrect
                                    ? "bg-muted/30 text-foreground border-muted"
                                    : "bg-destructive/10 text-destructive border-destructive/30"
                                  : "bg-muted/20 text-muted-foreground border-muted"
                              }`}
                            >
                              {userAnswer || `Q${questionNumber}`}
                            </div>
                          </div>
                        )}

                        {step.textAfter && (
                          <span className="text-center">{step.textAfter}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Arrow pointing down (except for last item) */}
                  {!isLast && (
                    <div className="my-2">
                      <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-l-transparent border-r-transparent border-t-[15px] border-t-primary"></div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="bg-muted/30 rounded-lg p-3 sm:p-4">
        <h4 className="font-medium text-foreground mb-3 text-sm sm:text-base">
          FLOW CHART COMPLETION Questions
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

        {/* Flow Chart */}
        <div className="mb-6 p-4 bg-background rounded border">
          <div className="text-xs font-medium text-muted-foreground mb-4">
            Complete the flow chart below:
          </div>

          {questionGroup.chartType === "image"
            ? renderImageChart()
            : renderTextChart()}
        </div>

        {/* Individual question analysis */}
        <div className="space-y-3 sm:space-y-4">
          {questionGroup.questions.map((question) => {
            const questionNumber = getQuestionNumber(question.stepId);
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
                      Step {question.stepId}
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
