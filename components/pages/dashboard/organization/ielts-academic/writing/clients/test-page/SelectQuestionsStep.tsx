import { useContext, useState, useEffect } from "react";
import { TestStepperContext } from "../TestStepperContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetIeltsWritingQuestions } from "@/hooks/organization/ielts-academic/writing/use-get-ielts-writing-questions";
import {
  IELTSWritingTask,
  IELTSWritingTest,
} from "@/types/exam/ielts-academic/writing/writing";
import {
  IELTSAcademicTask1,
  IELTSGeneralTask1,
  IELTSTask2,
} from "@/types/exam/ielts-academic/writing/writing";
import { Search, X, ArrowRight, CheckCircle, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface SelectQuestionsStepProps {
  organizationId: number;
  testData: Partial<IELTSWritingTest>;
  updateTestData: (data: Partial<IELTSWritingTest>) => void;
}

export default function SelectQuestionsStep({
  organizationId,
  testData,
  updateTestData,
}: SelectQuestionsStepProps) {
  const { stepperRef } = useContext(TestStepperContext);
  const [searchTask1, setSearchTask1] = useState("");
  const [searchTask2, setSearchTask2] = useState("");
  const [task1Page, setTask1Page] = useState(1);
  const [task2Page, setTask2Page] = useState(1);
  const [activeTab, setActiveTab] = useState<"task1" | "task2">("task1");

  const ITEMS_PER_PAGE = 5; // Show 5 items per page for better readability

  // Reset pagination when search changes
  useEffect(() => {
    setTask1Page(1);
  }, [searchTask1]);

  useEffect(() => {
    setTask2Page(1);
  }, [searchTask2]);

  // Fetch questions
  const { data: task1Data, isLoading: isLoadingTask1 } =
    useGetIeltsWritingQuestions(
      organizationId,
      task1Page,
      ITEMS_PER_PAGE,
      searchTask1,
      "createdAt",
      "desc",
      undefined,
      "task_1"
    );

  const { data: task2Data, isLoading: isLoadingTask2 } =
    useGetIeltsWritingQuestions(
      organizationId,
      task2Page,
      ITEMS_PER_PAGE,
      searchTask2,
      "createdAt",
      "desc",
      undefined,
      "task_2"
    );

  const task1Questions = task1Data?.questions || [];
  const task2Questions = task2Data?.questions || [];
  const task1TotalPages = task1Data?.totalPages || 1;
  const task2TotalPages = task2Data?.totalPages || 1;

  const selectTask1 = (question: IELTSWritingTask) => {
    if (question.taskType === "task_1") {
      // Check if it's an academic task
      const academicTaskTypes: string[] = [
        "line_graph",
        "bar_chart",
        "pie_chart",
        "table",
        "diagram_process",
        "diagram_map",
        "mixed_charts",
      ];

      if (academicTaskTypes.includes(question.detailType)) {
        updateTestData({
          ...testData,
          task1: question as IELTSAcademicTask1,
        });
      } else {
        // It's a general task
        updateTestData({
          ...testData,
          task1: question as IELTSGeneralTask1,
        });
      }
    }
  };

  const selectTask2 = (question: IELTSWritingTask) => {
    if (question.taskType === "task_2") {
      updateTestData({
        ...testData,
        task2: question as IELTSTask2,
      });
    }
  };

  // Helper function to format the detail type for display
  const formatDetailType = (detailType: string) => {
    return detailType.replace(/_/g, " ");
  };

  const onNext = () => {
    if (!testData.task1 || !testData.task2) {
      alert("Please select both Task 1 and Task 2 questions");
      return;
    }
    stepperRef.current?.nextStep();
  };

  const onPrevious = () => {
    stepperRef.current?.prevStep();
  };

  // Helper function to render pagination
  const renderPagination = (
    currentPage: number,
    totalPages: number,
    setPage: (page: number) => void
  ) => {
    if (totalPages <= 1) return null;

    return (
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) setPage(currentPage - 1);
              }}
              className={
                currentPage <= 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            // Show first page, last page, current page, and pages around current
            const pageToShow = (() => {
              if (totalPages <= 5) {
                // If 5 or fewer pages, show all pages
                return i + 1;
              } else if (currentPage <= 3) {
                // If near start, show first 5 pages
                return i + 1;
              } else if (currentPage >= totalPages - 2) {
                // If near end, show last 5 pages
                return totalPages - 4 + i;
              } else {
                // Show 2 pages before and after current page
                return currentPage - 2 + i;
              }
            })();

            // For large page counts, add ellipses
            if (totalPages > 5) {
              if (
                (pageToShow === 1 && currentPage > 3) ||
                (pageToShow === totalPages && currentPage < totalPages - 2)
              ) {
                return (
                  <PaginationItem key={`ellipsis-${pageToShow}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }
            }

            return (
              <PaginationItem key={pageToShow}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(pageToShow);
                  }}
                  isActive={currentPage === pageToShow}
                >
                  {pageToShow}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) setPage(currentPage + 1);
              }}
              className={
                currentPage >= totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  // Loading skeleton for questions
  const renderQuestionSkeletons = () => (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-5 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-3" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-3" />
            <Skeleton className="h-3 w-20" />
          </div>
        </Card>
      ))}
    </>
  );

  // Empty state component
  const renderEmptyState = (taskType: string) => (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="rounded-full bg-muted/50 p-4 mb-4">
        <FileText className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">No {taskType} questions found</h3>
      <p className="text-muted-foreground mt-1 mb-4">
        {searchTask1 || searchTask2
          ? "Try adjusting your search query"
          : `No ${taskType} questions are available`}
      </p>
    </div>
  );

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0">
        <Tabs
          className="w-full"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "task1" | "task2")}
        >
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="task1" className="flex justify-between gap-2">
              <span>Task 1</span>
              {testData.task1 && (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
            </TabsTrigger>
            <TabsTrigger value="task2" className="flex justify-between gap-2">
              <span>Task 2</span>
              {testData.task2 && (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
            </TabsTrigger>
          </TabsList>
          {/* Task 1 Content */}
          <TabsContent value="task1" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-lg font-medium">Select Task 1</h3>
              <div className="relative w-full sm:w-[300px]">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search Task 1 questions..."
                  className="pl-8 pr-10"
                  value={searchTask1}
                  onChange={(e) => setSearchTask1(e.target.value)}
                />
                {searchTask1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-9 px-3"
                    onClick={() => setSearchTask1("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Task 1 Questions List */}
            <div className="grid grid-cols-1 gap-4">
              {isLoadingTask1
                ? renderQuestionSkeletons()
                : task1Questions.length === 0
                ? renderEmptyState("Task 1")
                : task1Questions.map((question) => (
                    <Card
                      key={question.id}
                      className={cn(
                        "p-4 cursor-pointer transition-all hover:border-primary",
                        testData.task1?.id === question.id &&
                          "border-primary bg-primary/5"
                      )}
                      onClick={() => selectTask1(question)}
                    >
                      <div className="flex justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              variant={
                                testData.task1?.id === question.id
                                  ? "default"
                                  : "outline"
                              }
                            >
                              Task 1
                            </Badge>
                            <Badge variant="secondary">
                              {formatDetailType(question.detailType)}
                            </Badge>
                          </div>
                          <p className="font-medium line-clamp-2">
                            {question.instruction}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {question.prompt}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <span>Time: {question.timeLimit} min</span>
                            <span>•</span>
                            <span>Words: {question.minimumWords}</span>
                          </div>
                        </div>
                        {testData.task1?.id === question.id && (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </Card>
                  ))}
            </div>

            {/* Task 1 Pagination */}
            {!isLoadingTask1 &&
              task1Questions.length > 0 &&
              renderPagination(task1Page, task1TotalPages, setTask1Page)}
          </TabsContent>

          {/* Task 2 Content */}
          <TabsContent value="task2" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-lg font-medium">Select Task 2</h3>
              <div className="relative w-full sm:w-[300px]">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search Task 2 questions..."
                  className="pl-8 pr-10"
                  value={searchTask2}
                  onChange={(e) => setSearchTask2(e.target.value)}
                />
                {searchTask2 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-9 px-3"
                    onClick={() => setSearchTask2("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Task 2 Questions List */}
            <div className="grid grid-cols-1 gap-4">
              {isLoadingTask2
                ? renderQuestionSkeletons()
                : task2Questions.length === 0
                ? renderEmptyState("Task 2")
                : task2Questions.map((question) => (
                    <Card
                      key={question.id}
                      className={cn(
                        "p-4 cursor-pointer transition-all hover:border-primary",
                        testData.task2?.id === question.id &&
                          "border-primary bg-primary/5"
                      )}
                      onClick={() => selectTask2(question)}
                    >
                      <div className="flex justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              variant={
                                testData.task2?.id === question.id
                                  ? "default"
                                  : "outline"
                              }
                            >
                              Task 2
                            </Badge>
                            <Badge variant="secondary">
                              {formatDetailType(question.detailType)}
                            </Badge>
                          </div>
                          <p className="font-medium line-clamp-2">
                            {question.instruction}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {question.prompt}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <span>Time: {question.timeLimit} min</span>
                            <span>•</span>
                            <span>Words: {question.minimumWords}</span>
                          </div>
                        </div>
                        {testData.task2?.id === question.id && (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </Card>
                  ))}
            </div>

            {/* Task 2 Pagination */}
            {!isLoadingTask2 &&
              task2Questions.length > 0 &&
              renderPagination(task2Page, task2TotalPages, setTask2Page)}
          </TabsContent>
        </Tabs>

        {/* Navigation buttons */}
        <div className="flex justify-between pt-8">
          <Button type="button" variant="outline" onClick={onPrevious}>
            Previous
          </Button>
          <Button
            type="button"
            onClick={onNext}
            className="flex items-center gap-1"
            disabled={!testData.task1 || !testData.task2}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
