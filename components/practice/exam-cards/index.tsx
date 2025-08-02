import React from "react";
import { ExamModel, ExamType } from "@/types/exam/exam";
import { BaseExamCard } from "./base-exam-card";
import { IELTSExamCard } from "./ielts-exam-card";
import { OtherExamCard } from "./other-exam-card";

interface ExamCardProps {
  exam: ExamModel;
  className?: string;
  onStartPractice?: (examId: string) => void;
}

export const ExamCard: React.FC<ExamCardProps> = ({ exam, ...props }) => {
  switch (exam.type_of_exam) {
    case ExamType.IELTS:
      return <IELTSExamCard exam={exam} {...props} />;
    case ExamType.TOEFL:
    case ExamType.GRE:
    case ExamType.SAT:
    case ExamType.GMAT:
      return <OtherExamCard exam={exam} {...props} />;
    default:
      return <BaseExamCard exam={exam} {...props} />;
  }
};

export { BaseExamCard, IELTSExamCard, OtherExamCard };
