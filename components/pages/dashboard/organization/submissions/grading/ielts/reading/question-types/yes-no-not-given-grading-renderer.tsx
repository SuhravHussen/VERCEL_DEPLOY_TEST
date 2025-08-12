"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { YesNoNotGivenGroup } from "@/types/exam/ielts-academic/reading/question/question";

type ManualGradeStatus = "correct" | "incorrect" | "auto";

interface ManualGrades {
  [questionNumber: number]: ManualGradeStatus;
}

interface YesNoNotGivenGradingRendererProps {
  questionGroup: YesNoNotGivenGroup;
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

export default function YesNoNotGivenGradingRenderer({
  questionGroup,
  userAnswers,
  manualGrades,
  onManualGradeChange,
  getFinalGradeStatus,
}: YesNoNotGivenGradingRendererProps) {
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

  const getAnswerBadge = (
    answer: string,
    isCorrect: boolean,
    isUserAnswer: boolean
  ) => {
    if (isCorrect && isUserAnswer) {
      return (
        <Badge className="bg-green-100 text-green-800 text-xs ml-2">
          ✓ Correct Answer
        </Badge>
      );
    } else if (isCorrect) {
      return (
        <Badge className="bg-green-100 text-green-800 text-xs ml-2">
          ✓ Correct
        </Badge>
      );
    } else if (isUserAnswer) {
      return (
        <Badge className="bg-red-100 text-red-800 text-xs ml-2">
          ✗ Student&apos;s Answer
        </Badge>
      );
    }
    return null;
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="bg-muted/30 rounded-lg p-3 sm:p-4">
        <h4 className="font-medium text-foreground mb-3 text-sm sm:text-base">
          YES / NO / NOT GIVEN Questions
        </h4>

        <div className="text-xs sm:text-sm text-muted-foreground mb-3">
          <strong>Instructions:</strong> {questionGroup.instruction}
        </div>

        <div className="space-y-3 sm:space-y-4">
          {questionGroup.questions.map((question) => {
            const questionNumber = question.number;
            const userAnswer = userAnswers.get(questionNumber) || "";
            const correctAnswer = question.answer;
            const finalStatus = getFinalGradeStatus(questionNumber);
            const manualGrade = manualGrades[questionNumber];

            const options = ["YES", "NO", "NOT GIVEN"];

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
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-foreground mb-3">
                      {question.statement}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs sm:text-sm">
                      {options.map((option) => {
                        const isCorrect =
                          option.toLowerCase() === correctAnswer.toLowerCase();
                        const isUserAnswer =
                          option.toLowerCase() === userAnswer.toLowerCase();

                        return (
                          <div
                            key={option}
                            className={`p-2 rounded border text-center font-medium ${
                              isCorrect
                                ? "bg-muted/30 border-muted text-foreground"
                                : isUserAnswer
                                ? "bg-destructive/10 border-destructive/30 text-destructive"
                                : "bg-muted/20 border-border"
                            }`}
                          >
                            {option}
                            {getAnswerBadge(option, isCorrect, isUserAnswer)}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium">Student Answer:</span>{" "}
                      {userAnswer || "No answer"}
                      <br />
                      <span className="font-medium">Correct Answer:</span>{" "}
                      {correctAnswer.toUpperCase()}
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
