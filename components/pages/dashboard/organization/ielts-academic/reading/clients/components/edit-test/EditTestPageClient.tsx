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

import useGetIeltsReadingTestById from "@/hooks/organization/ielts-academic/reading/use-get-ielts-reading-test-by-id";
import useUpdateIeltsReadingTest from "@/hooks/organization/ielts-academic/reading/use-update-ielts-reading-test";
import { CreateReadingTestDto } from "@/types/dto/ielts/reading/test.dto";
import {
  StepperContext,
  TestDetailsStep,
  TestSectionsStep,
  TestPreviewStep,
  FormData,
} from "../create-test";

interface EditTestPageClientProps {
  organizationSlug: string;
  testId: string;
}

export default function EditTestPageClient({
  organizationSlug,
  testId,
}: EditTestPageClientProps) {
  const router = useRouter();
  const stepperRef = useRef<HTMLDivElement & IStepperMethods>(null);
  const { success, error } = useToasts();

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    difficulty: "medium",
    instructions: "",
    timeLimit: 60,
    section_one: null,
    section_two: null,
    section_three: null,
  });

  // Fetch existing test data
  const {
    data: existingTest,
    isLoading,
    error: fetchError,
  } = useGetIeltsReadingTestById(testId);

  // Update mutation
  const updateTest = useUpdateIeltsReadingTest(testId);

  // Populate form with existing data when loaded
  useEffect(() => {
    if (existingTest) {
      console.log("Loading existing test:", existingTest);

      const transformedData: FormData = {
        title: existingTest.title || "",
        description: existingTest.description || "",
        difficulty: existingTest.difficulty || "medium",
        instructions: existingTest.instructions || "",
        timeLimit: existingTest.timeLimit || 60,
        section_one: existingTest.section_one || null,
        section_two: existingTest.section_two || null,
        section_three: existingTest.section_three || null,
      };

      console.log("Transformed form data:", transformedData);
      console.log("Section titles:", {
        section_one_title: transformedData.section_one?.passage?.title,
        section_two_title: transformedData.section_two?.passage?.title,
        section_three_title: transformedData.section_three?.passage?.title,
      });
      setFormData(transformedData);
    }
  }, [existingTest]);

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const saveHandler = async () => {
    try {
      if (
        !formData.section_one ||
        !formData.section_two ||
        !formData.section_three
      ) {
        error("Please select passages for all three sections");
        return;
      }

      const testData: CreateReadingTestDto = {
        title: formData.title,
        description: formData.description || "",
        organizationSlug,
        difficulty: formData.difficulty,
        createdAt: existingTest?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        section_one: formData.section_one,
        section_two: formData.section_two,
        section_three: formData.section_three,
        createdBy: existingTest?.createdBy || "Current User",
        status: existingTest?.status || "published",
        timeLimit: formData.timeLimit,
        instructions: formData.instructions,
        totalQuestionCount:
          (formData.section_one.questions?.length || 0) +
          (formData.section_two.questions?.length || 0) +
          (formData.section_three.questions?.length || 0),
      };

      await updateTest.mutateAsync(testData);
      success("Test updated successfully");
      router.push(
        `/dashboard/organization/${organizationSlug}/ielts/reading/tests`
      );
    } catch (e) {
      console.error(e);
      error("Failed to update test");
    }
  };

  // Show loading state
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

  // Show error state
  if (fetchError) {
    return (
      <div className="container py-8 mx-auto px-2">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-2">Error Loading Test</h2>
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
                `/dashboard/organization/${organizationSlug}/ielts/reading/tests`
              )
            }
            className="gap-1.5"
          >
            <ChevronLeft className="size-4" />
            Back to Tests
          </Button>
        </div>

        <h1 className="text-2xl font-bold mb-6">Edit IELTS Reading Test</h1>
        <p className="text-muted-foreground mb-8">
          Edit the IELTS Reading test with three sections
        </p>

        <InteractiveStepper ref={stepperRef}>
          <InteractiveStepperItem>
            <InteractiveStepperIndicator />
            <div>
              <InteractiveStepperTitle>Test Details</InteractiveStepperTitle>
              <InteractiveStepperDescription>
                Edit basic information about the test
              </InteractiveStepperDescription>
            </div>
            <InteractiveStepperSeparator />
          </InteractiveStepperItem>

          <InteractiveStepperItem>
            <InteractiveStepperIndicator />
            <div>
              <InteractiveStepperTitle>Test Sections</InteractiveStepperTitle>
              <InteractiveStepperDescription>
                Edit passages and questions for each section
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
              organizationSlug={organizationSlug}
            />
          </InteractiveStepperContent>

          <InteractiveStepperContent step={3}>
            <TestPreviewStep
              formData={formData}
              onSave={saveHandler}
              isSaving={updateTest.isPending}
              isEditing={true}
            />
          </InteractiveStepperContent>
        </InteractiveStepper>
      </div>
    </StepperContext.Provider>
  );
}
