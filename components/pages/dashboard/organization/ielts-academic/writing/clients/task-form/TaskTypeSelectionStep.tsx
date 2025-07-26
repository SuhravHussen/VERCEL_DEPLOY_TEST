"use client";

import React, { useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StepperContext } from "../CreateWritingPageClient";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import type { FormData } from "../CreateWritingPageClient";
import { IELTSWritingTaskType } from "@/types/exam/ielts-academic/writing/writing";

interface TaskTypeSelectionStepProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

const taskTypeSchema = z.object({
  testType: z.enum(["academic", "general_training"]),
  taskType: z.enum(["task_1", "task_2"]),
});

export default function TaskTypeSelectionStep({
  formData,
  updateFormData,
}: TaskTypeSelectionStepProps) {
  const { stepperRef } = useContext(StepperContext);

  const form = useForm<z.infer<typeof taskTypeSchema>>({
    resolver: zodResolver(taskTypeSchema),
    defaultValues: {
      testType: formData.testType || "academic",
      taskType: formData.taskType || "task_1",
    },
  });

  function onSubmit(values: z.infer<typeof taskTypeSchema>) {
    updateFormData({
      testType: values.testType,
      taskType: values.taskType as IELTSWritingTaskType,
    });
    stepperRef.current?.nextStep();
  }

  return (
    <Card className="mt-4 border-0 shadow-none">
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="testType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Test Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="academic" id="academic" />
                        <label
                          htmlFor="academic"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Academic
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="general_training"
                          id="general_training"
                        />
                        <label
                          htmlFor="general_training"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          General Training
                        </label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="taskType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Task</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="task_1" id="task_1" />
                        <label
                          htmlFor="task_1"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Task 1
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="task_2" id="task_2" />
                        <label
                          htmlFor="task_2"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Task 2
                        </label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit">Next</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
