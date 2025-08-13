"use client";

import { useState, useEffect } from "react";
import ListeningTestOverlay from "./listening-test-overlay";
import ListeningTestHeader from "./listening-test-header";
import ListeningTestBottomNav from "./listening-test-bottom-nav";
import ListeningTestPartHeader from "./listening-test-part-header";
import ListeningTestContent from "./listening-test-content";
import NotesHighlightsSheet from "./notes-highlights-sheet";
import TextSelectionContextMenu from "./text-selection-context-menu";
import { useConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useSimpleAudioPlayer } from "@/hooks/use-simple-audio-player";
import { useTextHighlighting } from "@/hooks/use-text-highlighting";
import { useNotesManagement } from "@/hooks/use-notes-management";
import { useQuestionJumping } from "@/hooks/use-question-jumping";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useListeningTestFullData } from "@/hooks/use-exam-test-data";
import { IELTSListeningTest } from "@/types/exam/ielts-academic/listening/listening";
import {
  convertListeningTestToSections,
  getAudioUrlsWithSectionMapping,
  calculatePartProgress,
  extractPartQuestionNumbers,
} from "@/lib/listening-test-utils";
import { audioManager } from "@/lib/audio-manager";

interface IELTSListeningTestPageProps {
  listeningTest: IELTSListeningTest;
  regId: string;
  type?: "practice" | "registered";
}

export default function IELTSListeningTestPage({
  listeningTest,
  regId,
  type = "registered",
}: IELTSListeningTestPageProps) {
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();
  const { fetchListeningTestFullData } = useListeningTestFullData();

  // Basic state
  const [showOverlay, setShowOverlay] = useState(true);
  const [testStarted, setTestStarted] = useState(false);
  const [currentPart, setCurrentPart] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [isNotesSheetOpen, setIsNotesSheetOpen] = useState(false);
  const [fullTestData, setFullTestData] = useState<IELTSListeningTest | null>(
    null
  );
  const [isStartingTest, setIsStartingTest] = useState(false);

  // Use full test data if available, otherwise use basic info
  const currentTestData = fullTestData || listeningTest;

  // Convert sections to array format
  const sections = convertListeningTestToSections(currentTestData);
  const audioItems = getAudioUrlsWithSectionMapping(sections);

  // Extract just the URLs for the simple audio player
  const audioUrls = audioItems.map((item) => {
    // Fix GitHub raw URLs format
    return item.url.includes("github.com") && item.url.includes("/raw/")
      ? item.url
          .replace("github.com", "raw.githubusercontent.com")
          .replace("/raw/master/", "/master/")
      : item.url;
  });

  // Debug: Log audio URLs (only once)
  useEffect(() => {
    console.log("=== IELTS LISTENING TEST - SIMPLE AUDIO ===");
    console.log(`Found ${audioUrls.length} audio files:`);
    audioUrls.forEach((url, index) => {
      console.log(`Audio ${index + 1}: ${url}`);
    });
    console.log("==========================================");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Simple audio player hook
  const audioPlayer = useSimpleAudioPlayer(audioUrls);

  const textHighlighting = useTextHighlighting(
    testStarted,
    currentPart,
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
  const questionJumping = useQuestionJumping(currentPart, setCurrentPart);

  // Navigation and keyboard shortcuts
  const handlePrevious = () => {
    if (currentPart > 1) {
      setCurrentPart(currentPart - 1);
    }
  };

  const handleNext = () => {
    if (currentPart < 4) {
      setCurrentPart(currentPart + 1);
    }
  };

  const handleSubmit = () => {
    console.log("Listening test answers:", answers);
    console.log("Registration ID:", regId);
    console.log("Total questions answered:", Object.keys(answers).length);

    // Clear any flags after submission (removed navigation prevention)

    // Stop any playing audio
    audioPlayer.stopPlayback();

    // Here you would typically submit to a server action
    alert("Test submitted! Check console for results.");
  };

  useKeyboardShortcuts(
    testStarted,
    currentPart,
    handlePrevious,
    handleNext,
    handleSubmit
  );

  // Calculate progress and question numbers
  const partProgress = calculatePartProgress(sections, answers);
  const partQuestionNumbers = extractPartQuestionNumbers(sections);

  const handleStartTest = async () => {
    try {
      setIsStartingTest(true);

      // Fetch full exam data with questions
      console.log("Fetching full exam data...");
      const fullData = await fetchListeningTestFullData(regId, type);

      if (!fullData) {
        throw new Error("Failed to fetch full exam data");
      }

      setFullTestData(fullData);
      setShowOverlay(false);
      setTestStarted(true);

      // Start audio playback immediately in user interaction context
      console.log("Starting test - attempting to play audio...");
      audioPlayer.startPlayback();
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

  const handleAnswerChange = (
    questionId: string,
    answer: string | string[]
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handlePartChange = (part: number) => {
    setCurrentPart(part);
  };

  // Cleanup audio on unmount and page leave
  useEffect(() => {
    // Register with the audio manager
    const unregisterAudioCleanup = audioManager.registerCleanup(() => {
      console.log("🚨 AudioManager cleanup - force stopping audio player");
      audioPlayer.forceStopPlayback();
    });

    // Removed handleBeforeUnload - we want audio to continue if user cancels reload
    // If user actually reloads, page refreshes and audio stops naturally

    // Create a force stop function for NavigationGuard
    const forceStopAudio = () => {
      console.log("🚨 NavigationGuard triggered - stopping all audio");
      audioManager.stopAllAudio();
    };

    // Register cleanup function with parent NavigationGuard wrapper
    if (typeof window !== "undefined") {
      const globalWindow = window as typeof window & {
        __listeningTestCleanup?: (cleanupFn: (() => void) | null) => void;
      };
      if (globalWindow.__listeningTestCleanup) {
        console.log("🚨 Registering cleanup function with NavigationGuard");
        globalWindow.__listeningTestCleanup(forceStopAudio);
      } else {
        console.log("🚨 NavigationGuard cleanup function not available");
      }
    }

    // No beforeunload event listener - let audio continue if user cancels reload

    return () => {
      // Cleanup audio and remove event listeners
      console.log("🚨 Component unmounting - stopping all audio");
      audioManager.stopAllAudio();
      unregisterAudioCleanup();
      // No beforeunload listener to remove since we don't add one

      // Clear the global cleanup function
      if (typeof window !== "undefined") {
        const globalWindow = window as typeof window & {
          __listeningTestCleanup?: (cleanupFn: (() => void) | null) => void;
        };
        if (globalWindow.__listeningTestCleanup) {
          globalWindow.__listeningTestCleanup(null);
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only runs on mount/unmount

  const currentSection = sections[currentPart - 1]?.section;
  const currentQuestions = currentSection?.questions || [];

  if (!testStarted) {
    return (
      <ListeningTestOverlay
        isOpen={showOverlay}
        onStartTest={handleStartTest}
        isLoading={isStartingTest}
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

      {/* Fixed Part Header with Audio Status */}
      <ListeningTestPartHeader
        currentPart={currentPart}
        isAudioPlaying={audioPlayer.isPlaying}
        currentAudioIndex={audioPlayer.currentAudioIndex}
        audioUrlsLength={audioUrls.length}
      />

      {/* Scrollable Main Content with Text Selection */}
      <div className="flex-1 overflow-auto" ref={textHighlighting.contentRef}>
        <ListeningTestContent
          currentQuestions={currentQuestions}
          answers={answers}
          onAnswerChange={handleAnswerChange}
        />
      </div>

      {/* Fixed Bottom Navigation */}
      <ListeningTestBottomNav
        currentPart={currentPart}
        onPartChange={handlePartChange}
        partProgress={partProgress}
        answers={answers}
        onQuestionJump={questionJumping.handleQuestionJump}
        partQuestionNumbers={partQuestionNumbers}
      />

      {/* Text Selection Context Menu */}
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

      {/* Notes and Highlights Management Sheet */}
      <NotesHighlightsSheet
        isOpen={isNotesSheetOpen}
        onOpenChange={setIsNotesSheetOpen}
        highlights={textHighlighting.highlights}
        notes={notesManagement.notes}
        onRemoveAllHighlights={textHighlighting.removeAllHighlights}
        onDeleteNote={notesManagement.handleDeleteNote}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog />
    </div>
  );
}
