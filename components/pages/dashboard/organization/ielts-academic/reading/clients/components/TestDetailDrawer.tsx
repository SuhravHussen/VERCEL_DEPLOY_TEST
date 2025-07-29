"use client";

import { useMemo } from "react";
import { IELTSReadingTest } from "@/types/exam/ielts-academic/reading/test/test";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  getDifficultyColor,
  getDifficultyLabel,
  formatDate,
} from "../utils/testHelpers";
import { addQuestionNumbering } from "@/lib/addQuestionNumbering";
import { Card } from "@/components/ui/card";
import { BarChart, PieChart, Clock } from "lucide-react";

interface TestDetailDrawerProps {
  test: IELTSReadingTest | null;
  open: boolean;
  onClose: () => void;
}

export function TestDetailDrawer({
  test,
  open,
  onClose,
}: TestDetailDrawerProps) {
  // Calculate detailed test statistics
  const testStats = useMemo(() => {
    if (!test)
      return {
        numberedSections: [],
        totalQuestions: 0,
        passageStats: [],
        summary: {
          totalPassages: 0,
          totalQuestions: 0,
          averageQuestionsPerPassage: 0,
          difficultyBreakdown: {},
        },
      };

    const sections = [
      test.section_one,
      test.section_two,
      test.section_three,
    ].filter(Boolean);

    return addQuestionNumbering(sections);
  }, [test]);

  if (!test) return null;

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="">
        <div className="mx-auto w-full max-w-4xl overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle className="text-xl">{test.title}</DrawerTitle>
            <DrawerDescription>
              Created by {test.createdBy} on {formatDate(test.createdAt)}
            </DrawerDescription>
            <div className="mt-2">
              <Badge variant="secondary" className="capitalize">
                {test.status || "Draft"}
              </Badge>
            </div>
          </DrawerHeader>

          <div className="p-4 pb-0">
            <div className="space-y-6">
              {test.description && (
                <p className="text-muted-foreground">{test.description}</p>
              )}

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-sm text-muted-foreground">
                      Difficulty
                    </h3>
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-center mt-2">
                    <Badge className={`${getDifficultyColor(test.difficulty)}`}>
                      {getDifficultyLabel(test.difficulty)}
                    </Badge>
                  </div>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-sm text-muted-foreground">
                      Questions
                    </h3>
                    <PieChart className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col mt-2">
                    <p className="text-lg font-medium">
                      {testStats.totalQuestions || 40}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {testStats.summary.averageQuestionsPerPassage} avg per
                      passage
                    </p>
                  </div>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-sm text-muted-foreground">
                      Time Limit
                    </h3>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col mt-2">
                    <p className="text-lg font-medium">
                      {test.timeLimit || 60} minutes
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round(
                        ((test.timeLimit || 60) / testStats.totalQuestions) * 10
                      ) / 10}{" "}
                      min per question
                    </p>
                  </div>
                </div>
              </div>

              {/* Advanced Stats */}
              {testStats.passageStats && testStats.passageStats.length > 0 && (
                <div className="border-t pt-4 mt-2">
                  <h3 className="font-medium mb-3 text-sm">Test Statistics</h3>
                  <Card className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {testStats.passageStats.map((stat, index) => (
                        <div key={index} className="space-y-2">
                          <h4 className="text-sm font-medium">
                            Passage {index + 1} ({stat.difficulty})
                          </h4>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Questions:
                              </span>
                              <span>
                                {stat.questionRange} ({stat.questionCount})
                              </span>
                            </div>
                            <div className="mt-2">
                              <p className="text-muted-foreground mb-1">
                                Question types:
                              </p>
                              {Object.entries(stat.questionTypes).map(
                                ([type, count]) => (
                                  <div
                                    key={type}
                                    className="flex justify-between"
                                  >
                                    <span>{type.replace(/_/g, " ")}:</span>
                                    <span className="font-medium">{count}</span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              <div className="border-t pt-4 mt-2">
                <h3 className="font-semibold mb-3">Test Sections</h3>
                <ScrollArea className="">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {test.section_one && (
                      <div className="bg-muted/20 hover:bg-muted/30 transition-colors p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="font-semibold">
                            Section 1
                          </Badge>
                          <Badge variant="secondary">
                            {testStats.passageStats?.[0]?.questionCount || 0}{" "}
                            Questions
                          </Badge>
                        </div>
                        <h4 className="font-medium mb-1">
                          {test.section_one.passage?.title || "No title"}
                        </h4>
                        {testStats.passageStats?.[0] && (
                          <div className="mb-2">
                            <Badge
                              className={`${getDifficultyColor(
                                testStats.passageStats[0].difficulty
                              )}`}
                            >
                              {getDifficultyLabel(
                                testStats.passageStats[0].difficulty
                              )}
                            </Badge>
                            <span className="text-xs ml-2 text-muted-foreground">
                              Questions{" "}
                              {testStats.passageStats[0].questionRange}
                            </span>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {test.section_one.passage?.content?.substring(
                            0,
                            100
                          ) || "No content"}{" "}
                          ...
                        </p>
                      </div>
                    )}

                    {test.section_two && (
                      <div className="bg-muted/20 hover:bg-muted/30 transition-colors p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="font-semibold">
                            Section 2
                          </Badge>
                          <Badge variant="secondary">
                            {testStats.passageStats?.[1]?.questionCount || 0}{" "}
                            Questions
                          </Badge>
                        </div>
                        <h4 className="font-medium mb-1">
                          {test.section_two.passage?.title || "No title"}
                        </h4>
                        {testStats.passageStats?.[1] && (
                          <div className="mb-2">
                            <Badge
                              className={`${getDifficultyColor(
                                testStats.passageStats[1].difficulty
                              )}`}
                            >
                              {getDifficultyLabel(
                                testStats.passageStats[1].difficulty
                              )}
                            </Badge>
                            <span className="text-xs ml-2 text-muted-foreground">
                              Questions{" "}
                              {testStats.passageStats[1].questionRange}
                            </span>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {test.section_two.passage?.content?.substring(
                            0,
                            100
                          ) || "No content"}{" "}
                          ...
                        </p>
                      </div>
                    )}

                    {test.section_three && (
                      <div className="bg-muted/20 hover:bg-muted/30 transition-colors p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="font-semibold">
                            Section 3
                          </Badge>
                          <Badge variant="secondary">
                            {testStats.passageStats?.[2]?.questionCount || 0}{" "}
                            Questions
                          </Badge>
                        </div>
                        <h4 className="font-medium mb-1">
                          {test.section_three.passage?.title || "No title"}
                        </h4>
                        {testStats.passageStats?.[2] && (
                          <div className="mb-2">
                            <Badge
                              className={`${getDifficultyColor(
                                testStats.passageStats[2].difficulty
                              )}`}
                            >
                              {getDifficultyLabel(
                                testStats.passageStats[2].difficulty
                              )}
                            </Badge>
                            <span className="text-xs ml-2 text-muted-foreground">
                              Questions{" "}
                              {testStats.passageStats[2].questionRange}
                            </span>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {test.section_three.passage?.content?.substring(
                            0,
                            100
                          ) || "No content"}{" "}
                          ...
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>

          <DrawerFooter>
            <div className="flex justify-end gap-2">
              <DrawerClose asChild>
                <Button variant="outline" size="sm">
                  Close
                </Button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
