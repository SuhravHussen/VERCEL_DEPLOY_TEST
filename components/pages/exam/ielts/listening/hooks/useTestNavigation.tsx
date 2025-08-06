"use client";
import { useState, useCallback, useEffect } from "react";
import { useConfirmationDialog } from "@/components/ui/confirmation-dialog";

interface UseTestNavigationProps {
  hasUnsavedChanges: boolean;
  testStarted: boolean;
}

export function useTestNavigation({
  hasUnsavedChanges,
  testStarted,
}: UseTestNavigationProps) {
  const { showConfirmation } = useConfirmationDialog();
  const [currentPart, setCurrentPart] = useState(1);

  // Navigation handlers with bounds checking
  const handlePartChange = useCallback((part: number) => {
    if (part >= 1 && part <= 4) {
      setCurrentPart(part);
    }
  }, []);

  const handlePrevious = useCallback(() => {
    if (currentPart > 1) {
      setCurrentPart(currentPart - 1);
    }
  }, [currentPart]);

  const handleNext = useCallback(() => {
    if (currentPart < 4) {
      setCurrentPart(currentPart + 1);
    }
  }, [currentPart]);

  // Question jumping with scroll functionality
  const handleQuestionJump = useCallback(
    (questionNumber: number) => {
      const targetPart = Math.ceil(questionNumber / 10);

      if (currentPart !== targetPart) {
        setCurrentPart(targetPart);
        setTimeout(() => scrollToQuestion(questionNumber), 300);
      } else {
        setTimeout(() => scrollToQuestion(questionNumber), 100);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentPart]
  );

  // Scroll to specific question
  const scrollToQuestion = useCallback((questionNumber: number) => {
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
      // Try scrollIntoView first
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
        const containerRect = scrollContainer.getBoundingClientRect();
        const questionRect = questionElement.getBoundingClientRect();

        const scrollTop =
          scrollContainer.scrollTop +
          (questionRect.top - containerRect.top) -
          100; // 100px offset

        scrollContainer.scrollTo({
          top: scrollTop,
          behavior: "smooth",
        });
      }
    }
  }, []);

  // Navigation prevention for unsaved changes
  const handleNavigationAttempt = useCallback(async () => {
    if (!hasUnsavedChanges) {
      return true;
    }

    const confirmed = await showConfirmation({
      title: "Leave Test?",
      description:
        "You have unsaved progress. Are you sure you want to leave the test? All your answers will be lost.",
      confirmText: "Leave Test",
      cancelText: "Stay",
      variant: "warning",
      onConfirm: () => {},
    });

    return confirmed;
  }, [hasUnsavedChanges, showConfirmation]);

  // Browser navigation prevention
  useEffect(() => {
    if (!testStarted || !hasUnsavedChanges) return;

    const handlePopState = async (event: PopStateEvent) => {
      event.preventDefault();
      window.history.pushState(null, "", window.location.href);

      const shouldLeave = await handleNavigationAttempt();
      if (shouldLeave) {
        window.history.back();
      }
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
        return event.returnValue;
      }
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [testStarted, hasUnsavedChanges, handleNavigationAttempt]);

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
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [testStarted, handlePrevious, handleNext]);

  return {
    currentPart,
    handlePartChange,
    handlePrevious,
    handleNext,
    handleQuestionJump,
    scrollToQuestion,
  };
}
