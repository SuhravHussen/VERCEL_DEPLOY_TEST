"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToasts } from "@/components/ui/toast";
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
import { CreateListeningTestDto } from "@/types/dto/ielts/listening/listening.dto";
import { useGetIeltsListeningTestById } from "@/hooks/organization/ielts-academic/listening/use-get-ielts-listening-test-by-id";
import { useUpdateIeltsListeningTest } from "@/hooks/organization/ielts-academic/listening/use-update-ielts-listening-test";
import {
  StepperContext,
  TestDetailsStep,
  TestSectionsStep,
  TestPreviewStep,
  FormData,
} from "../create-test";

interface EditListeningTestPageClientProps {
  organizationId: number;
  testId: string;
}

export default function EditListeningTestPageClient({
  organizationId,
  testId,
}: EditListeningTestPageClientProps) {
  const router = useRouter();
  const stepperRef = useRef<HTMLDivElement & IStepperMethods>(null);
  const toast = useToasts();

  // Fetch the existing test data
  const {
    data: existingTest,
    isLoading,
    error,
  } = useGetIeltsListeningTestById(testId);
  const updateTestMutation = useUpdateIeltsListeningTest();

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    difficulty: "medium",
    instructions: "",
    timeLimit: 30,
    section_one: null,
    section_two: null,
    section_three: null,
    section_four: null,
  });

  // Load existing data when it becomes available
  useEffect(() => {
    if (existingTest) {
      setFormData({
        title: existingTest.title,
        description: existingTest.description || "",
        difficulty: existingTest.difficulty,
        instructions: existingTest.instructions || "",
        timeLimit: existingTest.timeLimit || 30,
        section_one: existingTest.section_one,
        section_two: existingTest.section_two,
        section_three: existingTest.section_three,
        section_four: existingTest.section_four,
      });
    }
  }, [existingTest]);

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleSubmit = async () => {
    try {
      if (
        !formData.section_one ||
        !formData.section_two ||
        !formData.section_three ||
        !formData.section_four
      ) {
        toast.error("Please select audio for all four sections");
        return;
      }

      const testData: CreateListeningTestDto = {
        title: formData.title,
        description: formData.description || "",
        organizationId,
        difficulty: formData.difficulty,
        section_one: formData.section_one,
        section_two: formData.section_two,
        section_three: formData.section_three,
        section_four: formData.section_four,
        createdBy: existingTest?.createdBy || "Current User",
        status: existingTest?.status || "published",
        timeLimit: formData.timeLimit,
        instructions: formData.instructions,
        totalQuestionCount:
          (formData.section_one.questions?.length || 0) +
          (formData.section_two.questions?.length || 0) +
          (formData.section_three.questions?.length || 0) +
          (formData.section_four.questions?.length || 0),
      };

      await updateTestMutation.mutateAsync({
        testId,
        testData,
      });

      toast.success("Test updated successfully!");
      router.push(
        `/dashboard/organization/${organizationId}/ielts/listening/tests`
      );
    } catch (error) {
      console.error("Error updating test:", error);
      toast.error("Failed to update test. Please try again.");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container py-8 mx-auto px-2">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading test data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !existingTest) {
    return (
      <div className="container py-8 mx-auto px-2">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-destructive mb-2">Error</h2>
            <p className="text-muted-foreground mb-4">
              Failed to load test data. The test might not exist.
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
        {/* Back Button */}
        <div className="mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              router.push(
                `/dashboard/organization/${organizationId}/ielts/listening/tests`
              )
            }
            className="gap-1.5"
          >
            <ChevronLeft className="size-4" />
            Back to Tests
          </Button>
        </div>

        <h1 className="text-2xl font-bold mb-6">Edit IELTS Listening Test</h1>
        <p className="text-muted-foreground mb-8">
          Update the IELTS Listening test details
        </p>

        <InteractiveStepper ref={stepperRef}>
          <InteractiveStepperItem>
            <InteractiveStepperIndicator />
            <div>
              <InteractiveStepperTitle>Test Details</InteractiveStepperTitle>
              <InteractiveStepperDescription>
                Update basic information about the test
              </InteractiveStepperDescription>
            </div>
            <InteractiveStepperSeparator />
          </InteractiveStepperItem>

          <InteractiveStepperItem>
            <InteractiveStepperIndicator />
            <div>
              <InteractiveStepperTitle>Test Sections</InteractiveStepperTitle>
              <InteractiveStepperDescription>
                Update audio recordings and questions for each section
              </InteractiveStepperDescription>
            </div>
            <InteractiveStepperSeparator />
          </InteractiveStepperItem>

          <InteractiveStepperItem>
            <InteractiveStepperIndicator />
            <div>
              <InteractiveStepperTitle>Preview</InteractiveStepperTitle>
              <InteractiveStepperDescription>
                Review and update your test
              </InteractiveStepperDescription>
            </div>
          </InteractiveStepperItem>

          <InteractiveStepperContent step={1}>
            <TestDetailsStep
              formData={formData}
              updateFormData={updateFormData}
            />
          </InteractiveStepperContent>

          <InteractiveStepperContent step={2}>
            <TestSectionsStep
              formData={formData}
              updateFormData={updateFormData}
              organizationId={organizationId}
            />
          </InteractiveStepperContent>

          <InteractiveStepperContent step={3}>
            <TestPreviewStep
              formData={formData}
              onSave={handleSubmit}
              isSaving={updateTestMutation.isPending}
              submitButtonText="Update Test"
            />
          </InteractiveStepperContent>
        </InteractiveStepper>
      </div>
    </StepperContext.Provider>
  );
}
