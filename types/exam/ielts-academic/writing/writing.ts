// ========================= WRITING TYPES =========================

// Types of IELTS Writing tasks
export type IELTSWritingTaskType = "task_1" | "task_2";

// Academic Task 1 specific types
export type AcademicTask1Type =
  | "line_graph"
  | "bar_chart"
  | "pie_chart"
  | "table"
  | "diagram_process"
  | "diagram_map"
  | "mixed_charts";

// General Training Task 1 types
export type GeneralTask1Type =
  | "formal_letter"
  | "semi_formal_letter"
  | "informal_letter";

// Combined Task 1 types
export type Task1DetailType = AcademicTask1Type | GeneralTask1Type;

// Task 2 essay types
export type Task2EssayType =
  | "opinion_essay"
  | "discussion_essay"
  | "problem_solution_essay"
  | "advantage_disadvantage_essay"
  | "two_part_question";

// Base writing task interface
export interface IELTSWritingTask {
  id: string;
  taskType: IELTSWritingTaskType;
  detailType: Task1DetailType | Task2EssayType;
  instruction: string;
  prompt: string;
  timeLimit: number; // in minutes
  minimumWords: number;
  sampleAnswer?: string;
}

// Academic Task 1
export interface IELTSAcademicTask1 extends IELTSWritingTask {
  taskType: "task_1";
  detailType: AcademicTask1Type;
  visualData?: {
    chartImage?: string;
    chartDescription?: string;
  };
  keyFeatures?: string[];
}

// General Training Task 1
export interface IELTSGeneralTask1 extends IELTSWritingTask {
  taskType: "task_1";
  detailType: GeneralTask1Type;
  scenario: string;
  bulletPoints: string[];
  recipient?: string;
  tone: "formal" | "semi-formal" | "informal";
}

// Task 2 (Both Academic and General)
export interface IELTSTask2 extends IELTSWritingTask {
  taskType: "task_2";
  detailType: Task2EssayType;
  topic: string;
  backgroundInfo?: string;
  backgroundImage?: string; // URL to a background image/visual for context
  specificQuestion: string;
  keyWords?: string[];
}

// Complete IELTS Writing test
export interface IELTSWritingTest {
  id: string | number;
  title: string;
  description?: string;
  organizationId?: number;
  organizationSlug?: string;
  testType: "academic" | "general_training";
  difficulty: "easy" | "medium" | "hard";
  createdAt: string;
  updatedAt: string;
  task1: IELTSAcademicTask1 | IELTSGeneralTask1;
  task2: IELTSTask2;
  createdBy: string;
  status: "published" | "archived";
  totalTimeLimit: number; // Typically 60 minutes
  instructions?: string;
  generalInstructions?: string;
}
