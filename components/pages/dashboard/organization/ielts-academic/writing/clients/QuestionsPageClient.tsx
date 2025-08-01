"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageLayout } from "@/components/ui/page-layout";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { FileText, Plus } from "lucide-react";

import { useGetIeltsWritingQuestions } from "@/hooks/organization/ielts-academic/writing/use-get-ielts-writing-questions";
import { IELTSWritingTask } from "@/types/exam/ielts-academic/writing/writing";
import { QuestionFilters } from "./questions-page/QuestionFilters";
import { QuestionsPagination } from "./questions-page/QuestionsPagination";
import { QuestionCard } from "./questions-page/QuestionCard";
import { QuestionDetailView } from "./questions-page/QuestionDetailView";

export interface QuestionsPageClientProps {
  organizationId: number;
}

export default function QuestionsPageClient({
  organizationId,
}: QuestionsPageClientProps) {
  // State for search, filters, pagination
  const [search, setSearch] = useState("");
  const [questionType, setQuestionType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"taskType" | "createdAt">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [selectedQuestion, setSelectedQuestion] =
    useState<IELTSWritingTask | null>(null);

  // Fetch questions data
  const { data, isLoading, isFetching, error } = useGetIeltsWritingQuestions(
    organizationId,
    page,
    10,
    search,
    sortBy,
    sortOrder
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const questions = data?.questions || [];
  const totalPages = data?.totalPages || 0;

  // Reset pagination when search/filters change
  useEffect(() => {
    setPage(1);
  }, [search, questionType, sortBy, sortOrder]);

  // Select first question by default when data loads
  useEffect(() => {
    if (questions.length > 0 && !selectedQuestion) {
      setSelectedQuestion(questions[0]);
    }
  }, [questions, selectedQuestion]);

  // Clear selected question if it's no longer in the list (e.g., deleted)
  useEffect(() => {
    if (selectedQuestion && questions.length > 0) {
      const questionExists = questions.some(
        (q) => q.id === selectedQuestion.id
      );
      if (!questionExists) {
        setSelectedQuestion(questions[0] || null);
      }
    }
  }, [questions, selectedQuestion]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const clearFilters = () => {
    setSearch("");
    setQuestionType("all");
    setSortBy("createdAt");
    setSortOrder("desc");
  };

  const handleSort = (field: "taskType" | "createdAt") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const questionTypeOptions = [
    { value: "all", label: "All Types" },
    { value: "task_1", label: "Task 1" },
    { value: "task_2", label: "Task 2" },
    { value: "line_graph", label: "Line Graph" },
    { value: "bar_chart", label: "Bar Chart" },
    { value: "pie_chart", label: "Pie Chart" },
    { value: "table", label: "Table" },
    { value: "diagram_process", label: "Process Diagram" },
    { value: "diagram_map", label: "Map Diagram" },
    { value: "mixed_charts", label: "Mixed Charts" },
    { value: "opinion_essay", label: "Opinion Essay" },
    { value: "discussion_essay", label: "Discussion Essay" },
    { value: "problem_solution_essay", label: "Problem Solution Essay" },
    {
      value: "advantage_disadvantage_essay",
      label: "Advantage Disadvantage Essay",
    },
    { value: "two_part_question", label: "Two Part Question" },
  ];

  const getQuestionTypeLabel = (type: string): string => {
    const found = questionTypeOptions.find((option) => option.value === type);
    return found ? found.label : type;
  };

  const getQuestionTypeFromQuestion = (question: IELTSWritingTask): string => {
    return question.detailType || question.taskType;
  };

  const isDataLoading = isLoading || isFetching;

  const handleCreateQuestion = () => {
    window.location.href = `/dashboard/organization/${organizationId}/ielts/writing/questions/create`;
  };

  return (
    <PageLayout
      title="IELTS Writing Questions"
      description="Manage writing tasks for IELTS Academic and General Training tests."
      actionButton={{
        label: "Create Question",
        onClick: handleCreateQuestion,
        icon: <Plus className="h-4 w-4" />,
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: List of questions */}
        <div className="lg:col-span-5 xl:col-span-4">
          <Card className="overflow-hidden border-none shadow-lg">
            <div className="bg-muted/30 backdrop-blur-sm p-4">
              {/* Search and filters */}
              <QuestionFilters
                search={search}
                questionType={questionType}
                sortBy={sortBy}
                sortOrder={sortOrder}
                questionTypeOptions={questionTypeOptions}
                handleSearchChange={handleSearchChange}
                setQuestionType={setQuestionType}
                handleSort={handleSort}
                clearFilters={clearFilters}
              />
            </div>

            {/* Questions list */}
            <div className="p-4 space-y-3 ">
              {isDataLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-lg border border-border/50"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-12" />
                    </div>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex justify-between mt-3">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))
              ) : error ? (
                <div className="text-center py-8 text-destructive">
                  <p>Error loading questions.</p>
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="mt-2"
                  >
                    Retry
                  </Button>
                </div>
              ) : questions.length === 0 ? (
                <div className="p-4">
                  <EmptyState
                    icon={
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    }
                    title="No questions found"
                    description="Try adjusting your filters or create a new question"
                    searchQuery={search}
                    onClearSearch={() => clearFilters()}
                    primaryAction={{
                      label: "Create Question",
                      onClick: handleCreateQuestion,
                      icon: <Plus className="h-4 w-4" />,
                    }}
                  />
                </div>
              ) : (
                questions.map((question, index) => (
                  <QuestionCard
                    key={index}
                    question={question}
                    isSelected={selectedQuestion?.id === question.id}
                    onSelect={() => setSelectedQuestion(question)}
                    getQuestionTypeLabel={getQuestionTypeLabel}
                    getQuestionTypeFromQuestion={getQuestionTypeFromQuestion}
                  />
                ))
              )}
            </div>

            {/* Pagination */}
            {!isDataLoading && questions.length > 0 && totalPages > 1 && (
              <div className="border-t p-2">
                <QuestionsPagination
                  totalPages={totalPages}
                  page={page}
                  setPage={setPage}
                />
              </div>
            )}
          </Card>
        </div>

        {/* Right column: Question details */}
        <div className="lg:col-span-7 xl:col-span-8 hidden lg:block h-[calc(100vh-200px)] sticky top-24">
          <Card className="h-full overflow-hidden border-none shadow-lg">
            <div className="absolute inset-0 overflow-y-auto">
              {isDataLoading && !selectedQuestion ? (
                <div className="p-6 space-y-4">
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                  <div className="space-y-4 mt-8">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                </div>
              ) : (
                <QuestionDetailView
                  selectedQuestion={selectedQuestion}
                  getQuestionTypeLabel={getQuestionTypeLabel}
                  getQuestionTypeFromQuestion={getQuestionTypeFromQuestion}
                  organizationId={organizationId}
                />
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Mobile Drawer for details */}
      {selectedQuestion && (
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              variant="default"
              className="fixed bottom-4 right-4 z-10 lg:hidden shadow-lg flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              View Details
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[90vh]">
            <DrawerHeader className="border-b">
              <DrawerTitle>
                {selectedQuestion.taskType === "task_1" ? "Task 1" : "Task 2"} -{" "}
                {getQuestionTypeLabel(
                  getQuestionTypeFromQuestion(selectedQuestion)
                )}
              </DrawerTitle>
            </DrawerHeader>
            <div className="flex-grow overflow-y-auto p-4">
              <QuestionDetailView
                selectedQuestion={selectedQuestion}
                getQuestionTypeLabel={getQuestionTypeLabel}
                getQuestionTypeFromQuestion={getQuestionTypeFromQuestion}
                organizationId={organizationId}
              />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </PageLayout>
  );
}
