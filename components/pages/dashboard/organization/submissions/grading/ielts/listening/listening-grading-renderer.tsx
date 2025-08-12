"use client";

import { useState, useMemo, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Volume2, Clock, CheckCircle, Play } from "lucide-react";
import {
  IELTSListeningTest,
  IELTSListeningQuestionGroup,
} from "@/types/exam/ielts-academic/listening/listening";
import { addListeningQuestionNumbering } from "@/lib/addListeningQuestionNumbering";
import IELTSQuestionGradingRenderer from "./ielts-question-grading-renderer";

interface ListeningGradingRendererProps {
  test: IELTSListeningTest;
  userAnswers: { question_number: number; answer: string }[];
}

interface QuestionWithNumber {
  number?: number;
  gapId?: string;
  cellId?: string;
  stepId?: string;
  labelId?: string;
  answer?: string;
  answers?: string[];
  correctAnswer?: string;
  correctMatch?: string;
}

type ManualGradeStatus = "correct" | "incorrect" | "auto";

interface ManualGrades {
  [questionNumber: number]: ManualGradeStatus;
}

export default function ListeningGradingRenderer({
  test,
  userAnswers,
}: ListeningGradingRendererProps) {
  // Manual grading state
  const [manualGrades, setManualGrades] = useState<ManualGrades>({});
  // View toggle state: default to simple view
  const [isDetailedView, setIsDetailedView] = useState(false);
  const [isGradeCalcOpen, setIsGradeCalcOpen] = useState(false);
  const [calcCorrect, setCalcCorrect] = useState<number>(0);

  // Process listening test with question numbering
  const testSections = [
    test.section_one,
    test.section_two,
    test.section_three,
    test.section_four,
  ];
  const { numberedSections, totalQuestions, audioStats } =
    addListeningQuestionNumbering(testSections);

  // Create a map of user answers by question number
  const userAnswerMap = useMemo(
    () =>
      new Map(
        userAnswers.map((answer) => [answer.question_number, answer.answer])
      ),
    [userAnswers]
  );

  // Helper function to get question number from various ID types
  const getQuestionNumber = (question: QuestionWithNumber): number => {
    if (question.number) return question.number;
    if (question.gapId) {
      const match = question.gapId.match(/\d+/);
      return match ? parseInt(match[0]) : 0;
    }
    if (question.cellId) {
      const match = question.cellId.match(/\d+/);
      return match ? parseInt(match[0]) : 0;
    }
    if (question.stepId) {
      const match = question.stepId.match(/\d+/);
      return match ? parseInt(match[0]) : 0;
    }
    if (question.labelId) {
      const match = question.labelId.match(/\d+/);
      return match ? parseInt(match[0]) : 0;
    }
    return 0;
  };

  // Get all question numbers for easy reference
  const allQuestionNumbers = useMemo(() => {
    const numbers: number[] = [];
    numberedSections.forEach((section) => {
      section.questions.forEach((questionGroup) => {
        questionGroup.questions?.forEach((question: QuestionWithNumber) => {
          const questionNumber = getQuestionNumber(question);
          if (questionNumber > 0) {
            numbers.push(questionNumber);
          }
        });
      });
    });
    return numbers;
  }, [numberedSections]);

  // Simple view rows: question number, correct answer(s) (if available), student answer
  const simpleRows = useMemo(() => {
    const rows: {
      questionNumber: number;
      correctAnswer: string;
      studentAnswer: string;
      status: "correct" | "incorrect" | "unanswered";
    }[] = [];
    numberedSections.forEach((section) => {
      section.questions.forEach((questionGroup) => {
        questionGroup.questions?.forEach((question: QuestionWithNumber) => {
          const questionNumber = getQuestionNumber(question);
          if (questionNumber > 0) {
            const correctAnswers: string[] = (
              question.answers && question.answers.length > 0
                ? question.answers
                : [
                    question.answer,
                    question.correctAnswer,
                    question.correctMatch,
                  ].filter(Boolean as unknown as (v: unknown) => v is string)
            ) as string[];
            const correctAnswer = correctAnswers.join(", ");
            const studentAnswer = userAnswerMap.get(questionNumber) || "";
            const normalizedStudent = studentAnswer.trim().toLowerCase();
            const isMatch =
              normalizedStudent.length > 0 &&
              correctAnswers.some(
                (ans) => ans && ans.toLowerCase().trim() === normalizedStudent
              );
            const status: "correct" | "incorrect" | "unanswered" =
              normalizedStudent.length === 0
                ? "unanswered"
                : isMatch
                ? "correct"
                : "incorrect";
            rows.push({
              questionNumber,
              correctAnswer: String(correctAnswer),
              studentAnswer: String(studentAnswer),
              status,
            });
          }
        });
      });
    });
    rows.sort((a, b) => a.questionNumber - b.questionNumber);
    return rows;
  }, [numberedSections, userAnswerMap]);

  // Listening band calculator
  const computeListeningBand = (correct: number): number | null => {
    if (correct >= 39) return 9.0;
    if (correct >= 37) return 8.5;
    if (correct >= 35) return 8.0;
    if (correct >= 32) return 7.5;
    if (correct >= 30) return 7.0;
    if (correct >= 26) return 6.5;
    if (correct >= 23) return 6.0;
    if (correct >= 18) return 5.5;
    if (correct >= 16) return 5.0;
    if (correct >= 13) return 4.5;
    if (correct >= 11) return 4.0;
    if (correct >= 8) return 3.5;
    if (correct >= 6) return 3.0;
    return null;
  };
  const computedBand = useMemo(
    () => computeListeningBand(calcCorrect),
    [calcCorrect]
  );

  // Function to get automatic grading result
  const getAutoGradeStatus = useCallback(
    (questionNumber: number): "correct" | "incorrect" | "unanswered" => {
      const userAnswer = userAnswerMap.get(questionNumber) || "";
      if (!userAnswer.trim()) return "unanswered";

      // Find the question in the sections
      let correctAnswers: string[] = [];
      numberedSections.forEach((section) => {
        section.questions.forEach((questionGroup) => {
          questionGroup.questions?.forEach((question: QuestionWithNumber) => {
            const qNum = getQuestionNumber(question);
            if (qNum === questionNumber) {
              const candidates: string[] = (
                question.answers && question.answers.length > 0
                  ? question.answers
                  : [
                      question.answer,
                      question.correctAnswer,
                      question.correctMatch,
                    ].filter(Boolean as unknown as (v: unknown) => v is string)
              ) as string[];
              correctAnswers = candidates;
            }
          });
        });
      });

      if (!correctAnswers.length) return "incorrect";
      const normalizedUser = userAnswer.toLowerCase().trim();
      const isMatch = correctAnswers.some(
        (ans) => ans && ans.toLowerCase().trim() === normalizedUser
      );
      return isMatch ? "correct" : "incorrect";
    },
    [numberedSections, userAnswerMap]
  );

  // Function to get final grading status (manual override or auto)
  const getFinalGradeStatus = useCallback(
    (questionNumber: number): "correct" | "incorrect" | "unanswered" => {
      const manualGrade = manualGrades[questionNumber];
      if (manualGrade && manualGrade !== "auto") {
        return manualGrade;
      }
      return getAutoGradeStatus(questionNumber);
    },
    [manualGrades, getAutoGradeStatus]
  );

  // Calculate statistics with manual grading
  const calculateStats = useMemo(() => {
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;
    let manuallyGraded = 0;

    allQuestionNumbers.forEach((questionNumber) => {
      const finalStatus = getFinalGradeStatus(questionNumber);
      const manualGrade = manualGrades[questionNumber];

      if (manualGrade && manualGrade !== "auto") {
        manuallyGraded++;
      }

      switch (finalStatus) {
        case "correct":
          correct++;
          break;
        case "incorrect":
          incorrect++;
          break;
        case "unanswered":
          unanswered++;
          break;
      }
    });

    return {
      correct,
      incorrect,
      unanswered,
      total: totalQuestions,
      answered: correct + incorrect,
      manuallyGraded,
    };
  }, [allQuestionNumbers, manualGrades, totalQuestions, getFinalGradeStatus]);

  // Function to update manual grade
  const updateManualGrade = (
    questionNumber: number,
    status: ManualGradeStatus
  ) => {
    setManualGrades((prev) => ({
      ...prev,
      [questionNumber]: status,
    }));
  };

  // Function to bulk grade all questions
  const bulkGrade = (status: "correct" | "incorrect" | "auto") => {
    if (status === "auto") {
      setManualGrades({});
    } else {
      const newGrades: ManualGrades = {};
      allQuestionNumbers.forEach((num) => {
        newGrades[num] = status;
      });
      setManualGrades(newGrades);
    }
  };

  const renderQuestionGroup = (
    questionGroup: IELTSListeningQuestionGroup,
    sectionIndex: number,
    groupIndex: number
  ) => {
    return (
      <IELTSQuestionGradingRenderer
        key={`${sectionIndex}-${groupIndex}`}
        questionGroup={questionGroup}
        userAnswers={userAnswerMap}
        manualGrades={manualGrades}
        onManualGradeChange={updateManualGrade}
        getFinalGradeStatus={getFinalGradeStatus}
      />
    );
  };

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
      <div className="flex justify-end gap-2">
        <Dialog
          open={isGradeCalcOpen}
          onOpenChange={(open) => {
            setIsGradeCalcOpen(open);
            if (open) setCalcCorrect(calculateStats.correct);
          }}
        >
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="text-xs h-7 px-2">
              Grade calculator
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Listening Grade Calculator</DialogTitle>
              <DialogDescription>
                Enter the number of correct answers to estimate the band score.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-[1fr_auto] gap-2 items-end">
                <div>
                  <div className="text-xs font-medium mb-1">
                    Correct answers
                  </div>
                  <input
                    type="number"
                    min={0}
                    max={totalQuestions}
                    value={calcCorrect}
                    onChange={(e) =>
                      setCalcCorrect(
                        Math.max(
                          0,
                          Math.min(totalQuestions, Number(e.target.value || 0))
                        )
                      )
                    }
                    className="w-full h-9 px-2 rounded-md border bg-background text-sm"
                  />
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  out of {totalQuestions}
                </div>
              </div>
              <div className="rounded-md border bg-muted/40 p-3">
                <div className="text-xs text-muted-foreground mb-1">
                  Estimated band
                </div>
                <div className="text-2xl font-semibold">
                  {computedBand ? computedBand.toFixed(1) : "N/A"}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium mb-2">Conversion table</div>
                <div className="rounded-md border overflow-hidden">
                  <div className="max-h-56 overflow-auto">
                    <div className="grid grid-cols-2 text-xs font-medium bg-muted/50 border-b">
                      <div className="px-2 py-2">Correct Answers</div>
                      <div className="px-2 py-2">Band Score</div>
                    </div>
                    {[
                      { range: "39–40", band: "9.0" },
                      { range: "37–38", band: "8.5" },
                      { range: "35–36", band: "8.0" },
                      { range: "32–34", band: "7.5" },
                      { range: "30–31", band: "7.0" },
                      { range: "26–29", band: "6.5" },
                      { range: "23–25", band: "6.0" },
                      { range: "18–22", band: "5.5" },
                      { range: "16–17", band: "5.0" },
                      { range: "13–15", band: "4.5" },
                      { range: "11–12", band: "4.0" },
                      { range: "8–10", band: "3.5" },
                      { range: "6–7", band: "3.0" },
                    ].map((row) => (
                      <div
                        key={row.range}
                        className="grid grid-cols-2 text-xs border-b last:border-b-0"
                      >
                        <div className="px-2 py-1.5">{row.range}</div>
                        <div className="px-2 py-1.5">{row.band}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                size="sm"
                className="h-8 px-3"
                onClick={() => setIsGradeCalcOpen(false)}
              >
                Done
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button
          size="sm"
          variant="outline"
          className="text-xs h-7 px-2"
          onClick={() => setIsDetailedView((v) => !v)}
        >
          {isDetailedView ? "Simple view" : "Detailed view"}
        </Button>
      </div>

      {isDetailedView ? (
        <>
          {/* Grading Summary & Controls */}
          <div className="bg-background/60 rounded-lg border border-border/40 p-3 md:p-4 space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h4 className="text-sm sm:text-base font-medium text-foreground">
                Grading Control Panel
              </h4>
            </div>
            {/* Statistics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
              <div className="text-center p-1.5 sm:p-2 bg-muted/30 rounded">
                <div className="font-semibold text-foreground">
                  {calculateStats.total}
                </div>
                <div className="text-muted-foreground">Total</div>
              </div>
              <div className="text-center p-1.5 sm:p-2 bg-green-50 dark:bg-green-950/30 rounded">
                <div className="font-semibold text-foreground">
                  {calculateStats.correct}
                </div>
                <div className="text-muted-foreground">Correct</div>
              </div>
              <div className="text-center p-1.5 sm:p-2 bg-red-50 dark:bg-red-950/30 rounded">
                <div className="font-semibold text-foreground">
                  {calculateStats.incorrect}
                </div>
                <div className="text-muted-foreground">Incorrect</div>
              </div>
              <div className="text-center p-1.5 sm:p-2 bg-yellow-50 dark:bg-yellow-950/30 rounded">
                <div className="font-semibold text-foreground">
                  {calculateStats.unanswered}
                </div>
                <div className="text-muted-foreground">Unanswered</div>
              </div>
              <div className="text-center p-1.5 sm:p-2 bg-blue-50 dark:bg-blue-950/30 rounded">
                <div className="font-semibold text-foreground">
                  {calculateStats.manuallyGraded}
                </div>
                <div className="text-muted-foreground">Manual</div>
              </div>
              <div className="text-center p-1.5 sm:p-2 bg-purple-50 dark:bg-purple-950/30 rounded">
                <div className="font-semibold text-foreground">
                  {Math.round(
                    (calculateStats.correct / calculateStats.total) * 100
                  )}
                  %
                </div>
                <div className="text-muted-foreground">Score</div>
              </div>
            </div>

            {/* Bulk Grading Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="text-xs text-muted-foreground">
                Quick Actions:
              </div>
              <div className="flex flex-wrap items-center gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => bulkGrade("correct")}
                  className="text-xs h-6 px-2"
                >
                  All Correct
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => bulkGrade("incorrect")}
                  className="text-xs h-6 px-2"
                >
                  All Incorrect
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => bulkGrade("auto")}
                  className="text-xs h-6 px-2"
                >
                  Reset Auto
                </Button>
              </div>
            </div>
          </div>

          {/* Test Overview */}
          <div className="bg-muted/50 rounded-md p-2 sm:p-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <h3 className="text-xs sm:text-sm font-medium text-foreground">
                Listening Test Details
              </h3>
              <Badge variant="outline" className="text-xs h-5 w-fit">
                {totalQuestions} Questions
              </Badge>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
              <div className="flex items-center space-x-1">
                <Volume2 className="h-3 w-3 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">
                  {audioStats.length} sections
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">~30 min</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-3 w-3 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">
                  {calculateStats.answered}/{calculateStats.total} answered
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-3 w-3 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">
                  Auto: {calculateStats.total - calculateStats.manuallyGraded}
                </span>
              </div>
            </div>
          </div>

          {/* Audio Sections */}
          {numberedSections.map((section, sectionIndex) => {
            const audioStat = audioStats[sectionIndex];

            // Calculate section stats with manual grading
            const sectionStats = () => {
              let correct = 0;
              let answered = 0;
              let total = 0;

              section.questions.forEach((questionGroup) => {
                questionGroup.questions?.forEach(
                  (question: QuestionWithNumber) => {
                    total++;
                    const questionNumber = getQuestionNumber(question);
                    const userAnswer = userAnswerMap.get(questionNumber) || "";

                    if (userAnswer.trim()) {
                      answered++;
                      const finalStatus = getFinalGradeStatus(questionNumber);
                      if (finalStatus === "correct") {
                        correct++;
                      }
                    }
                  }
                );
              });

              return { correct, answered, total };
            };

            const sectionStat = sectionStats();

            return (
              <div
                key={sectionIndex}
                className="bg-background/40 rounded-lg border border-border/30"
              >
                <div className="p-3 md:p-4 pb-2 md:pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h4 className="text-sm sm:text-base text-foreground font-medium">
                      Section {sectionIndex + 1}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs h-5">
                        Q{audioStat.questionRange}
                      </Badge>
                      <Badge variant="outline" className="text-xs h-5">
                        {sectionStat.correct}/{sectionStat.total}
                      </Badge>
                    </div>
                  </div>

                  {section.audio && (
                    <div className="flex items-center space-x-2 mt-2 p-1.5 sm:p-2 bg-muted/50 rounded text-xs">
                      <Play className="h-3 w-3 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {section.audio.title}
                        </p>
                        <p className="text-muted-foreground">
                          {section.audio.difficulty}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs h-5 shrink-0">
                        Audio
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="px-3 md:px-4 pb-3 md:pb-4">
                  <div className="h-px bg-border/30 mb-2 sm:mb-3" />

                  <div className="space-y-3 sm:space-y-4">
                    {section.questions.map((questionGroup, groupIndex) =>
                      renderQuestionGroup(
                        questionGroup,
                        sectionIndex,
                        groupIndex
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <div className="rounded-lg border border-border/40">
          <div className="max-h-[70vh] overflow-auto">
            <div className="grid grid-cols-[60px_1fr_1fr] sticky top-0 z-10 bg-background text-xs font-medium text-foreground border-b border-border/40">
              <div className="px-2 py-2">Q#</div>
              <div className="px-2 py-2">Correct</div>
              <div className="px-2 py-2">Student</div>
            </div>
            <div className="divide-y divide-border/30">
              {simpleRows.map((row) => (
                <div
                  key={row.questionNumber}
                  className="grid grid-cols-[60px_1fr_1fr] text-xs"
                >
                  <div className="px-2 py-1.5 text-center">
                    <span className="inline-flex items-center justify-center rounded-md bg-muted/40 px-2 h-6 font-medium">
                      Q{row.questionNumber}
                    </span>
                  </div>
                  <div
                    className="px-2 py-1.5 text-muted-foreground whitespace-pre-wrap break-words font-mono min-w-0"
                    title={row.correctAnswer}
                  >
                    {row.correctAnswer || "-"}
                  </div>
                  <div
                    className={`px-2 py-1.5 whitespace-pre-wrap break-words font-mono min-w-0 rounded-sm ${
                      row.status === "correct"
                        ? "bg-green-50 dark:bg-green-950/25 text-green-700 dark:text-green-300"
                        : row.status === "incorrect"
                        ? "bg-red-50 dark:bg-red-950/25 text-red-700 dark:text-red-300"
                        : "bg-muted/30 text-muted-foreground"
                    }`}
                    title={row.studentAnswer}
                  >
                    {row.studentAnswer || "-"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
