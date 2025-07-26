/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useContext, useState } from "react";
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
  Task2EssayType,
  IELTSTask2,
} from "@/types/exam/ielts-academic/writing/writing";

interface Task2FormProps {
  formData: FormData;
  updateTaskData: (data: Partial<IELTSTask2>) => void;
}

const task2Schema = z.object({
  detailType: z.enum([
    "opinion_essay",
    "discussion_essay",
    "problem_solution_essay",
    "advantage_disadvantage_essay",
    "two_part_question",
  ] as const),
  instruction: z.string().min(10, "Instruction must be at least 10 characters"),
  prompt: z.string().min(10, "Prompt must be at least 10 characters"),
  timeLimit: z.number().min(1, "Time limit must be at least 1 minute"),
  minimumWords: z.number().min(1, "Minimum words must be at least 1"),
  topic: z.string().min(5, "Topic must be at least 5 characters"),
  backgroundInfo: z.string().optional(),
  specificQuestion: z
    .string()
    .min(10, "Specific question must be at least 10 characters"),
  keyWords: z.string().optional(),
  sampleAnswer: z.string().optional(),
});

export default function Task2Form({
  formData,
  updateTaskData,
}: Task2FormProps) {
  const { stepperRef } = useContext(StepperContext);

  // Parse existing task data if it exists
  const task = formData.task as Partial<IELTSTask2>;

  // State for image upload
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(
    task.backgroundImage || null
  );

  const form = useForm<z.infer<typeof task2Schema>>({
    resolver: zodResolver(task2Schema),
    defaultValues: {
      detailType: (task.detailType as Task2EssayType) || "opinion_essay",
      instruction: task.instruction || "",
      prompt: task.prompt || "",
      timeLimit: task.timeLimit || 40,
      minimumWords: task.minimumWords || 250,
      topic: task.topic || "",
      backgroundInfo: task.backgroundInfo || "",
      specificQuestion: task.specificQuestion || "",
      keyWords: task.keyWords?.join(", ") || "",
      sampleAnswer: task.sampleAnswer || "",
    },
  });

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
        path: "ielts/writing/task2",
      });

      setImageUrl(url);

      // Update form data with the new image URL
      updateTaskData({
        backgroundImage: url,
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

  const getEssayTypeDescription = (detailType: Task2EssayType) => {
    switch (detailType) {
      case "opinion_essay":
        return "Present your personal viewpoint on a topic, supported by reasons and examples.";
      case "discussion_essay":
        return "Examine both sides of an argument or different viewpoints before giving your opinion.";
      case "problem_solution_essay":
        return "Analyze a problem and propose solutions or measures to address it.";
      case "advantage_disadvantage_essay":
        return "Evaluate the benefits and drawbacks of a situation or proposal.";
      case "two_part_question":
        return "Address two related but distinct aspects of a topic in your response.";
      default:
        return "";
    }
  };

  function onSubmit(values: z.infer<typeof task2Schema>) {
    const { keyWords, ...rest } = values;

    updateTaskData({
      ...rest,
      keyWords: keyWords
        ? keyWords
            .split(",")
            .map((word) => word.trim())
            .filter(Boolean)
        : [],
      backgroundImage: imageUrl || undefined,
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
                        <FormLabel className="text-base">Essay Type</FormLabel>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-[300px]">
                              <p>
                                {getEssayTypeDescription(
                                  field.value as Task2EssayType
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
                            <SelectValue placeholder="Select essay type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="opinion_essay">
                            Opinion Essay
                          </SelectItem>
                          <SelectItem value="discussion_essay">
                            Discussion Essay
                          </SelectItem>
                          <SelectItem value="problem_solution_essay">
                            Problem Solution Essay
                          </SelectItem>
                          <SelectItem value="advantage_disadvantage_essay">
                            Advantage Disadvantage Essay
                          </SelectItem>
                          <SelectItem value="two_part_question">
                            Two Part Question
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {getEssayTypeDescription(field.value as Task2EssayType)}
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
                              field.onChange(parseInt(e.target.value) || 40)
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
                              field.onChange(parseInt(e.target.value) || 250)
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
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Topic</FormLabel>
                      <FormControl>
                        <Input
                          className="h-10"
                          placeholder="Enter essay topic"
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

                <FormField
                  control={form.control}
                  name="backgroundInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        Background Information (Optional)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter background information"
                          className="min-h-[100px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide helpful context or background for the topic
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Background Image Upload */}
                <FormItem>
                  <FormLabel className="text-base">
                    Background Image (Optional)
                  </FormLabel>
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
                                alt="Background image"
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
                                  backgroundImage: undefined,
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
                  name="specificQuestion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        Specific Question
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter specific question"
                          className="min-h-[100px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The main question or task that examinees must address
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="keyWords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        Key Words (Comma separated, Optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="h-10"
                          placeholder="e.g., environment, technology, education"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Important keywords or concepts that should be addressed
                        in the essay
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
