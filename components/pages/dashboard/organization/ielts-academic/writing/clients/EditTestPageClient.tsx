"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToasts } from "@/components/ui/toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft } from "lucide-react";
import { useGetIeltsWritingTest } from "@/hooks/organization/ielts-academic/writing/use-get-ielts-writing-test";
import { useUpdateIeltsWritingTest } from "@/hooks/organization/ielts-academic/writing/use-update-ielts-writing-test";

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

import { IELTSWritingTest } from "@/types/exam/ielts-academic/writing/writing";
import { TestStepperContext } from "./TestStepperContext";
import BasicInfoStep from "./test-page/BasicInfoStep";
import SelectQuestionsStep from "./test-page/SelectQuestionsStep";
import PreviewStep from "./test-page/PreviewStep";

export interface EditTestPageClientProps {
  organizationId: number;
  testId: string;
}

export default function EditTestPageClient({
  organizationId,
  testId,
}: EditTestPageClientProps) {
  const router = useRouter();
  const { error, success } = useToasts();
  const stepperRef = useRef<IStepperMethods | null>(null);

  // Fetch existing test data
  const {
    data: existingTest,
    isLoading,
    error: fetchError,
  } = useGetIeltsWritingTest(organizationId, testId);

  // Test data state
  const [testData, setTestData] = useState<Partial<IELTSWritingTest>>({
    organizationId,
    testType: "academic",
    difficulty: "medium",
    status: "published",
    totalTimeLimit: 60,
  });

  // Pre-populate form data when test data is loaded
  useEffect(() => {
    if (existingTest) {
      setTestData(existingTest);
    }
  }, [existingTest]);

  const { mutate: updateTest, isPending } = useUpdateIeltsWritingTest({
    onSuccess: () => {
      success("Test updated successfully");
      router.push(
        `/dashboard/organization/${organizationId}/ielts/writing/tests`
      );
    },
    onError: (err) => {
      error(err.message || "Failed to update test");
    },
  });

  const updateTestData = (data: Partial<IELTSWritingTest>) => {
    setTestData((prev) => ({ ...prev, ...data }));
  };

  const handleSubmit = () => {
    if (!testData.title || !testData.task1 || !testData.task2) {
      error("Please fill all required fields");
      return;
    }

    updateTest({
      testId,
      organizationId,
      testData: testData as IELTSWritingTest,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-2 md:p-6">
        <div className="text-center">Loading test data...</div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="space-y-6 p-2 md:p-6">
        <div className="text-center text-red-500">
          Error loading test: {fetchError.message}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-2 md:p-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            router.push(
              `/dashboard/organization/${organizationId}/ielts/writing/tests`
            )
          }
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Edit IELTS Writing Test
          </h1>
          <p className="text-muted-foreground">
            Edit the existing IELTS Academic Writing test
          </p>
        </div>
      </div>

      <Card className="border-none shadow-lg">
        <CardContent className="p-6">
          <TestStepperContext.Provider value={{ stepperRef }}>
            <InteractiveStepper
              ref={
                stepperRef as React.RefObject<HTMLDivElement & IStepperMethods>
              }
            >
              <InteractiveStepperItem>
                <InteractiveStepperIndicator />
                <div className="flex flex-col">
                  <InteractiveStepperTitle>
                    Basic Information
                  </InteractiveStepperTitle>
                  <InteractiveStepperDescription>
                    Enter test details
                  </InteractiveStepperDescription>
                </div>
                <InteractiveStepperSeparator />
              </InteractiveStepperItem>

              <InteractiveStepperItem>
                <InteractiveStepperIndicator />
                <div className="flex flex-col">
                  <InteractiveStepperTitle>
                    Select Questions
                  </InteractiveStepperTitle>
                  <InteractiveStepperDescription>
                    Choose Task 1 and Task 2 questions
                  </InteractiveStepperDescription>
                </div>
                <InteractiveStepperSeparator />
              </InteractiveStepperItem>

              <InteractiveStepperItem>
                <InteractiveStepperIndicator />
                <div className="flex flex-col">
                  <InteractiveStepperTitle>
                    Preview Test
                  </InteractiveStepperTitle>
                  <InteractiveStepperDescription>
                    Review and update test
                  </InteractiveStepperDescription>
                </div>
              </InteractiveStepperItem>

              <InteractiveStepperContent step={1}>
                <div className="pt-6">
                  <Separator className="mb-6" />
                  <BasicInfoStep
                    testData={testData}
                    updateTestData={updateTestData}
                  />
                </div>
              </InteractiveStepperContent>

              <InteractiveStepperContent step={2}>
                <div className="pt-6">
                  <Separator className="mb-6" />
                  <SelectQuestionsStep
                    organizationId={organizationId}
                    testData={testData}
                    updateTestData={updateTestData}
                  />
                </div>
              </InteractiveStepperContent>

              <InteractiveStepperContent step={3}>
                <div className="pt-6">
                  <Separator className="mb-6" />
                  <PreviewStep
                    testData={testData}
                    isSubmitting={isPending}
                    onSubmit={handleSubmit}
                    isEditMode={true}
                  />
                </div>
              </InteractiveStepperContent>
            </InteractiveStepper>
          </TestStepperContext.Provider>
        </CardContent>
      </Card>
    </div>
  );
}
