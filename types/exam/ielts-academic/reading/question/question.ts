// ========================= INTERFACES =========================

export type IELTSReadingQuestionType =
  | "multiple_choice"
  | "multiple_choice_multiple_answers"
  | "true_false_not_given"
  | "yes_no_not_given"
  | "matching_information"
  | "matching_headings"
  | "matching_features"
  | "matching_sentence_endings"
  | "sentence_completion"
  | "summary_completion"
  | "note_completion"
  | "table_completion"
  | "flow_chart_completion"
  | "diagram_label_completion"
  | "short_answer";

export interface IELTSReadingPassage {
  id?: string;
  title: string;
  content: string;
  difficulty: "easy" | "medium" | "hard";
  organizationId?: number;
}

export interface IELTSReadingTestSection {
  passage?: IELTSReadingPassage;
  questions: IELTSReadingQuestionGroup[];
}

// Base interface for question groups
export interface IELTSReadingQuestionGroup {
  id: string;
  questionType: string;
  instruction: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  questions: Record<string, any>[];
  [key: string]: unknown; // Allow additional properties for specific question types
}

// Specific question group types
export interface MultipleChoiceGroup extends IELTSReadingQuestionGroup {
  questionType: "multiple_choice";
  questions: {
    number: number;
    question: string;
    options: string[];
    answer: string;
  }[];
}

export interface MultipleChoiceMultipleAnswersGroup
  extends IELTSReadingQuestionGroup {
  questionType: "multiple_choice_multiple_answers";
  questions: {
    number: number;
    question: string;
    answers: string[];
  }[];
  options?: string[];
  answersRequired?: 2 | 3;
}

export interface TrueFalseNotGivenGroup extends IELTSReadingQuestionGroup {
  questionType: "true_false_not_given";
  questions: {
    number: number;
    statement: string;
    answer: "true" | "false" | "not_given";
  }[];
}

export interface YesNoNotGivenGroup extends IELTSReadingQuestionGroup {
  questionType: "yes_no_not_given";
  questions: {
    number: number;
    statement: string;
    answer: "yes" | "no" | "not_given";
  }[];
}

export interface MatchingInformationGroup extends IELTSReadingQuestionGroup {
  questionType: "matching_information";
  questions: {
    number: number;
    statement: string;
    correctParagraph: string;
    imageUrl?: string;
  }[];
  paragraphLabels?: string[];
}

export interface MatchingHeadingsGroup extends IELTSReadingQuestionGroup {
  questionType: "matching_headings";
  questions: {
    paragraph: string;
    correctHeading: string;
  }[];
  headings?: string[];
}

export interface MatchingFeaturesGroup extends IELTSReadingQuestionGroup {
  questionType: "matching_features";
  questions: {
    number: number;
    statement: string;
    correctFeature: string;
  }[];
  features?: { label: string; description: string }[];
}

export interface MatchingSentenceEndingsGroup
  extends IELTSReadingQuestionGroup {
  questionType: "matching_sentence_endings";
  questions: {
    number: number;
    sentenceStart: string;
    correctEnding: string;
  }[];
  endings?: { label: string; text: string }[];
}

export interface SentenceCompletionGroup extends IELTSReadingQuestionGroup {
  questionType: "sentence_completion";
  questions: {
    number: number;
    sentenceWithBlank: string;
    correctAnswer: string;
    imageUrl?: string;
  }[];
  wordLimit?: number;
  wordLimitText?: string;
}

export interface SummaryCompletionGroup extends IELTSReadingQuestionGroup {
  questionType: "summary_completion";
  summaryText?: string;
  questions: {
    gapId: string;
    correctAnswer: string;
  }[];
  wordLimit?: number;
  wordLimitText?: string;
  options?: string[];
}

export interface NoteCompletionGroup extends IELTSReadingQuestionGroup {
  questionType: "note_completion";
  noteText?: string;
  questions: {
    gapId: string;
    correctAnswer?: string;
  }[];
  wordLimit?: number;
  wordLimitText?: string;
  options?: string[];
}

export interface TableCompletionGroup extends IELTSReadingQuestionGroup {
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

export interface FlowChartCompletionGroup extends IELTSReadingQuestionGroup {
  questionType: "flow_chart_completion";

  // Chart creation method
  chartType: "image" | "text";

  // For image-based flowcharts
  chartImage?: string;
  inputPositions?: {
    stepId: string;
    x: number; // X coordinate relative to image
    y: number; // Y coordinate relative to image
  }[];

  // For text-based flowcharts
  textSteps?: {
    stepId: string;
    stepNumber: number;
    textBefore?: string; // Text before the gap
    textAfter?: string; // Text after the gap
    isGap: boolean; // Whether this step contains a gap
  }[];

  // Common properties
  questions: {
    stepId: string;
    correctAnswer: string;
  }[];

  wordLimit?: number;
  wordLimitText?: string;
  options?: string[]; // Optional word bank

  // Additional metadata
  instructions?: string;
  totalGaps?: number;
}

export interface DiagramLabelCompletionGroup extends IELTSReadingQuestionGroup {
  questionType: "diagram_label_completion";

  // Image-based diagram only
  diagramImage?: string;
  inputPositions?: {
    labelId: string;
    x: number; // X coordinate relative to image
    y: number; // Y coordinate relative to image
  }[];

  // Questions and answers
  questions: {
    labelId: string;
    correctAnswer: string;
  }[];

  wordLimit?: number;
  wordLimitText?: string;
  options?: string[]; // Optional word bank
}

export interface ShortAnswerGroup extends IELTSReadingQuestionGroup {
  questionType: "short_answer";
  questions: {
    number: number;
    question: string;
    correctAnswer: string;
  }[];
  maxWords?: number;
  wordLimitText?: string;
}
