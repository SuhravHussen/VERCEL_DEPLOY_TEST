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
import {
  GeneralTask1Type,
  IELTSGeneralTask1,
} from "@/types/exam/ielts-academic/writing/writing";

interface Task1GeneralFormProps {
  formData: FormData;
  updateTaskData: (data: Partial<IELTSGeneralTask1>) => void;
}

const generalTask1Schema = z.object({
  detailType: z.enum([
    "formal_letter",
    "semi_formal_letter",
    "informal_letter",
  ] as const),
  instruction: z.string().min(10, "Instruction must be at least 10 characters"),
  prompt: z.string().min(10, "Prompt must be at least 10 characters"),
  timeLimit: z.number().min(1, "Time limit must be at least 1 minute"),
  minimumWords: z.number().min(1, "Minimum words must be at least 1"),
  scenario: z.string().min(10, "Scenario must be at least 10 characters"),
  bulletPoints: z
    .string()
    .min(5, "Bullet points must be at least 5 characters"),
  recipient: z.string().optional(),
  tone: z.enum(["formal", "semi-formal", "informal"] as const),
  sampleAnswer: z.string().optional(),
});

export default function Task1GeneralForm({
  formData,
  updateTaskData,
}: Task1GeneralFormProps) {
  const { stepperRef } = useContext(StepperContext);

  // Parse existing task data if it exists
  const task = formData.task as Partial<IELTSGeneralTask1>;

  const form = useForm<z.infer<typeof generalTask1Schema>>({
    resolver: zodResolver(generalTask1Schema),
    defaultValues: {
      detailType: (task.detailType as GeneralTask1Type) || "formal_letter",
      instruction: task.instruction || "",
      prompt: task.prompt || "",
      timeLimit: task.timeLimit || 20,
      minimumWords: task.minimumWords || 150,
      scenario: task.scenario || "",
      bulletPoints: task.bulletPoints?.join("\n") || "",
      recipient: task.recipient || "",
      tone: task.tone || "formal",
      sampleAnswer: task.sampleAnswer || "",
    },
  });

  function onSubmit(values: z.infer<typeof generalTask1Schema>) {
    const { bulletPoints, ...rest } = values;

    updateTaskData({
      ...rest,
      bulletPoints: bulletPoints.split("\n").filter(Boolean),
    });

    // Go to next step
    stepperRef.current?.nextStep();
  }

  return (
    <Card className="mt-4 border-0 shadow-none">
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="detailType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Letter Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select letter type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="formal_letter">
                        Formal Letter
                      </SelectItem>
                      <SelectItem value="semi_formal_letter">
                        Semi-Formal Letter
                      </SelectItem>
                      <SelectItem value="informal_letter">
                        Informal Letter
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="timeLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Limit (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 20)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="minimumWords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Words</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 150)
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
              name="instruction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instruction</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter task instruction"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter task prompt"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="scenario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scenario</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter letter scenario"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bulletPoints"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bullet Points (One per line)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter bullet points, one per line"
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
                name="recipient"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter recipient" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tone</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="formal">Formal</SelectItem>
                        <SelectItem value="semi-formal">Semi-Formal</SelectItem>
                        <SelectItem value="informal">Informal</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="sampleAnswer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sample Answer (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter sample answer"
                      className="resize-none min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => stepperRef.current?.prevStep()}
              >
                Previous
              </Button>
              <Button type="submit">Next</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
