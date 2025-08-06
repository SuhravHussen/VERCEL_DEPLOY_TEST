import { useCallback } from "react";

export interface UseReadingQuestionJumpingReturn {
  handleQuestionJump: (questionNumber: number) => void;
}

export const useReadingQuestionJumping = (
  currentSection: number,
  setCurrentSection: (section: number) => void,
  sectionQuestionNumbers: Record<number, number[]>
): UseReadingQuestionJumpingReturn => {
  const scrollToQuestion = useCallback((questionNumber: number) => {
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

      // Fallback: Find the scrollable container (questions panel)
      const scrollContainer = document.querySelector(
        ".h-full.overflow-y-auto.bg-background:not(.border-r)"
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
    }
  }, []);

  const handleQuestionJump = useCallback(
    (questionNumber: number) => {
      // Determine which section this question belongs to
      let targetSection = currentSection;

      for (const [sectionId, questionNumbers] of Object.entries(
        sectionQuestionNumbers
      )) {
        if (questionNumbers.includes(questionNumber)) {
          targetSection = parseInt(sectionId);
          break;
        }
      }

      // Switch to the correct section if not already there
      if (currentSection !== targetSection) {
        setCurrentSection(targetSection);
        // Wait longer for the section to change and DOM to update
        setTimeout(() => scrollToQuestion(questionNumber), 300);
      } else {
        // Add a small delay even for same section to ensure DOM is ready
        setTimeout(() => scrollToQuestion(questionNumber), 100);
      }
    },
    [
      currentSection,
      setCurrentSection,
      scrollToQuestion,
      sectionQuestionNumbers,
    ]
  );

  return {
    handleQuestionJump,
  };
};
