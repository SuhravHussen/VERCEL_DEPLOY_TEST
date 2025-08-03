"use client";

import { useState, useEffect, useRef } from "react";
import ListeningTestOverlay from "./listening-test-overlay";
import ListeningTestHeader from "./listening-test-header";
import ListeningTestBottomNav from "./listening-test-bottom-nav";
import IELTSQuestionRenderer from "./ielts-question-renderer";
import TextSelectionContextMenu from "./text-selection-context-menu";
import { useConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { IELTSListeningTest } from "@/types/exam/ielts-academic/listening/listening";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Trash2, FileText, Highlighter } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface IELTSListeningTestPageProps {
  listeningTest: IELTSListeningTest;
  examId: string;
}

interface HighlightData {
  text: string;
  id: string;
}

export default function IELTSListeningTestPage({
  listeningTest,
  examId,
}: IELTSListeningTestPageProps) {
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();
  const [showOverlay, setShowOverlay] = useState(true);
  const [testStarted, setTestStarted] = useState(false);
  const [currentPart, setCurrentPart] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Text selection and context menu states
  const [contextMenu, setContextMenu] = useState({
    isVisible: false,
    position: { x: 0, y: 0 },
    selectedText: "",
  });
  const [highlights, setHighlights] = useState<HighlightData[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [isNotesSheetOpen, setIsNotesSheetOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Convert sections to array format
  const sections = [
    { id: 1, section: listeningTest.section_one },
    { id: 2, section: listeningTest.section_two },
    { id: 3, section: listeningTest.section_three },
    { id: 4, section: listeningTest.section_four },
  ];

  // Get all audio URLs in order
  const audioUrls = sections
    .map(({ section }) => section.audio?.audioUrl)
    .filter((url): url is string => !!url);

  // Load highlights and notes from localStorage
  useEffect(() => {
    try {
      const savedHighlights = localStorage.getItem("ielts-highlights");
      if (savedHighlights) {
        setHighlights(JSON.parse(savedHighlights));
      }

      const savedNotes = localStorage.getItem("ielts-notes");
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (error) {
      console.error("Error loading highlights and notes:", error);
    }
  }, []);

  // Save highlights to localStorage
  const saveHighlights = (newHighlights: HighlightData[]) => {
    try {
      localStorage.setItem("ielts-highlights", JSON.stringify(newHighlights));
      setHighlights(newHighlights);
    } catch (error) {
      console.error("Error saving highlights:", error);
    }
  };

  // Save note to localStorage
  const saveNote = (selectedText: string, note: string) => {
    try {
      const existingNotes = { ...notes };
      if (note.trim()) {
        existingNotes[selectedText] = note;
      } else {
        delete existingNotes[selectedText];
      }
      localStorage.setItem("ielts-notes", JSON.stringify(existingNotes));
      setNotes(existingNotes);
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  // Remove all highlights
  const removeAllHighlights = async () => {
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
      try {
        // Remove from localStorage
        localStorage.removeItem("ielts-highlights");
        setHighlights([]);

        // Remove from DOM
        if (contentRef.current) {
          const highlightElements = contentRef.current.querySelectorAll(
            "[data-highlight-id]"
          );
          highlightElements.forEach((element) => {
            const parent = element.parentNode;
            if (parent) {
              const textNode = document.createTextNode(
                element.textContent || ""
              );
              parent.replaceChild(textNode, element);
              parent.normalize();
            }
          });
        }
      } catch (error) {
        console.error("Error removing highlights:", error);
      }
    }
  };

  // Delete a specific note
  const deleteNote = (selectedText: string) => {
    const updatedNotes = { ...notes };
    delete updatedNotes[selectedText];
    localStorage.setItem("ielts-notes", JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

  // Handle text selection and right-click
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      // Only handle context menu in the main content area
      if (!contentRef.current?.contains(e.target as Node)) return;

      const selection = window.getSelection();
      const selectedText = selection?.toString().trim();

      if (selectedText && selectedText.length > 0) {
        e.preventDefault();
        setContextMenu({
          isVisible: true,
          position: { x: e.clientX, y: e.clientY },
          selectedText,
        });
      }
    };

    const handleClickOutside = () => {
      setContextMenu((prev) => ({ ...prev, isVisible: false }));
    };

    if (testStarted) {
      document.addEventListener("contextmenu", handleContextMenu);
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [testStarted]);

  // Handle highlighting
  const handleHighlight = (text: string) => {
    const highlightId = `highlight-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const newHighlight: HighlightData = {
      text,
      id: highlightId,
    };

    // Check if this text overlaps with existing highlights
    const existingHighlights = [...highlights];

    // Remove any existing highlights that are contained within the new selection
    const filteredHighlights = existingHighlights.filter((highlight) => {
      const isContained = text
        .toLowerCase()
        .includes(highlight.text.toLowerCase());
      const isOverlapping =
        highlight.text.toLowerCase().includes(text.toLowerCase()) ||
        text.toLowerCase().includes(highlight.text.toLowerCase());

      if (isContained || isOverlapping) {
        // Remove the old highlight from DOM
        removeHighlightFromDOM(highlight.id);
        return false;
      }
      return true;
    });

    const updatedHighlights = [...filteredHighlights, newHighlight];
    saveHighlights(updatedHighlights);

    // Apply highlight to the actual DOM text
    applyHighlightToDOM(text, highlightId);
  };

  // Handle unhighlighting
  const handleUnhighlight = (text: string) => {
    const existingHighlights = [...highlights];

    // Find highlights that match or overlap with the selected text
    const highlightsToRemove = existingHighlights.filter(
      (highlight) =>
        highlight.text.toLowerCase().includes(text.toLowerCase()) ||
        text.toLowerCase().includes(highlight.text.toLowerCase())
    );

    // Remove highlights from DOM
    highlightsToRemove.forEach((highlight) => {
      removeHighlightFromDOM(highlight.id);
    });

    // Remove from storage
    const remainingHighlights = existingHighlights.filter(
      (highlight) =>
        !highlightsToRemove.some((toRemove) => toRemove.id === highlight.id)
    );

    saveHighlights(remainingHighlights);
  };

  // Remove highlight from DOM
  const removeHighlightFromDOM = (highlightId: string) => {
    if (!contentRef.current) return;

    const highlightElements = contentRef.current.querySelectorAll(
      `[data-highlight-id="${highlightId}"]`
    );
    highlightElements.forEach((element) => {
      const parent = element.parentNode;
      if (parent) {
        // Replace the highlighted span with its text content
        const textNode = document.createTextNode(element.textContent || "");
        parent.replaceChild(textNode, element);

        // Normalize adjacent text nodes
        parent.normalize();
      }
    });
  };

  // Apply highlight to DOM - improved version
  const applyHighlightToDOM = (text: string, highlightId: string) => {
    if (!contentRef.current) return;

    const walker = document.createTreeWalker(
      contentRef.current,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          // Skip already highlighted text nodes
          const parent = node.parentElement;
          if (parent && parent.hasAttribute("data-highlight-id")) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        },
      }
    );

    const textNodes: Text[] = [];
    let node;
    while ((node = walker.nextNode())) {
      textNodes.push(node as Text);
    }

    for (const textNode of textNodes) {
      const content = textNode.textContent || "";
      const lowerContent = content.toLowerCase();
      const lowerText = text.toLowerCase();
      const index = lowerContent.indexOf(lowerText);

      if (index !== -1) {
        const beforeText = content.substring(0, index);
        const matchText = content.substring(index, index + text.length);
        const afterText = content.substring(index + text.length);

        const fragment = document.createDocumentFragment();

        if (beforeText) {
          fragment.appendChild(document.createTextNode(beforeText));
        }

        const highlightSpan = document.createElement("span");
        highlightSpan.className =
          "bg-yellow-200 dark:bg-yellow-800 px-1 rounded transition-colors";
        highlightSpan.dataset.highlightId = highlightId;
        highlightSpan.textContent = matchText;
        fragment.appendChild(highlightSpan);

        if (afterText) {
          fragment.appendChild(document.createTextNode(afterText));
        }

        textNode.parentNode?.replaceChild(fragment, textNode);
        break; // Only highlight first occurrence per text node
      }
    }
  };

  // Restore highlights on part change
  useEffect(() => {
    if (!testStarted || !contentRef.current) return;

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      highlights.forEach((highlight) => {
        applyHighlightToDOM(highlight.text, highlight.id);
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [currentPart, testStarted, highlights]);

  // Handle note taking
  const handleNote = (selectedText: string, note: string) => {
    saveNote(selectedText, note);
  };

  // Close context menu
  const handleCloseContextMenu = () => {
    setContextMenu((prev) => ({ ...prev, isVisible: false }));
  };

  // Calculate part progress using actual numbered questions
  const partProgress = sections.reduce((acc, { id, section }) => {
    const questions = section.questions || [];
    let totalQuestions = 0;
    let answeredQuestions = 0;

    questions.forEach((group) => {
      const groupQuestions =
        (group as { questions?: Array<{ number?: number; gapId?: string }> })
          .questions || [];

      groupQuestions.forEach((question) => {
        totalQuestions++;
        const questionId = `q${question.number || question.gapId}`;
        if (answers[questionId]) {
          answeredQuestions++;
        }
      });

      // Handle group-level answers for multiple choice multiple answers
      if (group.questionType === "multiple_choice_multiple_answers") {
        const groupAnswers = answers[`group_${group.id}`];
        if (
          groupAnswers &&
          Array.isArray(groupAnswers) &&
          groupAnswers.length > 0
        ) {
          answeredQuestions = Math.min(answeredQuestions + 1, totalQuestions);
        }
      }
    });

    acc[id] = { total: totalQuestions, answered: answeredQuestions };
    return acc;
  }, {} as Record<number, { total: number; answered: number }>);

  // Extract actual question numbers for each part
  const partQuestionNumbers = sections.reduce((acc, { id, section }) => {
    const questions = section.questions || [];
    const questionNumbers: number[] = [];

    questions.forEach((group) => {
      const groupQuestions =
        (group as { questions?: Array<{ number?: number; gapId?: string }> })
          .questions || [];

      groupQuestions.forEach((question) => {
        if (question.number) {
          questionNumbers.push(question.number);
        }
      });
    });

    // Sort question numbers in ascending order
    questionNumbers.sort((a, b) => a - b);
    acc[id] = questionNumbers;
    return acc;
  }, {} as Record<number, number[]>);

  // Sequential audio playback system
  const playAudio = (audioUrl: string, audioIndex: number) => {
    return new Promise<void>((resolve, reject) => {
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.addEventListener("loadeddata", () => {
        console.log(`Starting audio for section ${audioIndex + 1}`);
        setIsAudioPlaying(true);
        audio.play().catch(reject);
      });

      audio.addEventListener("ended", () => {
        console.log(`Finished audio for section ${audioIndex + 1}`);
        setIsAudioPlaying(false);
        resolve();
      });

      audio.addEventListener("error", (e) => {
        console.error(`Error playing audio for section ${audioIndex + 1}:`, e);
        setIsAudioPlaying(false);
        reject(e);
      });

      // Load the audio
      audio.load();
    });
  };

  const startSequentialAudioPlayback = async () => {
    if (audioUrls.length === 0) {
      console.log("No audio files found");
      return;
    }

    for (let i = 0; i < audioUrls.length; i++) {
      try {
        setCurrentAudioIndex(i);
        // Automatically switch to the current part when its audio starts
        setCurrentPart(i + 1);

        await playAudio(audioUrls[i], i);

        // Small delay between audio files
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Failed to play audio ${i + 1}:`, error);
        // Continue to next audio even if current one fails
        continue;
      }
    }

    console.log("All audio files have finished playing");
    setIsAudioPlaying(false);
    setCurrentAudioIndex(-1);
  };

  const handleStartTest = () => {
    setShowOverlay(false);
    setTestStarted(true);
    setHasUnsavedChanges(true);

    // Start sequential audio playback
    startSequentialAudioPlayback();
  };

  const handleAnswerChange = (
    questionId: string,
    answer: string | string[]
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
    setHasUnsavedChanges(true);
  };

  const handlePartChange = (part: number) => {
    setCurrentPart(part);
  };

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
    console.log("Exam ID:", examId);
    console.log("Total questions answered:", Object.keys(answers).length);

    // Clear unsaved changes flag after submission
    setHasUnsavedChanges(false);

    // Stop any playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    setIsAudioPlaying(false);

    // Here you would typically submit to a server action
    alert("Test submitted! Check console for results.");
  };

  // Handle navigation prevention
  const handleNavigationAttempt = async () => {
    if (!hasUnsavedChanges) {
      return true; // Allow navigation if no unsaved changes
    }

    const confirmed = await showConfirmation({
      title: "Leave Test?",
      description:
        "You have unsaved progress. Are you sure you want to leave the test? All your answers will be lost.",
      confirmText: "Leave Test",
      cancelText: "Stay",
      variant: "warning",
      onConfirm: () => {
        setHasUnsavedChanges(false);
      },
    });

    return confirmed;
  };

  // Prevent browser back button and page refresh
  useEffect(() => {
    if (!testStarted || !hasUnsavedChanges) return;

    // Handle browser back button
    const handlePopState = async (event: PopStateEvent) => {
      event.preventDefault();
      // Push current state back to prevent navigation
      window.history.pushState(null, "", window.location.href);

      const shouldLeave = await handleNavigationAttempt();
      if (shouldLeave) {
        // Allow navigation by going back
        setHasUnsavedChanges(false);
        window.history.back();
      }
    };

    // Handle page refresh/close
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
        return event.returnValue;
      }
    };

    // Push initial state to history
    window.history.pushState(null, "", window.location.href);

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testStarted, hasUnsavedChanges]);

  // Handle question jumping from bottom navigation
  const handleQuestionJump = (questionNumber: number) => {
    // First, determine which part this question belongs to
    const targetPart = Math.ceil(questionNumber / 10);

    // Switch to the correct part if not already there
    if (currentPart !== targetPart) {
      setCurrentPart(targetPart);
      // Wait longer for the part to change and DOM to update
      setTimeout(() => scrollToQuestion(questionNumber), 300);
    } else {
      // Add a small delay even for same part to ensure DOM is ready
      setTimeout(() => scrollToQuestion(questionNumber), 100);
    }
  };

  const scrollToQuestion = (questionNumber: number) => {
    // Try to find the question element by various possible IDs
    const possibleSelectors = [
      `#question-${questionNumber}`,
      `[data-question="${questionNumber}"]`,
      `#q${questionNumber}`,
    ];

    let questionElement: HTMLElement | null = null;

    for (const selector of possibleSelectors) {
      questionElement = document.querySelector(selector);
      if (questionElement) {
        break;
      }
    }

    if (questionElement) {
      // Try scrollIntoView first (simpler approach)
      try {
        questionElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
        return;
      } catch (error) {
        console.warn("scrollIntoView failed, trying container method:", error);
      }

      // Fallback: Find the scrollable container
      const scrollContainer = document.querySelector(
        ".flex-1.overflow-auto"
      ) as HTMLElement;

      if (scrollContainer) {
        // Get the position of the question relative to the scroll container
        const containerRect = scrollContainer.getBoundingClientRect();
        const questionRect = questionElement.getBoundingClientRect();

        // Calculate the scroll position
        const scrollTop =
          scrollContainer.scrollTop +
          (questionRect.top - containerRect.top) -
          100; // 100px offset

        scrollContainer.scrollTo({
          top: scrollTop,
          behavior: "smooth",
        });
      } else {
        console.warn("Scroll container not found");
      }
    } else {
      // Debug: log all elements with question IDs
      const allQuestionElements = document.querySelectorAll(
        '[data-question], [id^="question-"], [id^="q"]'
      );
      console.log(
        "All question elements found:",
        Array.from(allQuestionElements).map((el) => ({
          id: el.id,
          dataQuestion: el.getAttribute("data-question"),
          tagName: el.tagName,
        }))
      );
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!testStarted) return;

      if (event.ctrlKey && event.key === "ArrowLeft") {
        event.preventDefault();
        handlePrevious();
      } else if (event.ctrlKey && event.key === "ArrowRight") {
        event.preventDefault();
        handleNext();
      } else if (event.altKey && event.key === "n") {
        event.preventDefault();
        handleNext();
      } else if (event.altKey && event.key === "p") {
        event.preventDefault();
        handlePrevious();
      } else if (event.altKey && event.key === "f") {
        event.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testStarted, currentPart]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  const currentSection = sections[currentPart - 1]?.section;
  const currentQuestions = currentSection?.questions || [];

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

      {/* Fixed Part Header with Audio Status */}
      <div className="bg-background border-b border-border px-3 sm:px-6 lg:px-8 py-2 sm:py-3 flex-shrink-0 w-full">
        <div className="w-full max-w-none">
          <div className="flex items-center justify-between mb-0.5 sm:mb-1">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
              Part {currentPart}
            </h1>
            {isAudioPlaying && (
              <div className="flex items-center gap-2 text-sm text-primary">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                Playing Audio {currentAudioIndex + 1} of {audioUrls.length}
              </div>
            )}
          </div>
          <p className="text-muted-foreground text-sm sm:text-base">
            Read the following text and answer the questions{" "}
            {(currentPart - 1) * 10 + 1} - {currentPart * 10}.
          </p>
        </div>
      </div>

      {/* Scrollable Main Content with Text Selection */}
      <div className="flex-1 overflow-auto" ref={contentRef}>
        <div className="w-full max-w-none px-3 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6">
          {/* Question Groups */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {currentQuestions.map((questionGroup, index) => {
              // Get question numbers from the actual questions
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
                  {/* Question Range Header */}
                  <div className="border-b border-border pb-2 sm:pb-3 lg:pb-4">
                    <h2 className="font-semibold text-base sm:text-lg lg:text-xl text-foreground">
                      Question {firstQuestion}
                      {questionNumbers.length > 1 ? ` - ${lastQuestion}` : ""}
                    </h2>
                    <p className="text-muted-foreground mt-1 sm:mt-2 text-xs sm:text-sm lg:text-base">
                      {questionGroup.instruction}
                    </p>
                  </div>

                  {/* Questions */}
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

      {/* Fixed Bottom Navigation */}
      <ListeningTestBottomNav
        currentPart={currentPart}
        onPartChange={handlePartChange}
        partProgress={partProgress}
        answers={answers}
        onQuestionJump={handleQuestionJump}
        partQuestionNumbers={partQuestionNumbers}
      />

      {/* Text Selection Context Menu */}
      <TextSelectionContextMenu
        isVisible={contextMenu.isVisible}
        position={contextMenu.position}
        selectedText={contextMenu.selectedText}
        onHighlight={handleHighlight}
        onUnhighlight={handleUnhighlight}
        onNote={handleNote}
        onClose={handleCloseContextMenu}
      />

      {/* Notes and Highlights Management Sheet */}
      <Sheet open={isNotesSheetOpen} onOpenChange={setIsNotesSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] p-6">
          <SheetHeader className="mb-6">
            <SheetTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Notes & Highlights
            </SheetTitle>
            <SheetDescription>
              Manage your notes and highlights for this test.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-8">
            {/* Highlights Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Highlighter className="w-4 h-4" />
                  Highlights ({highlights.length})
                </h3>
                {highlights.length > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={removeAllHighlights}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Remove All
                  </Button>
                )}
              </div>

              {highlights.length === 0 ? (
                <div className="p-4 border-2 border-dashed  rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">
                    No highlights yet. Select text and right-click to highlight.
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[200px] pr-4">
                  <div className="space-y-3">
                    {highlights.map((highlight) => (
                      <div
                        key={highlight.id}
                        className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
                      >
                        <p className="text-sm text-foreground leading-relaxed">
                          &quot;{highlight.text}&quot;
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>

            {/* Notes Section */}
            <div>
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Notes ({Object.keys(notes).length})
              </h3>

              {Object.keys(notes).length === 0 ? (
                <div className="p-4 border-2 border-dashed rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">
                    No notes yet. Select text and right-click to add notes.
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-4">
                    {Object.entries(notes).map(([selectedText, note]) => (
                      <div
                        key={selectedText}
                        className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground mb-3 leading-relaxed">
                              &quot;{selectedText}&quot;
                            </p>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {note}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNote(selectedText)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 p-2 h-auto shrink-0"
                            title="Delete note"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Confirmation Dialog */}
      <ConfirmationDialog />
    </div>
  );
}
