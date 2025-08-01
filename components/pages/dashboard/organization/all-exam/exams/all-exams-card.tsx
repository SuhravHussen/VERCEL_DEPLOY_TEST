"use client";

import { ExamModel } from "@/types/exam/exam";
import { IeltsAllExamCard } from "./IeltsAllExamCard";
import { ToeflAllExamCard } from "./ToeflAllExamCard";
import { GreAllExamCard } from "./GreAllExamCard";
import { SatAllExamCard } from "./SatAllExamCard";
import { GmatAllExamCard } from "./GmatAllExamCard";
import { GenericAllExamCard } from "./GenericAllExamCard";

interface AllExamsCardProps {
  exam: ExamModel;
  onViewDetails?: (examId: string) => void;
  onDelete?: (examId: string) => void;
  isDeleting?: boolean;
  showActions?: boolean;
}

export function AllExamsCard({
  exam,
  onViewDetails,
  onDelete,
  isDeleting = false,
  showActions = true,
}: AllExamsCardProps) {
  // Dynamically choose the appropriate card based on exam type
  switch (exam.type_of_exam.toLowerCase()) {
    case "ielts":
      return (
        <IeltsAllExamCard
          exam={exam}
          onViewDetails={onViewDetails}
          onDelete={onDelete}
          isDeleting={isDeleting}
          showActions={showActions}
        />
      );
    case "toefl":
      return (
        <ToeflAllExamCard
          exam={exam}
          onViewDetails={onViewDetails}
          onDelete={onDelete}
          isDeleting={isDeleting}
          showActions={showActions}
        />
      );
    case "gre":
      return (
        <GreAllExamCard
          exam={exam}
          onViewDetails={onViewDetails}
          onDelete={onDelete}
          isDeleting={isDeleting}
          showActions={showActions}
        />
      );
    case "sat":
      return (
        <SatAllExamCard
          exam={exam}
          onViewDetails={onViewDetails}
          onDelete={onDelete}
          isDeleting={isDeleting}
          showActions={showActions}
        />
      );
    case "gmat":
      return (
        <GmatAllExamCard
          exam={exam}
          onViewDetails={onViewDetails}
          onDelete={onDelete}
          isDeleting={isDeleting}
          showActions={showActions}
        />
      );
    default:
      return (
        <GenericAllExamCard
          exam={exam}
          onViewDetails={onViewDetails}
          onDelete={onDelete}
          isDeleting={isDeleting}
          showActions={showActions}
        />
      );
  }
}
