/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash, UploadCloud } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DiagramLabelCompletionGroup } from "@/types/exam/ielts-academic/reading/question/question";

// Define specific types for this component
interface DiagramLabelQuestion {
  labelId: string;
  correctAnswer: string;
}

interface InputPosition {
  labelId: string;
  x: number;
  y: number;
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
  const [showOptions, setShowOptions] = useState(
    Array.isArray(questionGroup.options) && questionGroup.options.length > 0
  );
  const [wordLimitOptions] = useState([
    { value: "1", label: "ONE WORD ONLY" },
    { value: "2", label: "NO MORE THAN TWO WORDS" },
    { value: "3", label: "NO MORE THAN THREE WORDS" },
  ]);

  // Refs for interactive positioning
  const imageRef = useRef<HTMLImageElement>(null);

  // Helper functions to safely handle array operations
  const getInputPositions = (): InputPosition[] =>
    Array.isArray(questionGroup.inputPositions)
      ? (questionGroup.inputPositions as InputPosition[])
      : [];

  const getQuestions = (): DiagramLabelQuestion[] =>
    Array.isArray(questionGroup.questions) ? questionGroup.questions : [];

  const getOptions = (): string[] =>
    Array.isArray(questionGroup.options)
      ? (questionGroup.options as string[])
      : [];

  // Initialize questions if not present
  useEffect(() => {
    if (!questionGroup.questions) {
      updateQuestionGroup({
        questions: [],
      });
    }
  }, [questionGroup.questions, updateQuestionGroup]);

  // Interactive image positioning functions
  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const positions = getInputPositions();
    const newPosition: InputPosition = {
      labelId: `label-${positions.length + 1}`,
      x: Math.round(x * 10) / 10, // Round to 1 decimal place
      y: Math.round(y * 10) / 10,
    };

    updateQuestionGroup({ inputPositions: [...positions, newPosition] });
  };

  const handleDeletePosition = (index: number) => {
    const positions = getInputPositions();
    positions.splice(index, 1);
    updateQuestionGroup({ inputPositions: positions });
  };

  const handleInstructionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    updateQuestionGroup({ instruction: e.target.value });
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
      // For demo purposes, we'll create a data URL
      const reader = new FileReader();
      reader.onload = () => {
        updateQuestionGroup({ diagramImage: reader.result as string });
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
    const options = getOptions();
    options.push("");
    updateQuestionGroup({ options });
  };

  const updateOption = (index: number, value: string) => {
    const options = getOptions();
    options[index] = value;
    updateQuestionGroup({ options });
  };

  const deleteOption = (index: number) => {
    const options = getOptions();
    options.splice(index, 1);

    if (options.length === 0) {
      setShowOptions(false);
      updateQuestionGroup({ options: undefined });
    } else {
      updateQuestionGroup({ options });
    }
  };

  // Input Positions Management
  const updateInputPosition = (
    index: number,
    field: keyof InputPosition,
    value: string | number
  ) => {
    const positions = getInputPositions();
    if (positions[index]) {
      positions[index] = {
        ...positions[index],
        [field]: value,
      };
      updateQuestionGroup({ inputPositions: positions });
    }
  };

  // Questions Management
  const addQuestion = () => {
    const questions = getQuestions();
    const newQuestion: DiagramLabelQuestion = {
      labelId: `${questions.length + 1}`,
      correctAnswer: "",
    };

    updateQuestionGroup({ questions: [...questions, newQuestion] });
  };

  const updateQuestion = (
    index: number,
    field: keyof DiagramLabelQuestion,
    value: string
  ) => {
    const questions = getQuestions();
    if (questions[index]) {
      questions[index] = {
        ...questions[index],
        [field]: value,
      };
      updateQuestionGroup({ questions });
    }
  };

  const deleteQuestion = (index: number) => {
    const questions = getQuestions();
    questions.splice(index, 1);

    // Renumber the questions
    questions.forEach((q, i) => {
      q.labelId = `${i + 1}`;
    });

    updateQuestionGroup({ questions });
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
            Example: &quot;Label the diagram below. Choose NO MORE THAN TWO
            WORDS from the passage for each answer.&quot;
          </p>
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

        {/* Diagram Image Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="diagram-image">Diagram Image</Label>
            <div className="border rounded-md p-4 w-full">
              {questionGroup.diagramImage ? (
                <div className="space-y-4">
                  <div className="overflow-auto">
                    <div className="relative inline-block min-w-[400px] max-w-full">
                      <img
                        ref={imageRef}
                        src={questionGroup.diagramImage}
                        alt="Diagram"
                        className="w-full h-auto border rounded object-contain cursor-crosshair"
                        style={{
                          minHeight: "300px",
                          minWidth: "500px",
                        }}
                        onClick={handleImageClick}
                      />

                      {/* Show input position markers */}
                      {getInputPositions().map((position, index) => (
                        <div
                          key={index}
                          className="absolute w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold cursor-pointer hover:bg-green-600 transition-colors"
                          style={{
                            left: `${position.x}%`,
                            top: `${position.y}%`,
                            transform: "translate(-50%, -50%)",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePosition(index);
                          }}
                          title={`Position ${index + 1}: ${
                            position.labelId
                          } (Click to delete)`}
                        >
                          {index + 1}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-md p-3">
                    <h4 className="font-medium text-green-800 mb-2">
                      📍 Interactive Positioning
                    </h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>
                        • Click anywhere on the diagram to add a label position
                      </li>
                      <li>
                        • Click on existing green numbered markers to remove
                        them
                      </li>
                      <li>
                        • Positions are automatically saved as percentages
                      </li>
                      <li>• Each position will become a label input field</li>
                    </ul>
                  </div>

                  {/* Input Positions List */}
                  {getInputPositions().length > 0 && (
                    <div className="border rounded-md p-3">
                      <h4 className="font-medium mb-2">
                        Label Positions ({getInputPositions().length})
                      </h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {getInputPositions().map((position, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-muted/30 p-2 rounded text-sm"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                {index + 1}
                              </div>
                              <Input
                                value={position.labelId}
                                onChange={(e) =>
                                  updateInputPosition(
                                    index,
                                    "labelId",
                                    e.target.value
                                  )
                                }
                                placeholder={`Label ${index + 1}`}
                                className="h-8 text-xs flex-grow"
                              />
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>
                                ({position.x.toFixed(1)}%,{" "}
                                {position.y.toFixed(1)}%)
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 hover:bg-red-100"
                                onClick={() => handleDeletePosition(index)}
                              >
                                <Trash className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateQuestionGroup({ inputPositions: [] })
                      }
                      disabled={!getInputPositions().length}
                    >
                      Clear All Positions
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        updateQuestionGroup({
                          diagramImage: undefined,
                          inputPositions: undefined,
                        })
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
                  {getOptions().map((option, index) => (
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
        <h3 className="text-lg font-medium">Label Answers</h3>
        <Button
          variant="outline"
          onClick={addQuestion}
          className="w-full sm:w-auto"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Answer
        </Button>
      </div>

      {getQuestions().length > 0 ? (
        <Card className="p-4 sm:p-6">
          <div className="space-y-4">
            {getQuestions().map((question, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4"
              >
                <div className="flex-shrink-0 w-full sm:w-12">
                  <Input
                    value={question.labelId}
                    onChange={(e) =>
                      updateQuestion(index, "labelId", e.target.value)
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
            No label answers added yet.
          </p>
          <Button onClick={addQuestion} className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add First Answer
          </Button>
        </div>
      )}
    </div>
  );
}
