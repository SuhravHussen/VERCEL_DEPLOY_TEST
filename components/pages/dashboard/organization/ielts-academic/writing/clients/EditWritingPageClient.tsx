"use client";

import React, { useRef, useState, useEffect } from "react";
import { useToasts } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useGetIeltsWritingQuestion } from "@/hooks/organization/ielts-academic/writing/use-get-ielts-writing-question";
import {
  useUpdateIeltsWritingQuestion,
  UpdateWritingQuestionDto,
} from "@/hooks/organization/ielts-academic/writing/use-update-ielts-writing-question";

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
import { StepperContext } from "./StepperContext";

import {
  IELTSAcademicTask1,
  IELTSGeneralTask1,
  IELTSTask2,
  IELTSWritingTaskType,
} from "@/types/exam/ielts-academic/writing/writing";

// Import the components from the create page
import PreviewStep from "./task-form/PreviewStep";
import TaskTypeSelectionStep from "./task-form/TaskTypeSelectionStep";
import Task1AcademicForm from "./task-form/Task1AcademicForm";
import Task1GeneralForm from "./task-form/Task1GeneralForm";
import Task2Form from "./task-form/Task2Form";

interface EditWritingPageClientProps {
  organizationId: number;
  questionId: string;
}

// Reuse the same FormData interface from CreateWritingPageClient
export interface FormData {
  testType: "academic" | "general_training";
  taskType: IELTSWritingTaskType;
  task: Partial<IELTSAcademicTask1 | IELTSGeneralTask1 | IELTSTask2>;
}

export default function EditWritingPageClient({
  organizationId,
  questionId,
}: EditWritingPageClientProps) {
  const stepperRef = useRef<HTMLDivElement & IStepperMethods>(null);
  const { success, error: showError } = useToasts();
  const router = useRouter();
  const updateMutation = useUpdateIeltsWritingQuestion();

  // Fetch existing question data
  const {
    data: questionData,
    isLoading,
    error,
  } = useGetIeltsWritingQuestion(organizationId, questionId);

  const [formData, setFormData] = useState<FormData>({
    testType: "academic",
    taskType: "task_1",
    task: {},
  });

  // Pre-populate form data when question data is loaded
  useEffect(() => {
    if (questionData) {
      // Determine test type based on task details
      let testType: "academic" | "general_training" = "academic";

      if (questionData.taskType === "task_1") {
        // Check for general training specific properties
        if (
          "scenario" in questionData ||
          "bulletPoints" in questionData ||
          "tone" in questionData
        ) {
          testType = "general_training";
        }
      }

      setFormData({
        testType,
        taskType: questionData.taskType,
        task: { ...questionData } as Partial<
          IELTSAcademicTask1 | IELTSGeneralTask1 | IELTSTask2
        >,
      });
    }
  }, [questionData]);

  const updateTaskTypeData = (taskTypeData: Partial<FormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...taskTypeData,
    }));
  };

  const updateTaskData = (
    taskData: Partial<IELTSAcademicTask1 | IELTSGeneralTask1 | IELTSTask2>
  ) => {
    setFormData((prev) => {
      const updatedTask = {
        ...prev.task,
        ...taskData,
      };

      return {
        ...prev,
        task: updatedTask as typeof prev.task,
      };
    });
  };

  const saveHandler = async () => {
    try {
      // Create the task data for update
      const taskData = {
        ...formData.task,
        taskType: formData.taskType,
        organizationId,
        questionId,
      } as UpdateWritingQuestionDto;

      // Call the mutation to update the writing question
      await updateMutation.mutateAsync(taskData);

      success("Writing task updated successfully");
      router.push(
        `/dashboard/organization/${organizationId}/ielts-academic/writing/questions`
      );
    } catch (e) {
      console.error(e);
      showError("Failed to update writing task");
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8 mx-auto px-2">
        <div className="text-center">Loading question data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8 mx-auto px-2">
        <div className="text-center text-red-500">
          Error loading question: {error.message}
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
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              router.push(
                `/dashboard/organization/${organizationId}/ielts-academic/writing/questions`
              )
            }
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Questions
          </Button>
        </div>

        <h1 className="text-2xl font-bold mb-6">Edit Writing Task</h1>
        <p className="text-muted-foreground mb-8">
          Edit the existing writing task for IELTS
        </p>

        <InteractiveStepper ref={stepperRef}>
          <InteractiveStepperItem>
            <InteractiveStepperIndicator />
            <div>
              <InteractiveStepperTitle>Task Type</InteractiveStepperTitle>
              <InteractiveStepperDescription>
                Select the type of writing task
              </InteractiveStepperDescription>
            </div>
            <InteractiveStepperSeparator />
          </InteractiveStepperItem>

          <InteractiveStepperItem>
            <InteractiveStepperIndicator />
            <div>
              <InteractiveStepperTitle>Task Details</InteractiveStepperTitle>
              <InteractiveStepperDescription>
                Fill in the details for the task
              </InteractiveStepperDescription>
            </div>
            <InteractiveStepperSeparator />
          </InteractiveStepperItem>

          <InteractiveStepperItem>
            <InteractiveStepperIndicator />
            <div>
              <InteractiveStepperTitle>Preview</InteractiveStepperTitle>
              <InteractiveStepperDescription>
                Preview the writing task before saving
              </InteractiveStepperDescription>
            </div>
          </InteractiveStepperItem>

          <InteractiveStepperContent step={1}>
            <TaskTypeSelectionStep
              formData={formData}
              updateFormData={updateTaskTypeData}
            />
          </InteractiveStepperContent>

          <InteractiveStepperContent step={2}>
            {formData.taskType === "task_1" &&
            formData.testType === "academic" ? (
              <Task1AcademicForm
                formData={formData}
                updateTaskData={updateTaskData}
              />
            ) : formData.taskType === "task_1" &&
              formData.testType === "general_training" ? (
              <Task1GeneralForm
                formData={formData}
                updateTaskData={updateTaskData}
              />
            ) : (
              <Task2Form formData={formData} updateTaskData={updateTaskData} />
            )}
          </InteractiveStepperContent>

          <InteractiveStepperContent step={3}>
            <PreviewStep
              formData={formData}
              onSave={saveHandler}
              isSaving={updateMutation.isPending}
            />
          </InteractiveStepperContent>
        </InteractiveStepper>
      </div>
    </StepperContext.Provider>
  );
}
