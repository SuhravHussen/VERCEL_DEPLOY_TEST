"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { IELTSListeningTest } from "@/types/exam/ielts-academic/listening/listening";

// Components
import ListeningTestOverlay from "./listening-test-overlay";
import ListeningTestHeader from "./listening-test-header";
import ListeningTestBottomNav from "./listening-test-bottom-nav";
import IELTSQuestionRenderer from "./ielts-question-renderer";
import TextSelectionContextMenu from "./text-selection-context-menu";
import { NotesSheet, AudioStatus } from "./components";

// Custom hooks
import {
  useAudioPlayback,
  useHighlightSystem,
  useNoteManagement,
  useContextMenu,
  useTestData,
  useTestNavigation,
} from "./hooks";

interface IELTSListeningTestPageProps {
  listeningTest: IELTSListeningTest;
  examId: string;
}

export default function IELTSListeningTestPageRefactored({
  listeningTest,
  examId,
}: IELTSListeningTestPageProps) {
  // Core test state
  const [showOverlay, setShowOverlay] = useState(true);
  const [testStarted, setTestStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isNotesSheetOpen, setIsNotesSheetOpen] = useState(false);

  // Refs
  const contentRef = useRef<HTMLDivElement>(null);

  // Dialog
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  // Custom hooks
  const testData = useTestData({ listeningTest, answers });
  const navigation = useTestNavigation({ hasUnsavedChanges, testStarted });
  const audio = useAudioPlayback({
    audioUrls: testData.audioUrls,
    onPartChange: navigation.handlePartChange,
  });
  const highlights = useHighlightSystem({ contentRef });
  const notes = useNoteManagement();
  const contextMenu = useContextMenu({ contentRef, testStarted });

  // Get current section data
  const { currentQuestions } = testData.getCurrentSectionData(
    navigation.currentPart
  );

  // Event handlers
  const handleStartTest = useCallback(() => {
    setShowOverlay(false);
    setTestStarted(true);
    setHasUnsavedChanges(true);
    audio.startSequentialAudioPlayback();
  }, [audio]);

  const handleAnswerChange = useCallback(
    (questionId: string, answer: string | string[]) => {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: answer,
      }));
      setHasUnsavedChanges(true);
    },
    []
  );

  const handleSubmit = useCallback(() => {
    console.log("Listening test answers:", answers);
    console.log("Exam ID:", examId);
    console.log("Total questions answered:", Object.keys(answers).length);

    setHasUnsavedChanges(false);
    audio.stopAudio();

    alert("Test submitted! Check console for results.");
  }, [answers, examId, audio]);

  const handleHighlight = useCallback(
    (text: string) => {
      highlights.addHighlight(text);
    },
    [highlights]
  );

  const handleUnhighlight = useCallback(
    (text: string) => {
      highlights.removeHighlight(text);
    },
    [highlights]
  );

  const handleNote = useCallback(
    (selectedText: string, note: string) => {
      notes.saveNote(selectedText, note);
    },
    [notes]
  );

  const handleRemoveAllHighlights = useCallback(async () => {
    const confirmed = await showConfirmation({
      title: "Remove All Highlights?",
      description:
        "This will remove all highlighted text from your test. This action cannot be undone.",
      confirmText: "Remove All",
      cancelText: "Cancel",
      variant: "destructive",
      onConfirm: () => {},
    });

    if (confirmed) {
      highlights.removeAllHighlights();
    }
  }, [highlights, showConfirmation]);

  // Restore highlights when part changes
  useEffect(() => {
    if (testStarted) {
      highlights.restoreHighlights();
    }
  }, [navigation.currentPart, testStarted, highlights]);

  // Don't render main content until test starts
  if (!testStarted) {
    return (
      <ListeningTestOverlay
        isOpen={showOverlay}
        onStartTest={handleStartTest}
      />
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <ListeningTestHeader
        onSubmit={handleSubmit}
        onTimeUp={handleSubmit}
        onNotesClick={() => setIsNotesSheetOpen(true)}
      />

      {/* Part Header with Audio Status */}
      <div className="bg-background border-b border-border px-3 sm:px-6 lg:px-8 py-2 sm:py-3 flex-shrink-0 w-full">
        <div className="w-full max-w-none">
          <div className="flex items-center justify-between mb-0.5 sm:mb-1">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
              Part {navigation.currentPart}
            </h1>
            <AudioStatus
              isAudioPlaying={audio.isAudioPlaying}
              currentAudioIndex={audio.currentAudioIndex}
              totalAudioCount={testData.audioUrls.length}
            />
          </div>
          <p className="text-muted-foreground text-sm sm:text-base">
            Read the following text and answer the questions{" "}
            {(navigation.currentPart - 1) * 10 + 1} -{" "}
            {navigation.currentPart * 10}.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto" ref={contentRef}>
        <div className="w-full max-w-none px-3 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6">
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {currentQuestions.map((questionGroup, index) => {
              const questions =
                (questionGroup as { questions?: Array<{ number?: number }> })
                  .questions || [];
              const questionNumbers = questions
                .map((q) => q.number)
                .filter((num): num is number => typeof num === "number");
              const firstQuestion =
                questionNumbers.length > 0 ? Math.min(...questionNumbers) : 1;
              const lastQuestion =
                questionNumbers.length > 0 ? Math.max(...questionNumbers) : 1;

              return (
                <div
                  key={questionGroup.id || index}
                  className="space-y-3 sm:space-y-4 lg:space-y-6"
                >
                  <div className="border-b border-border pb-2 sm:pb-3 lg:pb-4">
                    <h2 className="font-semibold text-base sm:text-lg lg:text-xl text-foreground">
                      Question {firstQuestion}
                      {questionNumbers.length > 1 ? ` - ${lastQuestion}` : ""}
                    </h2>
                    <p className="text-muted-foreground mt-1 sm:mt-2 text-xs sm:text-sm lg:text-base">
                      {questionGroup.instruction}
                    </p>
                  </div>

                  <IELTSQuestionRenderer
                    questionGroup={questionGroup}
                    answers={answers}
                    onAnswerChange={handleAnswerChange}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <ListeningTestBottomNav
        currentPart={navigation.currentPart}
        onPartChange={navigation.handlePartChange}
        partProgress={testData.partProgress}
        answers={answers}
        onQuestionJump={navigation.handleQuestionJump}
        partQuestionNumbers={testData.partQuestionNumbers}
      />

      {/* Context Menu */}
      <TextSelectionContextMenu
        isVisible={contextMenu.contextMenu.isVisible}
        position={contextMenu.contextMenu.position}
        selectedText={contextMenu.contextMenu.selectedText}
        onHighlight={handleHighlight}
        onUnhighlight={handleUnhighlight}
        onNote={handleNote}
        onClose={contextMenu.hideContextMenu}
      />

      {/* Notes Sheet */}
      <NotesSheet
        isOpen={isNotesSheetOpen}
        onOpenChange={setIsNotesSheetOpen}
        highlights={highlights.highlights}
        notes={notes.notes}
        onRemoveAllHighlights={handleRemoveAllHighlights}
        onDeleteNote={notes.deleteNote}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog />
    </div>
  );
}
