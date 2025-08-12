import { ExamSubmission, SubmissionStatus } from "@/types/exam/exam-submission";
import { ExamType } from "@/types/exam/exam";
import { Role } from "@/types/role";
import { mockInstructorSpeakingSessions } from "./mockInstructorSpeakingSessions";

export const mockExamSubmissions: ExamSubmission[] = [
  {
    id: "sub_001",
    exam_id: "ielts_exam_2026_08_academic",
    student_id: "user_001",
    exam_type: ExamType.IELTS,
    status: SubmissionStatus.COMPLETED,
    listening_submission: {
      answers: [
        { question_number: 1, answer: "A" },
        { question_number: 2, answer: "library" },
        { question_number: 3, answer: "B" },
        { question_number: 4, answer: "economics" },
        { question_number: 5, answer: "C" },
      ],
      time_spent: 1800, // 30 minutes
      started_at: "2024-01-15T09:00:00Z",
      completed_at: "2024-01-15T09:30:00Z",
    },
    reading_submission: {
      answers: [
        { question_number: 1, answer: "TRUE" },
        { question_number: 2, answer: "FALSE" },
        { question_number: 3, answer: "NOT GIVEN" },
        { question_number: 4, answer: "technology" },
        { question_number: 5, answer: "C" },
      ],
      time_spent: 3600, // 60 minutes
      started_at: "2024-01-15T09:30:00Z",
      completed_at: "2024-01-15T10:30:00Z",
    },
    writing_submission: {
      task_1: {
        content:
          "The chart shows the percentage of households with different types of internet connections from 2000 to 2020...",
        word_count: 156,
        time_spent: 1200, // 20 minutes
      },
      task_2: {
        content:
          "In today's digital age, the role of technology in education has become increasingly significant...",
        word_count: 287,
        time_spent: 2400, // 40 minutes
      },
      started_at: "2024-01-15T10:30:00Z",
      completed_at: "2024-01-15T11:30:00Z",
    },
    speaking_submission: {
      session_id: "session_001",
      instructor_id: "instructor_001",
      recording_urls: [
        "/recordings/sub_001_part1.mp3",
        "/recordings/sub_001_part2.mp3",
        "/recordings/sub_001_part3.mp3",
      ],
      notes: "Student showed good fluency in part 2",
      started_at: "2024-01-15T11:30:00Z",
      completed_at: "2024-01-15T11:45:00Z",
      duration: 900, // 15 minutes
    },
    grades: {
      listening: {
        score: 28,
        max_score: 40,
        band_score: 7.0,
        feedback: "Good performance in listening comprehension",
        graded_by: "instructor_001",
        graded_at: "2024-01-15T14:00:00Z",
      },
      reading: {
        score: 32,
        max_score: 40,
        band_score: 7.5,
        feedback: "Excellent reading skills demonstrated",
        graded_by: "instructor_001",
        graded_at: "2024-01-15T14:15:00Z",
      },
      writing: {
        task_1: {
          score: 6.5,
          max_score: 9,
          band_score: 6.5,
          feedback: "Good task achievement and coherence",
          graded_by: "instructor_002",
          graded_at: "2024-01-15T15:00:00Z",
        },
        task_2: {
          score: 7.0,
          max_score: 9,
          band_score: 7.0,
          feedback: "Strong arguments and vocabulary range",
          graded_by: "instructor_002",
          graded_at: "2024-01-15T15:15:00Z",
        },
        overall: {
          score: 6.75,
          max_score: 9,
          band_score: 6.5,
        },
      },
      speaking: {
        score: 7.0,
        max_score: 9,
        band_score: 7.0,
        feedback: "Natural fluency with good pronunciation",
        graded_by: "instructor_003",
        graded_at: "2024-01-15T16:00:00Z",
        coherence_and_cohesion: 7.0, // out of 9 (Fluency and Coherence)
        lexical_resource: 7.5, // out of 9
        grammatical_range_and_accuracy: 6.5, // out of 9
        pronunciation: 7.0, // out of 9
      },
      overall_score: 85.25,
      overall_band_score: 7.0,
    },
    requires_manual_grading: false,
    auto_graded_sections: ["listening", "reading"],
    attempt_number: 1,
    is_practice: false,
    created_at: "2024-01-15T08:45:00Z",
    updated_at: "2024-01-15T16:00:00Z",
    student: {
      id: "user_001",
      name: "John Doe",
      email: "john.doe@example.com",
      role: Role.USER,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
  },
  {
    id: "sub_002",
    exam_id: "ielts_exam_2026_08_academic",
    student_id: "user_002",
    exam_type: ExamType.IELTS,
    status: SubmissionStatus.UNDER_REVIEW,
    listening_submission: {
      answers: [
        { question_number: 1, answer: "B" },
        { question_number: 2, answer: "museum" },
        { question_number: 3, answer: "A" },
        { question_number: 4, answer: "history" },
        { question_number: 5, answer: "C" },
      ],
      time_spent: 1950, // 32.5 minutes
      started_at: "2024-01-15T09:00:00Z",
      completed_at: "2024-01-15T09:32:30Z",
    },
    reading_submission: {
      answers: [
        { question_number: 1, answer: "FALSE" },
        { question_number: 2, answer: "TRUE" },
        { question_number: 3, answer: "NOT GIVEN" },
        { question_number: 4, answer: "environment" },
        { question_number: 5, answer: "B" },
      ],
      time_spent: 3900, // 65 minutes
      started_at: "2024-01-15T09:32:30Z",
      completed_at: "2024-01-15T10:37:30Z",
    },
    writing_submission: {
      task_1: {
        content:
          "The graph illustrates the changes in renewable energy consumption across different countries...",
        word_count: 142,
        time_spent: 1350, // 22.5 minutes
      },
      task_2: {
        content:
          "The importance of environmental conservation cannot be overstated in our modern world...",
        word_count: 312,
        time_spent: 2700, // 45 minutes
      },
      started_at: "2024-01-15T10:37:30Z",
      completed_at: "2024-01-15T11:45:00Z",
    },
    speaking_submission: {
      session_id: "session_002",
      recording_urls: [
        "/recordings/sub_002_part1.mp3",
        "/recordings/sub_002_part2.mp3",
        "/recordings/sub_002_part3.mp3",
      ],
      started_at: "2024-01-15T11:45:00Z",
      completed_at: "2024-01-15T12:00:00Z",
      duration: 900,
    },
    grades: {
      listening: {
        score: 25,
        max_score: 40,
        band_score: 6.5,
        feedback: "Good comprehension, some areas for improvement",
        graded_by: "instructor_001",
        graded_at: "2024-01-15T14:30:00Z",
      },
      reading: {
        score: 29,
        max_score: 40,
        band_score: 7.0,
        feedback: "Solid reading performance",
        graded_by: "instructor_001",
        graded_at: "2024-01-15T14:45:00Z",
      },
    },
    requires_manual_grading: true,
    auto_graded_sections: ["listening", "reading"],
    attempt_number: 1,
    is_practice: false,
    created_at: "2024-01-15T08:45:00Z",
    updated_at: "2024-01-15T14:45:00Z",
    student: {
      id: "user_002",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: Role.USER,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
  },
  {
    id: "sub_003",
    exam_id: "ielts_exam_2026_12_general",
    student_id: "user_003",
    exam_type: ExamType.IELTS,
    status: SubmissionStatus.SUBMITTED,
    listening_submission: {
      answers: [
        { question_number: 1, answer: "C" },
        { question_number: 2, answer: "school" },
        { question_number: 3, answer: "B" },
        { question_number: 4, answer: "mathematics" },
        { question_number: 5, answer: "A" },
      ],
      time_spent: 1750, // 29.16 minutes
      started_at: "2024-01-15T13:00:00Z",
      completed_at: "2024-01-15T13:29:10Z",
    },
    reading_submission: {
      answers: [
        { question_number: 1, answer: "TRUE" },
        { question_number: 2, answer: "NOT GIVEN" },
        { question_number: 3, answer: "FALSE" },
        { question_number: 4, answer: "climate" },
        { question_number: 5, answer: "A" },
      ],
      time_spent: 3450, // 57.5 minutes
      started_at: "2024-01-15T13:29:10Z",
      completed_at: "2024-01-15T14:26:40Z",
    },
    writing_submission: {
      task_1: {
        content:
          "The pie chart demonstrates the distribution of energy sources used globally in 2023...",
        word_count: 163,
        time_spent: 1080, // 18 minutes
      },
      task_2: {
        content:
          "Education plays a pivotal role in shaping the future of society...",
        word_count: 298,
        time_spent: 2760, // 46 minutes
      },
      started_at: "2024-01-15T14:26:40Z",
      completed_at: "2024-01-15T15:30:40Z",
    },
    speaking_submission: {
      session_id: "session_001",
      session: mockInstructorSpeakingSessions[0],
      started_at: "2024-01-15T15:30:40Z",
      completed_at: "2024-01-15T15:45:40Z",
      duration: 900,
    },
    grades: {
      listening: {
        score: 28,
        max_score: 40,
        band_score: 7.0,
        feedback: "Good performance in listening comprehension",
        graded_by: "instructor_001",
        graded_at: "2024-01-15T14:00:00Z",
        coherence_and_cohesion: 7.0, // out of 9
        lexical_resource: 7.5, // out of 9
        grammatical_range_and_accuracy: 6.5, // out of 9
        pronunciation: 7.0, // out of 9
      },
      reading: {
        score: 32,
        max_score: 40,
        band_score: 7.5,
        feedback: "Excellent reading skills demonstrated",
        graded_by: "instructor_001",
        graded_at: "2024-01-15T14:15:00Z",
      },
      writing: {
        task_1: {
          score: 6.5,
          max_score: 9,
          band_score: 6.5,
          feedback: "Good task achievement and coherence",
          graded_by: "instructor_002",
          graded_at: "2024-01-15T15:00:00Z",
          task_achievement: 6.5, // out of 9
          coherence_and_cohesion: 6.5, // out of 9
          lexical_resource: 6.5, // out of 9
          grammatical_range_and_accuracy: 6.0, // out of 9
        },
        task_2: {
          score: 7.0,
          max_score: 9,
          band_score: 7.0,
          feedback: "Strong arguments and vocabulary range",
          graded_by: "instructor_002",
          graded_at: "2024-01-15T15:15:00Z",
          task_achievement: 7.0, // out of 9
          coherence_and_cohesion: 7.0, // out of 9
          lexical_resource: 7.5, // out of 9
          grammatical_range_and_accuracy: 6.5, // out of 9
        },
        overall: {
          score: 6.75,
          max_score: 9,
          band_score: 6.5,
          feedback: "Good task achievement and coherence",
        },
      },
      speaking: {
        score: 7.0,
        max_score: 9,
        band_score: 7.0,
        feedback: "Natural fluency with good pronunciation",
        graded_by: "instructor_003",
        graded_at: "2024-01-15T16:00:00Z",
        coherence_and_cohesion: 7.0, // out of 9 (Fluency and Coherence)
        lexical_resource: 7.5, // out of 9
        grammatical_range_and_accuracy: 6.5, // out of 9
        pronunciation: 7.0, // out of 9
      },
      overall_score: 85.25,
      overall_band_score: 7.0,
    },
    requires_manual_grading: true,
    auto_graded_sections: ["listening"],
    attempt_number: 1,
    is_practice: false,
    created_at: "2024-01-15T12:45:00Z",
    updated_at: "2024-01-15T17:00:00Z",
    student: {
      id: "user_003",
      name: "Mike Johnson",
      email: "mike.johnson@example.com",
      role: Role.USER,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
  },
  {
    id: "sub_004",
    exam_id: "ielts_practice_free_001",
    student_id: "user_004",
    exam_type: ExamType.IELTS,
    status: SubmissionStatus.DRAFT,
    listening_submission: {
      answers: [
        { question_number: 1, answer: "A" },
        { question_number: 2, answer: "bookstore" },
        { question_number: 3, answer: "" },
      ],
      time_spent: 900, // 15 minutes (incomplete)
      started_at: "2024-01-16T09:00:00Z",
    },
    requires_manual_grading: false,
    auto_graded_sections: [],
    attempt_number: 1,
    is_practice: false,
    created_at: "2024-01-16T08:45:00Z",
    updated_at: "2024-01-16T09:15:00Z",
    student: {
      id: "user_004",
      name: "Sarah Williams",
      email: "sarah.williams@example.com",
      role: Role.USER,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
  },
  {
    id: "sub_005",
    exam_id: "ielts_exam_2026_10_academic",
    student_id: "user_005",
    exam_type: ExamType.IELTS,
    status: SubmissionStatus.GRADED,
    listening_submission: {
      answers: [
        { question_number: 1, answer: "B" },
        { question_number: 2, answer: "university" },
        { question_number: 3, answer: "C" },
        { question_number: 4, answer: "research" },
        { question_number: 5, answer: "A" },
      ],
      time_spent: 1680, // 28 minutes
      started_at: "2024-01-14T10:00:00Z",
      completed_at: "2024-01-14T10:28:00Z",
    },
    reading_submission: {
      answers: [
        { question_number: 1, answer: "NOT GIVEN" },
        { question_number: 2, answer: "TRUE" },
        { question_number: 3, answer: "FALSE" },
        { question_number: 4, answer: "innovation" },
        { question_number: 5, answer: "C" },
      ],
      time_spent: 3720, // 62 minutes
      started_at: "2024-01-14T10:28:00Z",
      completed_at: "2024-01-14T11:30:00Z",
    },
    writing_submission: {
      task_1: {
        content:
          "The bar chart shows the comparison of renewable energy adoption rates across five countries...",
        word_count: 171,
        time_spent: 1500, // 25 minutes
      },
      task_2: {
        content:
          "The rapid advancement of artificial intelligence presents both opportunities and challenges...",
        word_count: 334,
        time_spent: 2700, // 45 minutes
      },
      started_at: "2024-01-14T11:30:00Z",
      completed_at: "2024-01-14T12:40:00Z",
    },
    speaking_submission: {
      session_id: "session_005",
      recording_urls: [
        "/recordings/sub_005_part1.mp3",
        "/recordings/sub_005_part2.mp3",
        "/recordings/sub_005_part3.mp3",
      ],
      notes: "Excellent pronunciation and fluency",
      started_at: "2024-01-14T12:45:00Z",
      completed_at: "2024-01-14T13:00:00Z",
      duration: 900,
    },
    grades: {
      listening: {
        score: 35,
        max_score: 40,
        band_score: 8.0,
        feedback: "Excellent listening comprehension skills",
        graded_by: "instructor_001",
        graded_at: "2024-01-14T15:00:00Z",
      },
      reading: {
        score: 36,
        max_score: 40,
        band_score: 8.5,
        feedback: "Outstanding reading performance",
        graded_by: "instructor_001",
        graded_at: "2024-01-14T15:15:00Z",
      },
      writing: {
        task_1: {
          score: 7.5,
          max_score: 9,
          band_score: 7.5,
          feedback: "Excellent task achievement and language use",
          graded_by: "instructor_002",
          graded_at: "2024-01-14T16:00:00Z",
        },
        task_2: {
          score: 8.0,
          max_score: 9,
          band_score: 8.0,
          feedback: "Strong arguments with sophisticated vocabulary",
          graded_by: "instructor_002",
          graded_at: "2024-01-14T16:15:00Z",
        },
        overall: {
          score: 7.75,
          max_score: 9,
          band_score: 8.0,
        },
      },
      speaking: {
        score: 8.0,
        max_score: 9,
        band_score: 8.0,
        feedback: "Excellent fluency and coherence",
        graded_by: "instructor_003",
        graded_at: "2024-01-14T17:00:00Z",
        coherence_and_cohesion: 8.0, // out of 9 (Fluency and Coherence)
        lexical_resource: 8.0, // out of 9
        grammatical_range_and_accuracy: 7.5, // out of 9
        pronunciation: 8.5, // out of 9
      },
      overall_score: 94.75,
      overall_band_score: 8.0,
    },
    requires_manual_grading: false,
    auto_graded_sections: ["listening", "reading"],
    attempt_number: 1,
    is_practice: false,
    created_at: "2024-01-14T09:45:00Z",
    updated_at: "2024-01-14T17:00:00Z",
    student: {
      id: "user_005",
      name: "Emily Davis",
      email: "emily.davis@example.com",
      role: Role.USER,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
  },
];
