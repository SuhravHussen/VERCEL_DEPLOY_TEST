import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2 } from "lucide-react";
import { ListeningSentenceCompletionGroup } from "@/types/exam/ielts-academic/listening/listening";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

interface SentenceCompletionQuestion {
  number: number;
  sentenceWithBlank: string;
  correctAnswer: string;
}

interface SentenceCompletionFieldsProps {
  questionGroup: ListeningSentenceCompletionGroup;
  updateQuestionGroup: (
    data: Partial<ListeningSentenceCompletionGroup>
  ) => void;
}

export default function SentenceCompletionFields({
  questionGroup,
  updateQuestionGroup,
}: SentenceCompletionFieldsProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<
    number | null
  >(questionGroup.questions?.length ? 0 : null);

  const wordLimitOptions = [
    { value: "1", label: "ONE WORD ONLY" },
    { value: "2", label: "NO MORE THAN TWO WORDS" },
    { value: "3", label: "NO MORE THAN THREE WORDS" },
  ];

  // Initialize questions if not present
  React.useEffect(() => {
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
    const nextNumber = (questionGroup.questions || []).length + 1;

    const newQuestion: SentenceCompletionQuestion = {
      number: nextNumber,
      sentenceWithBlank: "",
      correctAnswer: "",
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

  const insertBlankAtCursor = (index: number) => {
    const textarea = document.getElementById(
      `sentence-${index}`
    ) as HTMLTextAreaElement;

    if (!textarea) return;

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const currentValue = textarea.value;
    const newValue =
      currentValue.substring(0, startPos) +
      " _______ " +
      currentValue.substring(endPos);

    updateQuestion(index, "sentenceWithBlank", newValue);

    // Set cursor position after the blank
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = startPos + 8; // Length of " _______ "
      textarea.selectionEnd = startPos + 8;
    }, 0);
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
            Example: &quot;Complete each sentence with the information you hear.
            Write NO MORE THAN THREE WORDS.&quot;
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="word-limit">Word Limit</Label>
          <Select
            value={(questionGroup.wordLimit || 3).toString()}
            onValueChange={handleWordLimitChange}
          >
            <SelectTrigger id="word-limit" className="w-full sm:w-[240px]">
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
          <Label htmlFor="word-limit-text">Word Limit Text</Label>
          <Input
            id="word-limit-text"
            value={questionGroup.wordLimitText || ""}
            onChange={(e) =>
              updateQuestionGroup({ wordLimitText: e.target.value })
            }
            placeholder="E.g., NO MORE THAN THREE WORDS"
          />
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
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {question.sentenceWithBlank || "(No sentence text)"}
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
                    <Label htmlFor={`sentence-${currentQuestionIndex}`}>
                      Sentence with blank (_______)
                    </Label>
                    <div className="relative">
                      <Textarea
                        id={`sentence-${currentQuestionIndex}`}
                        value={
                          (questionGroup.questions || [])[currentQuestionIndex]
                            ?.sentenceWithBlank || ""
                        }
                        onChange={(e) =>
                          updateQuestion(
                            currentQuestionIndex,
                            "sentenceWithBlank",
                            e.target.value
                          )
                        }
                        placeholder="The museum is located on _______ Street."
                        rows={3}
                        className="w-full"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="absolute right-2 top-2"
                        onClick={() =>
                          insertBlankAtCursor(currentQuestionIndex)
                        }
                      >
                        Insert Blank
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Use underscores (_______) to indicate the blank space.
                    </p>
                  </div>

                  <div>
                    <Label htmlFor={`answer-${currentQuestionIndex}`}>
                      Correct Answer
                    </Label>
                    <Input
                      id={`answer-${currentQuestionIndex}`}
                      value={
                        (questionGroup.questions || [])[currentQuestionIndex]
                          ?.correctAnswer || ""
                      }
                      onChange={(e) =>
                        updateQuestion(
                          currentQuestionIndex,
                          "correctAnswer",
                          e.target.value
                        )
                      }
                      placeholder="Enter the correct answer"
                      className="w-full"
                    />
                  </div>
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
              <div key={index} className="flex space-x-2">
                <div className="w-8 shrink-0 font-semibold">
                  {question.number}.
                </div>
                <div className="flex-1 min-w-0">
                  <div className="break-words">
                    {question.sentenceWithBlank || "(No sentence text)"}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    <span className="font-medium">Answer: </span>
                    {question.correctAnswer || "(No answer provided)"}
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
