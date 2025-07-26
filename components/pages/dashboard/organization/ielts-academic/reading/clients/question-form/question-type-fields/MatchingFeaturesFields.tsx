"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash } from "lucide-react";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { MatchingFeaturesGroup } from "@/types/exam/ielts-academic/reading/question/question";

// Define specific types for this component
interface Feature {
  label: string;
  description: string;
}

interface MatchingFeaturesQuestion {
  number: number;
  statement: string;
  correctFeature: string;
  [key: string]: unknown; // For compatibility
}

interface MatchingFeaturesFieldsProps {
  questionGroup: MatchingFeaturesGroup;
  updateQuestionGroup: (data: Partial<MatchingFeaturesGroup>) => void;
}

export default function MatchingFeaturesFields({
  questionGroup,
  updateQuestionGroup,
}: MatchingFeaturesFieldsProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<
    number | null
  >(questionGroup.questions?.length ? 0 : null);

  const handleInstructionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    updateQuestionGroup({ instruction: e.target.value });
  };

  // Initialize features and questions if not present
  React.useEffect(() => {
    if (!questionGroup.features || questionGroup.features.length === 0) {
      updateQuestionGroup({
        features: [
          { label: "A", description: "" },
          { label: "B", description: "" },
          { label: "C", description: "" },
          { label: "D", description: "" },
          { label: "E", description: "" },
        ],
      });
    }
    if (!questionGroup.questions) {
      updateQuestionGroup({ questions: [] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addFeature = () => {
    const features = questionGroup.features || [];
    const lastLabel =
      features.length > 0 ? features[features.length - 1]?.label : "@";
    const nextLabel = String.fromCharCode(lastLabel.charCodeAt(0) + 1);

    updateQuestionGroup({
      features: [...features, { label: nextLabel, description: "" }],
    });
  };

  const updateFeature = (
    index: number,
    field: keyof Feature,
    value: string
  ) => {
    if (!questionGroup.features) return;

    const updatedFeatures = [...questionGroup.features];
    updatedFeatures[index] = {
      ...updatedFeatures[index],
      [field]: value,
    };

    updateQuestionGroup({ features: updatedFeatures });
  };

  const deleteFeature = (index: number) => {
    if (!questionGroup.features) return;

    const updatedFeatures = [...questionGroup.features];
    updatedFeatures.splice(index, 1);

    // Relabel the features
    updatedFeatures.forEach((feature, i) => {
      feature.label = String.fromCharCode(65 + i); // A, B, C...
    });

    updateQuestionGroup({ features: updatedFeatures });

    // Update any questions that reference this feature
    const deletedLabel = String.fromCharCode(65 + index);
    const updatedQuestions = (questionGroup.questions || []).map((question) => {
      if (question.correctFeature === deletedLabel) {
        return { ...question, correctFeature: "" };
      } else if (
        question.correctFeature &&
        question.correctFeature.charCodeAt(0) > deletedLabel.charCodeAt(0)
      ) {
        // Adjust references to features after the deleted one
        return {
          ...question,
          correctFeature: String.fromCharCode(
            question.correctFeature.charCodeAt(0) - 1
          ),
        };
      }
      return question;
    });

    updateQuestionGroup({ questions: updatedQuestions });
  };

  const addQuestion = () => {
    const newQuestion: MatchingFeaturesQuestion = {
      number: (questionGroup.questions || []).length + 1,
      statement: "",
      correctFeature: "",
    };

    const updatedQuestions = [...(questionGroup.questions || []), newQuestion];
    updateQuestionGroup({ questions: updatedQuestions });
    setCurrentQuestionIndex(updatedQuestions.length - 1);
  };

  const updateQuestion = (
    index: number,
    field: keyof MatchingFeaturesQuestion,
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
      q.number = i + 1;
    });

    updateQuestionGroup({ questions: updatedQuestions });

    if (currentQuestionIndex === index) {
      setCurrentQuestionIndex(updatedQuestions.length ? 0 : null);
    } else if (currentQuestionIndex !== null && currentQuestionIndex > index) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Get valid features that can be used in selection
  const getValidFeatures = () => {
    if (!questionGroup.features) return [];
    return questionGroup.features.filter(
      (feature) =>
        feature.label.trim() !== "" && feature.description.trim() !== ""
    );
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
            Example: &quot;Match each feature to the correct person. Choose the
            correct letter, A-E. NB. You may use any letter more than
            once.&quot;
          </p>
        </div>

        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-0">
              <h3 className="text-lg font-medium">Features</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={addFeature}
                className="w-full sm:w-auto"
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Add Feature
              </Button>
            </div>

            <div className="space-y-3">
              {(questionGroup.features || []).map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    {feature.label}
                  </div>
                  <Input
                    value={feature.description}
                    onChange={(e) =>
                      updateFeature(index, "description", e.target.value)
                    }
                    placeholder={`Description for ${feature.label}`}
                    className="flex-grow w-full"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0"
                    onClick={() => deleteFeature(index)}
                    disabled={(questionGroup.features?.length || 0) <= 2}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <h3 className="text-lg font-medium">Statements</h3>
        <Button
          variant="outline"
          onClick={addQuestion}
          disabled={!questionGroup.features?.length}
          className="w-full sm:w-auto"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Statement
        </Button>
      </div>

      {(questionGroup.questions || []).length > 0 && (
        <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:w-1/4 border-b sm:border-r sm:border-b-0 pb-4 sm:pb-0 sm:pr-4 mb-4 sm:mb-0">
            <div className="space-y-2">
              {(questionGroup.questions || []).map((question, index) => (
                <div
                  key={index}
                  className={`p-2 rounded cursor-pointer ${
                    currentQuestionIndex === index
                      ? "bg-primary/10 border border-primary"
                      : "hover:bg-muted"
                  }`}
                  onClick={() => setCurrentQuestionIndex(index)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      Statement {question.number}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteQuestion(index);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {question.statement || "(No statement text)"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full sm:w-3/4 sm:pl-4">
            {currentQuestionIndex !== null && (
              <Card className="p-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="statement-text">Statement Text</Label>
                    <Textarea
                      id="statement-text"
                      value={
                        (questionGroup.questions || [])[currentQuestionIndex]
                          ?.statement
                      }
                      onChange={(e) =>
                        updateQuestion(
                          currentQuestionIndex,
                          "statement",
                          e.target.value
                        )
                      }
                      placeholder="Enter the statement text"
                      rows={3}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label htmlFor="correct-feature">Correct Feature</Label>
                    <Select
                      value={
                        (questionGroup.questions || [])[currentQuestionIndex]
                          ?.correctFeature || ""
                      }
                      onValueChange={(value) =>
                        updateQuestion(
                          currentQuestionIndex,
                          "correctFeature",
                          value === "none" ? "" : value
                        )
                      }
                    >
                      <SelectTrigger id="correct-feature" className="w-full">
                        <SelectValue placeholder="Select correct feature" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None Selected</SelectItem>
                        {getValidFeatures().map((feature) => (
                          <SelectItem key={feature.label} value={feature.label}>
                            {feature.label}: {feature.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {(questionGroup.questions || []).length === 0 && (
        <div className="text-center p-4 sm:p-10 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-2">
            {!questionGroup.features?.length
              ? "Please add features first before creating statements."
              : "No statements added yet."}
          </p>
          {(questionGroup.features?.length || 0) > 0 && (
            <Button onClick={addQuestion} className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add First Statement
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
