"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageLayout } from "@/components/ui/page-layout";
import { EmptyState } from "@/components/ui/empty-state";
import { FileText, Plus } from "lucide-react";

import { useGetIeltsReadingQuestions } from "@/hooks/organization/ielts-academic/reading/use-get-ielts-reading-questions";

import { QuestionFilters } from "./questions-page/QuestionFilters";
import { PassageCard } from "./questions-page/PassageCard";
import { QuestionsPagination } from "./questions-page/QuestionsPagination";
import { PassageDetailView } from "./questions-page/PassageDetailView";
import { addQuestionNumbering } from "@/lib/addQuestionNumbering";
import { IELTSReadingTestSection } from "@/types/exam/ielts-academic/reading/question/question";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export interface QuestionsPageClientProps {
  organizationId: number;
}

export default function QuestionsPageClient({
  organizationId,
}: QuestionsPageClientProps) {
  // State for search, filters, pagination
  const [search, setSearch] = useState("");
  const [questionType, setQuestionType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<
    "passageTitle" | "questionType" | "createdAt"
  >("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [selectedPassage, setSelectedPassage] =
    useState<IELTSReadingTestSection | null>(null);

  const { data, isLoading, isFetching, error, refetch } =
    useGetIeltsReadingQuestions(
      organizationId,
      page,
      10,
      search,
      sortBy,
      sortOrder
    );

  const formattedData = addQuestionNumbering(
    data?.questions as unknown as IELTSReadingTestSection[]
  );

  const formattedPassages = formattedData.numberedSections;
  const passages = formattedPassages;
  const totalPages = data?.totalPages || 0;

  // Reset pagination when search/filters change
  useEffect(() => {
    setPage(1);
    setSelectedPassage(null);
  }, [search, questionType, sortBy, sortOrder]);

  // Set the first passage as selected by default on page load/data fetch
  useEffect(() => {
    if (passages && passages.length > 0 && !selectedPassage) {
      setSelectedPassage(passages[0]);
    }
  }, [passages, selectedPassage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const clearFilters = () => {
    setSearch("");
    setQuestionType("all");
    setSortBy("createdAt");
    setSortOrder("desc");
  };

  const handleSort = (field: "passageTitle" | "questionType" | "createdAt") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const questionTypeOptions = [
    { value: "all", label: "All Types" },
    { value: "multiple_choice", label: "Multiple Choice" },
    {
      value: "multiple_choice_multiple_answers",
      label: "Multiple Choice (Multiple Answers)",
    },
    { value: "true_false_not_given", label: "True/False/Not Given" },
    { value: "yes_no_not_given", label: "Yes/No/Not Given" },
    { value: "matching_information", label: "Matching Information" },
    { value: "matching_headings", label: "Matching Headings" },
    { value: "matching_features", label: "Matching Features" },
    { value: "matching_sentence_endings", label: "Matching Sentence Endings" },
    { value: "sentence_completion", label: "Sentence Completion" },
    { value: "summary_completion", label: "Summary Completion" },
    { value: "note_completion", label: "Note Completion" },
    { value: "table_completion", label: "Table Completion" },
    { value: "flow_chart_completion", label: "Flow Chart Completion" },
    { value: "diagram_label_completion", label: "Diagram Label Completion" },
    { value: "short_answer", label: "Short Answer" },
  ];

  const getQuestionTypeLabel = (type: string): string => {
    const found = questionTypeOptions.find((option) => option.value === type);
    return found ? found.label : type;
  };

  const isDataLoading = isLoading || isFetching;

  const handleCreateQuestion = () => {
    window.location.href = `/dashboard/organization/${organizationId}/ielts/reading/questions/create`;
  };

  return (
    <PageLayout
      title="IELTS Reading Questions"
      description="These questions are used to create tests. Each question is a part of a passage and can be used in multiple tests."
      actionButton={{
        label: "Create Question",
        onClick: handleCreateQuestion,
        icon: <Plus className="h-4 w-4" />,
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: List of passages */}
        <div className="lg:col-span-5 xl:col-span-4">
          <Card className="overflow-hidden border-none shadow-lg">
            <div className="bg-muted/30 backdrop-blur-sm p-4">
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
                getQuestionTypeLabel={getQuestionTypeLabel}
              />
            </div>

            {/* Passages list */}
            <div className="p-4 space-y-3  overflow-y-auto">
              {isDataLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-lg border border-border/50"
                  >
                    <Skeleton className="h-5 w-3/5 mb-3" />
                    <Skeleton className="h-4 w-4/5 mb-4" />
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
                    onClick={() => refetch()}
                    variant="outline"
                    className="mt-2"
                  >
                    Retry
                  </Button>
                </div>
              ) : passages && passages.length === 0 ? (
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
                passages &&
                passages.map((item, index) => (
                  <PassageCard
                    key={index}
                    item={item}
                    organizationId={organizationId}
                    getQuestionTypeLabel={getQuestionTypeLabel}
                    isSelected={
                      selectedPassage?.passage?.title === item.passage?.title
                    }
                    onSelect={() => setSelectedPassage(item)}
                  />
                ))
              )}
            </div>

            {/* Pagination */}
            {!isDataLoading &&
              passages &&
              passages.length > 0 &&
              totalPages > 1 && (
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

        {/* Right column: Passage details */}
        <div className="lg:col-span-7 xl:col-span-8 hidden lg:block h-[calc(100vh-200px)] sticky top-24">
          <Card className="h-full overflow-hidden border-none shadow-lg">
            <div className="absolute inset-0 overflow-y-auto">
              {isDataLoading && !selectedPassage ? (
                <div className="p-6 space-y-4">
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                  <div className="space-y-4 mt-8">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                </div>
              ) : (
                <PassageDetailView
                  selectedPassage={selectedPassage}
                  getQuestionTypeLabel={getQuestionTypeLabel}
                />
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Mobile Drawer for details */}
      {selectedPassage && (
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
              <DrawerTitle>{selectedPassage.passage?.title}</DrawerTitle>
            </DrawerHeader>
            <div className="flex-grow overflow-y-auto p-4">
              <PassageDetailView
                selectedPassage={selectedPassage}
                getQuestionTypeLabel={getQuestionTypeLabel}
              />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </PageLayout>
  );
}
