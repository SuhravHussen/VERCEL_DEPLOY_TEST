"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PenTool, Clock, Type, CheckCircle } from "lucide-react";
import { IELTSWritingTest } from "@/types/exam/ielts-academic/writing/writing";
import { WritingSubmission, SectionGrade } from "@/types/exam/exam-submission";

interface WritingGradingRendererNewProps {
  test: IELTSWritingTest;
  userSubmission: WritingSubmission;
  existingGrades?: {
    task_1?: SectionGrade;
    task_2?: SectionGrade;
    overall?: SectionGrade;
  };
  onGradesChange?: (grades: WritingGradeData) => void;
}

export interface WritingGradeData {
  // Task 1 criteria
  task_1_achievement?: number;
  task_1_coherence_cohesion?: number;
  task_1_lexical_resource?: number;
  task_1_grammatical_range?: number;
  task_1_feedback?: string;
  task_1_band_score?: number;

  // Task 2 criteria
  task_2_achievement?: number;
  task_2_coherence_cohesion?: number;
  task_2_lexical_resource?: number;
  task_2_grammatical_range?: number;
  task_2_feedback?: string;
  task_2_band_score?: number;

  // Overall
  overall_band_score?: number;
  overall_feedback?: string;
}

export default function WritingGradingRendererNew({
  userSubmission,
  existingGrades,
  onGradesChange,
}: WritingGradingRendererNewProps) {
  // Task 1 states
  const [task1Achievement, setTask1Achievement] = useState<string>("");
  const [task1Coherence, setTask1Coherence] = useState<string>("");
  const [task1Lexical, setTask1Lexical] = useState<string>("");
  const [task1Grammar, setTask1Grammar] = useState<string>("");
  const [task1Feedback, setTask1Feedback] = useState<string>("");
  const [task1BandScore, setTask1BandScore] = useState<string>("");

  // Task 2 states
  const [task2Achievement, setTask2Achievement] = useState<string>("");
  const [task2Coherence, setTask2Coherence] = useState<string>("");
  const [task2Lexical, setTask2Lexical] = useState<string>("");
  const [task2Grammar, setTask2Grammar] = useState<string>("");
  const [task2Feedback, setTask2Feedback] = useState<string>("");
  const [task2BandScore, setTask2BandScore] = useState<string>("");

  // Overall states
  const [overallBandScore, setOverallBandScore] = useState<string>("");
  const [overallFeedback, setOverallFeedback] = useState<string>("");

  // Prefill from existing grades
  useEffect(() => {
    if (existingGrades?.task_1) {
      const t1 = existingGrades.task_1;
      setTask1Achievement(t1.task_achievement?.toString() || "");
      setTask1Coherence(t1.coherence_and_cohesion?.toString() || "");
      setTask1Lexical(t1.lexical_resource?.toString() || "");
      setTask1Grammar(t1.grammatical_range_and_accuracy?.toString() || "");
      setTask1Feedback(t1.feedback || "");
      setTask1BandScore(t1.band_score?.toString() || "");
    }

    if (existingGrades?.task_2) {
      const t2 = existingGrades.task_2;
      setTask2Achievement(t2.task_achievement?.toString() || "");
      setTask2Coherence(t2.coherence_and_cohesion?.toString() || "");
      setTask2Lexical(t2.lexical_resource?.toString() || "");
      setTask2Grammar(t2.grammatical_range_and_accuracy?.toString() || "");
      setTask2Feedback(t2.feedback || "");
      setTask2BandScore(t2.band_score?.toString() || "");
    }

    if (existingGrades?.overall) {
      const overall = existingGrades.overall;
      setOverallBandScore(overall.band_score?.toString() || "");
      setOverallFeedback(overall.feedback || "");
    }
  }, [existingGrades]);

  // Calculate task band scores automatically
  useEffect(() => {
    const scores1 = [
      task1Achievement,
      task1Coherence,
      task1Lexical,
      task1Grammar,
    ];
    const validScores1 = scores1.filter((s) => s && !isNaN(parseFloat(s)));

    if (validScores1.length === 4) {
      const average1 =
        validScores1.reduce((sum, score) => sum + parseFloat(score), 0) / 4;
      const rounded1 = Math.round(average1 * 2) / 2;
      setTask1BandScore(rounded1.toString());
    }
  }, [task1Achievement, task1Coherence, task1Lexical, task1Grammar]);

  useEffect(() => {
    const scores2 = [
      task2Achievement,
      task2Coherence,
      task2Lexical,
      task2Grammar,
    ];
    const validScores2 = scores2.filter((s) => s && !isNaN(parseFloat(s)));

    if (validScores2.length === 4) {
      const average2 =
        validScores2.reduce((sum, score) => sum + parseFloat(score), 0) / 4;
      const rounded2 = Math.round(average2 * 2) / 2;
      setTask2BandScore(rounded2.toString());
    }
  }, [task2Achievement, task2Coherence, task2Lexical, task2Grammar]);

  // Calculate overall band score (Task 1: 33%, Task 2: 67%)
  useEffect(() => {
    if (task1BandScore && task2BandScore) {
      const t1Score = parseFloat(task1BandScore);
      const t2Score = parseFloat(task2BandScore);
      const overall = Math.round((t1Score * 0.33 + t2Score * 0.67) * 2) / 2;
      setOverallBandScore(overall.toString());
    }
  }, [task1BandScore, task2BandScore]);

  // Notify parent of changes
  useEffect(() => {
    const gradeData: WritingGradeData = {
      task_1_achievement: task1Achievement
        ? parseFloat(task1Achievement)
        : undefined,
      task_1_coherence_cohesion: task1Coherence
        ? parseFloat(task1Coherence)
        : undefined,
      task_1_lexical_resource: task1Lexical
        ? parseFloat(task1Lexical)
        : undefined,
      task_1_grammatical_range: task1Grammar
        ? parseFloat(task1Grammar)
        : undefined,
      task_1_feedback: task1Feedback || undefined,
      task_1_band_score: task1BandScore
        ? parseFloat(task1BandScore)
        : undefined,

      task_2_achievement: task2Achievement
        ? parseFloat(task2Achievement)
        : undefined,
      task_2_coherence_cohesion: task2Coherence
        ? parseFloat(task2Coherence)
        : undefined,
      task_2_lexical_resource: task2Lexical
        ? parseFloat(task2Lexical)
        : undefined,
      task_2_grammatical_range: task2Grammar
        ? parseFloat(task2Grammar)
        : undefined,
      task_2_feedback: task2Feedback || undefined,
      task_2_band_score: task2BandScore
        ? parseFloat(task2BandScore)
        : undefined,

      overall_band_score: overallBandScore
        ? parseFloat(overallBandScore)
        : undefined,
      overall_feedback: overallFeedback || undefined,
    };

    onGradesChange?.(gradeData);
  }, [
    task1Achievement,
    task1Coherence,
    task1Lexical,
    task1Grammar,
    task1Feedback,
    task1BandScore,
    task2Achievement,
    task2Coherence,
    task2Lexical,
    task2Grammar,
    task2Feedback,
    task2BandScore,
    overallBandScore,
    overallFeedback,
    onGradesChange,
  ]);

  return (
    <div className="space-y-6">
      {/* Task 1 Grading */}
      <TaskGradingCard
        taskNumber={1}
        userTask={userSubmission.task_1}
        achievement={task1Achievement}
        setAchievement={setTask1Achievement}
        coherence={task1Coherence}
        setCoherence={setTask1Coherence}
        lexical={task1Lexical}
        setLexical={setTask1Lexical}
        grammar={task1Grammar}
        setGrammar={setTask1Grammar}
        feedback={task1Feedback}
        setFeedback={setTask1Feedback}
        bandScore={task1BandScore}
      />

      {/* Task 2 Grading */}
      <TaskGradingCard
        taskNumber={2}
        userTask={userSubmission.task_2}
        achievement={task2Achievement}
        setAchievement={setTask2Achievement}
        coherence={task2Coherence}
        setCoherence={setTask2Coherence}
        lexical={task2Lexical}
        setLexical={setTask2Lexical}
        grammar={task2Grammar}
        setGrammar={setTask2Grammar}
        feedback={task2Feedback}
        setFeedback={setTask2Feedback}
        bandScore={task2BandScore}
      />

      {/* Section Grading - Now at the bottom with improved UI */}
      <Card
        className="border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20"
        style={{ borderWidth: "2px" }}
      >
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <span className="text-green-800 dark:text-green-200">
                Section Grading
              </span>
              <p className="text-sm font-normal text-green-600 dark:text-green-400 mt-1">
                Overall writing performance assessment
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Performance Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white/80 dark:bg-gray-800/50 rounded-xl border border-green-200/50 shadow-sm">
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                {overallBandScore || "—"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Overall Band Score
              </div>
            </div>
            <div className="text-center p-4 bg-blue-50/80 dark:bg-blue-950/30 rounded-xl border border-blue-200/50 shadow-sm">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {task1BandScore || "—"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Task 1 (33%)
              </div>
            </div>
            <div className="text-center p-4 bg-purple-50/80 dark:bg-purple-950/30 rounded-xl border border-purple-200/50 shadow-sm">
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {task2BandScore || "—"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Task 2 (67%)
              </div>
            </div>
          </div>

          {/* Overall Feedback Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-1 w-8 bg-green-400 rounded-full"></div>
              <Label className="text-sm font-semibold text-green-800 dark:text-green-200">
                Overall Writing Feedback
              </Label>
            </div>
            <div className="bg-white/60 dark:bg-gray-800/30 rounded-lg border border-green-200/50 p-4">
              <Textarea
                value={overallFeedback}
                onChange={(e) => setOverallFeedback(e.target.value)}
                placeholder="Provide comprehensive feedback on the overall writing performance, considering both tasks and the candidate's ability to communicate effectively in written English..."
                className="min-h-[100px] text-sm resize-none border-0 bg-transparent focus:ring-green-300 dark:focus:ring-green-600"
              />
            </div>
          </div>

          {/* Band Score Calculation Info */}
          <div className="bg-green-50/50 dark:bg-green-950/20 rounded-lg p-4 border border-green-200/50">
            <div className="flex items-start gap-3">
              <div className="p-1 rounded-md bg-green-200 dark:bg-green-800">
                <CheckCircle className="h-3 w-3 text-green-700 dark:text-green-300" />
              </div>
              <div className="text-xs text-green-700 dark:text-green-300">
                <p className="font-medium mb-1">Band Score Calculation</p>
                <p>
                  The overall band score is automatically calculated as:{" "}
                  <span className="font-mono">Task 1 × 33% + Task 2 × 67%</span>
                </p>
                <p className="mt-1">
                  Individual task scores are averaged from the four assessment
                  criteria.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Task Grading Card Component
const TaskGradingCard = ({
  taskNumber,
  userTask,
  achievement,
  setAchievement,
  coherence,
  setCoherence,
  lexical,
  setLexical,
  grammar,
  setGrammar,
  feedback,
  setFeedback,
  bandScore,
}: {
  taskNumber: 1 | 2;
  userTask?: { content: string; word_count: number; time_spent: number };
  achievement: string;
  setAchievement: (value: string) => void;
  coherence: string;
  setCoherence: (value: string) => void;
  lexical: string;
  setLexical: (value: string) => void;
  grammar: string;
  setGrammar: (value: string) => void;
  feedback: string;
  setFeedback: (value: string) => void;
  bandScore: string;
}) => {
  if (!userTask) {
    return (
      <Card className="border-border/50">
        <CardContent className="py-8 text-center text-muted-foreground">
          <PenTool className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Task {taskNumber} not available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <PenTool className="h-4 w-4 text-purple-600" />
            Task {taskNumber} Grading
            {bandScore && (
              <Badge variant="outline" className="ml-2 text-xs">
                Band: {parseFloat(bandScore).toFixed(1)}
              </Badge>
            )}
          </span>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Type className="h-3 w-3" />
            {userTask.word_count} words
            <Clock className="h-3 w-3 ml-2" />
            {Math.floor(userTask.time_spent / 60)}m {userTask.time_spent % 60}s
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Student's Response */}
        <div className="p-3 bg-muted/50 rounded-lg border">
          <div className="text-xs font-medium mb-2 text-muted-foreground">
            Student&apos;s Response:
          </div>
          <div className="text-sm whitespace-pre-wrap text-foreground max-h-48 overflow-y-auto">
            {userTask.content}
          </div>
        </div>

        {/* Grading Criteria */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">
            Grading Criteria (Band Score 1-9)
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CriteriaInput
              label="Task Achievement/Response"
              value={achievement}
              onChange={setAchievement}
            />
            <CriteriaInput
              label="Coherence & Cohesion"
              value={coherence}
              onChange={setCoherence}
            />
            <CriteriaInput
              label="Lexical Resource"
              value={lexical}
              onChange={setLexical}
            />
            <CriteriaInput
              label="Grammatical Range & Accuracy"
              value={grammar}
              onChange={setGrammar}
            />
          </div>

          {/* Task Feedback */}
          <div className="space-y-2">
            <Label className="text-xs">Task {taskNumber} Feedback</Label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={`Detailed feedback for Task ${taskNumber}...`}
              className="min-h-[80px] text-sm resize-none"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Criteria Input Component
const CriteriaInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="space-y-2">
    <Label className="text-xs">{label}</Label>
    <Input
      type="number"
      min="1"
      max="9"
      step="0.5"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="0.0"
      className="text-sm"
    />
  </div>
);
