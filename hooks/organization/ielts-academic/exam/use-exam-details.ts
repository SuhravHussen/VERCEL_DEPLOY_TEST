import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ExamModel } from "@/types/exam/exam";
import { IELTSReadingTestSection } from "@/types/exam/ielts-academic/reading/question/question";
import { IELTSListeningTestSection } from "@/types/exam/ielts-academic/listening/listening";
import { QUERY_KEYS } from "@/hooks/query-keys";
import mockdb from "@/mockdb";
import { addQuestionNumbering } from "@/lib/addQuestionNumbering";
import { addListeningQuestionNumbering } from "@/lib/addListeningQuestionNumbering";
import { addWritingTaskStats } from "@/lib/addWritingQuestionNumbering";

interface ExamDetailsResult {
  exam: ExamModel | null;
  isLoading: boolean;
  error: string | null;
  numberedReadingSections: IELTSReadingTestSection[];
  readingStats: ReturnType<typeof addQuestionNumbering>;
  numberedListeningSections: IELTSListeningTestSection[];
  listeningStats: ReturnType<typeof addListeningQuestionNumbering>;
  writingStats: ReturnType<typeof addWritingTaskStats>;
}

export function useExamDetails(examId: string): ExamDetailsResult {
  const {
    data: exam,
    isLoading,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.IELTS_EXAM.DETAILS(examId),
    queryFn: async (): Promise<ExamModel | null> => {
      if (!examId) {
        throw new Error("Exam ID is required");
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const examData = mockdb.getIeltsExamById(examId);

      if (!examData) {
        throw new Error("Exam not found");
      }

      return examData;
    },
    enabled: !!examId, // Only run query if examId is provided
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 10, // Keep in cache for 10 minutes
  });

  // Process exam data to calculate stats and numbered sections
  const processedData = useMemo(() => {
    if (!exam) {
      return {
        numberedReadingSections: [] as IELTSReadingTestSection[],
        readingStats: {
          numberedSections: [] as IELTSReadingTestSection[],
          totalQuestions: 0,
          passageStats: [] as unknown[],
          summary: {
            totalPassages: 0,
            totalQuestions: 0,
            averageQuestionsPerPassage: 0,
            difficultyBreakdown: {} as Record<string, number>,
          },
        } as ReturnType<typeof addQuestionNumbering>,
        numberedListeningSections: [] as IELTSListeningTestSection[],
        listeningStats: {
          numberedSections: [] as IELTSListeningTestSection[],
          totalQuestions: 0,
          audioStats: [] as unknown[],
          summary: {
            totalAudios: 0,
            totalQuestions: 0,
            averageQuestionsPerAudio: 0,
            difficultyBreakdown: {} as Record<string, number>,
          },
        } as ReturnType<typeof addListeningQuestionNumbering>,
        writingStats: {
          taskStats: [] as unknown[],
          summary: {
            totalTasks: 0,
            totalTask1: 0,
            totalTask2: 0,
            avgTimeLimit: 0,
            avgMinWords: 0,
            detailTypeBreakdown: {} as Record<string, number>,
            difficultyBreakdown: {} as Record<string, number>,
          },
        } as ReturnType<typeof addWritingTaskStats>,
      };
    }

    // Process reading test with question numbering
    let readingResult: ReturnType<typeof addQuestionNumbering>;
    if (exam.reading_test) {
      const readingSections = [
        exam.reading_test.section_one,
        exam.reading_test.section_two,
        exam.reading_test.section_three,
      ].filter(Boolean);
      readingResult = addQuestionNumbering(readingSections);
    } else {
      readingResult = {
        numberedSections: [] as IELTSReadingTestSection[],
        totalQuestions: 0,
        passageStats: [] as unknown[],
        summary: {
          totalPassages: 0,
          totalQuestions: 0,
          averageQuestionsPerPassage: 0,
          difficultyBreakdown: {} as Record<string, number>,
        },
      } as ReturnType<typeof addQuestionNumbering>;
    }

    // Process listening test with question numbering
    let listeningResult: ReturnType<typeof addListeningQuestionNumbering>;
    if (exam.listening_test) {
      const listeningSections = [
        exam.listening_test.section_one,
        exam.listening_test.section_two,
        exam.listening_test.section_three,
        exam.listening_test.section_four,
      ].filter(Boolean);
      listeningResult = addListeningQuestionNumbering(listeningSections);
    } else {
      listeningResult = {
        numberedSections: [] as IELTSListeningTestSection[],
        totalQuestions: 0,
        audioStats: [] as unknown[],
        summary: {
          totalAudios: 0,
          totalQuestions: 0,
          averageQuestionsPerAudio: 0,
          difficultyBreakdown: {} as Record<string, number>,
        },
      } as ReturnType<typeof addListeningQuestionNumbering>;
    }

    // Process writing test with task stats
    let writingResult: ReturnType<typeof addWritingTaskStats>;
    if (exam.writing_test) {
      const writingTasks = [
        {
          task1: exam.writing_test.task1,
          task2: exam.writing_test.task2,
          difficulty: exam.writing_test.difficulty,
        },
      ];
      writingResult = addWritingTaskStats(writingTasks);
    } else {
      writingResult = {
        taskStats: [] as unknown[],
        summary: {
          totalTasks: 0,
          totalTask1: 0,
          totalTask2: 0,
          avgTimeLimit: 0,
          avgMinWords: 0,
          detailTypeBreakdown: {} as Record<string, number>,
          difficultyBreakdown: {} as Record<string, number>,
        },
      } as ReturnType<typeof addWritingTaskStats>;
    }

    return {
      numberedReadingSections: readingResult.numberedSections,
      readingStats: readingResult,
      numberedListeningSections: listeningResult.numberedSections,
      listeningStats: listeningResult,
      writingStats: writingResult,
    };
  }, [exam]);

  return {
    exam: exam || null,
    isLoading,
    error: error?.message || null,
    ...processedData,
  };
}
