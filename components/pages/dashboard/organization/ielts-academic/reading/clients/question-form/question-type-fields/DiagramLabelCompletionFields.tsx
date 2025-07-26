/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash, UploadCloud } from "lucide-react";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DiagramLabelCompletionGroup } from "@/types/exam/ielts-academic/reading/question/question";

// Define specific types for this component
interface DiagramLabelQuestion {
  stepId: string;
  correctAnswer: string;
  [key: string]: unknown; // For compatibility
}

interface DiagramLabelCompletionFieldsProps {
  questionGroup: DiagramLabelCompletionGroup;
  updateQuestionGroup: (data: Partial<DiagramLabelCompletionGroup>) => void;
  organizationId: number;
}

export default function DiagramLabelCompletionFields({
  questionGroup,
  updateQuestionGroup,
}: DiagramLabelCompletionFieldsProps) {
  const [uploading, setUploading] = useState(false);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInstructionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    updateQuestionGroup({ instruction: e.target.value });
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    updateQuestionGroup({ diagramDescription: e.target.value });
  };

  const handleWordLimitChange = (value: string) => {
    updateQuestionGroup({
      wordLimit: parseInt(value),
      wordLimitText:
        wordLimitOptions.find((opt) => opt.value === value)?.label || "",
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      // In a real app, you'd upload the file to your server or cloud storage
      // For demo purposes, we'll just create a data URL
      const reader = new FileReader();
      reader.onload = () => {
        updateQuestionGroup({ diagramImage: reader.result as string });
        setUploading(false);
      };
      reader.readAsDataURL(file);

      // In a real app with API, you'd do something like:
      // const formData = new FormData();
      // formData.append('file', file);
      // formData.append('organizationId', organizationId.toString());
      // const response = await fetch('/api/upload', {
      //   method: 'POST',
      //   body: formData
      // });
      // const data = await response.json();
      // updateQuestionGroup({ diagramImage: data.imageUrl });
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  const addQuestion = () => {
    const newQuestion: DiagramLabelQuestion = {
      stepId: `${(questionGroup.questions || []).length + 1}`,
      correctAnswer: "",
    };

    const updatedQuestions = [...(questionGroup.questions || []), newQuestion];
    updateQuestionGroup({ questions: updatedQuestions });
  };

  const updateQuestion = (
    index: number,
    field: keyof DiagramLabelQuestion,
    value: string
  ) => {
    const updatedQuestions = [...(questionGroup.questions || [])];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value,
    };

    updateQuestionGroup({ questions: updatedQuestions });
  };

  const deleteQuestion = (index: number) => {
    const updatedQuestions = [...(questionGroup.questions || [])];
    updatedQuestions.splice(index, 1);

    // Renumber the questions
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
            value={questionGroup.instruction}
            onChange={handleInstructionChange}
            className="min-h-[100px] w-full"
          />
          <p className="text-sm text-muted-foreground">
            Example: &quot;Label the diagram below. Choose NO MORE THAN TWO
            WORDS from the passage for each answer.&quot;
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="diagram-description">Diagram Description</Label>
          <Textarea
            id="diagram-description"
            placeholder="Enter a description of the diagram"
            value={questionGroup.diagramDescription || ""}
            onChange={handleDescriptionChange}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="word-limit">Word Limit</Label>
          <Select
            value={(questionGroup.wordLimit || 2).toString()}
            onValueChange={handleWordLimitChange}
          >
            <SelectTrigger className="w-full">
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
          <Label htmlFor="diagram-image">Diagram Image</Label>
          <div className="border rounded-md p-4 w-full">
            {questionGroup.diagramImage ? (
              <div className="space-y-4">
                <div className="overflow-auto">
                  <img
                    src={questionGroup.diagramImage}
                    alt="Diagram"
                    className="max-w-full h-auto border rounded object-contain"
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      updateQuestionGroup({ diagramImage: undefined })
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
                  Upload diagram image
                </p>
                <div>
                  <Input
                    id="diagram-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                  <label htmlFor="diagram-image-upload">
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
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h3 className="text-lg font-medium">Label Points</h3>
        <Button
          variant="outline"
          onClick={addQuestion}
          className="w-full sm:w-auto"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Label
        </Button>
      </div>

      {(questionGroup.questions || []).length > 0 ? (
        <Card className="p-4 sm:p-6">
          <div className="space-y-4">
            {(questionGroup.questions || []).map((question, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4"
              >
                <div className="flex-shrink-0 w-full sm:w-12">
                  <Input
                    value={question.stepId}
                    onChange={(e) =>
                      updateQuestion(index, "stepId", e.target.value)
                    }
                    placeholder="ID"
                    className="w-full"
                  />
                </div>
                <div className="flex-grow w-full">
                  <Input
                    value={question.correctAnswer || ""}
                    onChange={(e) =>
                      updateQuestion(index, "correctAnswer", e.target.value)
                    }
                    placeholder={`Answer (max ${
                      questionGroup.wordLimit || 2
                    } words)`}
                    className="w-full"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0 ml-auto sm:ml-0"
                  onClick={() => deleteQuestion(index)}
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
            No label points added yet.
          </p>
          <Button onClick={addQuestion} className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add First Label
          </Button>
        </div>
      )}
    </div>
  );
}
