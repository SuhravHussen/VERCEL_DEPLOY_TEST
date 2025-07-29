import { IELTSExamModel } from "@/types/exam/ielts-academic/exam";
import { ValidationErrors } from "@/types/exam/ielts-academic/exam-creation";

export const validateBasicInfo = (examData: Partial<IELTSExamModel>): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!examData.title?.trim()) {
    errors.title = "Exam title is required";
  }

  if (!examData.is_free && (!examData.price || examData.price <= 0)) {
    errors.price = "Price must be greater than 0 for paid exams";
  }

  return errors;
};

export const validateTestSelection = (examData: Partial<IELTSExamModel>): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!examData.listening_test) {
    errors.listening_test = "Listening test is required";
  }

  if (!examData.reading_test) {
    errors.reading_test = "Reading test is required";
  }

  if (!examData.writing_test) {
    errors.writing_test = "Writing test is required";
  }

  return errors;
};

export const validateLRWSchedule = (examData: Partial<IELTSExamModel>): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!examData.lrw_group?.exam_date) {
    errors.exam_date = "Exam date is required";
  }

  if (!examData.lrw_group?.listening_time_start) {
    errors.listening_time = "Listening start time is required";
  }

  if (!examData.lrw_group?.reading_time_start) {
    errors.reading_time = "Reading start time is required";
  }

  if (!examData.lrw_group?.writing_time_start) {
    errors.writing_time = "Writing start time is required";
  }

  if (!examData.lrw_group?.assigned_instructors?.length) {
    errors.instructors = "At least one instructor must be assigned";
  }

  return errors;
};

export const validateSpeakingSchedule = (examData: Partial<IELTSExamModel>): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!examData.speaking_group?.time_windows?.length) {
    errors.time_windows = "At least one time window is required";
  }

  if (!examData.speaking_group?.assigned_instructors?.length) {
    errors.instructors = "At least one instructor must be assigned";
  }

  return errors;
};
