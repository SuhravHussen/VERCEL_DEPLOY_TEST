"use server";

import { mockAllExams } from "@/mockdata/mockIeltsExam";
import { registeredExams } from "@/mockdata/mockRegisteredExam";
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

// Basic exam info functions (without questions) - Phase 1
export async function getListeningTestBasicInfo(examId: string) {
  try {
    const exam = await getExamData(examId);

    if (!exam || !exam.listening_test) {
      return null;
    }

    // For now, return the same data since it's mock data
    // In production, this would exclude questions and return only basic info
    const sections = [
      exam.listening_test.section_one,
      exam.listening_test.section_two,
      exam.listening_test.section_three,
      exam.listening_test.section_four,
    ];

    const { numberedSections, totalQuestions, audioStats } =
      addListeningQuestionNumbering(sections);

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
    console.error("Error fetching listening test basic info:", error);
    return null;
  }
}

export async function getReadingTestBasicInfo(examId: string) {
  try {
    // For now, return the same data since it's mock data
    // In production, this would exclude questions and return only basic info
    const readingTest =
      ieltsReadingTest.find((test) => test.id === examId) ||
      ieltsReadingTest[0];

    if (!readingTest) {
      return null;
    }

    const sections = [
      readingTest.section_one,
      readingTest.section_two,
      readingTest.section_three,
    ];

    const { numberedSections, totalQuestions, passageStats } =
      addQuestionNumbering(sections);

    return {
      ...readingTest,
      section_one: numberedSections[0],
      section_two: numberedSections[1],
      section_three: numberedSections[2],
      totalQuestionCount: totalQuestions,
      passageStats,
    };
  } catch (error) {
    console.error("Error fetching reading test basic info:", error);
    return null;
  }
}

export async function getWritingTestBasicInfo(
  examId: string
): Promise<IELTSWritingTest | null> {
  try {
    // For now, return the same data since it's mock data
    // In production, this would exclude questions and return only basic info
    const writingTest =
      mockIeltsWritingTests.find((test) => test.id === examId) ||
      mockIeltsWritingTests[0];
    return writingTest || null;
  } catch (error) {
    console.error("Error fetching writing test basic info:", error);
    return null;
  }
}

// Full exam data functions (with questions) - Phase 2
export async function getListeningTestFullData(examId: string) {
  try {
    // For now, this is the same as getListeningTestData
    // In production, this would include all questions
    return await getListeningTestData(examId);
  } catch (error) {
    console.error("Error fetching listening test full data:", error);
    return null;
  }
}

export async function getReadingTestFullData(examId: string) {
  try {
    // For now, this is the same as getReadingTestData
    // In production, this would include all questions
    return await getReadingTestData(examId);
  } catch (error) {
    console.error("Error fetching reading test full data:", error);
    return null;
  }
}

export async function getWritingTestFullData(
  examId: string
): Promise<IELTSWritingTest | null> {
  try {
    // For now, this is the same as getWritingTestData
    // In production, this would include all questions
    return await getWritingTestData(examId);
  } catch (error) {
    console.error("Error fetching writing test full data:", error);
    return null;
  }
}

// Registration-based functions - using regId to get exam from registered exams
export async function getRegisteredExamData(
  regId: string
): Promise<ExamModel | null> {
  try {
    console.log("regId", regId);
    const registeredExam = registeredExams.find((reg) => reg.id === regId);
    return registeredExam?.exam || null;
  } catch (error) {
    console.error("Error fetching registered exam data:", error);
    return null;
  }
}

export async function getListeningTestDataByRegId(regId: string) {
  try {
    const registeredExam = registeredExams.find((reg) => reg.id === regId);

    if (!registeredExam || !registeredExam.exam.listening_test) {
      return null;
    }

    const exam = registeredExam.exam;
    const listeningTest = exam.listening_test;

    if (!listeningTest) {
      return null;
    }

    // Convert the test sections to the format expected by the numbering function
    const sections = [
      listeningTest.section_one,
      listeningTest.section_two,
      listeningTest.section_three,
      listeningTest.section_four,
    ];

    // Add proper question numbering
    const { numberedSections, totalQuestions, audioStats } =
      addListeningQuestionNumbering(sections);

    // Return the test with numbered sections
    return {
      ...listeningTest,
      section_one: numberedSections[0],
      section_two: numberedSections[1],
      section_three: numberedSections[2],
      section_four: numberedSections[3],
      totalQuestionCount: totalQuestions,
      audioStats,
    };
  } catch (error) {
    console.error("Error fetching listening test data by regId:", error);
    return null;
  }
}

export async function getReadingTestDataByRegId(regId: string) {
  try {
    const registeredExam = registeredExams.find((reg) => reg.id === regId);

    if (!registeredExam || !registeredExam.exam.reading_test) {
      return null;
    }

    const exam = registeredExam.exam;

    // Use the reading test from the exam
    const readingTest = exam.reading_test;

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
    console.error("Error fetching reading test data by regId:", error);
    return null;
  }
}

export async function getWritingTestDataByRegId(
  regId: string
): Promise<IELTSWritingTest | null> {
  try {
    const registeredExam = registeredExams.find((reg) => reg.id === regId);

    if (!registeredExam || !registeredExam.exam.writing_test) {
      return null;
    }

    return registeredExam.exam.writing_test;
  } catch (error) {
    console.error("Error fetching writing test data by regId:", error);
    return null;
  }
}

// Basic info functions using regId
export async function getListeningTestBasicInfoByRegId(regId: string) {
  try {
    // For now, return the same data since it's mock data
    // In production, this would exclude questions and return only basic info
    return await getListeningTestDataByRegId(regId);
  } catch (error) {
    console.error("Error fetching listening test basic info by regId:", error);
    return null;
  }
}

export async function getReadingTestBasicInfoByRegId(regId: string) {
  try {
    // For now, return the same data since it's mock data
    // In production, this would exclude questions and return only basic info
    return await getReadingTestDataByRegId(regId);
  } catch (error) {
    console.error("Error fetching reading test basic info by regId:", error);
    return null;
  }
}

export async function getWritingTestBasicInfoByRegId(
  regId: string
): Promise<IELTSWritingTest | null> {
  try {
    // For now, return the same data since it's mock data
    // In production, this would exclude questions and return only basic info
    return await getWritingTestDataByRegId(regId);
  } catch (error) {
    console.error("Error fetching writing test basic info by regId:", error);
    return null;
  }
}

// Full data functions using regId
export async function getListeningTestFullDataByRegId(regId: string) {
  try {
    // For now, this is the same as getListeningTestDataByRegId
    // In production, this would include all questions
    return await getListeningTestDataByRegId(regId);
  } catch (error) {
    console.error("Error fetching listening test full data by regId:", error);
    return null;
  }
}

export async function getReadingTestFullDataByRegId(regId: string) {
  try {
    // For now, this is the same as getReadingTestDataByRegId
    // In production, this would include all questions
    return await getReadingTestDataByRegId(regId);
  } catch (error) {
    console.error("Error fetching reading test full data by regId:", error);
    return null;
  }
}

export async function getWritingTestFullDataByRegId(
  regId: string
): Promise<IELTSWritingTest | null> {
  try {
    // For now, this is the same as getWritingTestDataByRegId
    // In production, this would include all questions
    return await getWritingTestDataByRegId(regId);
  } catch (error) {
    console.error("Error fetching writing test full data by regId:", error);
    return null;
  }
}
