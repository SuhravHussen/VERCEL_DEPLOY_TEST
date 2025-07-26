// ========================= LISTENING TYPES =========================

export interface IELTSListeningAudio {
  title: string;
  audioUrl: string;
  transcript?: string;
  difficulty: "easy" | "medium" | "hard";
}

// Represents a complete IELTS Listening test with 4 sections
export interface IELTSListeningTest {
  id: string;
  title: string;
  description?: string;
  organizationId: number;
  difficulty: "easy" | "medium" | "hard";
  createdAt: string;
  updatedAt: string;
  section_one: IELTSListeningTestSection;
  section_two: IELTSListeningTestSection;
  section_three: IELTSListeningTestSection;
  section_four: IELTSListeningTestSection;
  createdBy: string;
  status: "published" | "archived";
  totalQuestionCount?: number; // Should be exactly 40 for a valid test
  timeLimit?: number; // Typically 30 minutes
  instructions?: string;
}

// Section with audio and question groups
export interface IELTSListeningTestSection {
  audio: IELTSListeningAudio;
  questions: IELTSListeningQuestionGroup[];
}

// Types of listening questions
export type IELTSListeningQuestionType =
  | "multiple_choice"
  | "multiple_choice_multiple_answers"
  | "sentence_completion"
  | "form_completion"
  | "note_completion"
  | "table_completion"
  | "flow_chart_completion"
  | "diagram_label_completion"
  | "matching"
  | "short_answer";

// Base group
export interface IELTSListeningQuestionGroup {
  id: string;
  questionType: IELTSListeningQuestionType;
  instruction: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  questions: Record<string, any>[];
  [key: string]: unknown;
}

// Group types

export interface ListeningMultipleChoiceGroup
  extends IELTSListeningQuestionGroup {
  questionType: "multiple_choice";
  questions: {
    number: number;
    question: string;
    options: string[];
    answer: string;
  }[];
}

export interface ListeningMultipleChoiceMultipleAnswersGroup
  extends IELTSListeningQuestionGroup {
  questionType: "multiple_choice_multiple_answers";
  questions: {
    number: number;
    question: string;
    answers: string[];
  }[];
  options?: string[];
  answersRequired?: 2 | 3;
}

export interface ListeningSentenceCompletionGroup
  extends IELTSListeningQuestionGroup {
  questionType: "sentence_completion";
  questions: {
    number: number;
    sentenceWithBlank: string;
    correctAnswer: string;
  }[];
  wordLimit?: number;
  wordLimitText?: string;
}

export interface ListeningFormCompletionGroup
  extends IELTSListeningQuestionGroup {
  questionType: "form_completion";
  questions: {
    number: number;
    sentenceWithBlank: string;
    correctAnswer: string;
  }[];
  wordLimit?: number;
  wordLimitText?: string;
  options?: string[];
}

export interface ListeningNoteCompletionGroup
  extends IELTSListeningQuestionGroup {
  questionType: "note_completion";
  noteText?: string;
  questions: {
    gapId: string;
    correctAnswer: string;
  }[];
  wordLimit?: number;
  wordLimitText?: string;
  options?: string[];
}

export interface ListeningTableCompletionGroup
  extends IELTSListeningQuestionGroup {
  questionType: "table_completion";
  tableStructure?: string[][];
  questions: {
    cellId: string;
    correctAnswer: string;
  }[];
  wordLimit?: number;
  wordLimitText?: string;
  options?: string[];
}

export interface ListeningFlowChartCompletionGroup
  extends IELTSListeningQuestionGroup {
  questionType: "flow_chart_completion";
  chartStructure?: string;
  chartImage?: string;
  questions: {
    stepId: string;
    correctAnswer: string;
  }[];
  wordLimit?: number;
  wordLimitText?: string;
  options?: string[];
  startingQuestionNumber?: number;
}

export interface ListeningDiagramLabelCompletionGroup
  extends IELTSListeningQuestionGroup {
  questionType: "diagram_label_completion";
  diagramImage?: string;
  diagramDescription?: string;
  questions: {
    labelId: string;
    correctAnswer: string;
  }[];
  wordLimit?: number;
  wordLimitText?: string;
  options?: string[];
}

export interface ListeningMatchingGroup extends IELTSListeningQuestionGroup {
  questionType: "matching";
  questions: {
    number: number;
    prompt: string;
    correctMatch: string;
  }[];
  options?: string[];
}

export interface ListeningShortAnswerGroup extends IELTSListeningQuestionGroup {
  questionType: "short_answer";
  questions: {
    number: number;
    question: string;
    correctAnswer: string;
  }[];
  maxWords?: number;
  wordLimitText?: string;
}
