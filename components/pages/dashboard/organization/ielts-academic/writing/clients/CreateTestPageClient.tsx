"use client";

import { useState, useRef, createContext } from "react";
import { useRouter } from "next/navigation";
import { useToasts } from "@/components/ui/toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft } from "lucide-react";
import { useCreateIeltsWritingTest } from "@/hooks/organization/ielts-academic/writing/use-create-ielts-writing-test";

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
import BasicInfoStep from "./test-page/BasicInfoStep";
import SelectQuestionsStep from "./test-page/SelectQuestionsStep";
import PreviewStep from "./test-page/PreviewStep";

export interface CreateTestPageClientProps {
  organizationId: number;
}

// Create a context for the stepper to be used across steps
export const TestStepperContext = createContext<{
  stepperRef: React.RefObject<IStepperMethods | null>;
}>({
  stepperRef: { current: null },
});

export default function CreateTestPageClient({
  organizationId,
}: CreateTestPageClientProps) {
  const router = useRouter();
  const { error, success } = useToasts();
  const stepperRef = useRef<IStepperMethods | null>(null);

  // Test data state
  const [testData, setTestData] = useState<Partial<IELTSWritingTest>>({
    organizationId,
    testType: "academic",
    difficulty: "medium",
    status: "published",
    totalTimeLimit: 60,
  });

  const { mutate: createTest, isPending } = useCreateIeltsWritingTest({
    onSuccess: () => {
      success("Test created successfully");
      router.push(
        `/dashboard/organization/${organizationId}/ielts-academic/writing/tests`
      );
    },
    onError: (err) => {
      error(err.message || "Failed to create test");
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

    createTest(testData as IELTSWritingTest);
  };

  return (
    <div className="space-y-6 p-2 md:p-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            router.push(
              `/dashboard/organization/${organizationId}/ielts-academic/writing/tests`
            )
          }
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Create IELTS Writing Test
          </h1>
          <p className="text-muted-foreground">
            Create a new IELTS Academic Writing test by following these steps
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
                    Review and create test
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
