"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MatchingHeadingsGroup } from "@/types/exam/ielts-academic/reading/question/question";

// Define specific types for this component
interface MatchingHeadingsQuestion {
  paragraph: string;
  correctHeading: string;
  [key: string]: unknown; // For compatibility
}

interface MatchingHeadingsFieldsProps {
  questionGroup: MatchingHeadingsGroup;
  updateQuestionGroup: (data: Partial<MatchingHeadingsGroup>) => void;
}

export default function MatchingHeadingsFields({
  questionGroup,
  updateQuestionGroup,
}: MatchingHeadingsFieldsProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<
    number | null
  >(questionGroup.questions?.length ? 0 : null);

  // Initialize headings and questions if not present
  React.useEffect(() => {
    if (!questionGroup.headings) {
      updateQuestionGroup({
        headings: ["", "", "", "", ""],
      });
    }
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

  // Heading management
  const addHeading = () => {
    const currentHeadings = questionGroup.headings || [];
    updateQuestionGroup({
      headings: [...currentHeadings, ""],
    });
  };

  const updateHeading = (index: number, value: string) => {
    if (!questionGroup.headings) return;

    const updatedHeadings = [...questionGroup.headings];
    updatedHeadings[index] = value;

    updateQuestionGroup({ headings: updatedHeadings });
  };

  const deleteHeading = (index: number) => {
    const headings = questionGroup.headings || [];
    if (headings.length <= 0) return;

    const updatedHeadings = [...headings];
    const deletedHeadingText = updatedHeadings.splice(index, 1)[0];
    updateQuestionGroup({ headings: updatedHeadings });

    // Update any questions that reference this heading
    if (deletedHeadingText) {
      const updatedQuestions = (questionGroup.questions || []).map(
        (question) => {
          if (question.correctHeading === deletedHeadingText) {
            return { ...question, correctHeading: "" };
          }
          return question;
        }
      );

      updateQuestionGroup({ questions: updatedQuestions });
    }
  };

  // Question (paragraph) management
  const addQuestion = () => {
    const newQuestion: MatchingHeadingsQuestion = {
      paragraph: "",
      correctHeading: "",
    };

    const updatedQuestions = [...(questionGroup.questions || []), newQuestion];
    updateQuestionGroup({ questions: updatedQuestions });
    setCurrentQuestionIndex(updatedQuestions.length - 1);
  };

  const updateQuestion = (
    index: number,
    field: keyof MatchingHeadingsQuestion,
    value: string
  ) => {
    const updatedQuestions = [...(questionGroup.questions || [])];
    if (updatedQuestions[index]) {
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        [field]: value,
      };
      updateQuestionGroup({ questions: updatedQuestions });
    }
  };

  const deleteQuestion = (index: number) => {
    const updatedQuestions = [...(questionGroup.questions || [])];
    updatedQuestions.splice(index, 1);

    updateQuestionGroup({ questions: updatedQuestions });

    if (currentQuestionIndex === index) {
      setCurrentQuestionIndex(updatedQuestions.length ? 0 : null);
    } else if (currentQuestionIndex !== null && currentQuestionIndex > index) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Get available headings that actually have content
  const getValidHeadings = () => {
    return (questionGroup.headings || []).filter(
      (heading) => heading.trim() !== ""
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
            Example: &quot;The reading passage has eight paragraphs, A-H. Choose
            the correct heading for each paragraph from the list of headings
            below.&quot;
          </p>
        </div>

        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-0">
              <h3 className="text-lg font-medium">Headings List</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={addHeading}
                className="w-full sm:w-auto"
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Add Heading
              </Button>
            </div>

            <div className="space-y-3">
              {(questionGroup.headings || []).map((heading, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    {index + 1}
                  </div>
                  <Input
                    value={heading}
                    onChange={(e) => updateHeading(index, e.target.value)}
                    placeholder={`Heading ${index + 1}`}
                    className="flex-grow w-full"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0"
                    onClick={() => deleteHeading(index)}
                    disabled={(questionGroup.headings?.length || 0) <= 2}
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
        <h3 className="text-lg font-medium">Paragraphs</h3>
        <Button
          variant="outline"
          onClick={addQuestion}
          disabled={getValidHeadings().length === 0}
          className="w-full sm:w-auto"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Paragraph
        </Button>
      </div>

      {(questionGroup.questions || []).length > 0 && (
        <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:w-1/3 border-b sm:border-r sm:border-b-0 pb-4 sm:pb-0 sm:pr-4 mb-4 sm:mb-0">
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
                    <span className="font-medium">Paragraph {index + 1}</span>
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
                    {question.paragraph || "(No paragraph text)"}
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
                    <Label htmlFor="paragraph-text">Paragraph Text</Label>
                    <Textarea
                      id="paragraph-text"
                      value={
                        (questionGroup.questions || [])[currentQuestionIndex]
                          ?.paragraph
                      }
                      onChange={(e) =>
                        updateQuestion(
                          currentQuestionIndex,
                          "paragraph",
                          e.target.value
                        )
                      }
                      placeholder="Enter the paragraph text"
                      rows={5}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label htmlFor="correct-heading">Correct Heading</Label>
                    <Select
                      value={
                        (questionGroup.questions || [])[currentQuestionIndex]
                          ?.correctHeading || "none"
                      }
                      onValueChange={(value) =>
                        updateQuestion(
                          currentQuestionIndex,
                          "correctHeading",
                          value === "none" ? "" : value
                        )
                      }
                    >
                      <SelectTrigger id="correct-heading" className="w-full">
                        <SelectValue placeholder="Select correct heading" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None Selected</SelectItem>
                        {getValidHeadings().map((heading, i) => (
                          <SelectItem key={i} value={heading}>
                            {i + 1}: {heading}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {getValidHeadings().length === 0 && (
                      <p className="text-sm text-red-500 mt-1">
                        Please add at least one heading with content before
                        assigning.
                      </p>
                    )}
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
            {getValidHeadings().length === 0
              ? "Please add at least one heading with content first."
              : "No paragraphs added yet."}
          </p>
          {getValidHeadings().length > 0 && (
            <Button onClick={addQuestion} className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add First Paragraph
            </Button>
          )}
        </div>
      )}

      {(questionGroup.questions || []).length > 0 &&
        (questionGroup.headings?.length || 0) > 0 && (
          <Card className="p-4 bg-muted/30">
            <h3 className="text-lg font-medium mb-4">Preview</h3>

            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="font-medium">Headings List:</h4>
                <div className="grid grid-cols-1 gap-1 pl-4">
                  {(questionGroup.headings || []).map((heading, index) => (
                    <div key={index} className="flex">
                      <span className="w-8 font-semibold">{index + 1}</span>
                      <span className="break-words flex-1">
                        {heading || "(Empty heading)"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 space-y-4">
                <h4 className="font-medium">Paragraphs:</h4>
                {(questionGroup.questions || []).map((question, index) => (
                  <div key={index} className="flex space-x-2">
                    <div className="w-8 shrink-0 font-semibold">
                      {index + 1}.
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="line-clamp-3 break-words">
                        {question.paragraph || "(No paragraph text)"}
                      </div>
                      {question.correctHeading && (
                        <div className="text-sm text-muted-foreground mt-1">
                          <span className="font-medium">Heading: </span>
                          {(questionGroup.headings || []).indexOf(
                            question.correctHeading
                          ) !== -1 ? (
                            <span>
                              {(questionGroup.headings || []).indexOf(
                                question.correctHeading
                              ) + 1}
                              : {question.correctHeading}
                            </span>
                          ) : (
                            <span className="italic">
                              (Invalid heading reference)
                            </span>
                          )}
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
