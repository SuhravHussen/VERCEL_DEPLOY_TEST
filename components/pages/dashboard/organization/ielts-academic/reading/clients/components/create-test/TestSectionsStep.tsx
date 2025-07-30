import React, { useContext, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Check, Search, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TestSectionsStepProps, IELTSReadingTestSection } from "./types";
import { StepperContext } from "./StepperContext";
import { SelectedPassageDisplay } from "./SelectedPassageDisplay";
import { PassageCard } from "./PassageCard";
import { useGetIeltsReadingQuestions } from "@/hooks/organization/ielts-academic/reading/use-get-ielts-reading-questions";

export function TestSectionsStep({
  formData,
  updateFormData,
  organizationId,
}: TestSectionsStepProps) {
  const { stepperRef } = useContext(StepperContext);
  const [currentSection, setCurrentSection] = useState<1 | 2 | 3>(1);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [page, setPage] = useState(1);

  // Use the hook to fetch passages with questions
  const {
    data,
    isLoading,
    isError,
    error: fetchError,
  } = useGetIeltsReadingQuestions(
    organizationId,
    page,
    100, // Fetch up to 100 items to have enough choices
    search,
    "passageTitle", // Updated sort parameter
    "asc" // In ascending order
  );

  // Get the data from the hook response
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const questions = data?.questions || [];

  // Group questions by passage for selection
  const passageGroups = React.useMemo(() => {
    // Create a map to group questions by passage title (since there's no id)
    const groupedByPassage = new Map();

    // First check if questions is an array
    if (!Array.isArray(questions)) {
      return [];
    }

    questions.forEach((question, index) => {
      if (question.passage && typeof question.passage === "object") {
        // Cast the passage to a more specific type
        const passage = question.passage as {
          title?: string;
          content?: string;
          difficulty?: string;
        };

        // Use title as the identifier
        const passageTitle = passage.title || `Passage ${index + 1}`;

        // Add a generated id for internal use
        const passageWithId = {
          ...passage,
          id: `generated-id-${index}`, // Generate an id for internal use
        };

        if (!groupedByPassage.has(passageTitle)) {
          groupedByPassage.set(passageTitle, {
            passage: passageWithId,
            questions: question.questions || [],
          });
        }
      }
    });

    const groups = Array.from(groupedByPassage.values());

    // Debug logging - remove after testing
    console.log(
      "Available passage titles:",
      groups.map((g) => g.passage?.title)
    );
    console.log("Currently selected passages:", {
      section_one: formData.section_one?.passage?.title,
      section_two: formData.section_two?.passage?.title,
      section_three: formData.section_three?.passage?.title,
    });

    return groups;
  }, [
    questions,
    formData.section_one,
    formData.section_two,
    formData.section_three,
  ]);

  // Filter by difficulty if needed
  const filteredPassages =
    difficulty === "all"
      ? passageGroups
      : passageGroups.filter(
          (group) => (group.passage?.difficulty as string) === difficulty
        );

  const handlePrev = () => {
    if (stepperRef.current) {
      stepperRef.current.prevStep();
    }
  };

  const handleNext = () => {
    if (
      !formData.section_one ||
      !formData.section_two ||
      !formData.section_three
    ) {
      alert("Please select passages for all three sections");
      return;
    }

    if (stepperRef.current) {
      stepperRef.current.nextStep();
    }
  };

  const selectPassage = (
    section: number,
    group: {
      passage?: {
        id: string;
        title: string;
        content: string;
        difficulty: string;
        organizationId?: number;
      };
      questions: Record<string, unknown>[];
    }
  ) => {
    // Create a test section from the selected passage group
    const testSection: IELTSReadingTestSection = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      passage: group.passage as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      questions: group.questions as any,
    };

    // Update the appropriate section
    switch (section) {
      case 1:
        updateFormData({ section_one: testSection });
        break;
      case 2:
        updateFormData({ section_two: testSection });
        break;
      case 3:
        updateFormData({ section_three: testSection });
        break;
    }
  };

  const isPassageSelected = (passageTitle: string) => {
    const selectedTitles = {
      section_one: formData.section_one?.passage?.title,
      section_two: formData.section_two?.passage?.title,
      section_three: formData.section_three?.passage?.title,
    };

    const isSelected =
      formData.section_one?.passage?.title === passageTitle ||
      formData.section_two?.passage?.title === passageTitle ||
      formData.section_three?.passage?.title === passageTitle;

    // Debug logging - remove after testing
    if (isSelected) {
      console.log(
        `Passage "${passageTitle}" is selected. Current selections:`,
        selectedTitles
      );
    }

    return isSelected;
  };

  const getSectionForPassage = (passageTitle: string): number | null => {
    if (formData.section_one?.passage?.title === passageTitle) return 1;
    if (formData.section_two?.passage?.title === passageTitle) return 2;
    if (formData.section_three?.passage?.title === passageTitle) return 3;
    return null;
  };

  const clearSelection = (section: number) => {
    switch (section) {
      case 1:
        updateFormData({ section_one: null });
        break;
      case 2:
        updateFormData({ section_two: null });
        break;
      case 3:
        updateFormData({ section_three: null });
        break;
    }
  };

  const difficultyOptions = [
    { value: "all", label: "All Difficulties" },
    { value: "easy", label: "Easy" },
    { value: "medium", label: "Medium" },
    { value: "hard", label: "Hard" },
  ];

  // Handle search functionality
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSectionChange = (value: string) => {
    setCurrentSection(Number(value.split("-")[1]) as 1 | 2 | 3);
  };

  return (
    <div className="space-y-6 ">
      <Tabs
        value={`section-${currentSection}`}
        onValueChange={handleSectionChange}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="section-1" className="relative">
            Section 1
            {formData.section_one && (
              <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center">
                <Check className="h-3 w-3" />
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="section-2" className="relative">
            Section 2
            {formData.section_two && (
              <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center">
                <Check className="h-3 w-3" />
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="section-3" className="relative">
            Section 3
            {formData.section_three && (
              <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center">
                <Check className="h-3 w-3" />
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {[1, 2, 3].map((section) => (
          <TabsContent
            key={section}
            value={`section-${section}`}
            className="space-y-4"
          >
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Section {section}</h3>

              {/* Show currently selected passage for this section */}
              <SelectedPassageDisplay
                section={section}
                formData={formData}
                clearSelection={clearSelection}
              />

              <div className="flex flex-col md:flex-row gap-3 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search passages..."
                    className="pl-8"
                    value={search}
                    onChange={handleSearchChange}
                  />
                </div>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficultyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 mt-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-3">Loading passages...</span>
                  </div>
                ) : isError ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      Failed to load passages. Please try again.
                      {fetchError instanceof Error && (
                        <p className="text-xs mt-1">{fetchError.message}</p>
                      )}
                    </AlertDescription>
                  </Alert>
                ) : filteredPassages.length > 0 ? (
                  filteredPassages.map((group) => (
                    <PassageCard
                      key={group.passage?.id}
                      group={group}
                      isSelected={isPassageSelected(group.passage?.title || "")}
                      sectionNumber={getSectionForPassage(
                        group.passage?.title || ""
                      )}
                      onSelect={() => {
                        const sectionNum = getSectionForPassage(
                          group.passage?.title || ""
                        );
                        if (sectionNum) {
                          clearSelection(sectionNum);
                        }
                        if (!isPassageSelected(group.passage?.title || "")) {
                          selectPassage(section, group);
                        }
                      }}
                    />
                  ))
                ) : (
                  <div className="text-center py-10 border-2 border-dashed rounded-md">
                    <p>No passages found matching your search</p>
                    {search && (
                      <Button
                        variant="outline"
                        onClick={() => setSearch("")}
                        className="mt-2"
                      >
                        Clear search
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Pagination if needed */}
              {!isLoading &&
                !isError &&
                data?.totalPages &&
                data.totalPages > 1 && (
                  <div className="flex justify-center mt-4">
                    <div className="flex space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                      >
                        Previous
                      </Button>
                      {Array.from(
                        { length: data.totalPages },
                        (_, i) => i + 1
                      ).map((pageNum) => (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page + 1)}
                        disabled={page === data.totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex justify-between">
        <Button onClick={handlePrev} variant="outline">
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={
            !formData.section_one ||
            !formData.section_two ||
            !formData.section_three
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}
