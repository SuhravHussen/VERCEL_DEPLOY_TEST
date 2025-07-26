/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react"; // Added missing import for React
import { SentenceCompletionGroup } from "@/types/exam/ielts-academic/reading/question/question";

// Define specific types for this component
interface SentenceCompletionQuestion {
  number: number;
  sentenceWithBlank: string;
  correctAnswer: string;
  imageUrl: string;
  [key: string]: unknown; // For compatibility
}

interface SentenceCompletionFieldsProps {
  questionGroup: SentenceCompletionGroup;
  updateQuestionGroup: (data: Partial<SentenceCompletionGroup>) => void;
}

export default function SentenceCompletionFields({
  questionGroup,
  updateQuestionGroup,
}: SentenceCompletionFieldsProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<
    number | null
  >(questionGroup.questions?.length ? 0 : null);

  const [wordLimitOptions] = useState([
    { value: "1", label: "ONE WORD ONLY" },
    { value: "2", label: "NO MORE THAN TWO WORDS" },
    { value: "3", label: "NO MORE THAN THREE WORDS" },
  ]);

  // Initialize questions if not present
  useEffect(() => {
    if (!questionGroup.questions) {
      updateQuestionGroup({ questions: [] });
    }
  }, [questionGroup.questions, updateQuestionGroup]);

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

  const addQuestion = () => {
    const newQuestion: SentenceCompletionQuestion = {
      number: (questionGroup.questions || []).length + 1,
      sentenceWithBlank: "",
      correctAnswer: "",
      imageUrl: "",
    };

    const updatedQuestions = [...(questionGroup.questions || []), newQuestion];
    updateQuestionGroup({ questions: updatedQuestions });
    setCurrentQuestionIndex(updatedQuestions.length - 1);
  };

  const updateQuestion = (
    index: number,
    field: keyof SentenceCompletionQuestion,
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

  // Helper to insert a blank placeholder at cursor position
  const insertBlankAtCursor = (index: number) => {
    if (currentQuestionIndex === null) return;

    const textAreaElement = document.getElementById(
      `sentence-${index}`
    ) as HTMLTextAreaElement | null;
    if (!textAreaElement) return;

    const cursorPos = textAreaElement.selectionStart;
    const text = textAreaElement.value;
    const updatedText =
      text.substring(0, cursorPos) + " _______ " + text.substring(cursorPos);

    updateQuestion(index, "sentenceWithBlank", updatedText);

    // Focus back on the textarea and position cursor after the blank
    setTimeout(() => {
      textAreaElement.focus();
      const newCursorPos = cursorPos + 8; // 8 is the length of " _______ "
      textAreaElement.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const currentQuestion =
    currentQuestionIndex !== null
      ? (questionGroup.questions || [])[currentQuestionIndex]
      : null;

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
            Example: &quot;Complete the sentences below. Choose NO MORE THAN
            THREE WORDS from the passage for each answer.&quot;
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="word-limit">Word Limit</Label>
          <Select
            value={(questionGroup.wordLimit || 2).toString()}
            onValueChange={handleWordLimitChange}
          >
            <SelectTrigger id="word-limit" className="w-full sm:w-64">
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
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <h3 className="text-lg font-medium">Sentences</h3>
        <Button
          variant="outline"
          onClick={addQuestion}
          className="w-full sm:w-auto"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Sentence
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
                      Sentence {question.number}
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
                    {question.sentenceWithBlank || "(No sentence text)"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full sm:w-3/4 sm:pl-4">
            {currentQuestion && (
              <Card className="p-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex flex-col sm:flex-row justify-between gap-2 sm:items-center mb-2">
                      <Label htmlFor={`sentence-${currentQuestionIndex}`}>
                        Sentence with Blank
                      </Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          insertBlankAtCursor(currentQuestionIndex!)
                        }
                        className="w-full sm:w-auto"
                      >
                        Insert Blank
                      </Button>
                    </div>
                    <Textarea
                      id={`sentence-${currentQuestionIndex}`}
                      value={currentQuestion.sentenceWithBlank}
                      onChange={(e) =>
                        updateQuestion(
                          currentQuestionIndex!,
                          "sentenceWithBlank",
                          e.target.value
                        )
                      }
                      placeholder="Enter the sentence with a blank space (_______) where the answer goes"
                      rows={3}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Type your sentence and click &quot;Insert Blank&quot; to
                      add a blank space where the answer should go, or type
                      _______ (7 underscores) directly.
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="correct-answer">Correct Answer</Label>
                    <Input
                      id="correct-answer"
                      value={currentQuestion.correctAnswer || ""}
                      onChange={(e) =>
                        updateQuestion(
                          currentQuestionIndex!,
                          "correctAnswer",
                          e.target.value
                        )
                      }
                      placeholder={`Answer (max ${
                        questionGroup.wordLimit || 2
                      } words)`}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label htmlFor="image-url">Image URL (Optional)</Label>
                    <Input
                      id="image-url"
                      value={currentQuestion.imageUrl || ""}
                      onChange={(e) =>
                        updateQuestion(
                          currentQuestionIndex!,
                          "imageUrl",
                          e.target.value
                        )
                      }
                      placeholder="Enter optional image URL"
                      className="w-full"
                    />
                  </div>

                  {currentQuestion.imageUrl && (
                    <div className="border rounded-md p-2 mt-2 overflow-hidden">
                      <img
                        src={currentQuestion.imageUrl}
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

      {(questionGroup.questions || []).length === 0 && (
        <div className="text-center p-4 sm:p-10 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-2">No sentences added yet.</p>
          <Button onClick={addQuestion} className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add First Sentence
          </Button>
        </div>
      )}

      {(questionGroup.questions || []).length > 0 && (
        <Card className="p-4 bg-muted/30">
          <h3 className="text-lg font-medium mb-4">Preview</h3>
          <div className="space-y-4">
            {(questionGroup.questions || []).map((question, index) => (
              <div
                key={index}
                className="border-b pb-4 last:border-b-0 last:pb-0"
              >
                <div className="flex flex-wrap">
                  <div className="w-8 shrink-0 font-semibold">
                    {question.number}.
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="prose prose-sm break-words">
                      {question.sentenceWithBlank
                        .split("_______")
                        .map((part, i, arr) => (
                          <React.Fragment key={i}>
                            {part}
                            {i < arr.length - 1 && (
                              <span className="bg-primary/10 px-4 sm:px-8 mx-1 border-b-2 border-dashed border-primary/30 inline-block">
                                &nbsp;
                              </span>
                            )}
                          </React.Fragment>
                        ))}
                    </div>
                    {question.imageUrl && (
                      <div className="mt-2 overflow-hidden">
                        <img
                          src={question.imageUrl}
                          alt={`Visual for question ${question.number}`}
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
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
