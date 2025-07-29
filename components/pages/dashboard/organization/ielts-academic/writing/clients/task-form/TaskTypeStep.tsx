"use client";

import React, { useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StepperContext } from "../StepperContext";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import type { FormData } from "../CreateWritingPageClient";

// Define the type for the form data used in this component
interface TaskTypeFormData {
  testType: "academic" | "general_training";
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  totalTimeLimit: number;
  generalInstructions: string;
}

interface TaskTypeStepProps {
  formData: FormData & Partial<TaskTypeFormData>;
  updateFormData: (data: Partial<FormData & TaskTypeFormData>) => void;
}

const taskTypeSchema = z.object({
  testType: z.enum(["academic", "general_training"]),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  totalTimeLimit: z.number().min(1, "Time limit must be at least 1 minute"),
  generalInstructions: z.string().optional(),
});

export default function TaskTypeStep({
  formData,
  updateFormData,
}: TaskTypeStepProps) {
  const { stepperRef } = useContext(StepperContext);

  const form = useForm<z.infer<typeof taskTypeSchema>>({
    resolver: zodResolver(taskTypeSchema),
    defaultValues: {
      testType: formData.testType || "academic",
      title: formData.title || "",
      description: formData.description || "",
      difficulty: formData.difficulty || "medium",
      totalTimeLimit: formData.totalTimeLimit || 60,
      generalInstructions: formData.generalInstructions || "",
    },
  });

  function onSubmit(values: z.infer<typeof taskTypeSchema>) {
    updateFormData({
      ...values,
    });
    stepperRef.current?.nextStep();
  }

  return (
    <Card className="mt-4 border-0 shadow-none">
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="testType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Test Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a test type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="general_training">
                          General Training
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalTimeLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Time Limit (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 60)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="generalInstructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>General Instructions (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter general instructions for the test"
                      className="resize-none"
                      {...field}
                    />
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
