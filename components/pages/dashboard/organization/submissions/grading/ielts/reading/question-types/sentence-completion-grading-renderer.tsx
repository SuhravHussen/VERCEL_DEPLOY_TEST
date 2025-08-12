/* eslint-disable @next/next/no-img-element */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { SentenceCompletionGroup } from "@/types/exam/ielts-academic/reading/question/question";

type ManualGradeStatus = "correct" | "incorrect" | "auto";

interface ManualGrades {
  [questionNumber: number]: ManualGradeStatus;
}

interface SentenceCompletionGradingRendererProps {
  questionGroup: SentenceCompletionGroup;
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

export default function SentenceCompletionGradingRenderer({
  questionGroup,
  userAnswers,
  manualGrades,
  onManualGradeChange,
  getFinalGradeStatus,
}: SentenceCompletionGradingRendererProps) {
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

  // Helper function to render sentence with highlighted blank
  const renderSentenceWithBlank = (
    sentenceWithBlank: string,
    userAnswer: string,
    correctAnswer: string,
    questionNumber: number
  ) => {
    const parts = sentenceWithBlank.split("_____");
    if (parts.length !== 2) {
      // If no blank found, just return the sentence
      return <span>{sentenceWithBlank}</span>;
    }

    const isCorrect =
      userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();

    return (
      <span>
        {parts[0]}
        <span
          className={`px-2 py-1 rounded font-medium ${
            userAnswer
              ? isCorrect
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-red-100 text-red-800 border border-red-300"
              : "bg-yellow-100 text-yellow-800 border border-yellow-300"
          }`}
        >
          {userAnswer || `[Q${questionNumber}]`}
        </span>
        {parts[1]}
      </span>
    );
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="bg-muted/30 rounded-lg p-3 sm:p-4">
        <h4 className="font-medium text-foreground mb-3 text-sm sm:text-base">
          SENTENCE COMPLETION Questions
        </h4>

        <div className="text-xs sm:text-sm text-muted-foreground mb-3">
          <strong>Instructions:</strong> {questionGroup.instruction}
          {questionGroup.wordLimitText && (
            <div className="mt-1">
              <strong>Word Limit:</strong> {questionGroup.wordLimitText}
            </div>
          )}
        </div>

        <div className="space-y-3 sm:space-y-4">
          {questionGroup.questions.map((question) => {
            const questionNumber = question.number;
            const userAnswer = userAnswers.get(questionNumber) || "";
            const correctAnswer = question.correctAnswer;
            const finalStatus = getFinalGradeStatus(questionNumber);
            const manualGrade = manualGrades[questionNumber];

            // Calculate word count for user answer
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
                  <div>
                    <div className="mb-3">
                      <div className="text-xs font-medium text-muted-foreground mb-2">
                        Complete the sentence:
                      </div>
                      <div className="p-3 rounded border bg-muted/20 text-sm leading-relaxed">
                        {renderSentenceWithBlank(
                          question.sentenceWithBlank,
                          userAnswer,
                          correctAnswer,
                          questionNumber
                        )}
                      </div>
                    </div>

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

                    {question.imageUrl && (
                      <div className="mt-3">
                        <img
                          src={question.imageUrl}
                          alt="Question context"
                          className="max-w-full h-auto rounded border"
                        />
                      </div>
                    )}
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
