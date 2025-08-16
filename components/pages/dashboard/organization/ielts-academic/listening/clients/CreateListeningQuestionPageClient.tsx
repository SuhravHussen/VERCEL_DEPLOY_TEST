"use client";

import React, { useRef, useState } from "react";
import AudioStep from "./question-form/AudioStep";
import QuestionStep from "./question-form/QuestionStep";
import PreviewStep from "./question-form/PreviewStep";

import { useToasts } from "@/components/ui/toast";

import useCreateIeltsListeningQuestion from "@/hooks/organization/ielts-academic/listening/use-add-ielts-listening-questions";

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

interface CreateListeningQuestionPageClientProps {
  organizationSlug: string;
}

import { StepperContext, FormData } from "./shared/StepperContext";

export default function CreateListeningQuestionPageClient({
  organizationSlug,
}: CreateListeningQuestionPageClientProps) {
  const stepperRef = useRef<HTMLDivElement & IStepperMethods>(null);
  const { success, error } = useToasts();

  const createQuestionMutation = useCreateIeltsListeningQuestion();

  const [formData, setFormData] = useState<FormData>({
    audio: {
      title: "",
      audioUrl: "",
      difficulty: "medium",
    },
    questions: [],
  });

  const updateAudioData = (audioData: Partial<FormData["audio"]>) => {
    setFormData((prev) => ({
      ...prev,
      audio: {
        ...prev.audio,
        ...audioData,
      },
    }));
  };

  const saveHandler = async () => {
    try {
      console.log(formData);
      // await createQuestionMutation.mutateAsync(formData);
      success("Question created successfully");
      // router.push(
      //   `/dashboard/organization/${organizationId}/ielts/listening/questions`
      // );
    } catch (e) {
      console.error(e);
      error("Failed to create question");
    }
  };

  return (
    <StepperContext.Provider
      value={{
        stepperRef: stepperRef as React.RefObject<
          HTMLDivElement & IStepperMethods
        >,
      }}
    >
      <div className="container py-8 mx-auto px-2">
        <h1 className="text-2xl font-bold mb-6">Create Listening Question</h1>
        <p className="text-muted-foreground mb-8">
          Create a new question for the listening section
        </p>

        <InteractiveStepper ref={stepperRef}>
          <InteractiveStepperItem>
            <InteractiveStepperIndicator />
            <div>
              <InteractiveStepperTitle>
                Select Listening Audio
              </InteractiveStepperTitle>
              <InteractiveStepperDescription>
                Select an audio file for the question
              </InteractiveStepperDescription>
            </div>
            <InteractiveStepperSeparator />
          </InteractiveStepperItem>

          <InteractiveStepperItem>
            <InteractiveStepperIndicator />
            <div>
              <InteractiveStepperTitle>Create Question</InteractiveStepperTitle>
              <InteractiveStepperDescription>
                Create a new question for the listening section
              </InteractiveStepperDescription>
            </div>
            <InteractiveStepperSeparator />
          </InteractiveStepperItem>

          <InteractiveStepperItem>
            <InteractiveStepperIndicator />
            <div>
              <InteractiveStepperTitle>Preview</InteractiveStepperTitle>
              <InteractiveStepperDescription>
                Preview the question before saving
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
              updateFormData={(questions: IELTSListeningQuestionGroup[]) =>
                setFormData((prev) => ({ ...prev, questions }))
              }
              audio={formData.audio}
              organizationSlug={organizationSlug}
            />
          </InteractiveStepperContent>

          <InteractiveStepperContent step={3}>
            <PreviewStep
              formData={formData}
              onSave={saveHandler}
              isSaving={createQuestionMutation.isPending}
            />
          </InteractiveStepperContent>
        </InteractiveStepper>
      </div>
    </StepperContext.Provider>
  );
}
