"use server";

import { mockAllExams } from "@/mockdata/mockIeltsExam";
import { ExamModel } from "@/types/exam/exam";
import { addListeningQuestionNumbering } from "@/lib/addListeningQuestionNumbering";
import { ieltsReadingTest } from "@/mockdata/mockieltsReadingTest";
import { mockIeltsWritingTests } from "@/mockdata/mockIeltsWritingTests";
import { IELTSWritingTest } from "@/types/exam/ielts-academic/writing/writing";
import { addQuestionNumbering } from "@/lib/addQuestionNumbering";

export async function getExamData(examId: string): Promise<ExamModel | null> {
  try {
    console.log("examId", examId);
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

export async function getReadingTestData(examId: string) {
  try {
    // For now, return the first mock reading test
    // In production, this would filter by examId
    const readingTest =
      ieltsReadingTest.find((test) => test.id === examId) ||
      ieltsReadingTest[0];

    if (!readingTest) {
      return null;
    }

    // Convert the test sections to the format expected by the numbering function
    const sections = [
      readingTest.section_one,
      readingTest.section_two,
      readingTest.section_three,
    ];

    // Add proper question numbering
    const { numberedSections, totalQuestions, passageStats } =
      addQuestionNumbering(sections);

    // Return the test with numbered sections
    return {
      ...readingTest,
      section_one: numberedSections[0],
      section_two: numberedSections[1],
      section_three: numberedSections[2],
      totalQuestionCount: totalQuestions,
      passageStats,
    };
  } catch (error) {
    console.error("Error fetching reading test data:", error);
    return null;
  }
}

export async function getWritingTestData(
  examId: string
): Promise<IELTSWritingTest | null> {
  try {
    // For now, return the first mock writing test
    // In production, this would filter by examId
    const writingTest =
      mockIeltsWritingTests.find((test) => test.id === examId) ||
      mockIeltsWritingTests[0];
    return writingTest || null;
  } catch (error) {
    console.error("Error fetching writing test data:", error);
    return null;
  }
}
