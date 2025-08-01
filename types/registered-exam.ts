import { User } from "@/types/user";
import { Currency } from "@/types/currency";
import { ExamModel } from "./exam/exam";

// Registered exam type, when a user registers for an exam
export interface RegisteredExam {
  id: string;
  user: User;
  exam: ExamModel;
  registered_at: string; // ISO timestamp
  payment_status: "pending" | "paid" | "failed" | "refunded";
  paid_amount: number;
  currency: Currency;
  speaking_time?: {
    date: string; // ISO date
    start: string; // Time string
    end: string; // Time string
    instructor?: {
      id: string;
      name?: string;
    };
  };
  status: "registered" | "cancelled" | "completed";
}
