"use client";
import { useState, useCallback, useEffect, RefObject } from "react";

interface ContextMenuState {
  isVisible: boolean;
  position: { x: number; y: number };
  selectedText: string;
}

interface UseContextMenuProps {
  contentRef: RefObject<HTMLDivElement | null>;
  testStarted: boolean;
}

export function useContextMenu({
  contentRef,
  testStarted,
}: UseContextMenuProps) {
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    isVisible: false,
    position: { x: 0, y: 0 },
    selectedText: "",
  });

  const showContextMenu = useCallback(
    (position: { x: number; y: number }, selectedText: string) => {
      setContextMenu({
        isVisible: true,
        position,
        selectedText,
      });
    },
    []
  );

  const hideContextMenu = useCallback(() => {
    setContextMenu((prev) => ({ ...prev, isVisible: false }));
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
        showContextMenu({ x: e.clientX, y: e.clientY }, selectedText);
      }
    };

    const handleClickOutside = () => {
      hideContextMenu();
    };

    if (testStarted) {
      document.addEventListener("contextmenu", handleContextMenu);
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [testStarted, contentRef, showContextMenu, hideContextMenu]);

  return {
    contextMenu,
    showContextMenu,
    hideContextMenu,
  };
}
