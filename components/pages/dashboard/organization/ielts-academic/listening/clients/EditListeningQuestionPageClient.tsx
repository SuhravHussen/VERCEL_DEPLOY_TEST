"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AudioStep from "./question-form/AudioStep";
import QuestionStep from "./question-form/QuestionStep";
import PreviewStep from "./question-form/PreviewStep";

import { useToasts } from "@/components/ui/toast";

import { useGetIeltsListeningQuestion } from "@/hooks/organization/ielts-academic/listening/use-get-ielts-listening-question";
import { useUpdateIeltsListeningQuestion } from "@/hooks/organization/ielts-academic/listening/use-update-ielts-listening-question";

import {
  InteractiveStepper,
  InteractiveStepperItem,
  InteractiveStepperIndicator,
  InteractiveStepperTitle,
  InteractiveStepperDescription,
  InteractiveStepperSeparator,
  InteractiveStepperContent,
  IStepperMethods,
} from "@/components/ui/stepper";

import { IELTSListeningQuestionGroup } from "@/types/exam/ielts-academic/listening/listening";

import { StepperContext, FormData } from "./shared/StepperContext";

interface EditListeningQuestionPageClientProps {
  organizationId: number;
  questionId: string;
}

export default function EditListeningQuestionPageClient({
  organizationId,
  questionId,
}: EditListeningQuestionPageClientProps) {
  const router = useRouter();
  const toast = useToasts();
  const stepperRef = useRef<HTMLDivElement & IStepperMethods>(null);

  // Fetch the existing question data
  const {
    data: existingQuestion,
    isLoading,
    error,
  } = useGetIeltsListeningQuestion(questionId);
  const updateQuestionMutation = useUpdateIeltsListeningQuestion();

  const [formData, setFormData] = useState<FormData>({
    audio: {
      title: "",
      audioUrl: "",
      difficulty: "medium",
    },
    questions: [],
  });

  // Load existing data when it becomes available
  useEffect(() => {
    if (existingQuestion) {
      setFormData({
        audio: existingQuestion.audio,
        questions: existingQuestion.questions,
      });
    }
  }, [existingQuestion]);

  const updateAudioData = (audioData: Partial<FormData["audio"]>) => {
    setFormData((prev) => ({
      ...prev,
      audio: {
        ...prev.audio,
        ...audioData,
      },
    }));
  };

  const updateQuestionsData = (questions: IELTSListeningQuestionGroup[]) => {
    setFormData((prev) => ({ ...prev, questions }));
  };

  const handleSubmit = async () => {
    if (!formData.audio.title || formData.questions.length === 0) {
      toast.error("Please complete all required fields");
      return;
    }

    try {
      await updateQuestionMutation.mutateAsync({
        questionId,
        audio: formData.audio,
        questions: formData.questions,
      });

      toast.success("Question updated successfully!");
      router.push(
        `/dashboard/organization/${organizationId}/ielts-academic/listening/questions`
      );
    } catch (error) {
      console.error("Error updating question:", error);
      toast.error("Failed to update question. Please try again.");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container py-8 mx-auto px-2">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading question data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !existingQuestion) {
    return (
      <div className="container py-8 mx-auto px-2">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-destructive mb-2">Error</h2>
            <p className="text-muted-foreground mb-4">
              Failed to load question data. The question might not exist.
            </p>
            <button
              onClick={() => router.back()}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <StepperContext.Provider
      value={{
        stepperRef: stepperRef as React.RefObject<
          HTMLDivElement & IStepperMethods
        >,
      }}
    >
      <div className="container py-8 mx-auto px-2">
        <h1 className="text-2xl font-bold mb-6">Edit Listening Question</h1>
        <p className="text-muted-foreground mb-8">
          Update the listening question details
        </p>

        <InteractiveStepper ref={stepperRef}>
          <InteractiveStepperItem>
            <InteractiveStepperIndicator />
            <div>
              <InteractiveStepperTitle>
                Edit Listening Audio
              </InteractiveStepperTitle>
              <InteractiveStepperDescription>
                Update the audio file for the question
              </InteractiveStepperDescription>
            </div>
            <InteractiveStepperSeparator />
          </InteractiveStepperItem>

          <InteractiveStepperItem>
            <InteractiveStepperIndicator />
            <div>
              <InteractiveStepperTitle>Edit Question</InteractiveStepperTitle>
              <InteractiveStepperDescription>
                Update the question details
              </InteractiveStepperDescription>
            </div>
            <InteractiveStepperSeparator />
          </InteractiveStepperItem>

          <InteractiveStepperItem>
            <InteractiveStepperIndicator />
            <div>
              <InteractiveStepperTitle>Preview</InteractiveStepperTitle>
              <InteractiveStepperDescription>
                Preview the updated question before saving
              </InteractiveStepperDescription>
            </div>
          </InteractiveStepperItem>

          <InteractiveStepperContent step={1}>
            <AudioStep
              formData={formData.audio}
              updateFormData={updateAudioData}
            />
          </InteractiveStepperContent>

          <InteractiveStepperContent step={2}>
            <QuestionStep
              formData={formData.questions}
              updateFormData={updateQuestionsData}
              audio={formData.audio}
              organizationId={organizationId}
            />
          </InteractiveStepperContent>

          <InteractiveStepperContent step={3}>
            <PreviewStep
              formData={formData}
              onSave={handleSubmit}
              isSaving={updateQuestionMutation.isPending}
              submitButtonText="Update Question"
            />
          </InteractiveStepperContent>
        </InteractiveStepper>
      </div>
    </StepperContext.Provider>
  );
}
