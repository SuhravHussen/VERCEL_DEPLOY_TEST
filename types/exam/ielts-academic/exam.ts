import { User } from "@/types/user";
import { IELTSListeningTest } from "./listening/listening";
import { IELTSReadingTest } from "./reading/test/test";
import { IELTSWritingTest } from "./writing/writing";
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

// Admin exam model for creation/editing (allows optional tests)
export interface AdminIELTSExamModel {
  // Basic exam information
  id?: string;
  title: string;
  description?: string;

  // Test references (optional for admins)
  listening_test?: IELTSListeningTest;
  reading_test?: IELTSReadingTest;
  writing_test?: IELTSWritingTest;

  // Pricing information
  price: number;
  is_free: boolean;
  currency: Currency;

  // Listening, Reading, Writing (grouped together)
  lrw_group: {
    exam_date: string; // ISO date string
    listening_time_start: string; // ISO time string like "09:00:00Z" or "09:00"
    reading_time_start: string; // ISO time string like "10:30:00Z" or "10:30"
    writing_time_start: string; // ISO time string like "12:00:00Z" or "12:00"
    assigned_instructors: User[];
  };

  // Speaking test (separate scheduling)
  speaking_group: {
    time_windows: TimeWindow[];
    assigned_instructors: User[];
    session_per_student: number; // Duration in minutes or number of sessions
  };

  // Additional metadata
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
  max_students?: number;
  registration_deadline?: string;
}

// Main IELTS Exam model
export interface IELTSExamModel {
  // Basic exam information
  id: string;
  title: string;
  description?: string;

  // Test references (assuming you have these models already)
  listening_test: IELTSListeningTest;
  reading_test: IELTSReadingTest;
  writing_test: IELTSWritingTest;

  // Pricing information
  price: number;
  is_free: boolean;
  currency: Currency;

  // Listening, Reading, Writing (grouped together)
  lrw_group: {
    exam_date: string; // ISO date string
    listening_time_start: string; // ISO time string like "09:00:00Z" or "09:00"
    reading_time_start: string; // ISO time string like "10:30:00Z" or "10:30"
    writing_time_start: string; // ISO time string like "12:00:00Z" or "12:00"
    assigned_instructors: User[];
  };

  // Speaking test (separate scheduling)
  speaking_group: {
    time_windows: TimeWindow[];
    assigned_instructors: User[];
    session_per_student: number; // Duration in minutes or number of sessions
  };

  // Additional metadata
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
  max_students?: number;
  registration_deadline?: string;
}
