import { IELTSExamModel } from "@/types/exam/ielts-academic/exam";

/**
 * Check if exam registration is open
 */
export function isRegistrationOpen(exam: IELTSExamModel): boolean {
  if (!exam.registration_deadline) return exam.is_active || false;
  return (
    new Date() < new Date(exam.registration_deadline) &&
    (exam.is_active || false)
  );
}

/**
 * Check if exam is upcoming
 */
export function isExamUpcoming(exam: IELTSExamModel): boolean {
  const examDate = new Date(exam.lrw_group.exam_date);
  return examDate > new Date();
}

/**
 * Check if exam is in the past
 */
export function isExamPast(exam: IELTSExamModel): boolean {
  const examDate = new Date(exam.lrw_group.exam_date);
  return examDate < new Date();
}

/**
 * Get exam status as a readable string
 */
export function getExamStatus(exam: IELTSExamModel): {
  status:
    | "upcoming"
    | "registration-open"
    | "registration-closed"
    | "completed"
    | "inactive";
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
} {
  if (!exam.is_active) {
    return {
      status: "inactive",
      label: "Inactive",
      variant: "outline",
    };
  }

  if (isExamPast(exam)) {
    return {
      status: "completed",
      label: "Completed",
      variant: "secondary",
    };
  }

  if (isRegistrationOpen(exam)) {
    return {
      status: "registration-open",
      label: "Registration Open",
      variant: "default",
    };
  }

  if (isExamUpcoming(exam)) {
    return {
      status: "registration-closed",
      label: "Registration Closed",
      variant: "destructive",
    };
  }

  return {
    status: "upcoming",
    label: "Upcoming",
    variant: "outline",
  };
}

/**
 * Get days until exam
 */
export function getDaysUntilExam(exam: IELTSExamModel): number {
  const examDate = new Date(exam.lrw_group.exam_date);
  const today = new Date();
  const diffTime = examDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Get days until registration deadline
 */
export function getDaysUntilRegistrationDeadline(
  exam: IELTSExamModel
): number | null {
  if (!exam.registration_deadline) return null;

  const deadline = new Date(exam.registration_deadline);
  const today = new Date();
  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Check if exam has speaking component
 */
export function hasSpeakingComponent(exam: IELTSExamModel): boolean {
  return exam.speaking_group.time_windows.length > 0;
}

/**
 * Get total exam duration in minutes
 */
export function getTotalExamDuration(): number {
  // Standard IELTS timing: Listening (30) + Reading (60) + Writing (60) = 150 minutes
  // Speaking is separate and varies
  return 150;
}

/**
 * Sort exams by exam date
 */
export function sortExamsByDate(
  exams: IELTSExamModel[],
  ascending: boolean = true
): IELTSExamModel[] {
  return [...exams].sort((a, b) => {
    const dateA = new Date(a.lrw_group.exam_date).getTime();
    const dateB = new Date(b.lrw_group.exam_date).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
}

/**
 * Filter exams by status
 */
export function filterExamsByStatus(
  exams: IELTSExamModel[],
  status: "active" | "upcoming" | "past" | "registration-open"
): IELTSExamModel[] {
  return exams.filter((exam) => {
    switch (status) {
      case "active":
        return exam.is_active;
      case "upcoming":
        return isExamUpcoming(exam);
      case "past":
        return isExamPast(exam);
      case "registration-open":
        return isRegistrationOpen(exam);
      default:
        return true;
    }
  });
}
