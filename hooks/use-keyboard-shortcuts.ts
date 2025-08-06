import { useEffect } from "react";

export const useKeyboardShortcuts = (
  testStarted: boolean,
  currentPart: number,
  handlePrevious: () => void,
  handleNext: () => void,
  handleSubmit: () => void
): void => {
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
  }, [testStarted, currentPart, handlePrevious, handleNext, handleSubmit]);
};
