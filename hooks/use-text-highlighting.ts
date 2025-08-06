import { useState, useEffect, useRef } from "react";
import { HighlightData, ContextMenuState } from "@/types/listening-test";
import {
  loadHighlights,
  saveHighlights,
  clearHighlights,
} from "@/lib/listening-test-storage";

interface ConfirmationOptions {
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  variant: string;
  onConfirm: () => void;
}

export interface UseTextHighlightingReturn {
  highlights: HighlightData[];
  contextMenu: ContextMenuState;
  contentRef: React.RefObject<HTMLDivElement | null>;
  handleHighlight: (text: string) => void;
  handleUnhighlight: (text: string) => void;
  removeAllHighlights: () => Promise<void>;
  handleCloseContextMenu: () => void;
}

export const useTextHighlighting = (
  testStarted: boolean,
  currentPart: number,
  showConfirmation: (options: ConfirmationOptions) => Promise<boolean>
): UseTextHighlightingReturn => {
  const [highlights, setHighlights] = useState<HighlightData[]>([]);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    isVisible: false,
    position: { x: 0, y: 0 },
    selectedText: "",
  });
  const contentRef = useRef<HTMLDivElement>(null);

  // Load highlights from localStorage
  useEffect(() => {
    setHighlights(loadHighlights());
  }, []);

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

  // Apply highlight to DOM
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
    setHighlights(updatedHighlights);

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
    setHighlights(remainingHighlights);
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
        clearHighlights();
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

  // Close context menu
  const handleCloseContextMenu = () => {
    setContextMenu((prev) => ({ ...prev, isVisible: false }));
  };

  return {
    highlights,
    contextMenu,
    contentRef,
    handleHighlight,
    handleUnhighlight,
    removeAllHighlights,
    handleCloseContextMenu,
  };
};
