"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToasts } from "@/components/ui/toast";
import { QUERY_KEYS } from "@/hooks/query-keys";

// Simplified interface for section-level grading only
export interface SectionGradingData {
  submission_id: string;
  section: "listening" | "reading" | "writing" | "speaking";
  section_feedback?: string;
  band_score?: number;
  graded_by: string; // instructor ID

  // IELTS Writing specific criteria
  task_1_achievement?: number;
  task_1_coherence_cohesion?: number;
  task_1_lexical_resource?: number;
  task_1_grammatical_range?: number;
  task_1_feedback?: string;
  task_1_band_score?: number;

  task_2_achievement?: number;
  task_2_coherence_cohesion?: number;
  task_2_lexical_resource?: number;
  task_2_grammatical_range?: number;
  task_2_feedback?: string;
  task_2_band_score?: number;

  // IELTS Speaking specific criteria
  coherence_and_cohesion?: number; // Fluency & Coherence
  lexical_resource?: number;
  grammatical_range_and_accuracy?: number;
  pronunciation?: number;
}

// Individual section save hooks
export const useSaveListeningGrades = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToasts();

  return useMutation({
    mutationFn: async (data: SectionGradingData) => {
      // Simulate API call - replace with actual implementation
      console.log("Saving Listening Grades:", {
        ...data,
        graded_at: new Date().toISOString(),
      });

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate occasional failure for testing
      if (Math.random() < 0.1) {
        throw new Error("Failed to save listening grades");
      }

      return { success: true, section: "listening" };
    },
    onSuccess: (result, variables) => {
      success(`Listening grades saved successfully!`);

      // Invalidate related queries to refresh data
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.EXAM_SUBMISSIONS.BY_ID(variables.submission_id),
      });

      // Update the specific section query if it exists
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.GRADING.SAVE_LISTENING(variables.submission_id),
      });
    },
    onError: (err) => {
      console.error("Error saving listening grades:", err);
      error(`Failed to save listening grades: ${err.message}`);
    },
  });
};

export const useSaveReadingGrades = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToasts();

  return useMutation({
    mutationFn: async (data: SectionGradingData) => {
      console.log("Saving Reading Grades:", {
        ...data,
        graded_at: new Date().toISOString(),
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (Math.random() < 0.1) {
        throw new Error("Failed to save reading grades");
      }

      return { success: true, section: "reading" };
    },
    onSuccess: (result, variables) => {
      success(`Reading grades saved successfully!`);

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.EXAM_SUBMISSIONS.BY_ID(variables.submission_id),
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.GRADING.SAVE_READING(variables.submission_id),
      });
    },
    onError: (err) => {
      console.error("Error saving reading grades:", err);
      error(`Failed to save reading grades: ${err.message}`);
    },
  });
};

export const useSaveWritingGrades = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToasts();

  return useMutation({
    mutationFn: async (data: SectionGradingData) => {
      console.log("Saving Writing Grades with IELTS Criteria:", {
        ...data,
        graded_at: new Date().toISOString(),
        ielts_criteria: {
          task_1: {
            achievement: data.task_1_achievement,
            coherence_cohesion: data.task_1_coherence_cohesion,
            lexical_resource: data.task_1_lexical_resource,
            grammatical_range: data.task_1_grammatical_range,
            feedback: data.task_1_feedback,
            band_score: data.task_1_band_score,
          },
          task_2: {
            achievement: data.task_2_achievement,
            coherence_cohesion: data.task_2_coherence_cohesion,
            lexical_resource: data.task_2_lexical_resource,
            grammatical_range: data.task_2_grammatical_range,
            feedback: data.task_2_feedback,
            band_score: data.task_2_band_score,
          },
        },
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (Math.random() < 0.1) {
        throw new Error("Failed to save writing grades");
      }

      return { success: true, section: "writing" };
    },
    onSuccess: (result, variables) => {
      success(`Writing grades saved successfully!`);

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.EXAM_SUBMISSIONS.BY_ID(variables.submission_id),
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.GRADING.SAVE_WRITING(variables.submission_id),
      });
    },
    onError: (err) => {
      console.error("Error saving writing grades:", err);
      error(`Failed to save writing grades: ${err.message}`);
    },
  });
};

export const useSaveSpeakingGrades = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToasts();

  return useMutation({
    mutationFn: async (data: SectionGradingData) => {
      console.log("Saving Speaking Grades:", {
        ...data,
        graded_at: new Date().toISOString(),
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (Math.random() < 0.1) {
        throw new Error("Failed to save speaking grades");
      }

      return { success: true, section: "speaking" };
    },
    onSuccess: (result, variables) => {
      success(`Speaking grades saved successfully!`);

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.EXAM_SUBMISSIONS.BY_ID(variables.submission_id),
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.GRADING.SAVE_SPEAKING(variables.submission_id),
      });
    },
    onError: (err) => {
      console.error("Error saving speaking grades:", err);
      error(`Failed to save speaking grades: ${err.message}`);
    },
  });
};

// Generic hook for any section
export const useSaveSectionGrades = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToasts();

  return useMutation({
    mutationFn: async (data: SectionGradingData) => {
      console.log(`Saving ${data.section} Grades:`, {
        ...data,
        graded_at: new Date().toISOString(),
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (Math.random() < 0.1) {
        throw new Error(`Failed to save ${data.section} grades`);
      }

      return { success: true, section: data.section };
    },
    onSuccess: (result, variables) => {
      const sectionName =
        variables.section.charAt(0).toUpperCase() + variables.section.slice(1);
      success(`${sectionName} grades saved successfully!`);

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.EXAM_SUBMISSIONS.BY_ID(variables.submission_id),
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.GRADING.SAVE_SECTION(
          variables.submission_id,
          variables.section
        ),
      });
    },
    onError: (err, variables) => {
      console.error(`Error saving ${variables.section} grades:`, err);
      error(`Failed to save ${variables.section} grades: ${err.message}`);
    },
  });
};
