/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useContext, useState, useEffect } from "react";
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
  FormDescription,
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
import { uploadImage } from "@/lib/image-upload";
import { Loader2, Upload, CheckCircle2, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import type { FormData } from "../CreateWritingPageClient";
import {
  AcademicTask1Type,
  IELTSAcademicTask1,
} from "@/types/exam/ielts-academic/writing/writing";

interface Task1AcademicFormProps {
  formData: FormData;
  updateTaskData: (data: Partial<IELTSAcademicTask1>) => void;
}

const academicTask1Schema = z.object({
  detailType: z.enum([
    "line_graph",
    "bar_chart",
    "pie_chart",
    "table",
    "diagram_process",
    "diagram_map",
    "mixed_charts",
  ] as const),
  instruction: z.string().min(10, "Instruction must be at least 10 characters"),
  prompt: z.string().min(10, "Prompt must be at least 10 characters"),
  timeLimit: z.number().min(1, "Time limit must be at least 1 minute"),
  minimumWords: z.number().min(1, "Minimum words must be at least 1"),
  sampleAnswer: z.string().optional(),
  chartDescription: z.string().optional(),
  keyFeatures: z.string().optional(),
});

export default function Task1AcademicForm({
  formData,
  updateTaskData,
}: Task1AcademicFormProps) {
  const { stepperRef } = useContext(StepperContext);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(
    (formData.task as Partial<IELTSAcademicTask1>).visualData?.chartImage ||
      null
  );

  // Parse existing task data if it exists
  const task = formData.task as Partial<IELTSAcademicTask1>;

  const form = useForm<z.infer<typeof academicTask1Schema>>({
    resolver: zodResolver(academicTask1Schema),
    defaultValues: {
      detailType: (task.detailType as AcademicTask1Type) || "line_graph",
      instruction: task.instruction || "",
      prompt: task.prompt || "",
      timeLimit: task.timeLimit || 20,
      minimumWords: task.minimumWords || 150,
      sampleAnswer: task.sampleAnswer || "",
      chartDescription: task.visualData?.chartDescription || "",
      keyFeatures: task.keyFeatures?.join("\n") || "",
    },
  });

  // Update form values when formData changes (for edit mode)
  useEffect(() => {
    if (task) {
      form.reset({
        detailType: (task.detailType as AcademicTask1Type) || "line_graph",
        instruction: task.instruction || "",
        prompt: task.prompt || "",
        timeLimit: task.timeLimit || 20,
        minimumWords: task.minimumWords || 150,
        sampleAnswer: task.sampleAnswer || "",
        chartDescription: task.visualData?.chartDescription || "",
        keyFeatures: task.keyFeatures?.join("\n") || "",
      });

      // Update image URL if it exists
      if (task.visualData?.chartImage) {
        setImageUrl(task.visualData.chartImage);
      }
    }
  }, [formData, task, form]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    try {
      setIsUploading(true);
      const url = await uploadImage(file, {
        onProgress: (progress) => {
          setUploadProgress(progress);
        },
        path: "ielts/writing/academic/task1",
      });

      setImageUrl(url);

      // Update form data with the new image URL
      updateTaskData({
        visualData: {
          ...(task.visualData || {}),
          chartImage: url,
        },
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadError(
        error instanceof Error ? error.message : "Failed to upload image"
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const getTaskTypeDescription = (taskType: AcademicTask1Type) => {
    switch (taskType) {
      case "line_graph":
        return "Line graphs show changes or trends over time or compare different data sets.";
      case "bar_chart":
        return "Bar charts compare quantities or values across different categories.";
      case "pie_chart":
        return "Pie charts show proportions and percentages of a whole.";
      case "table":
        return "Tables contain organized numerical data in rows and columns.";
      case "diagram_process":
        return "Process diagrams show stages in a process or how something works.";
      case "diagram_map":
        return "Maps show geographical changes or comparisons.";
      case "mixed_charts":
        return "Mixed charts combine multiple types of data visualization.";
      default:
        return "";
    }
  };

  function onSubmit(values: z.infer<typeof academicTask1Schema>) {
    const { chartDescription, keyFeatures, ...rest } = values;

    updateTaskData({
      ...rest,
      visualData: {
        ...(task.visualData || {}),
        chartDescription,
      },
      keyFeatures: keyFeatures ? keyFeatures.split("\n").filter(Boolean) : [],
    });

    // Go to next step
    stepperRef.current?.nextStep();
  }

  return (
    <Card className="mt-4 border-0 shadow-none">
      <CardContent className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="rounded-lg bg-muted/30 p-6 backdrop-blur-sm">
              <h3 className="mb-4 text-lg font-medium">Basic Information</h3>
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="detailType"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel className="text-base">Task Type</FormLabel>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-[300px]">
                              <p>
                                {getTaskTypeDescription(
                                  field.value as AcademicTask1Type
                                )}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Select task type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="line_graph">Line Graph</SelectItem>
                          <SelectItem value="bar_chart">Bar Chart</SelectItem>
                          <SelectItem value="pie_chart">Pie Chart</SelectItem>
                          <SelectItem value="table">Table</SelectItem>
                          <SelectItem value="diagram_process">
                            Process Diagram
                          </SelectItem>
                          <SelectItem value="diagram_map">Map</SelectItem>
                          <SelectItem value="mixed_charts">
                            Mixed Charts
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {getTaskTypeDescription(
                          field.value as AcademicTask1Type
                        )}
                      </FormDescription>
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
                        <FormLabel className="text-base">
                          Time Limit (minutes)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className="h-10"
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
                        <FormLabel className="text-base">
                          Minimum Words
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className="h-10"
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
              </div>
            </div>

            <div className="rounded-lg bg-muted/30 p-6 backdrop-blur-sm">
              <h3 className="mb-4 text-lg font-medium">Task Content</h3>
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="instruction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Instruction</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter task instruction"
                          className="min-h-[100px] resize-none"
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
                      <FormLabel className="text-base">Prompt</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter task prompt"
                          className="min-h-[100px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="rounded-lg bg-muted/30 p-6 backdrop-blur-sm">
              <h3 className="mb-4 text-lg font-medium">Visual Data</h3>
              <div className="space-y-6">
                {/* Image Upload */}
                <FormItem>
                  <FormLabel className="text-base">Chart Image</FormLabel>
                  <div className="mt-2">
                    <label
                      className={cn(
                        "group relative flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed transition-all",
                        isUploading
                          ? "border-primary/50 bg-primary/5"
                          : "border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5"
                      )}
                    >
                      <div className="flex flex-col items-center justify-center space-y-2 text-center">
                        {isUploading ? (
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        ) : (
                          <Upload className="h-8 w-8 text-muted-foreground group-hover:text-primary" />
                        )}
                        <div className="text-sm font-medium">
                          {isUploading
                            ? `Uploading... ${uploadProgress}%`
                            : "Drop your image here or click to browse"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          PNG, JPG or WEBP (max 5MB)
                        </div>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                    </label>

                    {uploadError && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-destructive">
                        <XCircle className="h-4 w-4" />
                        {uploadError}
                      </div>
                    )}

                    {imageUrl && !isUploading && (
                      <div className="mt-4 overflow-hidden">
                        <div className="flex items-start space-x-2">
                          <div className="flex-1">
                            <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-background">
                              {/* Use standard img element instead of next/image to ensure it works with data URLs */}
                              <img
                                src={imageUrl}
                                alt="Uploaded chart"
                                className="h-full w-full object-contain"
                              />
                            </div>
                          </div>
                          <div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setImageUrl(null);
                                updateTaskData({
                                  visualData: {
                                    ...(task.visualData || {}),
                                    chartImage: undefined,
                                  },
                                });
                              }}
                            >
                              <XCircle className="h-4 w-4 mr-1" /> Remove
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                          Image uploaded successfully
                        </div>
                      </div>
                    )}
                  </div>
                </FormItem>

                <FormField
                  control={form.control}
                  name="chartDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        Chart Description (Optional)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter chart description"
                          className="min-h-[100px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Describe the chart for accessibility and context
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="keyFeatures"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        Key Features (Optional)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter key features, one per line"
                          className="min-h-[100px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter one feature per line (e.g., &quot;Steady increase
                        from 2010 to 2015&quot;)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="rounded-lg bg-muted/30 p-6 backdrop-blur-sm">
              <h3 className="mb-4 text-lg font-medium">Sample Answer</h3>
              <FormField
                control={form.control}
                name="sampleAnswer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">
                      Sample Answer (Optional)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter sample answer"
                        className="min-h-[200px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a model answer to help with assessment
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => stepperRef.current?.prevStep()}
              >
                Previous
              </Button>
              <Button type="submit" size="lg" className="px-8">
                Next
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
