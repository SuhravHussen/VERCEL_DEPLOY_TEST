"use server";

import { mockAllExams } from "@/mockdata/mockIeltsExam";
import { ExamModel } from "@/types/exam/exam";
import { addListeningQuestionNumbering } from "@/lib/addListeningQuestionNumbering";

export async function getExamData(examId: string): Promise<ExamModel | null> {
  try {
    const exam = mockAllExams.find((exam) => exam.id === examId);
    return exam || null;
  } catch (error) {
    console.error("Error fetching exam data:", error);
    return null;
  }
}

export async function getListeningTestData(examId: string) {
  try {
    const exam = await getExamData(examId);
    if (!exam || !exam.listening_test) {
      return null;
    }

    // Convert the test sections to the format expected by the numbering function
    const sections = [
      exam.listening_test.section_one,
      exam.listening_test.section_two,
      exam.listening_test.section_three,
      exam.listening_test.section_four,
    ];

    // Add proper question numbering
    const { numberedSections, totalQuestions, audioStats } =
      addListeningQuestionNumbering(sections);

    // Return the test with numbered sections
    return {
      ...exam.listening_test,
      section_one: numberedSections[0],
      section_two: numberedSections[1],
      section_three: numberedSections[2],
      section_four: numberedSections[3],
      totalQuestionCount: totalQuestions,
      audioStats,
    };
  } catch (error) {
    console.error("Error fetching listening test data:", error);
    return null;
  }
}
