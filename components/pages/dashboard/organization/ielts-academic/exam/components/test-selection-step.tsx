/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  Search,
  CheckCircle,
  CheckCircle2,
  BookOpen,
  Headphones,
  FileText,
  PenTool,
  BarChart3,
  Target,
} from "lucide-react";
import {
  IELTSExamModel,
  AdminIELTSExamModel,
} from "@/types/exam/ielts-academic/exam";
import { useGetIeltsListeningTests } from "@/hooks/organization/ielts-academic/listening/use-get-ielts-listening-test";
import { useGetIeltsReadingTests } from "@/hooks/organization/ielts-academic/reading/use-get-ietls-reading-test";
import { useGetIeltsWritingTests } from "@/hooks/organization/ielts-academic/writing/use-get-ielts-writing-tests";
import { PaginationWrapper } from "@/components/ui/pagination-wrapper";
import { addListeningQuestionNumbering } from "@/lib/addListeningQuestionNumbering";
import { addQuestionNumbering } from "@/lib/addQuestionNumbering";
import { addWritingTaskStats } from "@/lib/addWritingQuestionNumbering";
import {
  IELTSWritingTask,
  IELTSWritingTest,
} from "@/types/exam/ielts-academic/writing/writing";
import {
  IELTSListeningTest,
  IELTSListeningTestSection,
} from "@/types/exam/ielts-academic/listening/listening";
import { IELTSReadingTest } from "@/types/exam/ielts-academic/reading/test/test";
import { IELTSReadingTestSection } from "@/types/exam/ielts-academic/reading/question/question";

interface TestSelectionStepProps {
  examData: Partial<IELTSExamModel> | Partial<AdminIELTSExamModel>;
  updateExamData: (
    updates: Partial<IELTSExamModel> | Partial<AdminIELTSExamModel>
  ) => void;
  organizationId: number;
  onNext: () => void;
  onPrevious: () => void;
  isAdmin?: boolean;
}

export const TestSelectionStep: React.FC<TestSelectionStepProps> = ({
  examData,
  updateExamData,
  organizationId,
  onNext,
  onPrevious,
  isAdmin = false,
}) => {
  const [activeTab, setActiveTab] = useState("listening");
  const [searchTerms, setSearchTerms] = useState({
    listening: "",
    reading: "",
    writing: "",
  });
  const [currentPages, setCurrentPages] = useState({
    listening: 1,
    reading: 1,
    writing: 1,
  });

  const pageSize = 6;

  // Hooks for fetching tests
  const { data: listeningData, isLoading: listeningLoading } =
    useGetIeltsListeningTests(
      organizationId,
      currentPages.listening,
      pageSize,
      searchTerms.listening
    );

  const { data: readingData, isLoading: readingLoading } =
    useGetIeltsReadingTests(
      organizationId,
      currentPages.reading,
      pageSize,
      searchTerms.reading
    );

  const { data: writingData, isLoading: writingLoading } =
    useGetIeltsWritingTests(
      organizationId,
      currentPages.writing,
      pageSize,
      searchTerms.writing
    );

  const handleTestSelect = (
    testType: string,
    test: IELTSListeningTest | IELTSReadingTest | IELTSWritingTest
  ) => {
    updateExamData({
      [`${testType}_test`]: test,
    });
  };

  const handleSearchChange = (testType: string, value: string) => {
    setSearchTerms((prev) => ({ ...prev, [testType]: value }));
    setCurrentPages((prev) => ({ ...prev, [testType]: 1 }));
  };

  const handlePageChange = (testType: string, page: number) => {
    setCurrentPages((prev) => ({ ...prev, [testType]: page }));
  };

  const isTestSelected = (testType: string, testId: string) => {
    const selectedTest = examData[`${testType}_test` as keyof IELTSExamModel];
    return (
      selectedTest &&
      (selectedTest as IELTSListeningTest | IELTSReadingTest | IELTSWritingTest)
        .id === testId
    );
  };

  const canProceed = () => {
    if (isAdmin) {
      // Admins can proceed with at least one test selected
      return (
        examData.listening_test ||
        examData.reading_test ||
        examData.writing_test
      );
    } else {
      // Regular users must select all three tests
      return (
        examData.listening_test &&
        examData.reading_test &&
        examData.writing_test
      );
    }
  };

  const getTestStats = (
    test: IELTSListeningTest | IELTSReadingTest | IELTSWritingTest,
    testType: string
  ) => {
    function isListeningTest(
      test: IELTSListeningTest | IELTSReadingTest | IELTSWritingTest
    ): test is IELTSListeningTest {
      return testType === "listening" && "section_one" in test;
    }

    function isReadingTest(
      test: IELTSReadingTest | IELTSListeningTest | IELTSWritingTest
    ): test is IELTSReadingTest {
      return (
        testType === "reading" && "section_one" in test && !("task1" in test)
      );
    }

    function isWritingTest(
      test: IELTSWritingTest | IELTSListeningTest | IELTSReadingTest
    ): test is IELTSWritingTest {
      return testType === "writing" && "task1" in test;
    }

    // Extract sections from the test object based on type
    let sections:
      | IELTSListeningTestSection[]
      | IELTSReadingTestSection[]
      | IELTSWritingTask[] = [];

    if (isListeningTest(test)) {
      // Listening tests have section_one, section_two, section_three, section_four
      sections = [
        test.section_one,
        test.section_two,
        test.section_three,
        test.section_four,
      ].filter(Boolean); // Remove any undefined sections
    } else if (isReadingTest(test)) {
      // Reading tests have section_one, section_two, section_three
      sections = [
        test.section_one,
        test.section_two,
        test.section_three,
      ].filter(Boolean); // Remove any undefined sections
    } else if (isWritingTest(test)) {
      // For writing tests, we have task1 and task2
      sections = [test.task1, test.task2] as IELTSWritingTask[];
    }

    if (!sections || sections.length === 0) {
      return {
        totalQuestions: 0,
        totalSections: 0,
        averageQuestionsPerSection: 0,
        difficultyBreakdown: {},
        questionTypes: {},
        sectionStats: [],
      };
    }

    try {
      if (testType === "listening") {
        const result = addListeningQuestionNumbering(
          sections as IELTSListeningTestSection[]
        );
        return {
          totalQuestions: result.totalQuestions,
          totalSections: result.summary.totalAudios,
          averageQuestionsPerSection: result.summary.averageQuestionsPerAudio,
          difficultyBreakdown: result.summary.difficultyBreakdown,
          questionTypes: result.audioStats.reduce((acc: any, audio: any) => {
            Object.entries(audio.questionTypes).forEach(([type, count]) => {
              acc[type] = (acc[type] || 0) + count;
            });
            return acc;
          }, {}),
          sectionStats: result.audioStats,
        };
      } else if (testType === "reading") {
        const result = addQuestionNumbering(
          sections as IELTSReadingTestSection[]
        );

        return {
          totalQuestions: result.totalQuestions,
          totalSections: result.summary.totalPassages,
          averageQuestionsPerSection: result.summary.averageQuestionsPerPassage,
          difficultyBreakdown: result.summary.difficultyBreakdown,
          questionTypes: result.passageStats.reduce(
            (acc: any, passage: any) => {
              Object.entries(passage.questionTypes).forEach(([type, count]) => {
                acc[type] = (acc[type] || 0) + count;
              });
              return acc;
            },
            {}
          ),
          sectionStats: result.passageStats,
        };
      } else if (testType === "writing") {
        // For writing tests, use addWritingTaskStats for detailed statistics
        const writingTaskData = [
          {
            task1: (test as IELTSWritingTest).task1,
            task2: (test as IELTSWritingTest).task2,
            difficulty: (test as IELTSWritingTest).difficulty,
          },
        ];

        const result = addWritingTaskStats(writingTaskData);

        return {
          totalQuestions: result.summary.totalTasks,
          totalSections: 2, // Writing always has 2 tasks
          averageQuestionsPerSection: result.summary.totalTasks / 2,
          difficultyBreakdown: result.summary.difficultyBreakdown,
          questionTypes: result.summary.detailTypeBreakdown,
          sectionStats: result.taskStats,
          avgTimeLimit: result.summary.avgTimeLimit,
          avgMinWords: result.summary.avgMinWords,
        };
      } else {
        // Fallback for unknown test types
        return {
          totalQuestions: 0,
          totalSections: 0,
          averageQuestionsPerSection: 0,
          difficultyBreakdown: {},
          questionTypes: {},
          sectionStats: [],
        };
      }
    } catch (error) {
      console.warn(`Error calculating stats for ${testType} test:`, error);
      return {
        totalQuestions: 0,
        totalSections: 0,
        averageQuestionsPerSection: 0,
        difficultyBreakdown: {},
        questionTypes: {},
        sectionStats: [],
      };
    }
  };

  const renderTestCard = (
    test: IELTSListeningTest | IELTSReadingTest | IELTSWritingTest,
    testType: string
  ) => {
    const stats = getTestStats(test, testType);
    const isSelected = isTestSelected(testType, test.id.toString());

    const getDifficultyBadgeClasses = (difficulty: string) => {
      switch (difficulty.toLowerCase()) {
        case "easy":
          return "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800";
        case "medium":
          return "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
        case "hard":
          return "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800";
        default:
          return "bg-muted text-muted-foreground border-border";
      }
    };

    const getTestTypeIcon = (type: string) => {
      switch (type) {
        case "listening":
          return <Headphones className="w-4 h-4" />;
        case "reading":
          return <BookOpen className="w-4 h-4" />;
        case "writing":
          return <PenTool className="w-4 h-4" />;
        default:
          return <FileText className="w-4 h-4" />;
      }
    };

    return (
      <Card
        key={test.id}
        className={`group cursor-pointer transition-all duration-300 border-2 hover:shadow-lg ${
          isSelected
            ? "border-primary bg-primary/5 shadow-md ring-2 ring-primary/20"
            : "border-border/50 hover:border-primary/50 hover:bg-accent/5 shadow-sm hover:shadow-md"
        }`}
        onClick={() => handleTestSelect(testType, test)}
      >
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-3 flex-1 min-w-0">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                }`}
              >
                {getTestTypeIcon(testType)}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-foreground text-sm sm:text-base mb-1 break-words leading-snug">
                  {test.title}
                </h3>
                {test.description && (
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {test.description}
                  </p>
                )}
              </div>
            </div>
            {isSelected && (
              <div className="ml-3 flex-shrink-0">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-primary-foreground" />
                </div>
              </div>
            )}
          </div>

          {/* Stats Section */}
          <div className="space-y-4">
            {/* Primary Stats */}
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
                  <BarChart3 className="w-4 h-4" />
                  <span className="font-medium">Test Overview</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="text-center p-2 bg-background/50 rounded">
                  <p className="text-muted-foreground mb-1">Questions</p>
                  <p className="font-bold text-foreground text-lg">
                    {stats.totalQuestions}
                  </p>
                </div>
                <div className="text-center p-2 bg-background/50 rounded">
                  <p className="text-muted-foreground mb-1">
                    {testType === "listening"
                      ? "Audios"
                      : testType === "reading"
                      ? "Passages"
                      : "Tasks"}
                  </p>
                  <p className="font-bold text-foreground text-lg">
                    {stats.totalSections}
                  </p>
                </div>
              </div>
            </div>

            {/* Difficulty breakdown */}
            {Object.keys(stats.difficultyBreakdown).length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">
                    Difficulty Levels
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(stats.difficultyBreakdown).map(
                    ([difficulty, count]) => (
                      <Badge
                        key={difficulty}
                        variant="outline"
                        className={`text-xs font-medium border ${getDifficultyBadgeClasses(
                          difficulty
                        )}`}
                      >
                        {count} {difficulty}
                      </Badge>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Question types preview */}
            {Object.keys(stats.questionTypes).length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">
                    Question Types
                  </span>
                </div>
                <div className="text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded-md">
                  {Object.keys(stats.questionTypes)
                    .slice(0, 3)
                    .map((type) => type.replace(/_/g, " "))
                    .join(", ")}
                  {Object.keys(stats.questionTypes).length > 3 ? " + more" : ""}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 mt-4 border-t border-border">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground">
                Ready to use
              </span>
            </div>
            <Badge
              variant={isSelected ? "default" : "secondary"}
              className="text-xs font-semibold"
            >
              {isSelected ? "Selected" : "Available"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderTestSection = (
    testType: string,
    data:
      | {
          tests?: (IELTSListeningTest | IELTSReadingTest | IELTSWritingTest)[];
          totalPages?: number;
        }
      | undefined,
    isLoading: boolean,
    title: string
  ) => {
    const isSelected = !!examData[`${testType}_test` as keyof IELTSExamModel];

    return (
      <div className="space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg sm:text-xl font-semibold text-foreground">
              {title}
            </h3>
            {isSelected && (
              <Badge className="bg-primary text-primary-foreground shadow-sm">
                <CheckCircle className="h-3 w-3 mr-1" />
                Selected
              </Badge>
            )}
          </div>

          {data?.tests && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
              <BarChart3 className="w-4 h-4" />
              <span>{data.tests.length} available</span>
            </div>
          )}
        </div>

        {/* Search Input */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${testType} tests...`}
            value={searchTerms[testType as keyof typeof searchTerms]}
            onChange={(e) => handleSearchChange(testType, e.target.value)}
            className="pl-10 h-11 bg-background border-border text-foreground focus:border-primary transition-colors"
          />
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span>Loading {testType} tests...</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="border-2 border-border/50">
                  <CardContent className="p-4 sm:p-6">
                    <div className="animate-pulse space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-muted rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                          <div className="h-3 bg-muted rounded w-full"></div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-16 bg-muted rounded-lg"></div>
                        <div className="flex gap-2">
                          <div className="h-6 bg-muted rounded w-16"></div>
                          <div className="h-6 bg-muted rounded w-20"></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Tests Grid */}
            {data?.tests && data.tests.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {data.tests.map(
                    (
                      test:
                        | IELTSListeningTest
                        | IELTSReadingTest
                        | IELTSWritingTest
                    ) => renderTestCard(test, testType)
                  )}
                </div>

                {/* Pagination */}
                {data.totalPages && data.totalPages > 1 && (
                  <div className="flex justify-center pt-6">
                    <PaginationWrapper
                      currentPage={
                        currentPages[testType as keyof typeof currentPages]
                      }
                      totalPages={data.totalPages}
                      onPageChange={(page: number) =>
                        handlePageChange(testType, page)
                      }
                    />
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="text-center py-12 border-2 border-dashed border-border/50 rounded-lg bg-muted/20">
                <div className="mx-auto w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h4 className="text-base font-medium text-foreground mb-2">
                  No {testType} tests found
                </h4>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  {searchTerms[testType as keyof typeof searchTerms]
                    ? `No tests match your search "${
                        searchTerms[testType as keyof typeof searchTerms]
                      }". Try adjusting your search terms.`
                    : `No ${testType} tests are available at the moment. Create some tests first.`}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const selectedCount = [
    examData.listening_test,
    examData.reading_test,
    examData.writing_test,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 px-2 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full mb-4">
            <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 sm:mb-3">
            Select Tests
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {isAdmin
              ? "Choose any combination of tests: Listening, Reading, and/or Writing. You can select just one test or all three - it's your choice."
              : "Choose one test for each component: Listening, Reading, and Writing. Each selected test will be part of your complete IELTS exam."}
          </p>
        </div>

        {/* Selection Summary */}
        <Card className="border-2 border-border/50 shadow-sm mb-8">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    Test Selection Progress
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedCount} of 3 tests selected
                    {isAdmin ? " (optional)" : " (required)"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      examData.listening_test ? "bg-green-500" : "bg-muted"
                    }`}
                  ></div>
                  <span className="text-xs text-muted-foreground">
                    Listening
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      examData.reading_test ? "bg-green-500" : "bg-muted"
                    }`}
                  ></div>
                  <span className="text-xs text-muted-foreground">Reading</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      examData.writing_test ? "bg-green-500" : "bg-muted"
                    }`}
                  ></div>
                  <span className="text-xs text-muted-foreground">Writing</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 h-auto">
            <TabsTrigger
              value="listening"
              className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium transition-all min-w-0"
            >
              <div className="flex items-center justify-center space-x-1 sm:space-x-2 min-w-0">
                <Headphones className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="truncate">
                  Listening
                  {isAdmin && (
                    <span className="text-xs text-muted-foreground ml-1">
                      (opt)
                    </span>
                  )}
                </span>
                {examData.listening_test && (
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                )}
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="reading"
              className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium transition-all min-w-0"
            >
              <div className="flex items-center justify-center space-x-1 sm:space-x-2 min-w-0">
                <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="truncate">
                  Reading
                  {isAdmin && (
                    <span className="text-xs text-muted-foreground ml-1">
                      (opt)
                    </span>
                  )}
                </span>
                {examData.reading_test && (
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                )}
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="writing"
              className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium transition-all min-w-0"
            >
              <div className="flex items-center justify-center space-x-1 sm:space-x-2 min-w-0">
                <PenTool className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="truncate">
                  Writing
                  {isAdmin && (
                    <span className="text-xs text-muted-foreground ml-1">
                      (opt)
                    </span>
                  )}
                </span>
                {examData.writing_test && (
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                )}
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="listening" className="mt-8">
            {renderTestSection(
              "listening",
              listeningData,
              listeningLoading,
              "Listening Tests"
            )}
          </TabsContent>

          <TabsContent value="reading" className="mt-8">
            {renderTestSection(
              "reading",
              readingData,
              readingLoading,
              "Reading Tests"
            )}
          </TabsContent>

          <TabsContent value="writing" className="mt-8">
            {renderTestSection(
              "writing",
              writingData,
              writingLoading,
              "Writing Tests"
            )}
          </TabsContent>
        </Tabs>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 sm:pt-10 border-t border-border/50 mt-8">
          <Button
            onClick={onPrevious}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto border-border text-foreground hover:bg-muted transition-all duration-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous Step
          </Button>
          <Button
            onClick={onNext}
            disabled={!canProceed()}
            size="lg"
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {!canProceed() && !isAdmin
              ? "Select All 3 Tests"
              : !canProceed() && isAdmin
              ? "Select At Least 1 Test"
              : "Next Step"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
