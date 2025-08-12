"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { MultipleChoiceMultipleAnswersGroup } from "@/types/exam/ielts-academic/reading/question/question";

type ManualGradeStatus = "correct" | "incorrect" | "auto";

interface ManualGrades {
  [questionNumber: number]: ManualGradeStatus;
}

interface MultipleChoiceMultipleAnswersGradingRendererProps {
  questionGroup: MultipleChoiceMultipleAnswersGroup;
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

export default function MultipleChoiceMultipleAnswersGradingRenderer({
  questionGroup,
  userAnswers,
  manualGrades,
  onManualGradeChange,
  getFinalGradeStatus,
}: MultipleChoiceMultipleAnswersGradingRendererProps) {
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

  // Parse user answer (could be comma-separated or space-separated)
  const parseUserAnswer = (answer: string): string[] => {
    if (!answer) return [];
    return answer.split(/[,\s]+/).filter((item) => item.trim().length > 0);
  };

  // Check if arrays contain the same elements (order doesn't matter)
  const arraysEqual = (arr1: string[], arr2: string[]): boolean => {
    if (arr1.length !== arr2.length) return false;
    const sorted1 = arr1.map((item) => item.toLowerCase().trim()).sort();
    const sorted2 = arr2.map((item) => item.toLowerCase().trim()).sort();
    return sorted1.every((val, index) => val === sorted2[index]);
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="bg-muted/30 rounded-lg p-3 sm:p-4">
        <h4 className="font-medium text-foreground mb-3 text-sm sm:text-base">
          MULTIPLE CHOICE (MULTIPLE ANSWERS) Questions
        </h4>

        <div className="text-xs sm:text-sm text-muted-foreground mb-3">
          <strong>Instructions:</strong> {questionGroup.instruction}
          {questionGroup.answersRequired && (
            <div className="mt-1">
              <strong>Required Answers:</strong> Choose exactly{" "}
              {questionGroup.answersRequired} answers
            </div>
          )}
        </div>

        <div className="space-y-3 sm:space-y-4">
          {questionGroup.questions.map((question) => {
            const questionNumber = question.number;
            const userAnswerRaw = userAnswers.get(questionNumber) || "";
            const userAnswerArray = parseUserAnswer(userAnswerRaw);
            const correctAnswers = question.answers;
            const finalStatus = getFinalGradeStatus(questionNumber);
            const manualGrade = manualGrades[questionNumber];

            const options = questionGroup.options || [];
            const isCorrectOverall = arraysEqual(
              userAnswerArray,
              correctAnswers
            );

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
                    {getStatusIcon(finalStatus)}
                    {getStatusBadge(finalStatus)}
                    {manualGrade && manualGrade !== "auto" && (
                      <Badge variant="outline" className="text-xs">
                        Manual
                      </Badge>
                    )}
                    {questionGroup.answersRequired &&
                      userAnswerArray.length !==
                        questionGroup.answersRequired && (
                        <Badge className="bg-orange-100 text-orange-800 text-xs">
                          Wrong count ({userAnswerArray.length}/
                          {questionGroup.answersRequired})
                        </Badge>
                      )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-foreground mb-3">
                      {question.question}
                    </p>

                    <div className="grid grid-cols-1 gap-2 text-xs sm:text-sm">
                      {options.map((option, index) => {
                        const optionLetter = String.fromCharCode(65 + index);
                        const isCorrectAnswer =
                          correctAnswers.includes(optionLetter);
                        const isUserSelection =
                          userAnswerArray.includes(optionLetter);

                        let styling = "bg-muted/20 border-border";
                        if (isCorrectAnswer && isUserSelection) {
                          styling = "bg-muted/30 border-muted text-foreground";
                        } else if (isCorrectAnswer) {
                          styling =
                            "bg-muted/30 border-muted text-foreground opacity-75";
                        } else if (isUserSelection) {
                          styling =
                            "bg-destructive/10 border-destructive/30 text-destructive";
                        }

                        return (
                          <div
                            key={index}
                            className={`p-2 rounded border ${styling}`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">
                                  {optionLetter}
                                </span>
                                <span>{option}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                {isCorrectAnswer && (
                                  <Badge className="bg-green-100 text-green-800 text-xs">
                                    ✓ Correct
                                  </Badge>
                                )}
                                {isUserSelection && (
                                  <Badge
                                    className={`text-xs ${
                                      isCorrectAnswer
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {isCorrectAnswer
                                      ? "✓ Selected"
                                      : "✗ Selected"}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-border">
                    <div className="text-xs text-muted-foreground">
                      <div className="mb-1">
                        <span className="font-medium">Student Answers:</span>{" "}
                        {userAnswerArray.join(", ") || "No answers"}
                      </div>
                      <div>
                        <span className="font-medium">Correct Answers:</span>{" "}
                        {correctAnswers.join(", ")}
                      </div>
                      <div className="mt-1">
                        <span className="font-medium">Auto-check:</span>{" "}
                        {isCorrectOverall ? "Match" : "No match"}
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-1">
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
