import {
  IELTSAcademicTask1,
  IELTSGeneralTask1,
  IELTSWritingTest,
  IELTSTask2,
} from "@/types/exam/ielts-academic/writing/writing";
import { mockIeltsWritingTasks } from "./mockIeltsWritingQuestion";

export const mockIeltsWritingTests: IELTSWritingTest[] = [
  {
    id: "test-001",
    title: "IELTS Academic Writing Practice Test 1",
    description:
      "Complete academic writing test focusing on tourism data analysis and early childhood education",
    organizationId: 101,
    testType: "academic",
    difficulty: "medium",
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
    task1: mockIeltsWritingTasks[0] as IELTSAcademicTask1,
    task2: mockIeltsWritingTasks[4] as IELTSTask2,
    createdBy: "Dr. Sarah Johnson",
    status: "published",
    totalTimeLimit: 60,
    instructions:
      "This test consists of two writing tasks. You should spend about 20 minutes on Task 1 and 40 minutes on Task 2.",
    generalInstructions:
      "Write your answers in the answer booklet. Write clearly in pen or pencil. You may make alterations, but make sure your work is easy to read.",
  },
  {
    id: "test-002",
    title: "IELTS Academic Writing Practice Test 2",
    description:
      "Academic test featuring consumer habits analysis and urban traffic solutions",
    organizationId: 102,
    testType: "academic",
    difficulty: "hard",
    createdAt: "2024-02-01T10:15:00Z",
    updatedAt: "2024-02-01T10:15:00Z",
    task1: mockIeltsWritingTasks[1] as IELTSAcademicTask1,
    task2: mockIeltsWritingTasks[5] as IELTSTask2,
    createdBy: "Prof. Michael Chen",
    status: "published",
    totalTimeLimit: 60,
    instructions:
      "Complete both tasks within the time limit. Task 1 requires 150 words minimum, Task 2 requires 250 words minimum.",
    generalInstructions:
      "You will be assessed on task achievement, coherence and cohesion, lexical resource, and grammatical range and accuracy.",
  },
  {
    id: "test-003",
    title: "IELTS General Training Writing Mock Test",
    description:
      "General training test with formal complaint letter and education discussion",
    organizationId: 103,
    testType: "general_training",
    difficulty: "easy",
    createdAt: "2024-01-28T16:45:00Z",
    updatedAt: "2024-02-05T11:20:00Z",
    task1: mockIeltsWritingTasks[3] as IELTSGeneralTask1,
    task2: mockIeltsWritingTasks[4] as IELTSTask2,
    createdBy: "Emma Thompson",
    status: "published",
    totalTimeLimit: 60,
    instructions:
      "Task 1: Write a letter of at least 150 words. Task 2: Write an essay of at least 250 words.",
    generalInstructions:
      "Answer both tasks completely. Use appropriate register and tone for each task type.",
  },
  {
    id: 4,
    title: "IELTS Academic Writing - Process & Problem Solving",
    description:
      "Advanced academic test combining process description with problem-solution essay",
    organizationId: 104,
    testType: "academic",
    difficulty: "hard",
    createdAt: "2024-02-10T08:30:00Z",
    updatedAt: "2024-02-12T13:45:00Z",
    task1: mockIeltsWritingTasks[2] as IELTSAcademicTask1,
    task2: mockIeltsWritingTasks[5] as IELTSTask2,
    createdBy: "Dr. Amanda Wilson",
    status: "published",
    totalTimeLimit: 60,
    instructions:
      "This test challenges your ability to describe processes and propose solutions to complex problems.",
    generalInstructions:
      "Focus on accuracy, coherence, and appropriate academic vocabulary throughout both tasks.",
  },
  {
    id: "archived-test-001",
    title: "IELTS Academic Writing - Tourism Analysis (Archived)",
    description:
      "Previously used academic test focusing on tourism trends and educational approaches",
    organizationId: 101,
    testType: "academic",
    difficulty: "medium",
    createdAt: "2023-11-20T14:00:00Z",
    updatedAt: "2024-01-15T09:00:00Z",
    task1: mockIeltsWritingTasks[0] as IELTSAcademicTask1,
    task2: mockIeltsWritingTasks[4] as IELTSTask2,
    createdBy: "Dr. Sarah Johnson",
    status: "archived",
    totalTimeLimit: 60,
    instructions: "Standard IELTS writing test format with two tasks.",
    generalInstructions:
      "This test has been archived and is no longer active for student assignments.",
  },
  {
    id: "test-gt-002",
    title: "IELTS General Training Writing - Consumer Issues",
    description:
      "General training test focusing on consumer complaints and traffic management",
    organizationId: 105,
    testType: "general_training",
    difficulty: "medium",
    createdAt: "2024-02-08T12:00:00Z",
    updatedAt: "2024-02-08T12:00:00Z",
    task1: mockIeltsWritingTasks[3] as IELTSGeneralTask1,
    task2: mockIeltsWritingTasks[5] as IELTSTask2,
    createdBy: "James Rodriguez",
    status: "published",
    totalTimeLimit: 60,
    instructions:
      "General Training format: personal letter followed by essay on contemporary issue.",
    generalInstructions:
      "Ensure appropriate tone and style for each task. Task 1 should be personal, Task 2 should be formal and analytical.",
  },
];
