import { IELTSAcademicTask1, IELTSGeneralTask1, IELTSTask2, IELTSWritingTest } from "@/types/exam/ielts-academic/writing/writing";

interface WritingTaskStat {
    taskId: string;
    taskType: "task_1" | "task_2";
    detailType: string;
    timeLimit: number;
    minimumWords: number;
    difficulty: string;
  }
  
  interface WritingStatSummary {
    totalTasks: number;
    totalTask1: number;
    totalTask2: number;
    avgTimeLimit: number;
    avgMinWords: number;
    detailTypeBreakdown: Record<string, number>;
    difficultyBreakdown: Record<string, number>;
  }
  
  interface AddWritingTaskStatsResult {
    taskStats: WritingTaskStat[];
    summary: WritingStatSummary;
  }
  
  export function addWritingTaskStats(
    writingTasks: { task1: IELTSAcademicTask1 | IELTSGeneralTask1; task2: IELTSTask2; difficulty: IELTSWritingTest["difficulty"] }[]
  ): AddWritingTaskStatsResult {
    if (!writingTasks || writingTasks.length === 0)
      return {
        taskStats: [],
        summary: {
          totalTasks: 0,
          totalTask1: 0,
          totalTask2: 0,
          avgTimeLimit: 0,
          avgMinWords: 0,
          detailTypeBreakdown: {},
          difficultyBreakdown: {},
        },
      };
  
    const taskStats: WritingTaskStat[] = [];
    let totalTime = 0;
    let totalMinWords = 0;
    let totalTask1 = 0;
    let totalTask2 = 0;
    const detailTypeCount: Record<string, number> = {};
    const difficultyCount: Record<string, number> = {};
  
    writingTasks.forEach(({ task1, task2, difficulty }) => {
      // Task 1
      taskStats.push({
        taskId: task1.id,
        taskType: "task_1",
        detailType: task1.detailType,
        timeLimit: task1.timeLimit,
        minimumWords: task1.minimumWords,
        difficulty,
      });
      totalTime += task1.timeLimit;
      totalMinWords += task1.minimumWords;
      totalTask1++;
      detailTypeCount[task1.detailType] = (detailTypeCount[task1.detailType] || 0) + 1;
      difficultyCount[difficulty] = (difficultyCount[difficulty] || 0) + 1;
  
      // Task 2
      taskStats.push({
        taskId: task2.id,
        taskType: "task_2",
        detailType: task2.detailType,
        timeLimit: task2.timeLimit,
        minimumWords: task2.minimumWords,
        difficulty,
      });
      totalTime += task2.timeLimit;
      totalMinWords += task2.minimumWords;
      totalTask2++;
      detailTypeCount[task2.detailType] = (detailTypeCount[task2.detailType] || 0) + 1;
      difficultyCount[difficulty] = (difficultyCount[difficulty] || 0) + 1;
    });
  
    const totalTasks = totalTask1 + totalTask2;
  
    return {
      taskStats,
      summary: {
        totalTasks,
        totalTask1,
        totalTask2,
        avgTimeLimit: Math.round(totalTime / totalTasks),
        avgMinWords: Math.round(totalMinWords / totalTasks),
        detailTypeBreakdown: detailTypeCount,
        difficultyBreakdown: difficultyCount,
      },
    };
  }
  