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
export async function getListeningTestBasicInfo(
  id: string,
  type: "practice" | "registered" = "registered"
) {
  try {
    let exam;

    if (type === "practice") {
      // For practice, id is examId - get directly from mock exams
      exam = await getExamData(id);
    } else {
      // For registered, id is regId - get from registered exam
      const registeredExam = registeredExams.find((reg) => reg.id === id);
      exam = registeredExam?.exam || null;
    }

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

export async function getReadingTestBasicInfo(
  id: string,
  type: "practice" | "registered" = "registered"
) {
  try {
    let readingTest;

    if (type === "practice") {
      // For practice, id is examId - get directly from mock reading tests
      readingTest =
        ieltsReadingTest.find((test) => test.id === id) || ieltsReadingTest[0];
    } else {
      // For registered, id is regId - get from registered exam
      const registeredExam = registeredExams.find((reg) => reg.id === id);
      readingTest = registeredExam?.exam?.reading_test || null;
    }

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
  id: string,
  type: "practice" | "registered" = "registered"
): Promise<IELTSWritingTest | null> {
  try {
    let writingTest;

    if (type === "practice") {
      // For practice, id is examId - get directly from mock writing tests
      writingTest =
        mockIeltsWritingTests.find((test) => test.id === id) ||
        mockIeltsWritingTests[0];
    } else {
      // For registered, id is regId - get from registered exam
      const registeredExam = registeredExams.find((reg) => reg.id === id);
      writingTest = registeredExam?.exam?.writing_test || null;
    }

    return writingTest || null;
  } catch (error) {
    console.error("Error fetching writing test basic info:", error);
    return null;
  }
}

// Full exam data functions (with questions) - Phase 2
export async function getListeningTestFullData(
  id: string,
  type: "practice" | "registered" = "registered"
) {
  try {
    // For now, this is the same as getListeningTestBasicInfo
    // In production, this would include all questions
    return await getListeningTestBasicInfo(id, type);
  } catch (error) {
    console.error("Error fetching listening test full data:", error);
    return null;
  }
}

export async function getReadingTestFullData(
  id: string,
  type: "practice" | "registered" = "registered"
) {
  try {
    // For now, this is the same as getReadingTestBasicInfo
    // In production, this would include all questions
    return await getReadingTestBasicInfo(id, type);
  } catch (error) {
    console.error("Error fetching reading test full data:", error);
    return null;
  }
}

export async function getWritingTestFullData(
  id: string,
  type: "practice" | "registered" = "registered"
): Promise<IELTSWritingTest | null> {
  try {
    // For now, this is the same as getWritingTestBasicInfo
    // In production, this would include all questions
    return await getWritingTestBasicInfo(id, type);
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

// Basic info functions using regId (backward compatibility)
export async function getListeningTestBasicInfoByRegId(regId: string) {
  try {
    return await getListeningTestBasicInfo(regId, "registered");
  } catch (error) {
    console.error("Error fetching listening test basic info by regId:", error);
    return null;
  }
}

export async function getReadingTestBasicInfoByRegId(regId: string) {
  try {
    return await getReadingTestBasicInfo(regId, "registered");
  } catch (error) {
    console.error("Error fetching reading test basic info by regId:", error);
    return null;
  }
}

export async function getWritingTestBasicInfoByRegId(
  regId: string
): Promise<IELTSWritingTest | null> {
  try {
    return await getWritingTestBasicInfo(regId, "registered");
  } catch (error) {
    console.error("Error fetching writing test basic info by regId:", error);
    return null;
  }
}

// Full data functions using regId (backward compatibility)
export async function getListeningTestFullDataByRegId(regId: string) {
  try {
    return await getListeningTestFullData(regId, "registered");
  } catch (error) {
    console.error("Error fetching listening test full data by regId:", error);
    return null;
  }
}

export async function getReadingTestFullDataByRegId(regId: string) {
  try {
    return await getReadingTestFullData(regId, "registered");
  } catch (error) {
    console.error("Error fetching reading test full data by regId:", error);
    return null;
  }
}

export async function getWritingTestFullDataByRegId(
  regId: string
): Promise<IELTSWritingTest | null> {
  try {
    return await getWritingTestFullData(regId, "registered");
  } catch (error) {
    console.error("Error fetching writing test full data by regId:", error);
    return null;
  }
}
