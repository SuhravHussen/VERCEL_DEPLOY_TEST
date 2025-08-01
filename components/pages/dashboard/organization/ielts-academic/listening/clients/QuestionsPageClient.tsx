"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageLayout } from "@/components/ui/page-layout";
import { EmptyState } from "@/components/ui/empty-state";
import { Volume2, Plus } from "lucide-react";

import { addListeningQuestionNumbering } from "@/lib/addListeningQuestionNumbering";
import { IELTSListeningTestSection } from "@/types/exam/ielts-academic/listening/listening";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { QuestionFilters } from "./questions-page/QuestionFilters";
import { AudioCard } from "./questions-page/AudioCard";
import { QuestionsPagination } from "./questions-page/QuestionsPagination";
import { AudioDetailView } from "./questions-page/AudioDetailView";
import { useGetIeltsListeningQuestions } from "@/hooks/organization/ielts-academic/listening/use-get-ielts-listening-questions";
import { useDeleteIeltsListeningQuestion } from "@/hooks/organization/ielts-academic/listening/use-delete-ielts-listening-question";
import { useToasts } from "@/components/ui/toast";
import { useConfirmationDialog } from "@/components/ui/confirmation-dialog";

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
    "audioTitle" | "questionType" | "createdAt"
  >("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [selectedAudio, setSelectedAudio] =
    useState<IELTSListeningTestSection | null>(null);

  const { data, isLoading, isFetching, error } = useGetIeltsListeningQuestions(
    organizationId,
    page,
    10,
    search,
    sortBy,
    sortOrder
  );

  const toast = useToasts();
  const deleteQuestionMutation = useDeleteIeltsListeningQuestion();
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  const formattedData = data?.questions
    ? addListeningQuestionNumbering(
        data.questions as unknown as IELTSListeningTestSection[]
      )
    : {
        numberedSections: [],
        totalQuestions: 0,
        audioStats: [],
        summary: {
          totalAudios: 0,
          totalQuestions: 0,
          averageQuestionsPerAudio: 0,
          difficultyBreakdown: {},
        },
      };

  const formattedAudios = formattedData.numberedSections;
  const audios = formattedAudios;
  const totalPages = data?.totalPages || 0;

  // Reset pagination when search/filters change
  useEffect(() => {
    setPage(1);
  }, [search, questionType, sortBy, sortOrder]);

  // Set the first audio as selected by default on page load/data fetch
  useEffect(() => {
    if (audios && audios.length > 0 && !selectedAudio) {
      setSelectedAudio(audios[0]);
    }
  }, [audios, selectedAudio]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const clearFilters = () => {
    setSearch("");
    setQuestionType("all");
    setSortBy("createdAt");
    setSortOrder("desc");
  };

  const handleDeleteQuestion = async (questionId: string) => {
    await showConfirmation({
      title: "Delete Listening Question",
      description:
        "Are you sure you want to delete this listening question? This action cannot be undone and will permanently remove all associated audio and questions.",
      confirmText: "Delete Question",
      cancelText: "Cancel",
      variant: "destructive",
      onConfirm: async () => {
        try {
          await deleteQuestionMutation.mutateAsync(questionId);
          toast.success("Question deleted successfully!");

          // If the deleted question was the selected one, clear the selection
          if (selectedAudio?.questions.some((q) => q.id === questionId)) {
            setSelectedAudio(null);
          }
        } catch (error) {
          console.error("Error deleting question:", error);
          toast.error("Failed to delete question. Please try again.");
          throw error; // Re-throw to let the dialog handle the error state
        }
      },
    });
  };

  const handleSort = (field: "audioTitle" | "questionType" | "createdAt") => {
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
    { value: "sentence_completion", label: "Sentence Completion" },
    { value: "form_completion", label: "Form Completion" },
    { value: "note_completion", label: "Note Completion" },
    { value: "table_completion", label: "Table Completion" },
    { value: "flow_chart_completion", label: "Flow Chart Completion" },
    { value: "diagram_label_completion", label: "Diagram Label Completion" },
    { value: "matching", label: "Matching" },
    { value: "short_answer", label: "Short Answer" },
  ];

  const getQuestionTypeLabel = (type: string): string => {
    const found = questionTypeOptions.find((option) => option.value === type);
    return found ? found.label : type;
  };

  const isDataLoading = isLoading || isFetching;

  const handleCreateQuestion = () => {
    window.location.href = `/dashboard/organization/${organizationId}/ielts/listening/questions/create`;
  };

  return (
    <PageLayout
      title="IELTS Listening Questions"
      description="These questions are used to create tests. Each question is part of an audio section and can be used in multiple tests."
      actionButton={{
        label: "Create Question",
        onClick: handleCreateQuestion,
        icon: <Plus className="h-4 w-4" />,
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: List of audios */}
        <div className="lg:col-span-5 xl:col-span-4">
          <Card className="overflow-hidden border-none shadow-lg">
            <div className="bg-muted/30 backdrop-blur-sm p-3 sm:p-4">
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

            {/* Audios list */}
            <div className="p-3 sm:p-4 space-y-2 sm:space-y-3  overflow-y-auto touch-pan-y">
              {isDataLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="p-3 sm:p-4 rounded-lg border border-border/50"
                  >
                    <Skeleton className="h-5 w-3/5 mb-2 sm:mb-3" />
                    <Skeleton className="h-4 w-4/5 mb-3 sm:mb-4" />
                    <div className="flex justify-between mt-2 sm:mt-3">
                      <Skeleton className="h-3 w-12 sm:w-16" />
                      <Skeleton className="h-3 w-12 sm:w-16" />
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
              ) : audios && audios.length === 0 ? (
                <div className="p-4">
                  <EmptyState
                    icon={<Volume2 className="h-8 w-8 text-muted-foreground" />}
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
                audios &&
                audios.map((item, index) => (
                  <AudioCard
                    key={index}
                    item={item}
                    organizationId={organizationId}
                    getQuestionTypeLabel={getQuestionTypeLabel}
                    isSelected={
                      selectedAudio?.audio?.title === item.audio?.title
                    }
                    onSelect={() => setSelectedAudio(item)}
                    onDelete={handleDeleteQuestion}
                  />
                ))
              )}
            </div>

            {/* Pagination */}
            {!isDataLoading &&
              audios &&
              audios.length > 0 &&
              totalPages > 1 && (
                <div className="border-t p-2 ">
                  <QuestionsPagination
                    totalPages={totalPages}
                    page={page}
                    setPage={setPage}
                  />
                </div>
              )}
          </Card>
        </div>

        {/* Right column: Audio details */}
        <div className="lg:col-span-7 xl:col-span-8 hidden lg:block h-[calc(100vh-180px)] xl:h-[calc(100vh-200px)] sticky top-20 xl:top-24">
          <Card className="h-full overflow-hidden border-none shadow-lg">
            <div className="absolute inset-0 overflow-y-auto overscroll-contain">
              {isDataLoading && !selectedAudio ? (
                <div className="p-4 lg:p-6 space-y-4">
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                  <div className="space-y-4 mt-6 lg:mt-8">
                    <Skeleton className="h-16 lg:h-20 w-full" />
                    <Skeleton className="h-16 lg:h-20 w-full" />
                  </div>
                </div>
              ) : (
                <AudioDetailView
                  selectedAudio={selectedAudio}
                  getQuestionTypeLabel={getQuestionTypeLabel}
                />
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Mobile Drawer for details */}
      {selectedAudio && (
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              variant="default"
              className="fixed bottom-4 right-4 z-10 lg:hidden shadow-lg flex items-center gap-2 h-12 px-4 text-sm font-medium"
            >
              <Volume2 className="h-4 w-4" />
              View Details
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[95vh] sm:max-h-[90vh] flex flex-col">
            <DrawerHeader className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
              <DrawerTitle className="text-left truncate pr-4">
                {selectedAudio.audio?.title}
              </DrawerTitle>
            </DrawerHeader>
            <div className="flex-1 overflow-y-auto overscroll-contain">
              <div className="p-3 sm:p-4 pb-safe">
                <AudioDetailView
                  selectedAudio={selectedAudio}
                  getQuestionTypeLabel={getQuestionTypeLabel}
                />
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      )}

      <ConfirmationDialog />
    </PageLayout>
  );
}
