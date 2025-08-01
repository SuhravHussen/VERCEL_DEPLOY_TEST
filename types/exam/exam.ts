import { User } from "@/types/user";
import { IELTSListeningTest } from "./ielts-academic/listening/listening";
import { IELTSReadingTest } from "./ielts-academic/reading/test/test";
import { IELTSWritingTest } from "./ielts-academic/writing/writing";
import { Currency } from "@/types/currency";

// Time slot interface for speaking test scheduling
export interface TimeSlot {
  start: string; // ISO string or time format like "10:00"
  end: string; // ISO string or time format like "13:00"
}

// Time window interface for speaking test dates and available times
export interface TimeWindow {
  id?: string;
  date: string; // ISO date string like "2024-08-01"
  start_time: string; // Time string like "09:00"
  end_time: string; // Time string like "17:00"
}

// Instructor reference interface
export interface InstructorReference {
  id: string;
  name?: string; // Optional for display purposes
}

export enum ExamType {
  IELTS = "ielts",
  TOEFL = "toefl",
  GRE = "gre",
  SAT = "sat",
  GMAT = "gmat",
}

// Exam filter interfaces
export interface ExamFilters {
  examType?: ExamType | "all";
  priceFilter?: "all" | "free" | "paid";
  sortBy?: "date" | "price" | "title" | "created_at";
  sortOrder?: "asc" | "desc";
  searchQuery?: string;
}

export interface ExamStatsData {
  totalExams: number;
  totalByType: Record<ExamType, number>;
  freeExams: number;
  paidExams: number;
  upcomingExams: number;
  publishedExams: number;
}

// Main IELTS Exam model
export interface ExamModel {
  // Basic exam information
  id: string;
  title: string;
  description?: string;

  type_of_exam: ExamType;

  price: number;
  is_free: boolean;
  currency: Currency;

  // for ielts exam
  listening_test?: IELTSListeningTest;
  reading_test?: IELTSReadingTest;
  writing_test?: IELTSWritingTest;

  lrw_group?: {
    exam_date: string;
    listening_time_start: string;
    reading_time_start: string;
    writing_time_start: string;
    assigned_instructors: User[];
  };

  speaking_group?: {
    time_windows: TimeWindow[];
    assigned_instructors: User[];
    session_per_student: number;
  };

  // Additional metadata
  created_at?: string;
  updated_at?: string;
  is_published?: boolean;
  max_students?: number;
  registration_deadline?: string;
  is_practice_exam?: boolean;
}
