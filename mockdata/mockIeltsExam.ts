
import { Currency } from "@/types/currency";
import { ieltsListeningTest } from "./mockIeltsListeningTest";
import { ieltsReadingTest } from "./mockieltsReadingTest";
import { mockIeltsWritingTests } from "./mockIeltsWritingTests";
import { mockUsers } from "./mockUsers";
import { IELTSExamModel } from "@/types/exam/ielts-academic/exam";



// Array of Mock IELTS Exams
export const mockIELTSExams: IELTSExamModel[] = [
  {
    id: "ielts_exam_2024_08_academic",
    title: "IELTS Academic Test - August 2024 Session",
    description: "Comprehensive IELTS Academic test covering all four skills: Listening, Reading, Writing, and Speaking. Designed for students planning to study at English-speaking universities.",
    
    listening_test: ieltsListeningTest[0],
    
    reading_test: ieltsReadingTest[0],
    
    writing_test: mockIeltsWritingTests[0],
    price: 215.00,
    is_free: false,
    currency: Currency.BDT,

    lrw_group: {
      exam_date: "2024-08-15",
      listening_time_start: "09:00",
      reading_time_start: "09:40",
      writing_time_start: "10:40",
      assigned_instructors: [mockUsers[0],  mockUsers[1]]
    },

    speaking_group: {
      time_windows: [
        {
          id: "tw_001",
          date: "2024-08-15",
          start_time: "13:00",
          end_time: "17:00"
        },
        {
          id: "tw_002",
          date: "2024-08-16", 
          start_time: "09:00",
          end_time: "16:00"
        }
      ],
      assigned_instructors: [mockUsers[0], mockUsers[2]],
      session_per_student: 15
    },

    created_at: "2024-07-01T10:00:00Z",
    updated_at: "2024-07-20T14:30:00Z", 
    is_active: true,
    max_students: 50,
    registration_deadline: "2024-08-10T23:59:59Z"
  },

  {
    id: "ielts_exam_2024_09_general",
    title: "IELTS General Training - September 2024",
    description: "IELTS General Training test for immigration and work purposes in English-speaking countries.",

    listening_test: ieltsListeningTest[0],
    
    reading_test: ieltsReadingTest[0],

    writing_test: mockIeltsWritingTests[0],
    
    price: 200.00,
    is_free: false,
    currency: Currency.BDT,

    lrw_group: {
      exam_date: "2024-09-12",
      listening_time_start: "14:00",
      reading_time_start: "14:40",
      writing_time_start: "15:40",
      assigned_instructors: [mockUsers[0], mockUsers[2]]
    }   ,

    speaking_group: {
      time_windows: [
        {
          id: "tw_003",
          date: "2024-09-13",
          start_time: "09:00", 
          end_time: "17:00"
        },
        {
          id: "tw_004",
          date: "2024-09-14",
          start_time: "09:00",
          end_time: "15:00"
        }
      ],
      assigned_instructors: [mockUsers[0], mockUsers[2]],
      session_per_student: 12
    },

    created_at: "2024-07-15T09:00:00Z",
    updated_at: "2024-07-25T16:45:00Z",
    is_active: true,
    max_students: 40,
    registration_deadline: "2024-09-07T23:59:59Z",

    
  },

  {
    id: "ielts_practice_free_001",
    title: "Free IELTS Practice Test",
    description: "Complete practice test to familiarize yourself with the IELTS format. No speaking component included.",

    listening_test: ieltsListeningTest[0],
    
    reading_test: ieltsReadingTest[0],
    
    writing_test: mockIeltsWritingTests[0],

    price: 0.00,
    is_free: true,
    currency: Currency.BDT,

    lrw_group: {
      exam_date: "2024-08-01",
      listening_time_start: "10:00",
      reading_time_start: "10:40", 
      writing_time_start: "11:40",
      assigned_instructors: [mockUsers[3]]
    },

    speaking_group: {
      time_windows: [],
      assigned_instructors: [],
      session_per_student: 0
    },

    created_at: "2024-06-01T08:00:00Z",
    updated_at: "2024-06-15T12:00:00Z",
    is_active: true,
    max_students: 200,
    registration_deadline: "2024-07-30T23:59:59Z"
  },

  {
    id: "ielts_exam_2024_10_academic",
    title: "IELTS Academic Test - October 2024 Session",
    description: "Second academic session for October with weekend scheduling option.",

    listening_test: ieltsListeningTest[0],
    
    reading_test: ieltsReadingTest[0],
    
    writing_test: mockIeltsWritingTests[0],

    price: 220.00,
    is_free: false,
    currency: Currency.BDT,

    lrw_group: {
      exam_date: "2024-10-19",
      listening_time_start: "09:30",
      reading_time_start: "10:10",
      writing_time_start: "11:10",
      assigned_instructors: [mockUsers[2], mockUsers[3]]
    },

    speaking_group: {
      time_windows: [
        {
          id: "tw_005",
          date: "2024-10-20",
          start_time: "09:00",
          end_time: "12:00"
        },
        {
          id: "tw_006",
          date: "2024-10-20",
          start_time: "14:00",
          end_time: "18:00"
        },
        {
          id: "tw_007",
          date: "2024-10-21",
          start_time: "10:00",
          end_time: "16:00"
        }
      ],
      assigned_instructors: [mockUsers[0], mockUsers[1], mockUsers[2]],
      session_per_student: 15
    },

    created_at: "2024-08-01T09:00:00Z",
    updated_at: "2024-08-10T11:20:00Z",
    is_active: true,
    max_students: 60,
    registration_deadline: "2024-10-14T23:59:59Z"
  },

  {
    id: "ielts_exam_2024_11_general",
    title: "IELTS General Training - November 2024",
    description: "General Training test with extended speaking sessions for detailed assessment.",

    listening_test: ieltsListeningTest[0],
    
    reading_test: ieltsReadingTest[0], 
    
    writing_test: mockIeltsWritingTests[0],

    price: 205.00,
    is_free: false,
    currency: Currency.BDT,

    lrw_group: {
      exam_date: "2024-11-16",
      listening_time_start: "13:30",
      reading_time_start: "14:10",
      writing_time_start: "15:10",
      assigned_instructors: [mockUsers[0], mockUsers[3]]
    },

    speaking_group: {
      time_windows: [
        {
          id: "tw_008",
          date: "2024-11-17",
          start_time: "09:00",
          end_time: "13:00"
        },
        {
          id: "tw_009",
          date: "2024-11-17",
          start_time: "14:00",
          end_time: "17:00"
        }
      ],
      assigned_instructors: [mockUsers[1], mockUsers[2]],
      session_per_student: 18
    },

    created_at: "2024-08-15T14:00:00Z",
    updated_at: "2024-08-25T10:15:00Z",
    is_active: true,
    max_students: 35,
    registration_deadline: "2024-11-11T23:59:59Z"
  }
];