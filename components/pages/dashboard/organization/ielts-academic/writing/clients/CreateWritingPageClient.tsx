"use client";

import React, { useRef, useState } from "react";
import { useToasts } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import {
  useCreateIeltsWritingQuestion,
  CreateWritingQuestionDto,
} from "@/hooks/organization/ielts-academic/writing/use-add-ielts-writing-questions";

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

// Import the components we've created
import PreviewStep from "./task-form/PreviewStep";
import TaskTypeSelectionStep from "./task-form/TaskTypeSelectionStep";
import Task1AcademicForm from "./task-form/Task1AcademicForm";
import Task1GeneralForm from "./task-form/Task1GeneralForm";
import Task2Form from "./task-form/Task2Form";

interface CreateWritingPageClientProps {
  organizationId: number;
}

// Form data now represents a single task, not a complete test
export interface FormData {
  testType: "academic" | "general_training";
  taskType: IELTSWritingTaskType;
  task: Partial<IELTSAcademicTask1 | IELTSGeneralTask1 | IELTSTask2>;
}

export default function CreateWritingPageClient({
  organizationId,
}: CreateWritingPageClientProps) {
  const stepperRef = useRef<HTMLDivElement & IStepperMethods>(null);
  const { success, error: showError } = useToasts();
  const router = useRouter();
  const mutation = useCreateIeltsWritingQuestion();

  const [formData, setFormData] = useState<FormData>({
    testType: "academic",
    taskType: "task_1",
    task: {},
  });

  const updateTaskTypeData = (taskTypeData: Partial<FormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...taskTypeData,
    }));
  };

  const updateTaskData = (
    taskData: Partial<IELTSAcademicTask1 | IELTSGeneralTask1 | IELTSTask2>
  ) => {
    // Use type assertion to ensure the task property maintains its correct type
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
      // Create the appropriate task data with taskType correctly set
      let taskData: CreateWritingQuestionDto;

      if (formData.taskType === "task_1" && formData.testType === "academic") {
        taskData = {
          ...(formData.task as Partial<IELTSAcademicTask1>),
          taskType: "task_1",
          detailType: (formData.task as Partial<IELTSAcademicTask1>).detailType,
        } as CreateWritingQuestionDto;
      } else if (
        formData.taskType === "task_1" &&
        formData.testType === "general_training"
      ) {
        taskData = {
          ...(formData.task as Partial<IELTSGeneralTask1>),
          taskType: "task_1",
          detailType: (formData.task as Partial<IELTSGeneralTask1>).detailType,
        } as CreateWritingQuestionDto;
      } else {
        taskData = {
          ...(formData.task as Partial<IELTSTask2>),
          taskType: "task_2",
          detailType: (formData.task as Partial<IELTSTask2>).detailType,
        } as CreateWritingQuestionDto;
      }

      // Call the mutation to save the writing question
      await mutation.mutateAsync(taskData);

      success("Writing task created successfully");
      router.push(
        `/dashboard/organization/${organizationId}/ielts/writing/questions`
      );
    } catch (e) {
      console.error(e);
      showError("Failed to create writing task");
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
        <h1 className="text-2xl font-bold mb-6">Create Writing Task</h1>
        <p className="text-muted-foreground mb-8">
          Create a new writing task for IELTS
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
              isSaving={mutation.isPending}
            />
          </InteractiveStepperContent>
        </InteractiveStepper>
      </div>
    </StepperContext.Provider>
  );
}
