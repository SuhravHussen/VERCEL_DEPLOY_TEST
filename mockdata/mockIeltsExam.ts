import { Currency } from "@/types/currency";
import { ieltsListeningTest } from "./mockIeltsListeningTest";
import { ieltsReadingTest } from "./mockieltsReadingTest";
import { mockIeltsWritingTests } from "./mockIeltsWritingTests";
import { mockUsers } from "./mockUsers";
import { ExamModel, ExamType } from "@/types/exam/exam";

// Array of Mock IELTS Exams
export const mockIELTSExams: ExamModel[] = [
  {
    id: "ielts_exam_2026_08_academic",
    title: "IELTS Academic Test - August 2026 Session",
    description:
      "Comprehensive IELTS Academic test covering all four skills: Listening, Reading, Writing, and Speaking. Designed for students planning to study at English-speaking universities.",

    listening_test: ieltsListeningTest[0],

    reading_test: ieltsReadingTest[0],

    writing_test: mockIeltsWritingTests[0],
    price: 215.0,
    is_free: false,
    currency: Currency.BDT,
    type_of_exam: ExamType.IELTS,

    lrw_group: {
      exam_date: "2026-08-15",
      listening_time_start: "09:00",
      reading_time_start: "09:40",
      writing_time_start: "10:40",
      assigned_instructors: [mockUsers[0], mockUsers[1]],
    },

    speaking_group: {
      time_windows: [
        {
          id: "tw_001",
          date: "2026-08-15",
          start_time: "13:00",
          end_time: "17:00",
        },
        {
          id: "tw_002",
          date: "2026-08-16",
          start_time: "09:00",
          end_time: "16:00",
        },
      ],
      assigned_instructors: [mockUsers[0], mockUsers[2]],
      session_per_student: 15,
    },

    created_at: "2026-07-01T10:00:00Z",
    updated_at: "2026-07-20T14:30:00Z",
    is_published: true,
    max_students: 50,
    registration_deadline: "2026-08-10T23:59:59Z",
  },

  {
    id: "ielts_exam_2026_09_general",
    title: "IELTS General Training - September 2026",
    description:
      "IELTS General Training test for immigration and work purposes in English-speaking countries.",

    listening_test: ieltsListeningTest[0],

    reading_test: ieltsReadingTest[0],

    writing_test: mockIeltsWritingTests[0],

    price: 200.0,
    is_free: false,
    currency: Currency.BDT,
    type_of_exam: ExamType.IELTS,
    lrw_group: {
      exam_date: "2026-09-12",
      listening_time_start: "14:00",
      reading_time_start: "14:40",
      writing_time_start: "15:40",
      assigned_instructors: [mockUsers[0], mockUsers[2]],
    },

    speaking_group: {
      time_windows: [
        {
          id: "tw_003",
          date: "2026-09-13",
          start_time: "09:00",
          end_time: "17:00",
        },
        {
          id: "tw_004",
          date: "2026-09-14",
          start_time: "09:00",
          end_time: "15:00",
        },
      ],
      assigned_instructors: [mockUsers[0], mockUsers[2]],
      session_per_student: 12,
    },

    created_at: "2026-07-15T09:00:00Z",
    updated_at: "2026-07-25T16:45:00Z",
    is_published: true,
    max_students: 40,
    registration_deadline: "2026-09-07T23:59:59Z",
  },

  {
    id: "ielts_practice_free_001",
    title: "Free IELTS Practice Test",
    description:
      "Complete practice test to familiarize yourself with the IELTS format. No speaking component included.",

    listening_test: ieltsListeningTest[0],

    reading_test: ieltsReadingTest[0],

    writing_test: mockIeltsWritingTests[0],

    price: 0.0,
    is_free: true,
    currency: Currency.BDT,
    type_of_exam: ExamType.IELTS,
    lrw_group: {
      exam_date: "2026-08-01",
      listening_time_start: "10:00",
      reading_time_start: "10:40",
      writing_time_start: "11:40",
      assigned_instructors: [mockUsers[3]],
    },

    speaking_group: {
      time_windows: [],
      assigned_instructors: [],
      session_per_student: 0,
    },

    created_at: "2026-06-01T08:00:00Z",
    updated_at: "2026-06-15T12:00:00Z",
    is_published: true,
    max_students: 200,
    registration_deadline: "2026-07-30T23:59:59Z",
  },

  {
    id: "ielts_exam_2026_10_academic",
    title: "IELTS Academic Test - October 2026 Session",
    description:
      "Second academic session for October with weekend scheduling option.",

    listening_test: ieltsListeningTest[0],

    reading_test: ieltsReadingTest[0],

    writing_test: mockIeltsWritingTests[0],

    price: 220.0,
    is_free: false,
    currency: Currency.BDT,
    type_of_exam: ExamType.IELTS,
    lrw_group: {
      exam_date: "2026-10-19",
      listening_time_start: "09:30",
      reading_time_start: "10:10",
      writing_time_start: "11:10",
      assigned_instructors: [mockUsers[2], mockUsers[3]],
    },

    speaking_group: {
      time_windows: [
        {
          id: "tw_005",
          date: "2026-10-20",
          start_time: "09:00",
          end_time: "12:00",
        },
        {
          id: "tw_006",
          date: "2026-10-20",
          start_time: "14:00",
          end_time: "18:00",
        },
        {
          id: "tw_007",
          date: "2026-10-21",
          start_time: "10:00",
          end_time: "16:00",
        },
      ],
      assigned_instructors: [mockUsers[0], mockUsers[1], mockUsers[2]],
      session_per_student: 15,
    },

    created_at: "2026-08-01T09:00:00Z",
    updated_at: "2026-08-10T11:20:00Z",
    is_published: true,
    max_students: 60,
    registration_deadline: "2026-10-14T23:59:59Z",
  },

  {
    id: "ielts_exam_2026_11_general",
    title: "IELTS General Training - November 2026",
    description:
      "General Training test with extended speaking sessions for detailed assessment.",

    listening_test: ieltsListeningTest[0],

    reading_test: ieltsReadingTest[0],

    writing_test: mockIeltsWritingTests[0],

    price: 205.0,
    is_free: false,
    currency: Currency.BDT,
    type_of_exam: ExamType.IELTS,
    lrw_group: {
      exam_date: "2026-11-16",
      listening_time_start: "13:30",
      reading_time_start: "14:10",
      writing_time_start: "15:10",
      assigned_instructors: [mockUsers[0], mockUsers[3]],
    },

    speaking_group: {
      time_windows: [
        {
          id: "tw_008",
          date: "2026-11-17",
          start_time: "09:00",
          end_time: "13:00",
        },
        {
          id: "tw_009",
          date: "2026-11-17",
          start_time: "14:00",
          end_time: "17:00",
        },
      ],
      assigned_instructors: [mockUsers[1], mockUsers[2]],
      session_per_student: 18,
    },

    created_at: "2026-08-15T14:00:00Z",
    updated_at: "2026-08-25T10:15:00Z",
    is_published: true,
    max_students: 35,
    registration_deadline: "2026-11-11T23:59:59Z",
  },
];

// Additional exam types mock data
export const mockAdditionalExams: ExamModel[] = [
  // GRE Exams
  {
    id: "gre_general_2026_08",
    title: "GRE General Test - August 2026",
    description:
      "Graduate Record Examination for graduate school admissions. Tests verbal reasoning, quantitative reasoning, and analytical writing skills.",
    price: 220.0,
    is_free: false,
    currency: Currency.USD,
    type_of_exam: ExamType.GRE,
    lrw_group: {
      exam_date: "2026-08-20",
      listening_time_start: "09:00",
      reading_time_start: "10:30",
      writing_time_start: "12:00",
      assigned_instructors: [mockUsers[1], mockUsers[2]],
    },
    created_at: "2026-07-01T08:00:00Z",
    updated_at: "2026-07-15T10:00:00Z",
    is_published: true,
    max_students: 30,
    registration_deadline: "2026-08-15T23:59:59Z",
  },
  {
    id: "gre_practice_free_001",
    title: "Free GRE Practice Test",
    description:
      "Comprehensive GRE practice test to help you prepare for the actual exam. Includes all sections with detailed explanations.",
    price: 0.0,
    is_free: true,
    currency: Currency.USD,
    type_of_exam: ExamType.GRE,
    lrw_group: {
      exam_date: "2026-08-05",
      listening_time_start: "14:00",
      reading_time_start: "15:00",
      writing_time_start: "16:30",
      assigned_instructors: [mockUsers[3]],
    },
    created_at: "2026-06-15T12:00:00Z",
    updated_at: "2026-06-20T14:00:00Z",
    is_published: true,
    max_students: 100,
    registration_deadline: "2026-08-03T23:59:59Z",
  },

  // TOEFL Exams
  {
    id: "toefl_ibt_2026_09",
    title: "TOEFL iBT - September 2026",
    description:
      "Test of English as a Foreign Language Internet-based Test. Measures English language proficiency for academic purposes.",
    price: 195.0,
    is_free: false,
    currency: Currency.USD,
    type_of_exam: ExamType.TOEFL,
    lrw_group: {
      exam_date: "2026-09-15",
      listening_time_start: "09:00",
      reading_time_start: "10:00",
      writing_time_start: "11:30",
      assigned_instructors: [mockUsers[0], mockUsers[2]],
    },
    speaking_group: {
      time_windows: [
        {
          id: "tw_toefl_001",
          date: "2026-09-15",
          start_time: "13:00",
          end_time: "16:00",
        },
      ],
      assigned_instructors: [mockUsers[1]],
      session_per_student: 20,
    },
    created_at: "2026-08-01T09:00:00Z",
    updated_at: "2026-08-10T11:00:00Z",
    is_published: true,
    max_students: 25,
    registration_deadline: "2026-09-10T23:59:59Z",
  },

  // SAT Exams
  {
    id: "sat_general_2026_10",
    title: "SAT Reasoning Test - October 2026",
    description:
      "Standardized test for college admissions in the United States. Tests evidence-based reading, writing, and mathematics.",
    price: 60.0,
    is_free: false,
    currency: Currency.USD,
    type_of_exam: ExamType.SAT,
    lrw_group: {
      exam_date: "2026-10-10",
      listening_time_start: "08:00",
      reading_time_start: "08:30",
      writing_time_start: "10:30",
      assigned_instructors: [mockUsers[2], mockUsers[3]],
    },
    created_at: "2026-09-01T10:00:00Z",
    updated_at: "2026-09-15T12:00:00Z",
    is_published: true,
    max_students: 50,
    registration_deadline: "2026-10-05T23:59:59Z",
  },

  // GMAT Exams
  {
    id: "gmat_focus_2026_11",
    title: "GMAT Focus Edition - November 2026",
    description:
      "Graduate Management Admission Test for business school applications. Tests quantitative, verbal, and data insights skills.",
    price: 275.0,
    is_free: false,
    currency: Currency.USD,
    type_of_exam: ExamType.GMAT,
    lrw_group: {
      exam_date: "2026-11-20",
      listening_time_start: "09:00",
      reading_time_start: "10:15",
      writing_time_start: "11:45",
      assigned_instructors: [mockUsers[0], mockUsers[1]],
    },
    created_at: "2026-10-01T08:00:00Z",
    updated_at: "2026-10-10T10:00:00Z",
    is_published: true,
    max_students: 20,
    registration_deadline: "2026-11-15T23:59:59Z",
  },
];

// Combined export of all exam types
export const mockAllExams: ExamModel[] = [
  ...mockIELTSExams,
  ...mockAdditionalExams,
];
