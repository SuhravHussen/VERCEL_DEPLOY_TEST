"use client";

import { ExamModel } from "@/types/exam/exam";
import { IeltsExamBookingCard } from "./IeltsExamBookingCard";
import { GenericExamBookingCard } from "./GenericExamBookingCard";

interface ExamBookingCardProps {
  exam: ExamModel;
  onBookExam?: (examId: string) => void;
  isLoading?: boolean;
}

export function ExamBookingCard({
  exam,
  onBookExam,
  isLoading = false,
}: ExamBookingCardProps) {
  // Dynamically choose the appropriate card based on exam type
  switch (exam.type_of_exam.toLowerCase()) {
    case "ielts":
      return (
        <IeltsExamBookingCard
          exam={exam}
          onBookExam={onBookExam}
          isLoading={isLoading}
        />
      );
    case "toefl":
    case "gre":
    case "sat":
    case "gmat":
    default:
      return (
        <GenericExamBookingCard
          exam={exam}
          onBookExam={onBookExam}
          isLoading={isLoading}
        />
      );
  }
}
