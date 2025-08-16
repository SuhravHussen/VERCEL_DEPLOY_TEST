"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { IELTSReadingTest } from "@/types/exam/ielts-academic/reading/test/test";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useToasts } from "@/components/ui/toast";
import {
  getDifficultyColor,
  getDifficultyLabel,
  formatDate,
} from "../utils/testHelpers";
import { addQuestionNumbering } from "@/lib/addQuestionNumbering";
import { BookOpen, Clock, BarChart, Edit, Trash2 } from "lucide-react";
import { useDeleteIeltsReadingTest } from "@/hooks/organization/ielts-academic/reading/use-delete-ielts-reading-test";

interface TestCardProps {
  test: IELTSReadingTest;
  isSelected: boolean;
  onSelect: (test: IELTSReadingTest) => void;
  layout?: "grid" | "list";
  organizationSlug: string;
}

export function TestCard({
  test,
  isSelected,
  onSelect,
  layout = "grid",
  organizationSlug,
}: TestCardProps) {
  const { success, error } = useToasts();
  const deleteTest = useDeleteIeltsReadingTest();
  const { ConfirmationDialog, showConfirmation } = useConfirmationDialog();

  // Calculate accurate question count using addQuestionNumbering
  const testStats = useMemo(() => {
    const sections = [
      test.section_one,
      test.section_two,
      test.section_three,
    ].filter(Boolean);

    return addQuestionNumbering(sections);
  }, [test]);

  const handleDelete = () => {
    showConfirmation({
      title: "Delete Test",
      description: `Are you sure you want to delete "${test.title}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
      onConfirm: async () => {
        try {
          await deleteTest.mutateAsync(test.id);
          success("Test deleted successfully");
        } catch (err) {
          console.error("Failed to delete test:", err);
          error("Failed to delete test. Please try again.");
        }
      },
    });
  };

  const totalQuestions = testStats.totalQuestions;
  const sectionCount = [
    test.section_one,
    test.section_two,
    test.section_three,
  ].filter(Boolean).length;

  if (layout === "grid") {
    return (
      <>
        <Card
          className={`group hover:shadow-lg transition-all duration-300 ${
            isSelected
              ? "ring-2 ring-primary shadow-md"
              : "hover:border-primary/50"
          } cursor-pointer`}
          onClick={() => onSelect(test)}
        >
          <CardContent className="p-5">
            <div className="flex flex-col h-full">
              <div className="mb-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
                    {test.title}
                  </h3>
                  <Badge
                    variant="secondary"
                    className="capitalize ml-2 shrink-0"
                  >
                    {test.status || "Draft"}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm line-clamp-2 mt-1.5">
                  {test.description || "No description provided"}
                </p>
              </div>

              <div className="mt-auto">
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center text-muted-foreground">
                      <BarChart className="h-3.5 w-3.5 mr-1.5" />
                      <span className="text-xs">Difficulty</span>
                    </div>
                    <Badge
                      variant="outline"
                      className={`${getDifficultyColor(
                        test.difficulty
                      )} w-fit text-xs`}
                    >
                      {getDifficultyLabel(test.difficulty)}
                    </Badge>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center text-muted-foreground">
                      <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                      <span className="text-xs">Sections</span>
                    </div>
                    <span className="font-medium text-sm">
                      {sectionCount}{" "}
                      {sectionCount === 1 ? "passage" : "passages"}
                    </span>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 mr-1.5" />
                      <span className="text-xs">Time</span>
                    </div>
                    <span className="font-medium text-sm">
                      {test.timeLimit || 60} min
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t pt-3 mt-1">
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2">
                      {totalQuestions} Questions
                    </Badge>
                    {testStats.summary?.averageQuestionsPerPassage > 0 && (
                      <span className="text-xs text-muted-foreground">
                        ~{testStats.summary.averageQuestionsPerPassage}/section
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-7 px-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Link
                              href={`/dashboard/organization/${organizationSlug}/ielts/reading/tests/${test.id}/edit`}
                            >
                              <Edit className="h-3 w-3" />
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit Test</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete();
                            }}
                            disabled={deleteTest.isPending}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete Test</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(test.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <ConfirmationDialog />
      </>
    );
  }

  return (
    <>
      <Card
        className={`group hover:shadow-lg transition-all duration-300 ${
          isSelected
            ? "ring-2 ring-primary shadow-md"
            : "hover:border-primary/50"
        } cursor-pointer`}
        onClick={() => onSelect(test)}
      >
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3">
            <div className="flex-1 space-y-2.5">
              <div className="flex flex-wrap gap-2 justify-between">
                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                  {test.title}
                </h3>
                <Badge variant="secondary" className="capitalize shrink-0">
                  {test.status || "Draft"}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">
                {test.description || "No description provided"}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className={`${getDifficultyColor(test.difficulty)}`}
                >
                  {getDifficultyLabel(test.difficulty)}
                </Badge>
                <Badge variant="outline">{totalQuestions} Questions</Badge>
                <Badge variant="outline">
                  {sectionCount} {sectionCount === 1 ? "Passage" : "Passages"}
                </Badge>
                <Badge variant="outline">{test.timeLimit || 60} Minutes</Badge>
              </div>
            </div>

            <div className="shrink-0 border-l pl-4 hidden sm:block">
              <div className="text-right space-y-1">
                <div className="flex justify-end gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 mb-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Link
                            href={`/dashboard/organization/${organizationSlug}/ielts/reading/tests/${test.id}/edit`}
                          >
                            <Edit className="h-3 w-3" />
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit Test</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 mb-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete();
                          }}
                          disabled={deleteTest.isPending}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete Test</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-sm text-muted-foreground">
                  Created: {formatDate(test.createdAt)}
                </p>
                <p className="text-sm text-muted-foreground">
                  By: {test.createdBy || "Unknown"}
                </p>
                {testStats.summary?.averageQuestionsPerPassage > 0 && (
                  <p className="text-sm text-muted-foreground">
                    ~{testStats.summary.averageQuestionsPerPassage} Q/section
                  </p>
                )}
              </div>
            </div>

            {/* Mobile creator info */}
            <div className="flex justify-between text-xs text-muted-foreground sm:hidden pt-2 border-t w-full">
              <span>Created: {formatDate(test.createdAt)}</span>
              <span>By: {test.createdBy || "Unknown"}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <ConfirmationDialog />
    </>
  );
}
