import {
  IELTSReadingTestSection,
  IELTSReadingQuestionGroup,
  SummaryCompletionGroup,
  TableCompletionGroup,
  NoteCompletionGroup,
  FlowChartCompletionGroup,
  DiagramLabelCompletionGroup,
  MatchingHeadingsGroup,
  MatchingSentenceEndingsGroup,
} from "@/types/exam/ielts-academic/reading/question/question";

interface PassageStat {
  passageNumber: number;
  passageTitle: string;
  difficulty: string;
  questionCount: number;
  questionRange: string;
  questionTypes: Record<string, number>;
}

interface AddQuestionNumberingResult {
  numberedSections: IELTSReadingTestSection[];
  totalQuestions: number;
  passageStats: PassageStat[];
  summary: {
    totalPassages: number;
    totalQuestions: number;
    averageQuestionsPerPassage: number;
    difficultyBreakdown: Record<string, number>;
  };
}

export function addQuestionNumbering(
  ieltsTestSections: IELTSReadingTestSection[]
): AddQuestionNumberingResult {
  if (!ieltsTestSections || ieltsTestSections.length === 0)
    return {
      numberedSections: [],
      totalQuestions: 0,
      passageStats: [],
      summary: {
        totalPassages: 0,
        totalQuestions: 0,
        averageQuestionsPerPassage: 0,
        difficultyBreakdown: {},
      },
    };

  let currentQuestionNumber = 1;
  const passageStats: PassageStat[] = [];

  // Create a deep copy to avoid modifying the original array
  const numberedSections: IELTSReadingTestSection[] = JSON.parse(
    JSON.stringify(ieltsTestSections)
  );

  numberedSections.forEach((section, sectionIndex) => {
    const sectionStartNumber = currentQuestionNumber;
    let sectionQuestionCount = 0;
    const questionTypeStats: Record<string, number> = {};

    section.questions.forEach((questionGroup: IELTSReadingQuestionGroup) => {
      const questionType = questionGroup.questionType;
      let questionsInGroup = 0;

      // Handle different question structures
      if (questionGroup.questions && Array.isArray(questionGroup.questions)) {
        // For question groups with 'questions' array
        questionGroup.questions.forEach((question) => {
          // Add number property safely
          Object.assign(question, { number: currentQuestionNumber });
          currentQuestionNumber++;
          questionsInGroup++;
          sectionQuestionCount++;
        });
      } else if (
        questionGroup.questionType === "summary_completion" &&
        (questionGroup as SummaryCompletionGroup).questions
      ) {
        // For summary completion with gap-based questions
        (questionGroup as SummaryCompletionGroup).questions.forEach(
          (question) => {
            // Add number property safely
            Object.assign(question, { number: currentQuestionNumber });
            question.gapId = currentQuestionNumber.toString();
            currentQuestionNumber++;
            questionsInGroup++;
            sectionQuestionCount++;
          }
        );
      } else if (
        questionGroup.questionType === "table_completion" &&
        (questionGroup as TableCompletionGroup).questions
      ) {
        // For table completion with cell-based questions
        (questionGroup as TableCompletionGroup).questions.forEach(
          (question) => {
            // Add number property safely
            Object.assign(question, { number: currentQuestionNumber });
            question.cellId = currentQuestionNumber.toString();
            currentQuestionNumber++;
            questionsInGroup++;
            sectionQuestionCount++;
          }
        );
      } else if (
        questionGroup.questionType === "note_completion" &&
        (questionGroup as NoteCompletionGroup).questions
      ) {
        // For note completion with gap-based questions
        (questionGroup as NoteCompletionGroup).questions.forEach((question) => {
          // Add number property safely
          Object.assign(question, { number: currentQuestionNumber });
          question.gapId = currentQuestionNumber.toString();
          currentQuestionNumber++;
          questionsInGroup++;
          sectionQuestionCount++;
        });
      } else if (
        questionGroup.questionType === "flow_chart_completion" &&
        (questionGroup as FlowChartCompletionGroup).questions
      ) {
        // For flow chart completion
        (questionGroup as FlowChartCompletionGroup).startingQuestionNumber =
          currentQuestionNumber;
        (questionGroup as FlowChartCompletionGroup).questions.forEach(
          (question) => {
            // Add number property safely
            Object.assign(question, { number: currentQuestionNumber });
            question.stepId = currentQuestionNumber.toString();
            currentQuestionNumber++;
            questionsInGroup++;
            sectionQuestionCount++;
          }
        );
      } else if (
        questionGroup.questionType === "diagram_label_completion" &&
        (questionGroup as DiagramLabelCompletionGroup).questions
      ) {
        // For diagram label completion
        (questionGroup as DiagramLabelCompletionGroup).questions.forEach(
          (question) => {
            // Add number property safely
            Object.assign(question, { number: currentQuestionNumber });
            question.stepId = currentQuestionNumber.toString();
            currentQuestionNumber++;
            questionsInGroup++;
            sectionQuestionCount++;
          }
        );
      } else if (
        questionGroup.questionType === "matching_headings" &&
        (questionGroup as MatchingHeadingsGroup).questions
      ) {
        // For matching headings
        (questionGroup as MatchingHeadingsGroup).questions.forEach(
          (question) => {
            // Add number property safely
            Object.assign(question, { number: currentQuestionNumber });
            currentQuestionNumber++;
            questionsInGroup++;
            sectionQuestionCount++;
          }
        );
      } else if (
        questionGroup.questionType === "matching_sentence_endings" &&
        (questionGroup as MatchingSentenceEndingsGroup).questions
      ) {
        // For matching sentence endings
        (questionGroup as MatchingSentenceEndingsGroup).questions.forEach(
          (question) => {
            if (!("number" in question)) {
              // Add number property safely if it doesn't exist
              Object.assign(question, { number: currentQuestionNumber });
            }
            currentQuestionNumber++;
            questionsInGroup++;
            sectionQuestionCount++;
          }
        );
      } else {
        // Fallback for other question types

        if (typeof window === "undefined") {
          // Only log on server

          console.warn(`Unhandled question type: ${questionType}`);
        }
      }

      // Track question types and their counts
      questionTypeStats[questionType] =
        (questionTypeStats[questionType] || 0) + questionsInGroup;
    });

    const sectionEndNumber = currentQuestionNumber - 1;

    passageStats.push({
      passageNumber: sectionIndex + 1,
      passageTitle: section.passage?.title || "",
      difficulty: section.passage?.difficulty || "",
      questionCount: sectionQuestionCount,
      questionRange: `${sectionStartNumber}-${sectionEndNumber}`,
      questionTypes: questionTypeStats,
    });
  });

  const totalQuestions = currentQuestionNumber - 1;

  return {
    numberedSections,
    totalQuestions,
    passageStats,
    summary: {
      totalPassages: numberedSections.length,
      totalQuestions,
      averageQuestionsPerPassage: Math.round(
        totalQuestions / numberedSections.length
      ),
      difficultyBreakdown: passageStats.reduce<Record<string, number>>(
        (acc, passage) => {
          acc[passage.difficulty] = (acc[passage.difficulty] || 0) + 1;
          return acc;
        },
        {}
      ),
    },
  };
}
