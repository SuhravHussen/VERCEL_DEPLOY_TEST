/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash, FileText } from "lucide-react";
import { MatchingInformationGroup } from "@/types/exam/ielts-academic/reading/question/question";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define specific types for this component
interface MatchingInformationQuestion {
  number: number;
  statement: string;
  correctParagraph: string;
  imageUrl: string;
  [key: string]: unknown; // For compatibility
}

interface MatchingInformationFieldsProps {
  questionGroup: MatchingInformationGroup;
  updateQuestionGroup: (data: Partial<MatchingInformationGroup>) => void;
}

export default function MatchingInformationFields({
  questionGroup,
  updateQuestionGroup,
}: MatchingInformationFieldsProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<
    number | null
  >(questionGroup.questions?.length ? 0 : null);

  // Initialize paragraph labels if not present
  React.useEffect(() => {
    if (
      !questionGroup.paragraphLabels ||
      questionGroup.paragraphLabels.length === 0
    ) {
      updateQuestionGroup({
        paragraphLabels: ["A", "B", "C", "D", "E", "F"],
      });
    }

    // Initialize questions array if it's empty
    if (!questionGroup.questions || questionGroup.questions.length === 0) {
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

  // Paragraph label management
  const addParagraphLabel = () => {
    // Create a default array if paragraphLabels doesn't exist
    const currentLabels = questionGroup.paragraphLabels || [];

    // Get the last label or default to 'A'
    const lastLabel =
      currentLabels.length > 0 ? currentLabels[currentLabels.length - 1] : "@"; // Use @ because the next char will be A

    // Calculate next label (next character in alphabet)
    const nextLabelChar = String.fromCharCode(lastLabel.charCodeAt(0) + 1);

    // Create new array with the new label
    const updatedLabels = [...currentLabels, nextLabelChar];

    // Update the question group
    updateQuestionGroup({
      paragraphLabels: updatedLabels,
    });
  };

  const deleteParagraphLabel = () => {
    if (
      !questionGroup.paragraphLabels ||
      questionGroup.paragraphLabels.length <= 1
    )
      return;

    const updatedLabels = [...questionGroup.paragraphLabels];
    const removedLabel = updatedLabels.pop();

    updateQuestionGroup({ paragraphLabels: updatedLabels });

    // Update any questions that reference this paragraph
    if (removedLabel) {
      const updatedQuestions = questionGroup.questions.map((question) => {
        if (question.correctParagraph === removedLabel) {
          return { ...question, correctParagraph: "" };
        }
        return question;
      });

      updateQuestionGroup({ questions: updatedQuestions });
    }
  };

  // Question management
  const addQuestion = () => {
    if (!questionGroup.questions) return;

    const newQuestion: MatchingInformationQuestion = {
      number: questionGroup.questions.length + 1,
      statement: "",
      correctParagraph: "",
      imageUrl: "",
    };

    const updatedQuestions = [...questionGroup.questions, newQuestion];
    updateQuestionGroup({ questions: updatedQuestions });
    setCurrentQuestionIndex(updatedQuestions.length - 1);
  };

  const updateQuestion = (
    index: number,
    field: keyof MatchingInformationQuestion,
    value: string
  ) => {
    if (!questionGroup.questions) return;

    const updatedQuestions = [...questionGroup.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value,
    };

    updateQuestionGroup({ questions: updatedQuestions });
  };

  const deleteQuestion = (index: number) => {
    if (!questionGroup.questions) return;

    const updatedQuestions = [...questionGroup.questions];
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

  // Add this function to get valid paragraph labels
  const getValidParagraphLabels = () => {
    return (questionGroup.paragraphLabels || []).filter(
      (label) => label.trim() !== ""
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
            Example: &quot;The reading passage has six paragraphs, A-F. Which
            paragraph contains the following information?&quot;
          </p>
        </div>

        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-0">
              <h3 className="text-lg font-medium">Paragraph Labels</h3>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addParagraphLabel}
                  className="flex-1 sm:flex-none"
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add Label
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={deleteParagraphLabel}
                  disabled={
                    !questionGroup.paragraphLabels ||
                    questionGroup.paragraphLabels.length <= 1
                  }
                  className="flex-1 sm:flex-none"
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Remove Label
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {(questionGroup.paragraphLabels || []).map((label, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10"
                >
                  <span className="font-medium">{label}</span>
                </div>
              ))}
            </div>

            <p className="text-sm text-muted-foreground">
              These labels represent the paragraphs in your passage (A, B, C,
              etc.). Add or remove labels to match your passage structure.
            </p>
          </div>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <h3 className="text-lg font-medium">Statements</h3>
        <Button
          variant="outline"
          onClick={addQuestion}
          disabled={!questionGroup.paragraphLabels?.length}
          className="w-full sm:w-auto"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Statement
        </Button>
      </div>

      {questionGroup.questions.length > 0 && (
        <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:w-1/3 border-b sm:border-r sm:border-b-0 pb-4 sm:pb-0 sm:pr-4 mb-4 sm:mb-0">
            <div className="space-y-2">
              {questionGroup.questions.map((question, index) => (
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

          <div className="w-full sm:w-2/3 sm:pl-4">
            {currentQuestionIndex !== null && (
              <Card className="p-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="statement-text">Statement Text</Label>
                    <Textarea
                      id="statement-text"
                      value={
                        questionGroup.questions[currentQuestionIndex].statement
                      }
                      onChange={(e) =>
                        updateQuestion(
                          currentQuestionIndex,
                          "statement",
                          e.target.value
                        )
                      }
                      placeholder="Enter the statement text that should be matched to a paragraph"
                      rows={3}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label htmlFor="correct-paragraph">Correct Paragraph</Label>
                    <Select
                      value={
                        questionGroup.questions[currentQuestionIndex]
                          .correctParagraph || "none"
                      }
                      onValueChange={(value) =>
                        updateQuestion(
                          currentQuestionIndex,
                          "correctParagraph",
                          value === "none" ? "" : value
                        )
                      }
                    >
                      <SelectTrigger id="correct-paragraph" className="w-full">
                        <SelectValue placeholder="Select correct paragraph" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None Selected</SelectItem>
                        {getValidParagraphLabels().map((label, i) => (
                          <SelectItem key={i} value={label}>
                            Paragraph {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="image-url">Image URL (Optional)</Label>
                    <Input
                      id="image-url"
                      value={
                        questionGroup.questions[currentQuestionIndex]
                          .imageUrl || ""
                      }
                      onChange={(e) =>
                        updateQuestion(
                          currentQuestionIndex,
                          "imageUrl",
                          e.target.value
                        )
                      }
                      placeholder="Enter optional image URL"
                      className="w-full"
                    />
                  </div>

                  {questionGroup.questions[currentQuestionIndex].imageUrl && (
                    <div className="border rounded-md p-2 mt-2 overflow-hidden">
                      <img
                        src={
                          questionGroup.questions[currentQuestionIndex].imageUrl
                        }
                        alt="Question visual"
                        className="max-h-40 max-w-full object-contain mx-auto"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://placehold.co/400x200?text=Invalid+Image+URL";
                        }}
                      />
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {questionGroup.questions.length === 0 && (
        <div className="text-center p-4 sm:p-10 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-2">
            {!questionGroup.paragraphLabels?.length
              ? "Please add paragraph labels first."
              : "No statements added yet."}
          </p>
          {(questionGroup.paragraphLabels?.length || 0) > 0 && (
            <Button onClick={addQuestion} className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add First Statement
            </Button>
          )}
        </div>
      )}

      {questionGroup.questions.length > 0 &&
        questionGroup.paragraphLabels &&
        questionGroup.paragraphLabels.length > 0 && (
          <Card className="p-4 bg-muted/30">
            <h3 className="text-lg font-medium mb-4">Preview</h3>

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center mb-2 text-sm">
                  <FileText className="h-4 w-4 mr-2" />
                  <span className="break-words">
                    The reading passage has{" "}
                    {questionGroup.paragraphLabels.length} paragraphs, labeled{" "}
                    {questionGroup.paragraphLabels.join(", ")}.
                  </span>
                </div>

                {questionGroup.questions.map((question, index) => (
                  <div key={index} className="flex">
                    <div className="w-8 shrink-0 font-semibold">
                      {question.number}.
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="break-words">{question.statement}</div>
                      {question.correctParagraph && (
                        <div className="text-sm text-muted-foreground mt-1">
                          Answer: Paragraph {question.correctParagraph}
                        </div>
                      )}
                      {question.imageUrl && (
                        <div className="mt-2 overflow-hidden">
                          <img
                            src={question.imageUrl}
                            alt={`Visual for statement ${question.number}`}
                            className="max-h-20 object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://placehold.co/400x200?text=Invalid+Image+URL";
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
    </div>
  );
}
