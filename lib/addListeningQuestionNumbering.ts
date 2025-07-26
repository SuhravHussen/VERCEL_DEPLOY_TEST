import {
  IELTSListeningTestSection,
  IELTSListeningQuestionGroup,
  ListeningNoteCompletionGroup,
  ListeningTableCompletionGroup,
  ListeningFlowChartCompletionGroup,
  ListeningDiagramLabelCompletionGroup,
  ListeningFormCompletionGroup,
} from "@/types/exam/ielts-academic/listening/listening";

interface AudioStat {
  audioNumber: number;
  audioTitle: string;
  difficulty: string;
  questionCount: number;
  questionRange: string;
  questionTypes: Record<string, number>;
}

interface AddListeningQuestionNumberingResult {
  numberedSections: IELTSListeningTestSection[];
  totalQuestions: number;
  audioStats: AudioStat[];
  summary: {
    totalAudios: number;
    totalQuestions: number;
    averageQuestionsPerAudio: number;
    difficultyBreakdown: Record<string, number>;
  };
}

export function addListeningQuestionNumbering(
  ieltsTestSections: IELTSListeningTestSection[]
): AddListeningQuestionNumberingResult {
  if (!ieltsTestSections || ieltsTestSections.length === 0)
    return {
      numberedSections: [],
      totalQuestions: 0,
      audioStats: [],
      summary: {
        totalAudios: 0,
        totalQuestions: 0,
        averageQuestionsPerAudio: 0,
        difficultyBreakdown: {},
      },
    };

  let currentQuestionNumber = 1;
  const audioStats: AudioStat[] = [];

  // Create a deep copy to avoid modifying the original array
  const numberedSections: IELTSListeningTestSection[] = JSON.parse(
    JSON.stringify(ieltsTestSections)
  );

  numberedSections.forEach((section, sectionIndex) => {
    const sectionStartNumber = currentQuestionNumber;
    let sectionQuestionCount = 0;
    const questionTypeStats: Record<string, number> = {};

    section.questions.forEach((questionGroup: IELTSListeningQuestionGroup) => {
      const questionType = questionGroup.questionType;
      let questionsInGroup = 0;

      // Handle different question structures
      if (questionGroup.questions && Array.isArray(questionGroup.questions)) {
        // For question groups with 'questions' array (multiple_choice, multiple_choice_multiple_answers, etc.)
        questionGroup.questions.forEach((question) => {
          // Add number property safely
          Object.assign(question, { number: currentQuestionNumber });
          currentQuestionNumber++;
          questionsInGroup++;
          sectionQuestionCount++;
        });
      } else if (
        questionGroup.questionType === "note_completion" &&
        (questionGroup as ListeningNoteCompletionGroup).questions
      ) {
        // For note completion with gap-based questions
        (questionGroup as ListeningNoteCompletionGroup).questions.forEach(
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
        (questionGroup as ListeningTableCompletionGroup).questions
      ) {
        // For table completion with cell-based questions
        (questionGroup as ListeningTableCompletionGroup).questions.forEach(
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
        questionGroup.questionType === "form_completion" &&
        (questionGroup as ListeningFormCompletionGroup).questions
      ) {
        // For form completion with gap-based questions
        (questionGroup as ListeningFormCompletionGroup).questions.forEach(
          (question) => {
            // Add number property safely
            Object.assign(question, { number: currentQuestionNumber });
            currentQuestionNumber++;
            questionsInGroup++;
            sectionQuestionCount++;
          }
        );
      } else if (
        questionGroup.questionType === "flow_chart_completion" &&
        (questionGroup as ListeningFlowChartCompletionGroup).questions
      ) {
        // For flow chart completion
        (
          questionGroup as ListeningFlowChartCompletionGroup
        ).startingQuestionNumber = currentQuestionNumber;
        (questionGroup as ListeningFlowChartCompletionGroup).questions.forEach(
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
        (questionGroup as ListeningDiagramLabelCompletionGroup).questions
      ) {
        // For diagram label completion
        (
          questionGroup as ListeningDiagramLabelCompletionGroup
        ).questions.forEach((question) => {
          // Add number property safely
          Object.assign(question, { number: currentQuestionNumber });
          question.labelId = currentQuestionNumber.toString();
          currentQuestionNumber++;
          questionsInGroup++;
          sectionQuestionCount++;
        });
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

    audioStats.push({
      audioNumber: sectionIndex + 1,
      audioTitle: section.audio?.title || "",
      difficulty: section.audio?.difficulty || "",
      questionCount: sectionQuestionCount,
      questionRange: `${sectionStartNumber}-${sectionEndNumber}`,
      questionTypes: questionTypeStats,
    });
  });

  const totalQuestions = currentQuestionNumber - 1;

  return {
    numberedSections,
    totalQuestions,
    audioStats,
    summary: {
      totalAudios: numberedSections.length,
      totalQuestions,
      averageQuestionsPerAudio: Math.round(
        totalQuestions / numberedSections.length
      ),
      difficultyBreakdown: audioStats.reduce<Record<string, number>>(
        (acc, audio) => {
          acc[audio.difficulty] = (acc[audio.difficulty] || 0) + 1;
          return acc;
        },
        {}
      ),
    },
  };
}
