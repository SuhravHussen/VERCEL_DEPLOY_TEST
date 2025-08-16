"use client";

import { useContext, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { StepperContext } from "./StepperContext";
import { TestSectionsStepProps, AudioStat } from "./types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IELTSListeningTestSection } from "@/types/exam/ielts-academic/listening/listening";
import { AudioCard } from "./AudioCard";
import { AudioCardSkeleton } from "./AudioCardSkeleton";
import { SelectedAudioDisplay } from "./SelectedAudioDisplay";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useGetIeltsListeningQuestions } from "@/hooks/organization/ielts-academic/listening/use-get-ielts-listening-questions";
import { Input } from "@/components/ui/input";
import { addListeningQuestionNumbering } from "@/lib/addListeningQuestionNumbering";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";

type SectionKey =
  | "section_one"
  | "section_two"
  | "section_three"
  | "section_four";

export function TestSectionsStep({
  formData,
  updateFormData,
  organizationSlug,
}: TestSectionsStepProps) {
  const context = useContext(StepperContext);
  const [activeSection, setActiveSection] = useState<SectionKey>("section_one");

  // Pagination and filtering state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<
    "audioTitle" | "questionType" | "createdAt"
  >("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Debounce search term to avoid excessive API calls
  const debouncedSearch = useDebounce(searchTerm, 500);

  const {
    data: questionsData,
    isPending,
    isFetching,
  } = useGetIeltsListeningQuestions(
    organizationSlug,
    page,
    limit,
    debouncedSearch,
    sortBy,
    sortOrder
  );

  // Pre-calculate stats for all items to improve performance
  const audioStats = useMemo(() => {
    if (!questionsData?.questions || questionsData.questions.length === 0) {
      return {};
    }

    // Process each question section individually to get its stats
    return questionsData.questions.reduce((acc, item, index) => {
      const { audioStats } = addListeningQuestionNumbering([item]);
      acc[`${item.audio.title}-${index}`] = audioStats[0];
      return acc;
    }, {} as Record<string, AudioStat>);
  }, [questionsData?.questions]);

  const handlePrevious = () => {
    context?.stepperRef.current?.prevStep();
  };

  const handleContinue = () => {
    if (
      !formData.section_one ||
      !formData.section_two ||
      !formData.section_three ||
      !formData.section_four
    ) {
      // Show error message about missing sections
      alert("Please select audio for all sections");
      return;
    }
    context?.stepperRef.current?.nextStep();
  };

  const handleSelectAudio = (
    section: SectionKey,
    audioSection: IELTSListeningTestSection
  ) => {
    updateFormData({ [section]: audioSection });
  };

  const handleClearSection = (section: SectionKey) => {
    updateFormData({ [section]: null });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: string) => {
    setLimit(parseInt(newLimit, 10));
    setPage(1); // Reset to first page when changing items per page
  };

  const handleSortChange = (value: string) => {
    const [newSortBy, newSortOrder] = value.split("-") as [
      "audioTitle" | "questionType" | "createdAt",
      "asc" | "desc"
    ];
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setPage(1); // Reset to first page when changing sort
  };

  // Create an array of placeholders for skeleton loading
  const skeletonPlaceholders = Array(limit).fill(0);

  return (
    <div className="max-w-5xl mx-auto py-6">
      <h2 className="text-xl font-semibold mb-6">
        Select audio and questions for each section
      </h2>

      <Tabs
        value={activeSection}
        onValueChange={(value) => setActiveSection(value as SectionKey)}
      >
        <TabsList className="w-full grid grid-cols-4 mb-6">
          <TabsTrigger value="section_one">Section 1</TabsTrigger>
          <TabsTrigger value="section_two">Section 2</TabsTrigger>
          <TabsTrigger value="section_three">Section 3</TabsTrigger>
          <TabsTrigger value="section_four">Section 4</TabsTrigger>
        </TabsList>

        {(
          [
            "section_one",
            "section_two",
            "section_three",
            "section_four",
          ] as SectionKey[]
        ).map((section) => (
          <TabsContent
            key={section}
            value={section}
            className="space-y-6 border-none p-0"
          >
            <div className="flex flex-col space-y-6">
              {formData[section] ? (
                <SelectedAudioDisplay
                  audio={formData[section]?.audio}
                  onRemove={() => handleClearSection(section)}
                />
              ) : (
                <div className="text-muted-foreground">
                  No audio selected for this section
                </div>
              )}

              {/* Search and filter controls */}
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search audio..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select
                  value={`${sortBy}-${sortOrder}`}
                  onValueChange={handleSortChange}
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="audioTitle-asc">
                      Audio Title (A-Z)
                    </SelectItem>
                    <SelectItem value="audioTitle-desc">
                      Audio Title (Z-A)
                    </SelectItem>
                    <SelectItem value="questionType-asc">
                      Question Type (A-Z)
                    </SelectItem>
                    <SelectItem value="questionType-desc">
                      Question Type (Z-A)
                    </SelectItem>
                    <SelectItem value="createdAt-desc">Newest First</SelectItem>
                    <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {isPending || isFetching ? (
                  // Show skeleton cards while loading
                  skeletonPlaceholders.map((_, index) => (
                    <AudioCardSkeleton key={`skeleton-${index}`} />
                  ))
                ) : questionsData?.questions &&
                  questionsData.questions.length > 0 ? (
                  questionsData.questions.map((item, index) => {
                    const key = `${item.audio.title}-${index}`;
                    return (
                      <AudioCard
                        key={key}
                        audio={item.audio}
                        questions={item.questions}
                        isSelected={
                          formData[section]?.audio?.title === item.audio.title
                        }
                        onClick={() => handleSelectAudio(section, item)}
                        stats={audioStats[key]}
                      />
                    );
                  })
                ) : (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    No audio recordings found
                  </div>
                )}
              </div>

              {/* Pagination controls */}
              {questionsData && questionsData.totalPages > 0 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {(page - 1) * limit + 1} to{" "}
                    {Math.min(page * limit, questionsData.totalItems)} of{" "}
                    {questionsData.totalItems} items
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={limit.toString()}
                      onValueChange={handleLimitChange}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Items" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 per page</SelectItem>
                        <SelectItem value="10">10 per page</SelectItem>
                        <SelectItem value="20">20 per page</SelectItem>
                        <SelectItem value="50">50 per page</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page <= 1}
                        className="rounded-r-none"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Previous page</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page >= questionsData.totalPages}
                        className="rounded-l-none"
                      >
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Next page</span>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={handlePrevious}>
          Back
        </Button>
        <Button onClick={handleContinue}>Continue</Button>
      </div>
    </div>
  );
}
