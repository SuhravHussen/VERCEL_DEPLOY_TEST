import { HighlightData } from "@/types/listening-test";

export const loadHighlights = (): HighlightData[] => {
  try {
    const savedHighlights = localStorage.getItem("ielts-highlights");
    return savedHighlights ? JSON.parse(savedHighlights) : [];
  } catch (error) {
    console.error("Error loading highlights:", error);
    return [];
  }
};

export const saveHighlights = (highlights: HighlightData[]): void => {
  try {
    localStorage.setItem("ielts-highlights", JSON.stringify(highlights));
  } catch (error) {
    console.error("Error saving highlights:", error);
  }
};

export const loadNotes = (): Record<string, string> => {
  try {
    const savedNotes = localStorage.getItem("ielts-notes");
    return savedNotes ? JSON.parse(savedNotes) : {};
  } catch (error) {
    console.error("Error loading notes:", error);
    return {};
  }
};

export const saveNote = (
  selectedText: string,
  note: string,
  existingNotes: Record<string, string>
): Record<string, string> => {
  try {
    const updatedNotes = { ...existingNotes };
    if (note.trim()) {
      updatedNotes[selectedText] = note;
    } else {
      delete updatedNotes[selectedText];
    }
    localStorage.setItem("ielts-notes", JSON.stringify(updatedNotes));
    return updatedNotes;
  } catch (error) {
    console.error("Error saving note:", error);
    return existingNotes;
  }
};

export const deleteNote = (
  selectedText: string,
  existingNotes: Record<string, string>
): Record<string, string> => {
  const updatedNotes = { ...existingNotes };
  delete updatedNotes[selectedText];
  localStorage.setItem("ielts-notes", JSON.stringify(updatedNotes));
  return updatedNotes;
};

export const clearHighlights = (): void => {
  try {
    localStorage.removeItem("ielts-highlights");
  } catch (error) {
    console.error("Error clearing highlights:", error);
  }
};
