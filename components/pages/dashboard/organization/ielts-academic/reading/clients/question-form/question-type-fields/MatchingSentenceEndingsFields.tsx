"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash, ArrowRight } from "lucide-react";
import { MatchingSentenceEndingsGroup } from "@/types/exam/ielts-academic/reading/question/question";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define specific types for this component
interface SentenceEndingQuestion {
  number: number;
  sentenceStart: string;
  correctEnding: string;
  [key: string]: unknown; // Add index signature for compatibility
}

interface SentenceEnding {
  label: string;
  text: string;
}

interface MatchingSentenceEndingsFieldsProps {
  questionGroup: MatchingSentenceEndingsGroup;
  updateQuestionGroup: (data: Partial<MatchingSentenceEndingsGroup>) => void;
}

export default function MatchingSentenceEndingsFields({
  questionGroup,
  updateQuestionGroup,
}: MatchingSentenceEndingsFieldsProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<
    number | null
  >(questionGroup.questions?.length ? 0 : null);

  // Initialize endings if not present
  React.useEffect(() => {
    if (!questionGroup.endings || questionGroup.endings.length === 0) {
      updateQuestionGroup({
        endings: [
          { label: "A", text: "" },
          { label: "B", text: "" },
          { label: "C", text: "" },
          { label: "D", text: "" },
          { label: "E", text: "" },
        ],
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

  // Ending management
  const addEnding = () => {
    // Create a default array if endings doesn't exist
    const currentEndings = questionGroup.endings || [];

    // Get the last label or default to '@' (because we'll add 1 to get 'A')
    const lastLabel =
      currentEndings.length > 0
        ? currentEndings[currentEndings.length - 1]?.label
        : "@"; // Use @ because the next char will be A

    // Calculate next label (next character in alphabet)
    const nextLabel = String.fromCharCode(lastLabel.charCodeAt(0) + 1);

    // Create new array with the new ending
    const updatedEndings = [...currentEndings, { label: nextLabel, text: "" }];

    // Update the question group
    updateQuestionGroup({
      endings: updatedEndings,
    });
  };

  const updateEnding = (
    index: number,
    field: keyof SentenceEnding,
    value: string
  ) => {
    if (!questionGroup.endings) return;

    const updatedEndings = [...questionGroup.endings];
    updatedEndings[index] = {
      ...updatedEndings[index],
      [field]: value,
    };

    updateQuestionGroup({ endings: updatedEndings });
  };

  const deleteEnding = (index: number) => {
    if (!questionGroup.endings) return;

    const updatedEndings = [...questionGroup.endings];
    updatedEndings.splice(index, 1);

    // Relabel the endings
    updatedEndings.forEach((ending, i) => {
      ending.label = String.fromCharCode(65 + i); // A, B, C...
    });

    updateQuestionGroup({ endings: updatedEndings });

    // Update any questions that reference this ending
    const deletedLabel = String.fromCharCode(65 + index);
    const updatedQuestions = questionGroup.questions.map((question) => {
      if (question.correctEnding === deletedLabel) {
        return { ...question, correctEnding: "none" };
      } else if (
        question.correctEnding &&
        question.correctEnding.charCodeAt(0) > deletedLabel.charCodeAt(0)
      ) {
        // Adjust references to endings after the deleted one
        return {
          ...question,
          correctEnding: String.fromCharCode(
            question.correctEnding.charCodeAt(0) - 1
          ),
        };
      }
      return question;
    });

    updateQuestionGroup({ questions: updatedQuestions });
  };

  // Question (sentence start) management
  const addQuestion = () => {
    if (!questionGroup.questions) return;

    const newQuestion: SentenceEndingQuestion = {
      number: questionGroup.questions.length + 1,
      sentenceStart: "",
      correctEnding: "",
    };

    const updatedQuestions = [...questionGroup.questions, newQuestion];
    updateQuestionGroup({ questions: updatedQuestions });
    setCurrentQuestionIndex(updatedQuestions.length - 1);
  };

  const updateQuestion = (
    index: number,
    field: keyof SentenceEndingQuestion,
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
            Example: &quot;Complete each sentence with the correct ending, A-H,
            from the box below.&quot;
          </p>
        </div>

        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-0">
              <h3 className="text-lg font-medium">Sentence Endings</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={addEnding}
                className="w-full sm:w-auto"
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Add Ending
              </Button>
            </div>

            <div className="space-y-3">
              {(questionGroup.endings || []).map((ending, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    {ending.label}
                  </div>
                  <Input
                    value={ending.text}
                    onChange={(e) =>
                      updateEnding(index, "text", e.target.value)
                    }
                    placeholder={`Ending ${ending.label}`}
                    className="flex-grow w-full"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0"
                    onClick={() => deleteEnding(index)}
                    disabled={(questionGroup.endings?.length || 0) <= 2}
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
        <h3 className="text-lg font-medium">Sentence Starts</h3>
        <Button
          variant="outline"
          onClick={addQuestion}
          disabled={!questionGroup.endings?.length}
          className="w-full sm:w-auto"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Sentence
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
                    {question.sentenceStart || "(No text entered)"}
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
                    <Label htmlFor="sentence-start">Sentence Start</Label>
                    <Textarea
                      id="sentence-start"
                      value={
                        questionGroup.questions[currentQuestionIndex]
                          .sentenceStart
                      }
                      onChange={(e) =>
                        updateQuestion(
                          currentQuestionIndex,
                          "sentenceStart",
                          e.target.value
                        )
                      }
                      placeholder="Enter the beginning of the sentence"
                      rows={3}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label htmlFor="correct-ending">Correct Ending</Label>
                    <Select
                      value={
                        questionGroup.questions[currentQuestionIndex]
                          .correctEnding || "none"
                      }
                      onValueChange={(value) =>
                        updateQuestion(
                          currentQuestionIndex,
                          "correctEnding",
                          value
                        )
                      }
                    >
                      <SelectTrigger id="correct-ending" className="w-full">
                        <SelectValue placeholder="Select correct ending" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {(questionGroup.endings || []).map((ending) => (
                          <SelectItem key={ending.label} value={ending.label}>
                            {ending.label}: {ending.text}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {questionGroup.questions[currentQuestionIndex]
                    .correctEnding &&
                    questionGroup.questions[currentQuestionIndex]
                      .correctEnding !== "none" && (
                      <div className="mt-4 bg-muted/30 p-3 rounded-md">
                        <p className="text-sm font-medium mb-2">Preview:</p>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-0">
                          <span className="break-words">
                            {
                              questionGroup.questions[currentQuestionIndex]
                                .sentenceStart
                            }
                          </span>
                          <ArrowRight className="hidden sm:block mx-2 h-4 w-4 text-muted-foreground" />
                          <span className="font-medium break-words">
                            {questionGroup.endings?.find(
                              (e) =>
                                e.label ===
                                questionGroup.questions[currentQuestionIndex]
                                  .correctEnding
                            )?.text || ""}
                          </span>
                        </div>
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
            {!questionGroup.endings?.length
              ? "Please add sentence endings first."
              : "No sentence starts added yet."}
          </p>
          {(questionGroup.endings?.length || 0) > 0 && (
            <Button onClick={addQuestion} className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add First Sentence
            </Button>
          )}
        </div>
      )}

      {questionGroup.questions.length > 0 &&
        questionGroup.endings &&
        questionGroup.endings.length > 0 && (
          <Card className="p-4 bg-muted/30">
            <h3 className="text-lg font-medium mb-4">Preview</h3>

            <div className="space-y-6">
              <div className="space-y-4">
                {questionGroup.questions.map((question, index) => (
                  <div key={index} className="flex">
                    <div className="w-8 shrink-0 font-semibold">
                      {question.number}.
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium break-words">
                        {question.sentenceStart}
                      </div>
                      {question.correctEnding && (
                        <div className="text-sm text-muted-foreground mt-1">
                          Answer: {question.correctEnding}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Endings:</h4>
                <div className="grid grid-cols-1 gap-2">
                  {questionGroup.endings.map((ending) => (
                    <div key={ending.label} className="flex">
                      <div className="w-8 shrink-0 font-semibold">
                        {ending.label}
                      </div>
                      <div className="flex-1 min-w-0 break-words">
                        {ending.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}
    </div>
  );
}
