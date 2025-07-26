// // Represents a group of questions of a single type (e.g., all MCQs)
// export interface QuestionGroup {
//   id: string;
//   questionType: string;
//   instruction: string;
//   questions: Array<{
//     number?: number;
//     question?: string;
//     statement?: string;
//     sentenceStart?: string;
//     sentenceWithBlank?: string; // For sentence completion
//     answer?: string | string[];
//     options?: string[];
//     // for table completion
//     cellId?: string;
//     // for summary/note/flow-chart/diagram completion
//     gapId?: string;
//     stepId?: string;
//     // for matching
//     correctParagraph?: string;
//     correctHeading?: string;
//     correctFeature?: string;
//     correctEnding?: string;

//     [key: string]: unknown;
//   }>;

//   // For matching types
//   paragraphLabels?: string[];
//   headings?: string[];
//   features?: { label: string; description: string }[];
//   endings?: { label: string; text: string }[];
//   options?: string[];
//   answersRequired?: 2 | 3;

//   // For completion types
//   wordLimit?: number;
//   wordLimitText?: string;
//   summaryText?: string;
//   noteText?: string;
//   tableStructure?: string[][];
//   chartStructure?: string;
//   diagramDescription?: string;

//   // For image-based questions
//   groupImage?: string;
//   diagramImage?: string;
//   chartImage?: string;

//   // For short answer
//   maxWords?: number;

//   startingQuestionNumber?: number;

//   [key: string]: unknown;
// }

// // Represents a passage and all its associated question groups
// export interface PassageWithQuestions {
//   passage: {
//     title: string;
//     content: string;
//     difficulty: "easy" | "medium" | "hard";
//   };
//   questions:
// }
