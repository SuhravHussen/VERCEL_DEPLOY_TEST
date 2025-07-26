"use client";

import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StepperContext } from "./StepperContext";
import { TestDetailsStepProps } from "./types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileEdit, Clock, Gauge, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";

export function TestDetailsStep({
  formData,
  updateFormData,
}: TestDetailsStepProps) {
  const context = useContext(StepperContext);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Test title is required";
    }

    if (formData.timeLimit < 1) {
      newErrors.timeLimit = "Time limit must be at least 1 minute";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      context?.stepperRef.current?.nextStep();
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileEdit className="h-5 w-5 text-primary" />
            <CardTitle>Test Details</CardTitle>
          </div>
          <CardDescription>
            Enter the basic information for your listening test
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-4">
              <div>
                <Label
                  htmlFor="title"
                  className={cn(errors.title && "text-destructive")}
                >
                  Test Title*
                </Label>
                <Input
                  id="title"
                  placeholder="Enter test title"
                  value={formData.title}
                  onChange={(e) => {
                    updateFormData({ title: e.target.value });
                    if (errors.title) {
                      setErrors({ ...errors, title: "" });
                    }
                  }}
                  className={cn(errors.title && "border-destructive")}
                  required
                />
                {errors.title && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.title}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Briefly describe the test content and purpose"
                  value={formData.description}
                  onChange={(e) =>
                    updateFormData({ description: e.target.value })
                  }
                  rows={3}
                  className="resize-none"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <Gauge className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                </div>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value) =>
                    updateFormData({
                      difficulty: value as "easy" | "medium" | "hard",
                    })
                  }
                >
                  <SelectTrigger id="difficulty">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <Label
                    htmlFor="timeLimit"
                    className={cn(errors.timeLimit && "text-destructive")}
                  >
                    Time Limit (minutes)*
                  </Label>
                </div>
                <Input
                  id="timeLimit"
                  type="number"
                  min="1"
                  placeholder="Enter time limit in minutes"
                  value={formData.timeLimit.toString()}
                  onChange={(e) => {
                    updateFormData({
                      timeLimit: parseInt(e.target.value) || 30,
                    });
                    if (errors.timeLimit) {
                      setErrors({ ...errors, timeLimit: "" });
                    }
                  }}
                  className={cn(errors.timeLimit && "border-destructive")}
                />
                {errors.timeLimit && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.timeLimit}
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <ListChecks className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="instructions">Instructions</Label>
              </div>
              <Textarea
                id="instructions"
                placeholder="Enter detailed instructions for test takers"
                value={formData.instructions}
                onChange={(e) =>
                  updateFormData({ instructions: e.target.value })
                }
                rows={5}
                className="resize-none"
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={handleContinue} className="w-full sm:w-auto">
                Continue
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
