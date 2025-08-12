import { ExamModel } from "@/types/exam/exam";

/**
 * Checks if a user is assigned to any speaking sessions for an exam
 * @param exam - The exam to check
 * @param userId - The user ID to check for assignment
 * @returns true if the user is assigned to speaking sessions, false otherwise
 */
export function isAssigned(exam: ExamModel, userId: string): boolean {
  // Check if the exam has a speaking group and assigned instructors
  if (!exam.speaking_group?.assigned_instructors) {
    return false;
  }

  // Check if the user ID is in the assigned instructors array
  return exam.speaking_group.assigned_instructors.some(
    (instructor) => instructor.id === userId
  );
}

/**
 * Checks if a user is assigned to the LRW (Listening, Reading, Writing) group for an exam
 * @param exam - The exam to check
 * @param userId - The user ID to check for assignment
 * @returns true if the user is assigned to LRW group, false otherwise
 */
export function isAssignedToLRW(exam: ExamModel, userId: string): boolean {
  // Check if the exam has an LRW group and assigned instructors
  if (!exam.lrw_group?.assigned_instructors) {
    return false;
  }

  // Check if the user ID is in the assigned instructors array
  return exam.lrw_group.assigned_instructors.some(
    (instructor) => instructor.id === userId
  );
}
