import { useCallback } from "react";

export interface UseQuestionJumpingReturn {
  handleQuestionJump: (questionNumber: number) => void;
}

export const useQuestionJumping = (
  currentPart: number,
  setCurrentPart: (part: number) => void
): UseQuestionJumpingReturn => {
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
  }, []);

  const handleQuestionJump = useCallback(
    (questionNumber: number) => {
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
    },
    [currentPart, setCurrentPart, scrollToQuestion]
  );

  return {
    handleQuestionJump,
  };
};
