"use client";

import { useState, memo } from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FileText, BookOpen } from "lucide-react";
import { IELTSReadingTest } from "@/types/exam/ielts-academic/reading/test/test";
import { IELTSReadingQuestionGroup } from "@/types/exam/ielts-academic/reading/question/question";

import ReadingTestOverlay from "./reading-test-overlay";
import ReadingTestHeader from "./reading-test-header";
import ReadingTestBottomNav from "./reading-test-bottom-nav";
import ReadingQuestionRenderer from "./reading-question-renderer";
import ReadingTestSectionHeader from "./reading-test-section-header";
import NotesHighlightsSheet from "./notes-highlights-sheet";
import TextSelectionContextMenu from "./text-selection-context-menu";
import {
  convertReadingTestToSections,
  calculateSectionProgress,
  extractSectionQuestionNumbers,
  ReadingSection,
} from "@/lib/reading-test-utils";
import { useConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useTextHighlighting } from "@/hooks/use-text-highlighting";
import { useNotesManagement } from "@/hooks/use-notes-management";
import { useReadingQuestionJumping } from "@/hooks/use-reading-question-jumping";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useReadingTestFullData } from "@/hooks/use-exam-test-data";

interface IELTSReadingTestPageProps {
  readingTest: IELTSReadingTest;
  regId?: string;
  type?: "practice" | "registered";
}

const ReadingTestContent = memo(function ReadingTestContent({
  currentQuestions,
  answers,
  onAnswerChange,
}: {
  currentQuestions: IELTSReadingQuestionGroup[];
  answers: Record<string, string | string[]>;
  onAnswerChange: (questionId: string, answer: string | string[]) => void;
}) {
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {currentQuestions.map((questionGroup) => (
        <ReadingQuestionRenderer
          key={questionGroup.id}
          questionGroup={questionGroup}
          answers={answers}
          onAnswerChange={onAnswerChange}
        />
      ))}
    </div>
  );
});

const ReadingPassageContent = memo(function ReadingPassageContent({
  currentSectionData,
}: {
  currentSectionData: ReadingSection | undefined;
}) {
  const content = currentSectionData?.section.passage?.content || "";

  // Split content into paragraphs for better readability and text selection
  const paragraphs = content.split("\n\n").filter((p) => p.trim());

  return (
    <div className="p-4 sm:p-6">
      <div className="prose prose-sm sm:prose-base max-w-none text-foreground">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-foreground">
          {currentSectionData?.section.passage?.title}
        </h2>
        <div className="whitespace-pre-wrap leading-relaxed text-foreground space-y-4">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="mb-4 leading-relaxed">
              {paragraph.trim()}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
});

export default function IELTSReadingTestPage({
  readingTest,
  regId,
  type = "registered",
}: IELTSReadingTestPageProps) {
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();
  const { fetchReadingTestFullData } = useReadingTestFullData();

  const [showOverlay, setShowOverlay] = useState(true);
  const [currentSection, setCurrentSection] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [testStarted, setTestStarted] = useState(false);
  const [isNotesSheetOpen, setIsNotesSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("passage");
  const [fullTestData, setFullTestData] = useState<IELTSReadingTest | null>(
    null
  );
  const [isStartingTest, setIsStartingTest] = useState(false);

  // Use full test data if available, otherwise use basic info
  const currentTestData = fullTestData || readingTest;

  const sections = convertReadingTestToSections(currentTestData);
  const sectionProgress = calculateSectionProgress(sections, answers);
  const sectionQuestionNumbers = extractSectionQuestionNumbers(sections);

  const currentSectionData = sections.find((s) => s.id === currentSection);
  const currentQuestions = currentSectionData?.section.questions || [];

  const textHighlighting = useTextHighlighting(
    testStarted,
    currentSection,
    (options) =>
      showConfirmation({
        ...options,
        variant: options.variant as
          | "destructive"
          | "default"
          | "warning"
          | "info"
          | undefined,
      })
  );

  const notesManagement = useNotesManagement();
  const questionJumping = useReadingQuestionJumping(
    currentSection,
    setCurrentSection,
    sectionQuestionNumbers
  );

  const handleAnswerChange = (
    questionId: string,
    answer: string | string[]
  ) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSectionChange = (sectionId: number) => {
    setCurrentSection(sectionId);
  };

  const handlePrevious = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleNext = () => {
    const maxSection = Math.max(...sections.map((s) => s.id));
    if (currentSection < maxSection) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handleSubmit = () => {
    showConfirmation({
      title: "Submit Test?",
      description:
        "Are you sure you want to submit your test? This cannot be undone.",
      confirmText: "Submit",
      variant: "warning",
      onConfirm: () => {
        console.log("Test submitted with answers:", answers);
      },
    });
  };

  const handleStartTest = async () => {
    try {
      setIsStartingTest(true);

      // Fetch full exam data with questions if regId is provided
      if (regId) {
        console.log("Fetching full reading test data...");
        const fullData = await fetchReadingTestFullData(regId, type);

        if (!fullData) {
          throw new Error("Failed to fetch full exam data");
        }

        setFullTestData(fullData);
      }

      setShowOverlay(false);
      setTestStarted(true);
    } catch (error) {
      console.error("Error starting test:", error);
      showConfirmation({
        title: "Error Starting Test",
        description: "Failed to load exam data. Please try again.",
        confirmText: "OK",
        variant: "destructive",
        onConfirm: () => {},
      });
    } finally {
      setIsStartingTest(false);
    }
  };

  useKeyboardShortcuts(
    testStarted,
    currentSection,
    handlePrevious,
    handleNext,
    handleSubmit
  );

  // Show overlay if test hasn't started yet
  if (!testStarted) {
    return (
      <ReadingTestOverlay
        isOpen={showOverlay}
        onStartTest={handleStartTest}
        isLoading={isStartingTest}
      />
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <ReadingTestHeader
        onSubmit={handleSubmit}
        onTimeUp={handleSubmit}
        onNotesClick={() => setIsNotesSheetOpen(!isNotesSheetOpen)}
      />

      <ReadingTestSectionHeader
        currentSection={currentSection}
        sectionTitle={currentSectionData?.section.passage?.title || ""}
      />

      <div className="flex-1 overflow-hidden" ref={textHighlighting.contentRef}>
        {/* Mobile Tabs Layout */}
        <div className="block lg:hidden h-full">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="h-full flex flex-col"
          >
            <div className="px-4">
              <TabsList className="grid w-full grid-cols-2 p-0 mt-2">
                <TabsTrigger
                  value="passage"
                  className="flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  Passage
                </TabsTrigger>
                <TabsTrigger
                  value="questions"
                  className="flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Questions
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="passage" className="flex-1 overflow-y-auto">
                <div className="h-full bg-background">
                  <ReadingPassageContent
                    currentSectionData={currentSectionData}
                  />
                </div>
              </TabsContent>

              <TabsContent
                value="questions"
                className="flex-1 overflow-y-auto mt-2"
              >
                <div className="h-full bg-background">
                  <ReadingTestContent
                    currentQuestions={currentQuestions}
                    answers={answers}
                    onAnswerChange={handleAnswerChange}
                  />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Desktop Resizable Layout */}
        <div className="hidden lg:block h-full">
          <div className="h-full">
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel defaultSize={50} minSize={30}>
                <div className="h-full overflow-y-auto bg-background border-r border-border">
                  <ReadingPassageContent
                    currentSectionData={currentSectionData}
                  />
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={50} minSize={30}>
                <div className="h-full overflow-y-auto bg-background">
                  <ReadingTestContent
                    currentQuestions={currentQuestions}
                    answers={answers}
                    onAnswerChange={handleAnswerChange}
                  />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
      </div>

      <ReadingTestBottomNav
        currentSection={currentSection}
        onSectionChange={handleSectionChange}
        sectionProgress={sectionProgress}
        answers={answers}
        onQuestionJump={questionJumping.handleQuestionJump}
        sectionQuestionNumbers={sectionQuestionNumbers}
      />

      <TextSelectionContextMenu
        isVisible={textHighlighting.contextMenu.isVisible}
        position={textHighlighting.contextMenu.position}
        selectedText={textHighlighting.contextMenu.selectedText}
        highlights={textHighlighting.highlights}
        onHighlight={textHighlighting.handleHighlight}
        onUnhighlight={textHighlighting.handleUnhighlight}
        onNote={notesManagement.handleNote}
        onClose={textHighlighting.handleCloseContextMenu}
      />

      <NotesHighlightsSheet
        isOpen={isNotesSheetOpen}
        onOpenChange={setIsNotesSheetOpen}
        highlights={textHighlighting.highlights}
        notes={notesManagement.notes}
        onRemoveAllHighlights={textHighlighting.removeAllHighlights}
        onDeleteNote={notesManagement.handleDeleteNote}
      />

      <ConfirmationDialog />
    </div>
  );
}
