export interface HighlightData {
  text: string;
  id: string;
}

export interface ContextMenuState {
  isVisible: boolean;
  position: { x: number; y: number };
  selectedText: string;
}

export interface PartProgress {
  [key: number]: { total: number; answered: number };
}

export interface PartQuestionNumbers {
  [key: number]: number[];
}

export interface ListeningTestState {
  showOverlay: boolean;
  testStarted: boolean;
  currentPart: number;
  answers: Record<string, string | string[]>;
  hasUnsavedChanges: boolean;
  currentAudioIndex: number;
  isAudioPlaying: boolean;
  highlights: HighlightData[];
  notes: Record<string, string>;
  isNotesSheetOpen: boolean;
  contextMenu: ContextMenuState;
}
