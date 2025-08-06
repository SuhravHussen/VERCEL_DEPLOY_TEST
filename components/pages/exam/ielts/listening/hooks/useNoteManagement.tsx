"use client";
import { useState, useCallback, useEffect } from "react";

export function useNoteManagement() {
  const [notes, setNotes] = useState<Record<string, string>>({});

  // Load notes from localStorage on mount
  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem("ielts-notes");
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (error) {
      console.error("Error loading notes:", error);
    }
  }, []);

  // Save note to localStorage
  const saveNote = useCallback(
    (selectedText: string, note: string) => {
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
    },
    [notes]
  );

  // Delete a specific note
  const deleteNote = useCallback(
    (selectedText: string) => {
      const updatedNotes = { ...notes };
      delete updatedNotes[selectedText];
      localStorage.setItem("ielts-notes", JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
    },
    [notes]
  );

  // Get existing note for selected text
  const getExistingNote = useCallback(
    (selectedText: string): string => {
      return notes[selectedText] || "";
    },
    [notes]
  );

  return {
    notes,
    saveNote,
    deleteNote,
    getExistingNote,
  };
}
