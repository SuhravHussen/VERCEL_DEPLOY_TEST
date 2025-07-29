import React, { useContext, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TestPreviewStepProps, IELTSReadingTestSection } from "./types";
import { StepperContext } from "./StepperContext";
import { addQuestionNumbering } from "@/lib/addQuestionNumbering";
import { PieChart, BarChart } from "lucide-react";

// Define the type for passage stats from the addQuestionNumbering function
interface PassageStat {
  passageNumber: number;
  passageTitle: string;
  difficulty: string;
  questionCount: number;
  questionRange: string;
  questionTypes: Record<string, number>;
}

export function TestPreviewStep({
  formData,
  onSave,
  isSaving,
  isEditing = false,
}: TestPreviewStepProps) {
  const { stepperRef } = useContext(StepperContext);

  const handlePrev = () => {
    if (stepperRef.current) {
      stepperRef.current.prevStep();
    }
  };

  // Get detailed stats using addQuestionNumbering function
  const testStats = useMemo(() => {
    const sections = [
      formData.section_one,
      formData.section_two,
      formData.section_three,
    ].filter(Boolean) as IELTSReadingTestSection[];

    return addQuestionNumbering(sections);
  }, [formData]);

  const getDifficultyLabel = (difficulty: string) => {
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-200";
      case "medium":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "hard":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  // Preview Section component for each section
  const PreviewSection = ({
    section,
    sectionData,
    sectionStats,
  }: {
    section: number;
    sectionData: IELTSReadingTestSection | null;
    sectionStats: PassageStat | undefined;
  }) => {
    if (!sectionData) return null;

    return (
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
          <div>
            <h4 className="font-medium text-base">
              Section {section}: {sectionData.passage?.title}
            </h4>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge
                className={`${getDifficultyColor(
                  sectionData.passage?.difficulty || "medium"
                )} border`}
              >
                {getDifficultyLabel(
                  sectionData.passage?.difficulty || "medium"
                )}
              </Badge>

              {sectionStats && (
                <Badge variant="outline">
                  Questions {sectionStats.questionRange}
                </Badge>
              )}
            </div>
          </div>

          <div className="text-xs text-muted-foreground mt-2 md:mt-0 md:text-right">
            {sectionStats && (
              <div className="space-y-1">
                <p className="font-medium">Question types:</p>
                {Object.entries(sectionStats.questionTypes).map(
                  ([type, count]) => (
                    <div key={type} className="flex justify-between gap-2">
                      <span>{type.replace(/_/g, " ")}:</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 line-clamp-2 text-sm text-muted-foreground">
          {sectionData.passage?.content && (
            <div
              dangerouslySetInnerHTML={{
                __html: sectionData.passage.content.substring(0, 150) + "...",
              }}
            />
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-lg font-semibold">Test Preview</h2>
        <div className="flex flex-wrap gap-2">
          <Badge
            className={`${getDifficultyColor(formData.difficulty)} border`}
          >
            {getDifficultyLabel(formData.difficulty)}
          </Badge>
          <Badge variant="outline">
            {testStats.totalQuestions || 0} Questions
          </Badge>
          <Badge variant="outline">{formData.timeLimit} Minutes</Badge>
        </div>
      </div>

      <Card className="p-4 md:p-6">
        <h2 className="text-xl font-bold mb-2">{formData.title}</h2>
        {formData.description && (
          <p className="text-muted-foreground mb-4 text-sm">
            {formData.description}
          </p>
        )}

        {formData.instructions && (
          <div className="bg-muted/30 p-3 md:p-4 rounded-md mb-6">
            <h3 className="font-medium mb-1">Instructions</h3>
            <p className="text-sm">{formData.instructions}</p>
          </div>
        )}

        {testStats.summary && testStats.summary.totalPassages > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Overall</h4>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Total Questions:
                  </span>
                  <span className="font-medium">
                    {testStats.totalQuestions}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Avg. Questions/Passage:
                  </span>
                  <span className="font-medium">
                    {testStats.summary.averageQuestionsPerPassage}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Difficulty</h4>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="mt-2 space-y-2">
                {Object.entries(testStats.summary.difficultyBreakdown).map(
                  ([difficulty, count]) => (
                    <div
                      key={difficulty}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-muted-foreground">
                        {getDifficultyLabel(difficulty)}:
                      </span>
                      <span className="font-medium">
                        {count} passage{count !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )
                )}
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Time</h4>
                <div className="flex items-center text-sm font-medium">
                  <span>
                    {Math.round(
                      (formData.timeLimit / testStats.totalQuestions) * 10
                    ) / 10}
                  </span>
                  <span className="text-muted-foreground text-xs ml-1">
                    min/question
                  </span>
                </div>
              </div>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Time Limit:</span>
                  <span className="font-medium">{formData.timeLimit} min</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Recommended:</span>
                  <span className="font-medium">60 min</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        <div className="space-y-6">
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Test Sections</h3>

            <div className="space-y-4">
              <PreviewSection
                section={1}
                sectionData={formData.section_one}
                sectionStats={
                  testStats.passageStats && testStats.passageStats[0]
                }
              />
              <PreviewSection
                section={2}
                sectionData={formData.section_two}
                sectionStats={
                  testStats.passageStats && testStats.passageStats[1]
                }
              />
              <PreviewSection
                section={3}
                sectionData={formData.section_three}
                sectionStats={
                  testStats.passageStats && testStats.passageStats[2]
                }
              />
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-between">
        <Button onClick={handlePrev} variant="outline">
          Back
        </Button>
        <Button
          onClick={onSave}
          disabled={
            isSaving ||
            !formData.section_one ||
            !formData.section_two ||
            !formData.section_three
          }
        >
          {isSaving
            ? isEditing
              ? "Updating..."
              : "Creating..."
            : isEditing
            ? "Update Test"
            : "Create Test"}
        </Button>
      </div>
    </div>
  );
}
