"use client";
import { useState, useCallback, useEffect, RefObject } from "react";

export interface HighlightData {
  text: string;
  id: string;
}

interface UseHighlightSystemProps {
  contentRef: RefObject<HTMLDivElement | null>;
}

export function useHighlightSystem({ contentRef }: UseHighlightSystemProps) {
  const [highlights, setHighlights] = useState<HighlightData[]>([]);

  // Load highlights from localStorage on mount
  useEffect(() => {
    try {
      const savedHighlights = localStorage.getItem("ielts-highlights");
      if (savedHighlights) {
        setHighlights(JSON.parse(savedHighlights));
      }
    } catch (error) {
      console.error("Error loading highlights:", error);
    }
  }, []);

  // Save highlights to localStorage
  const saveHighlights = useCallback((newHighlights: HighlightData[]) => {
    try {
      localStorage.setItem("ielts-highlights", JSON.stringify(newHighlights));
      setHighlights(newHighlights);
    } catch (error) {
      console.error("Error saving highlights:", error);
    }
  }, []);

  // Remove highlight from DOM
  const removeHighlightFromDOM = useCallback(
    (highlightId: string) => {
      if (!contentRef.current) return;

      const highlightElements = contentRef.current.querySelectorAll(
        `[data-highlight-id="${highlightId}"]`
      );
      highlightElements.forEach((element) => {
        const parent = element.parentNode;
        if (parent) {
          const textNode = document.createTextNode(element.textContent || "");
          parent.replaceChild(textNode, element);
          parent.normalize();
        }
      });
    },
    [contentRef]
  );

  // Apply highlight to DOM
  const applyHighlightToDOM = useCallback(
    (text: string, highlightId: string) => {
      if (!contentRef.current) return;

      const walker = document.createTreeWalker(
        contentRef.current,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
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
          break;
        }
      }
    },
    [contentRef]
  );

  // Add highlight
  const addHighlight = useCallback(
    (text: string) => {
      const highlightId = `highlight-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const newHighlight: HighlightData = {
        text,
        id: highlightId,
      };

      const existingHighlights = [...highlights];
      const filteredHighlights = existingHighlights.filter((highlight) => {
        const isContained = text
          .toLowerCase()
          .includes(highlight.text.toLowerCase());
        const isOverlapping =
          highlight.text.toLowerCase().includes(text.toLowerCase()) ||
          text.toLowerCase().includes(highlight.text.toLowerCase());

        if (isContained || isOverlapping) {
          removeHighlightFromDOM(highlight.id);
          return false;
        }
        return true;
      });

      const updatedHighlights = [...filteredHighlights, newHighlight];
      saveHighlights(updatedHighlights);
      applyHighlightToDOM(text, highlightId);
    },
    [highlights, removeHighlightFromDOM, saveHighlights, applyHighlightToDOM]
  );

  // Remove highlight
  const removeHighlight = useCallback(
    (text: string) => {
      const existingHighlights = [...highlights];
      const highlightsToRemove = existingHighlights.filter(
        (highlight) =>
          highlight.text.toLowerCase().includes(text.toLowerCase()) ||
          text.toLowerCase().includes(highlight.text.toLowerCase())
      );

      highlightsToRemove.forEach((highlight) => {
        removeHighlightFromDOM(highlight.id);
      });

      const remainingHighlights = existingHighlights.filter(
        (highlight) =>
          !highlightsToRemove.some((toRemove) => toRemove.id === highlight.id)
      );

      saveHighlights(remainingHighlights);
    },
    [highlights, removeHighlightFromDOM, saveHighlights]
  );

  // Remove all highlights
  const removeAllHighlights = useCallback(() => {
    try {
      localStorage.removeItem("ielts-highlights");
      setHighlights([]);

      if (contentRef.current) {
        const highlightElements = contentRef.current.querySelectorAll(
          "[data-highlight-id]"
        );
        highlightElements.forEach((element) => {
          const parent = element.parentNode;
          if (parent) {
            const textNode = document.createTextNode(element.textContent || "");
            parent.replaceChild(textNode, element);
            parent.normalize();
          }
        });
      }
    } catch (error) {
      console.error("Error removing highlights:", error);
    }
  }, [contentRef]);

  // Restore highlights when content changes
  const restoreHighlights = useCallback(() => {
    if (!contentRef.current) return;

    setTimeout(() => {
      highlights.forEach((highlight) => {
        applyHighlightToDOM(highlight.text, highlight.id);
      });
    }, 100);
  }, [highlights, applyHighlightToDOM, contentRef]);

  // Check if text is highlighted
  const isTextHighlighted = useCallback(
    (text: string) => {
      if (!text) return false;

      // Check for exact match (should show "Remove Highlight")
      const hasExactMatch = highlights.some(
        (highlight) =>
          highlight.text.toLowerCase().trim() === text.toLowerCase().trim()
      );

      if (hasExactMatch) {
        return true;
      }

      // Check if selected text is completely contained within an existing highlight
      // (should show "Remove Highlight")
      const isCompletelyContained = highlights.some(
        (highlight) =>
          highlight.text.toLowerCase().includes(text.toLowerCase()) &&
          highlight.text.toLowerCase().trim() !== text.toLowerCase().trim()
      );

      if (isCompletelyContained) {
        return true;
      }

      // If selected text partially overlaps or extends beyond existing highlights,
      // should show "Highlight" to extend the selection
      return false;
    },
    [highlights]
  );

  return {
    highlights,
    addHighlight,
    removeHighlight,
    removeAllHighlights,
    restoreHighlights,
    isTextHighlighted,
  };
}
