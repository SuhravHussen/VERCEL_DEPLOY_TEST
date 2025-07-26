/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash, UploadCloud, MoveVertical } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ListeningFlowChartCompletionGroup } from "@/types/exam/ielts-academic/listening/listening";

interface FlowChartStep {
  stepId: string;
  correctAnswer: string;
}

interface FlowChartCompletionFieldsProps {
  questionGroup: ListeningFlowChartCompletionGroup;
  updateQuestionGroup: (
    data: Partial<ListeningFlowChartCompletionGroup>
  ) => void;
}

export default function FlowChartCompletionFields({
  questionGroup,
  updateQuestionGroup,
}: FlowChartCompletionFieldsProps) {
  const [uploading, setUploading] = useState(false);
  const [showOptions, setShowOptions] = useState(
    Array.isArray(questionGroup.options) && questionGroup.options.length > 0
  );
  const [wordLimitOptions] = useState([
    { value: "1", label: "ONE WORD ONLY" },
    { value: "2", label: "NO MORE THAN TWO WORDS" },
    { value: "3", label: "NO MORE THAN THREE WORDS" },
  ]);

  // Initialize questions if not present
  useEffect(() => {
    if (!questionGroup.questions) {
      updateQuestionGroup({
        questions: [],
      });
    }
  }, [questionGroup.questions, updateQuestionGroup]);

  const handleInstructionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    updateQuestionGroup({ instruction: e.target.value });
  };

  const handleChartStructureChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    updateQuestionGroup({ chartStructure: e.target.value });
  };

  const handleWordLimitChange = (value: string) => {
    updateQuestionGroup({
      wordLimit: parseInt(value),
      wordLimitText:
        wordLimitOptions.find((opt) => opt.value === value)?.label || "",
    });
  };

  const handleStartingNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      updateQuestionGroup({ startingQuestionNumber: value });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      // For demo purposes, we'll create a data URL
      const reader = new FileReader();
      reader.onload = () => {
        updateQuestionGroup({ chartImage: reader.result as string });
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  const toggleOptionsList = (checked: boolean) => {
    setShowOptions(checked);
    if (checked && !questionGroup.options) {
      updateQuestionGroup({ options: ["", "", ""] });
    } else if (!checked) {
      updateQuestionGroup({ options: undefined });
    }
  };

  const addOption = () => {
    const options = Array.isArray(questionGroup.options)
      ? [...questionGroup.options]
      : [];
    options.push("");
    updateQuestionGroup({ options });
  };

  const updateOption = (index: number, value: string) => {
    const options = Array.isArray(questionGroup.options)
      ? [...questionGroup.options]
      : [];
    options[index] = value;
    updateQuestionGroup({ options });
  };

  const deleteOption = (index: number) => {
    const options = Array.isArray(questionGroup.options)
      ? [...questionGroup.options]
      : [];
    options.splice(index, 1);

    if (options.length === 0) {
      setShowOptions(false);
      updateQuestionGroup({ options: undefined });
    } else {
      updateQuestionGroup({ options });
    }
  };

  const addStep = () => {
    const newStep: FlowChartStep = {
      stepId: `${(questionGroup.questions || []).length + 1}`,
      correctAnswer: "",
    };

    const updatedQuestions = [...(questionGroup.questions || []), newStep];
    updateQuestionGroup({ questions: updatedQuestions });
  };

  const updateStep = (
    index: number,
    field: keyof FlowChartStep,
    value: string
  ) => {
    const updatedQuestions = [...(questionGroup.questions || [])];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value,
    };

    updateQuestionGroup({ questions: updatedQuestions });
  };

  const deleteStep = (index: number) => {
    const updatedQuestions = [...(questionGroup.questions || [])];
    updatedQuestions.splice(index, 1);

    // Renumber the steps
    updatedQuestions.forEach((q, i) => {
      q.stepId = `${i + 1}`;
    });

    updateQuestionGroup({ questions: updatedQuestions });
  };

  const moveStep = (index: number, direction: "up" | "down") => {
    const questions = questionGroup.questions || [];
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === questions.length - 1)
    ) {
      return;
    }

    const updatedQuestions = [...questions];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    // Swap positions
    const temp = updatedQuestions[index];
    updatedQuestions[index] = updatedQuestions[newIndex];
    updatedQuestions[newIndex] = temp;

    // Update stepIds to match new order
    updatedQuestions.forEach((q, i) => {
      q.stepId = `${i + 1}`;
    });

    updateQuestionGroup({ questions: updatedQuestions });
  };

  return (
    <div className="space-y-6 w-full max-w-full">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="instruction">Instructions</Label>
          <Textarea
            id="instruction"
            placeholder="Enter instructions for this question group"
            value={questionGroup.instruction || ""}
            onChange={handleInstructionChange}
            className="min-h-[100px] w-full"
          />
          <p className="text-sm text-muted-foreground">
            Example: &quot;Complete the flow chart below. Choose NO MORE THAN
            TWO WORDS for each answer.&quot;
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="chart-structure">Flow Chart Description</Label>
          <Textarea
            id="chart-structure"
            placeholder="Enter a description of the flow chart's structure"
            value={questionGroup.chartStructure || ""}
            onChange={handleChartStructureChange}
            className="w-full"
          />
          <p className="text-sm text-muted-foreground">
            Describe the structure and flow of your chart. This will help
            students understand the context.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="word-limit">Word Limit</Label>
          <Select
            value={(questionGroup.wordLimit || 2).toString()}
            onValueChange={handleWordLimitChange}
          >
            <SelectTrigger id="word-limit" className="w-full">
              <SelectValue placeholder="Select word limit" />
            </SelectTrigger>
            <SelectContent>
              {wordLimitOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="starting-number">Starting Question Number</Label>
          <Input
            id="starting-number"
            type="number"
            min="1"
            value={questionGroup.startingQuestionNumber || ""}
            onChange={handleStartingNumberChange}
            placeholder="1"
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Use if this flow chart starts with a question number other than 1
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="chart-image">Flow Chart Image (Optional)</Label>
          <div className="border rounded-md p-4 w-full">
            {questionGroup.chartImage ? (
              <div className="space-y-4">
                <div className="overflow-auto">
                  <img
                    src={questionGroup.chartImage}
                    alt="Flow Chart"
                    className="max-w-full h-auto border rounded object-contain"
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      updateQuestionGroup({ chartImage: undefined })
                    }
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Remove Image</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10">
                <UploadCloud className="h-10 w-10 mb-2 text-muted-foreground" />
                <p className="text-muted-foreground mb-4 text-center">
                  Upload flow chart image (optional)
                </p>
                <div>
                  <Input
                    id="chart-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                  <label htmlFor="chart-image-upload">
                    <Button
                      variant="outline"
                      disabled={uploading}
                      className="cursor-pointer"
                      asChild
                    >
                      <span>
                        <UploadCloud className="mr-2 h-4 w-4" />
                        {uploading ? "Uploading..." : "Select Image"}
                      </span>
                    </Button>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="use-options"
              checked={showOptions}
              onCheckedChange={toggleOptionsList}
            />
            <Label htmlFor="use-options">Use word bank / options list</Label>
          </div>

          {showOptions && (
            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-0">
                  <h3 className="text-lg font-medium">Word Bank Options</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addOption}
                    className="w-full sm:w-auto"
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add Option
                  </Button>
                </div>

                <div className="space-y-3">
                  {(Array.isArray(questionGroup.options)
                    ? questionGroup.options
                    : []
                  ).map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="flex-grow w-full"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="flex-shrink-0"
                        onClick={() => deleteOption(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h3 className="text-lg font-medium">Flow Chart Steps</h3>
        <Button
          variant="outline"
          onClick={addStep}
          className="w-full sm:w-auto"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Step
        </Button>
      </div>

      {(questionGroup.questions || []).length > 0 ? (
        <Card className="p-4 sm:p-6">
          <div className="space-y-4">
            {(questionGroup.questions || []).map((step, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-3 border p-3 rounded-md"
              >
                <div className="flex sm:flex-col gap-2 justify-start">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => moveStep(index, "up")}
                    disabled={index === 0}
                  >
                    <MoveVertical className="h-4 w-4 rotate-180" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => moveStep(index, "down")}
                    disabled={
                      index === (questionGroup.questions || []).length - 1
                    }
                  >
                    <MoveVertical className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  {questionGroup.startingQuestionNumber
                    ? questionGroup.startingQuestionNumber + index
                    : step.stepId}
                </div>
                <div className="flex-grow w-full">
                  <Input
                    value={step.correctAnswer || ""}
                    onChange={(e) =>
                      updateStep(index, "correctAnswer", e.target.value)
                    }
                    placeholder={`Answer for step ${step.stepId}`}
                    className="w-full"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0 ml-auto sm:ml-0"
                  onClick={() => deleteStep(index)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <div className="text-center p-4 sm:p-10 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-2">
            No flow chart steps added yet.
          </p>
          <Button onClick={addStep} className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add First Step
          </Button>
        </div>
      )}
    </div>
  );
}
