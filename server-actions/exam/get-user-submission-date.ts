"use server";

export async function getUserSubmissionDate(examId: string) {
  console.log("submission date for exam ", examId);
  return {
    submitted: false,
    submissionDate: null,
  };
}
