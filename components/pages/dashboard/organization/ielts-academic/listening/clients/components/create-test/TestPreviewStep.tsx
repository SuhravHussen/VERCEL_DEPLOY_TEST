"use client";

import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { StepperContext } from "./StepperContext";
import { TestPreviewStepProps } from "./types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { addListeningQuestionNumbering } from "@/lib/addListeningQuestionNumbering";
import {
  Headphones,
  Clock,
  FileText,
  BarChart2,
  CheckCircle2,
  AlertCircle,
  FileQuestion,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { IELTSListeningTestSection } from "@/types/exam/ielts-academic/listening/listening";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function TestPreviewStep({
  formData,
  onSave,
  isSaving,
}: TestPreviewStepProps) {
  const context = useContext(StepperContext);
  const [openSections, setOpenSections] = useState<string>("section-0");

  const sections = [
    formData.section_one,
    formData.section_two,
    formData.section_three,
    formData.section_four,
  ].filter((section): section is IELTSListeningTestSection => section !== null);

  const { totalQuestions, audioStats } =
    addListeningQuestionNumbering(sections);

  const handlePrevious = () => {
    context?.stepperRef.current?.prevStep();
  };

  const isComplete = sections.length === 4 && totalQuestions >= 40;

  // Calculate question type distribution
  const questionTypeCounts: Record<string, number> = {};

  // Aggregate question types from all audio stats
  audioStats.forEach((stat) => {
    if (stat.questionTypes) {
      Object.entries(stat.questionTypes).forEach(([type, count]) => {
        questionTypeCounts[type] =
          (questionTypeCounts[type] || 0) + (count as number);
      });
    }
  });

  // Sort question types by count
  const questionTypeEntries = Object.entries(questionTypeCounts).sort(
    (a, b) => b[1] - a[1]
  );

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6">
      <div className="grid gap-6">
        <Card className="border-none shadow-none bg-transparent">
          <CardContent className="p-0">
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-2xl font-semibold truncate">
                  {formData.title}
                </h2>
                <Badge
                  variant={isComplete ? "outline" : "destructive"}
                  className="flex items-center gap-1"
                >
                  {isComplete ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      Complete
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3.5 w-3.5 mr-1" />
                      Incomplete
                    </>
                  )}
                </Badge>
              </div>

              <p className="text-muted-foreground">
                {formData.description || "No description provided"}
              </p>

              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{formData.timeLimit} minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileQuestion className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{totalQuestions} questions</span>
                </div>
                <div>
                  <Badge
                    variant={
                      formData.difficulty === "easy"
                        ? "secondary"
                        : formData.difficulty === "medium"
                        ? "outline"
                        : "destructive"
                    }
                    className="capitalize"
                  >
                    {formData.difficulty}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Desktop Table View (hidden on small screens) */}
        <Card className="hidden md:block">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Headphones className="h-5 w-5 text-primary" />
              <CardTitle>Test Contents</CardTitle>
            </div>
            <CardDescription>
              Preview of the listening test sections
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 sm:px-6">
            <div className="overflow-x-auto -mx-6 sm:mx-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Section</TableHead>
                    <TableHead className="min-w-[180px]">Audio</TableHead>
                    <TableHead className="w-[100px]">Difficulty</TableHead>
                    <TableHead className="w-[100px] text-center">
                      Questions
                    </TableHead>
                    <TableHead className="w-[140px]">Question Range</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {audioStats.map((stat, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        Section {index + 1}
                      </TableCell>
                      <TableCell className="flex items-center gap-2">
                        <Headphones className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{stat.audioTitle}</span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            stat.difficulty === "easy"
                              ? "secondary"
                              : stat.difficulty === "medium"
                              ? "outline"
                              : "destructive"
                          }
                          className="capitalize whitespace-nowrap"
                        >
                          {stat.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {stat.questionCount}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {stat.questionRange}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Card View (shown only on small screens) */}
        <div className="md:hidden">
          <div className="flex items-center gap-2 mb-4">
            <Headphones className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Test Contents</h3>
          </div>

          <Accordion
            type="single"
            defaultValue="section-0"
            value={openSections}
            onValueChange={setOpenSections}
            className="space-y-2"
          >
            {audioStats.map((stat, index) => (
              <AccordionItem
                key={index}
                value={`section-${index}`}
                className="border rounded-md border-border overflow-hidden bg-card"
              >
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-accent/50">
                  <div className="flex items-center gap-2">
                    <Badge className="h-6 w-6 rounded-full flex items-center justify-center p-0">
                      {index + 1}
                    </Badge>
                    <span className="font-medium">Section {index + 1}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="border-t px-4 pb-3 pt-3">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Headphones className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm">{stat.audioTitle}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            stat.difficulty === "easy"
                              ? "secondary"
                              : stat.difficulty === "medium"
                              ? "outline"
                              : "destructive"
                          }
                          className="capitalize whitespace-nowrap"
                        >
                          {stat.difficulty}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2">
                        <FileQuestion className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {stat.questionCount} questions ({stat.questionRange})
                        </span>
                      </div>
                    </div>

                    {stat.questionTypes &&
                      Object.entries(stat.questionTypes).length > 0 && (
                        <div className="pt-1">
                          <p className="text-xs text-muted-foreground mb-1.5">
                            Question Types:
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {Object.entries(stat.questionTypes).map(
                              ([type, count]) => (
                                <TooltipProvider key={type}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {formatQuestionType(type)} ({count})
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{formatQuestionTypeFullName(type)}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Question Types Distribution Card */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-primary" />
                <CardTitle>Question Types</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {questionTypeEntries.map(([type, count]) => (
                  <TooltipProvider key={type}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1 px-2 py-1"
                        >
                          {formatQuestionType(type)}
                          <span className="ml-1.5 bg-muted rounded-full px-1.5 py-0.5 text-xs font-medium">
                            {count}
                          </span>
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{formatQuestionTypeFullName(type)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
              {questionTypeEntries.length === 0 && (
                <p className="text-muted-foreground text-sm">
                  No question types available
                </p>
              )}
            </CardContent>
          </Card>

          {/* Instructions Card */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle>Instructions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {formData.instructions ? (
                <p className="text-sm whitespace-pre-line">
                  {formData.instructions}
                </p>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No instructions provided
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border-t border-border mt-4">
          <CardFooter className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 sm:p-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="w-full sm:w-auto"
            >
              Back
            </Button>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {!isComplete && (
                <p className="text-destructive text-xs sm:text-sm text-center sm:mr-4">
                  Please ensure all 4 sections are complete
                </p>
              )}
              <Button
                onClick={onSave}
                disabled={isSaving || !isComplete}
                className="w-full sm:w-auto"
              >
                {isSaving ? "Creating test..." : "Create Test"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

// Helper function to format question type for display
function formatQuestionType(type: string): string {
  const typeMap: Record<string, string> = {
    multiple_choice: "MC",
    multiple_choice_multiple_answers: "MCMA",
    sentence_completion: "SC",
    form_completion: "FC",
    note_completion: "NC",
    table_completion: "TC",
    flow_chart_completion: "FCC",
    diagram_label_completion: "DLC",
    matching: "Match",
    short_answer: "SA",
  };

  return typeMap[type] || type;
}

// Helper function to get full question type name
function formatQuestionTypeFullName(type: string): string {
  const typeMap: Record<string, string> = {
    multiple_choice: "Multiple Choice",
    multiple_choice_multiple_answers: "Multiple Choice (Multiple Answers)",
    sentence_completion: "Sentence Completion",
    form_completion: "Form Completion",
    note_completion: "Note Completion",
    table_completion: "Table Completion",
    flow_chart_completion: "Flow Chart Completion",
    diagram_label_completion: "Diagram Label Completion",
    matching: "Matching",
    short_answer: "Short Answer",
  };

  return typeMap[type] || type;
}
