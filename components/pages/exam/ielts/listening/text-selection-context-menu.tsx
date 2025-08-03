"use client";

import { useState, useRef, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Edit, NotebookPen, Minus } from "lucide-react";

interface ContextMenuProps {
  isVisible: boolean;
  position: { x: number; y: number };
  selectedText: string;
  onHighlight: (text: string) => void;
  onUnhighlight: (text: string) => void;
  onNote: (text: string, note: string) => void;
  onClose: () => void;
}

export default function TextSelectionContextMenu({
  isVisible,
  position,
  selectedText,
  onHighlight,
  onUnhighlight,
  onNote,
  onClose,
}: ContextMenuProps) {
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [dialogSelectedText, setDialogSelectedText] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  // Get existing note for selected text
  const existingNote = useMemo(() => {
    if (!selectedText) return "";
    try {
      const notes = JSON.parse(localStorage.getItem("ielts-notes") || "{}");
      return notes[selectedText] || "";
    } catch {
      return "";
    }
  }, [selectedText]);

  // Check if selected text is already highlighted
  const isTextHighlighted = useMemo(() => {
    if (!selectedText) return false;

    try {
      const highlights = JSON.parse(
        localStorage.getItem("ielts-highlights") || "[]"
      );
      return highlights.some(
        (highlight: { text: string; id: string }) =>
          highlight.text.toLowerCase().includes(selectedText.toLowerCase()) ||
          selectedText.toLowerCase().includes(highlight.text.toLowerCase())
      );
    } catch {
      return false;
    }
  }, [selectedText]);

  const handleHighlightClick = useCallback(() => {
    if (isTextHighlighted) {
      onUnhighlight(selectedText);
    } else {
      onHighlight(selectedText);
    }
    onClose();
  }, [isTextHighlighted, selectedText, onHighlight, onUnhighlight, onClose]);

  const handleNoteClick = useCallback(() => {
    setDialogSelectedText(selectedText);
    setNoteText(existingNote);
    setShowNoteDialog(true);
  }, [selectedText, existingNote]);

  const handleNoteSave = useCallback(() => {
    if (noteText.trim()) {
      onNote(dialogSelectedText, noteText.trim());
    }
    setShowNoteDialog(false);
    setNoteText("");
    setDialogSelectedText("");
    onClose();
  }, [noteText, dialogSelectedText, onNote, onClose]);

  const handleNoteCancel = useCallback(() => {
    setShowNoteDialog(false);
    setNoteText("");
    setDialogSelectedText("");
    onClose();
  }, [onClose]);

  // Position the menu within viewport bounds
  const menuStyle = useMemo(() => {
    if (!isVisible) return { display: "none" };

    const menuWidth = 160;
    const menuHeight = 80;
    let { x, y } = position;

    // Adjust if menu would go off-screen
    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - 10;
    }
    if (y + menuHeight > window.innerHeight) {
      y = y - menuHeight - 10;
    }

    return {
      position: "fixed" as const,
      left: `${x}px`,
      top: `${y}px`,
      zIndex: 1000,
    };
  }, [isVisible, position]);

  return (
    <>
      {/* Context Menu */}
      {isVisible && (
        <div
          ref={menuRef}
          style={menuStyle}
          className="bg-popover border border-border rounded-md shadow-lg py-1 min-w-[140px]"
          onMouseLeave={onClose}
        >
          <button
            onClick={handleHighlightClick}
            className="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground flex items-center gap-2 transition-colors"
          >
            {isTextHighlighted ? (
              <>
                <Minus className="w-4 h-4" />
                Remove Highlight
              </>
            ) : (
              <>
                <Edit className="w-4 h-4" />
                Highlight
              </>
            )}
          </button>
          <button
            onClick={handleNoteClick}
            className="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground flex items-center gap-2 transition-colors"
          >
            <NotebookPen className="w-4 h-4" />
            {existingNote ? "Edit Note" : "Add Note"}
          </button>
        </div>
      )}

      {/* Pre-mounted Note Dialog - Always in DOM for instant response */}
      <Dialog
        open={showNoteDialog}
        onOpenChange={(open) => !open && handleNoteCancel()}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <NotebookPen className="w-4 h-4" />
              {existingNote ? "Edit Note" : "Add Note"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Selected Text:
              </label>
              <div className="mt-1 p-2 bg-muted rounded text-sm max-h-20 overflow-y-auto">
                &quot;{dialogSelectedText}&quot;
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Note:
              </label>
              <Textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Enter your note here..."
                className="mt-1 min-h-[100px]"
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleNoteCancel}>
                Cancel
              </Button>
              <Button onClick={handleNoteSave} disabled={!noteText.trim()}>
                {existingNote ? "Update Note" : "Save Note"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
