"use client";

import React, { createContext, useRef, useState } from "react";
import PassageStep from "./question-form/PassageStep";
import QuestionStep from "./question-form/QuestionStep";
import PreviewStep from "./question-form/PreviewStep";

import { useToasts } from "@/components/ui/toast";

// Import the correct stepper components
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
import useCreateIeltsReadingQuestion from "@/hooks/organization/ielts-academic/reading/use-add-ielts-reading-questions";

import { CreateQuestionGroupDto } from "@/types/dto/ielts/reading/question.dto";
import { IELTSReadingQuestionGroup } from "@/types/exam/ielts-academic/reading/question/question";

interface CreateQuestionPageClientProps {
  organizationSlug: string;
}

export interface Question {
  number?: number;
  question?: string;
  options?: string[];
  answer?: string;
  answers?: string[];
  statement?: string;
  correctParagraph?: string;
  imageUrl?: string;
  paragraph?: string;
  correctHeading?: string;
  stepId?: string;
  correctAnswer?: string;
  cellId?: string;
  gapId?: string;
  sentenceStart?: string;
  correctEnding?: string;
  sentenceWithBlank?: string;
  correctFeature?: string;
  [key: string]: unknown;
}

export interface FormData {
  passage: {
    title: string;
    content: string;
    difficulty: "easy" | "medium" | "hard";
  };
  questions: IELTSReadingQuestionGroup[];
}

interface StepperContextType {
  stepperRef: React.RefObject<HTMLDivElement & IStepperMethods>;
}

export const StepperContext = createContext<StepperContextType>({
  stepperRef: { current: null } as unknown as React.RefObject<
    HTMLDivElement & IStepperMethods
  >,
});

export default function CreateQuestionPageClient({
  organizationSlug,
}: CreateQuestionPageClientProps) {
  const stepperRef = useRef<HTMLDivElement & IStepperMethods>(null);
  const { success, error } = useToasts();

  const [formData, setFormData] = useState<FormData>({
    passage: {
      title: "",
      content: "",
      difficulty: "medium",
    },
    questions: [],
  });

  const updatePassageData = (passageData: Partial<FormData["passage"]>) => {
    setFormData((prev) => ({
      ...prev,
      passage: {
        ...prev.passage,
        ...passageData,
      },
    }));
  };

  // const addQuestionGroup = (questionGroup: QuestionGroupData) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     questions: [...prev.questions, questionGroup],
  //   }));
  // };

  // const updateQuestionGroup = (
  //   id: string,
  //   questionGroupData: Partial<QuestionGroupData>
  // ) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     questions: prev.questions.map((q) =>
  //       q.id === id ? { ...q, ...questionGroupData } : q
  //     ),
  //   }));
  // };

  // const deleteQuestionGroup = (id: string) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     questions: prev.questions.filter((q) => q.id !== id),
  //   }));
  // };

  // Update the saveHandler function with proper type casting
  const createQuestion = useCreateIeltsReadingQuestion();
  const saveHandler = async () => {
    try {
      const questionData: CreateQuestionGroupDto = {
        passage: formData.passage,
        questions: formData.questions,
      };

      const question = await createQuestion.mutateAsync(questionData);
      console.log(question);
      success("Question created successfully");
      // router.push(`/dashboard/organization/${organizationId}/ielts/reading/questions`);
    } catch (e) {
      console.log(e);
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
        <h1 className="text-2xl font-bold mb-6">Create Question</h1>
        <p className="text-muted-foreground mb-8">
          Create a new question for the reading section
        </p>

        <InteractiveStepper ref={stepperRef}>
          <InteractiveStepperItem>
            <InteractiveStepperIndicator />
            <div>
              <InteractiveStepperTitle>
                Select Reading Passage
              </InteractiveStepperTitle>
              <InteractiveStepperDescription>
                Select a reading passage for the question
              </InteractiveStepperDescription>
            </div>
            <InteractiveStepperSeparator />
          </InteractiveStepperItem>

          <InteractiveStepperItem>
            <InteractiveStepperIndicator />
            <div>
              <InteractiveStepperTitle>Create Question</InteractiveStepperTitle>
              <InteractiveStepperDescription>
                Create a new question for the reading section
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
            <PassageStep
              formData={formData.passage}
              updateFormData={updatePassageData}
            />
          </InteractiveStepperContent>

          <InteractiveStepperContent step={2}>
            <QuestionStep
              formData={formData.questions}
              updateFormData={(questions) =>
                setFormData((prev) => ({ ...prev, questions }))
              }
              passage={formData.passage}
              organizationSlug={organizationSlug}
            />
          </InteractiveStepperContent>

          <InteractiveStepperContent step={3}>
            <PreviewStep
              formData={formData}
              onSave={saveHandler}
              isSaving={createQuestion.isPending}
            />
          </InteractiveStepperContent>
        </InteractiveStepper>
      </div>
    </StepperContext.Provider>
  );
}
