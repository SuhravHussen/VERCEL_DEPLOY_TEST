import { User } from "@/types/user";
import { ExamModel, ExamType } from "./exam";
import { SpeakingSession } from "./speaking-session";

// Submission status enum
export enum SubmissionStatus {
  DRAFT = "draft",
  SUBMITTED = "submitted",
  UNDER_REVIEW = "under_review",
  GRADED = "graded",
  COMPLETED = "completed",
}

// Individual section submission interfaces
export interface ListeningSubmission {
  answers: {
    question_number: number;
    answer: string;
  }[];
  time_spent: number; // in seconds
  started_at?: string;
  completed_at?: string;
}

export interface ReadingSubmission {
  answers: {
    question_number: number;
    answer: string;
  }[];
  time_spent: number; // in seconds
  started_at?: string;
  completed_at?: string;
}

export interface WritingSubmission {
  task_1?: {
    content: string;
    word_count: number;
    time_spent: number; // in seconds
  };
  task_2?: {
    content: string;
    word_count: number;
    time_spent: number; // in seconds
  };
  started_at?: string;
  completed_at?: string;
}

export interface SpeakingSubmission {
  session_id: string;
  session?: SpeakingSession;
  instructor_id?: string;
  recording_urls?: string[]; // Multiple recordings for different parts
  notes?: string;
  started_at?: string;
  completed_at?: string;
  duration?: number; // in seconds
}

// Grading interfaces
export interface SectionGrade {
  score?: number;
  max_score?: number;
  band_score?: number; // For IELTS
  feedback?: string;
  graded_by?: string; // instructor_id
  graded_at?: string;

  //for ietls wrting
  task_achievement?: number; // out of 9

  //for ietls speaking & writing
  coherence_and_cohesion?: number; // out of 9
  lexical_resource?: number; // out of 9
  grammatical_range_and_accuracy?: number; // out of 9

  //for ietls speaking
  pronunciation?: number; // out of 9
}

export interface ExamGrades {
  listening?: SectionGrade;
  reading?: SectionGrade;
  writing?: {
    task_1?: SectionGrade;
    task_2?: SectionGrade;
    overall?: SectionGrade;
  };
  speaking?: SectionGrade;
  overall_score?: number;
  overall_band_score?: number; // For IELTS
  grade_breakdown?: Record<string, number>;
}

// Main submission model
export interface ExamSubmission {
  // Basic submission information
  id: string;
  exam_id: string;
  student_id: string;
  exam_type: ExamType;

  // Submission status
  status: SubmissionStatus;

  // Section submissions
  listening_submission?: ListeningSubmission;
  reading_submission?: ReadingSubmission;
  writing_submission?: WritingSubmission;
  speaking_submission?: SpeakingSubmission;

  // Grading information
  grades?: ExamGrades;
  requires_manual_grading: boolean;
  auto_graded_sections: string[];

  // Additional metadata
  attempt_number: number;
  is_practice: boolean;
  created_at: string;
  updated_at: string;

  // Student and exam references
  student?: User;
  exam?: ExamModel;
}
