import {
  AcademicTask1Type,
  GeneralTask1Type,
  IELTSAcademicTask1,
  IELTSGeneralTask1,
  IELTSTask2,
  Task2EssayType,
} from "@/types/exam/ielts-academic/writing/writing";

// DTO for creating a writing test
export interface CreateIELTSWritingTestDto {
  title: string;
  description?: string;
  organizationId: number;
  testType: "academic" | "general_training";
  difficulty: "easy" | "medium" | "hard";
  task1: IELTSAcademicTask1 | IELTSGeneralTask1;
  task2: IELTSTask2;
  totalTimeLimit: number;
  instructions?: string;
  generalInstructions?: string;
}

// DTO for creating Academic Task 1
export interface CreateAcademicTask1Dto {
  taskType: "task_1";
  detailType: AcademicTask1Type;
  instruction: string;
  prompt: string;
  timeLimit: number;
  minimumWords: number;
  sampleAnswer?: string;
  visualData?: {
    chartImage?: string;
    chartDescription?: string;
  };
  keyFeatures?: string[];
}

// DTO for creating General Training Task 1
export interface CreateGeneralTask1Dto {
  taskType: "task_1";
  detailType: GeneralTask1Type;
  instruction: string;
  prompt: string;
  timeLimit: number;
  minimumWords: number;
  sampleAnswer?: string;
  scenario: string;
  bulletPoints: string[];
  recipient?: string;
  tone: "formal" | "semi-formal" | "informal";
}

// DTO for creating Task 2
export interface CreateTask2Dto {
  taskType: "task_2";
  detailType: Task2EssayType;
  instruction: string;
  prompt: string;
  timeLimit: number;
  minimumWords: number;
  sampleAnswer?: string;
  topic: string;
  backgroundInfo?: string;
  backgroundImage?: string;
  specificQuestion: string;
  keyWords?: string[];
}

// Union type for creating any writing task
export type CreateWritingTaskDto =
  | CreateAcademicTask1Dto
  | CreateGeneralTask1Dto
  | CreateTask2Dto;
