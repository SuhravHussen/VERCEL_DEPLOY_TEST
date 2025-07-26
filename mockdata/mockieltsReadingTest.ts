import ieltsTestSections from "./mockIeltsTestReadingSections";
import { IELTSReadingTest } from "../types/exam/ielts-academic/reading/test/test";

export const ieltsReadingTest = [
  {
    id: "ielts-reading-test-001",
    title: "IELTS Academic Reading Practice Test",
    description:
      "Complete IELTS Academic Reading test with three sections covering Climate Change, Smart Cities, and Marine Biology",
    organizationId: 1,
    difficulty: "medium", // Can be adjusted based on overall test difficulty
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    section_one: ieltsTestSections[0], // Climate Change and Renewable Energy
    section_two: ieltsTestSections[1], // Urban Planning and Smart Cities
    section_three: ieltsTestSections[2], // Marine Biology and Ocean Conservation
    createdBy: "admin",
    status: "published",
    totalQuestionCount: 40, // Standard IELTS Reading test has 40 questions
    timeLimit: 60, // Standard IELTS Reading time limit is 60 minutes
    instructions: `This is a complete IELTS Academic Reading test consisting of three sections with a variety of question types.
  
  Instructions:
  • You have 60 minutes to complete all three sections
  • Answer all questions in the order they appear
  • Transfer your answers to the answer sheet
  • Use a pencil for all answers
  • Check your spelling carefully
  • No extra time is given for transferring answers
  
  Each section contains one reading passage followed by a variety of question types including:
  - Multiple choice
  - True/False/Not Given
  - Yes/No/Not Given
  - Sentence completion
  - Summary completion
  - Matching information
  - Short answer questions
  - Table completion
  - Flow chart completion
  - Diagram labeling
  
  Read the instructions for each question type carefully.`,
  },
] as IELTSReadingTest[];
