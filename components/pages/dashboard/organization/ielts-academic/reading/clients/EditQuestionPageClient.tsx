"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
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

// Import the shared StepperContext from CreateQuestionPageClient
import { StepperContext } from "./CreateQuestionPageClient";

import useGetIeltsReadingQuestionById from "@/hooks/organization/ielts-academic/reading/use-get-ielts-reading-question-by-id";
import useUpdateIeltsReadingQuestion from "@/hooks/organization/ielts-academic/reading/use-update-ielts-reading-question";

import { CreateQuestionGroupDto } from "@/types/dto/ielts/reading/question.dto";
import { IELTSReadingQuestionGroup } from "@/types/exam/ielts-academic/reading/question/question";

interface EditQuestionPageClientProps {
  organizationId: number;
  questionId: string;
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

export default function EditQuestionPageClient({
  organizationId,
  questionId,
}: EditQuestionPageClientProps) {
  const stepperRef = useRef<HTMLDivElement & IStepperMethods>(null);
  const { success, error } = useToasts();
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    passage: {
      title: "",
      content: "",
      difficulty: "medium",
    },
    questions: [],
  });

  // Fetch existing question data
  const {
    data: existingQuestion,
    isLoading,
    error: fetchError,
  } = useGetIeltsReadingQuestionById(questionId);

  // Update mutation
  const updateQuestion = useUpdateIeltsReadingQuestion(questionId);

  // Populate form with existing data when loaded
  useEffect(() => {
    if (existingQuestion) {
      console.log("Loading existing question:", existingQuestion);

      // The question data now includes the entire section with passage and all questions
      const sectionData = existingQuestion as unknown as {
        passage?: {
          id?: string;
          title: string;
          content: string;
          difficulty: "easy" | "medium" | "hard";
        };
        questions?: IELTSReadingQuestionGroup[];
        selectedQuestionId?: string;
      };

      // Make sure we have actual passage data, not fallback
      const passageData = sectionData.passage;

      if (!passageData || !passageData.title || !passageData.content) {
        console.error("No valid passage data found in question:", sectionData);
      }

      const transformedData: FormData = {
        passage: {
          title: passageData?.title || "Reading Passage",
          content: passageData?.content
            ? // Convert plain text to HTML if needed
              passageData.content.includes("<")
              ? passageData.content
              : `<p>${passageData.content
                  .replace(/\n\n/g, "</p><p>")
                  .replace(/\n/g, "<br>")}</p>`
            : "<p>Passage content</p>",
          difficulty: passageData?.difficulty || "medium",
        },
        // Use all question groups from the section
        questions: sectionData.questions || [],
      };

      console.log("Transformed form data:", transformedData);
      setFormData(transformedData);
    }
  }, [existingQuestion]);

  const updatePassageData = (passageData: Partial<FormData["passage"]>) => {
    setFormData((prev) => ({
      ...prev,
      passage: {
        ...prev.passage,
        ...passageData,
      },
    }));
  };

  // Update the saveHandler function for editing
  const saveHandler = async () => {
    try {
      const questionData: CreateQuestionGroupDto = {
        passage: formData.passage,
        questions: formData.questions,
      };

      await updateQuestion.mutateAsync(questionData);
      success("Question updated successfully");
      router.push(
        `/dashboard/organization/${organizationId}/ielts/reading/questions`
      );
    } catch (e) {
      console.log(e);
      error("Failed to update question");
    }
  };

  // Show loading state
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

  // Show error state
  if (fetchError) {
    return (
      <div className="container py-8 mx-auto px-2">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-2">
              Error Loading Question
            </h2>
            <p className="text-muted-foreground mb-4">
              {fetchError instanceof Error
                ? fetchError.message
                : "An unexpected error occurred"}
            </p>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
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
        {/* Back Button */}
        <div className="mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              router.push(
                `/dashboard/organization/${organizationId}/ielts/reading/questions`
              )
            }
            className="gap-1.5"
          >
            <ChevronLeft className="size-4" />
            Back to Questions
          </Button>
        </div>

        <h1 className="text-2xl font-bold mb-6">Edit Question</h1>
        <p className="text-muted-foreground mb-8">
          Edit the reading section question
        </p>

        <InteractiveStepper ref={stepperRef}>
          <InteractiveStepperItem>
            <InteractiveStepperIndicator />
            <div>
              <InteractiveStepperTitle>
                Edit Reading Passage
              </InteractiveStepperTitle>
              <InteractiveStepperDescription>
                Edit the reading passage for the question
              </InteractiveStepperDescription>
            </div>
            <InteractiveStepperSeparator />
          </InteractiveStepperItem>

          <InteractiveStepperItem>
            <InteractiveStepperIndicator />
            <div>
              <InteractiveStepperTitle>Edit Question</InteractiveStepperTitle>
              <InteractiveStepperDescription>
                Edit the question for the reading section
              </InteractiveStepperDescription>
            </div>
            <InteractiveStepperSeparator />
          </InteractiveStepperItem>

          <InteractiveStepperItem>
            <InteractiveStepperIndicator />
            <div>
              <InteractiveStepperTitle>Preview</InteractiveStepperTitle>
              <InteractiveStepperDescription>
                Preview the question before saving changes
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
              organizationId={organizationId}
            />
          </InteractiveStepperContent>

          <InteractiveStepperContent step={3}>
            <PreviewStep
              formData={formData}
              onSave={saveHandler}
              isSaving={updateQuestion.isPending}
              isEditing={true}
            />
          </InteractiveStepperContent>
        </InteractiveStepper>
      </div>
    </StepperContext.Provider>
  );
}
