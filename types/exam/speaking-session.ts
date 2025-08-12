import { User } from "../user";

export interface SpeakingSession {
  id?: string;
  exam_id: string;
  student_id: string;
  student?: User;
  instructor_id: string;
  instructor?: User;
  date: string;
  start_time: string;
  end_time: string;
  status: "scheduled" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
  meeting_url: string;
}
