import { useState, useEffect } from "react";
import { loadNotes, saveNote, deleteNote } from "@/lib/listening-test-storage";

export interface UseNotesManagementReturn {
  notes: Record<string, string>;
  handleNote: (selectedText: string, note: string) => void;
  handleDeleteNote: (selectedText: string) => void;
}

export const useNotesManagement = (): UseNotesManagementReturn => {
  const [notes, setNotes] = useState<Record<string, string>>({});

  // Load notes from localStorage on mount
  useEffect(() => {
    setNotes(loadNotes());
  }, []);

  const handleNote = (selectedText: string, note: string) => {
    const updatedNotes = saveNote(selectedText, note, notes);
    setNotes(updatedNotes);
  };

  const handleDeleteNote = (selectedText: string) => {
    const updatedNotes = deleteNote(selectedText, notes);
    setNotes(updatedNotes);
  };

  return {
    notes,
    handleNote,
    handleDeleteNote,
  };
};
