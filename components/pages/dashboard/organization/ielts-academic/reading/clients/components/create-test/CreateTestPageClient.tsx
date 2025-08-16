"use client";

import React, { useRef, useState } from "react";
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
import { useRouter } from "next/navigation";
import useCreateIeltsReadingTest from "@/hooks/organization/ielts-academic/reading/use-add-ielts-reading-test";
import { CreateReadingTestDto } from "@/types/dto/ielts/reading/test.dto";
import {
  StepperContext,
  TestDetailsStep,
  TestSectionsStep,
  TestPreviewStep,
  FormData,
  CreateTestPageClientProps,
} from ".";

export default function CreateTestPageClient({
  organizationSlug,
}: CreateTestPageClientProps) {
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

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const createTest = useCreateIeltsReadingTest();

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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        section_one: formData.section_one,
        section_two: formData.section_two,
        section_three: formData.section_three,
        createdBy: "Current User", // In a real app, this would come from authentication
        status: "published",
        timeLimit: formData.timeLimit,
        instructions: formData.instructions,
        totalQuestionCount:
          (formData.section_one.questions?.length || 0) +
          (formData.section_two.questions?.length || 0) +
          (formData.section_three.questions?.length || 0),
      };

      await createTest.mutateAsync(testData);
      success("Test created successfully");
      router.push(
        `/dashboard/organization/${organizationSlug}/ielts/reading/tests`
      );
    } catch (e) {
      console.error(e);
      error("Failed to create test");
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
        <h1 className="text-2xl font-bold mb-6">Create IELTS Reading Test</h1>
        <p className="text-muted-foreground mb-8">
          Create a new IELTS Reading test with three sections
        </p>

        <InteractiveStepper ref={stepperRef}>
          <InteractiveStepperItem>
            <InteractiveStepperIndicator />
            <div>
              <InteractiveStepperTitle>Test Details</InteractiveStepperTitle>
              <InteractiveStepperDescription>
                Enter basic information about the test
              </InteractiveStepperDescription>
            </div>
            <InteractiveStepperSeparator />
          </InteractiveStepperItem>

          <InteractiveStepperItem>
            <InteractiveStepperIndicator />
            <div>
              <InteractiveStepperTitle>Test Sections</InteractiveStepperTitle>
              <InteractiveStepperDescription>
                Select passages and questions for each section
              </InteractiveStepperDescription>
            </div>
            <InteractiveStepperSeparator />
          </InteractiveStepperItem>

          <InteractiveStepperItem>
            <InteractiveStepperIndicator />
            <div>
              <InteractiveStepperTitle>Preview</InteractiveStepperTitle>
              <InteractiveStepperDescription>
                Review and create your test
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
              isSaving={createTest.isPending}
            />
          </InteractiveStepperContent>
        </InteractiveStepper>
      </div>
    </StepperContext.Provider>
  );
}
