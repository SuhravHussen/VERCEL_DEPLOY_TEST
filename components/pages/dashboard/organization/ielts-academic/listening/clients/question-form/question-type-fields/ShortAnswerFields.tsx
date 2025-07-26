import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2 } from "lucide-react";
import { ListeningShortAnswerGroup } from "@/types/exam/ielts-academic/listening/listening";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

interface ShortAnswerQuestion {
  number: number;
  question: string;
  correctAnswer: string;
}

interface ShortAnswerFieldsProps {
  questionGroup: ListeningShortAnswerGroup;
  updateQuestionGroup: (data: Partial<ListeningShortAnswerGroup>) => void;
}

export default function ShortAnswerFields({
  questionGroup,
  updateQuestionGroup,
}: ShortAnswerFieldsProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<
    number | null
  >(questionGroup.questions?.length ? 0 : null);

  const wordLimitOptions = [
    { value: "1", label: "ONE WORD ONLY" },
    { value: "2", label: "NO MORE THAN TWO WORDS" },
    { value: "3", label: "NO MORE THAN THREE WORDS" },
    { value: "4", label: "NO MORE THAN FOUR WORDS" },
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
      maxWords: parseInt(value),
      wordLimitText:
        wordLimitOptions.find((opt) => opt.value === value)?.label || "",
    });
  };

  const addQuestion = () => {
    const newQuestion: ShortAnswerQuestion = {
      number: (questionGroup.questions || []).length + 1,
      question: "",
      correctAnswer: "",
    };

    const updatedQuestions = [...(questionGroup.questions || []), newQuestion];
    updateQuestionGroup({ questions: updatedQuestions });
    setCurrentQuestionIndex(updatedQuestions.length - 1);
  };

  const updateQuestion = (
    index: number,
    field: keyof ShortAnswerQuestion,
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
            Example: &quot;Answer the following questions. Write NO MORE THAN
            THREE WORDS for each answer.&quot;
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="max-words">Maximum Words</Label>
          <Select
            value={(questionGroup.maxWords || 3).toString()}
            onValueChange={handleWordLimitChange}
          >
            <SelectTrigger id="max-words" className="w-full sm:w-[240px]">
              <SelectValue placeholder="Select maximum words" />
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
        <h3 className="text-lg font-medium">Questions</h3>
        <Button
          variant="outline"
          onClick={addQuestion}
          className="w-full sm:w-auto"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Question
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
                      Question {question.number}
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
                    {question.question || "(No question text)"}
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
                    <Label htmlFor="question-text">Question</Label>
                    <Textarea
                      id="question-text"
                      value={
                        (questionGroup.questions || [])[currentQuestionIndex]
                          ?.question || ""
                      }
                      onChange={(e) =>
                        updateQuestion(
                          currentQuestionIndex,
                          "question",
                          e.target.value
                        )
                      }
                      placeholder="Enter the question"
                      rows={3}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label htmlFor="correct-answer">Correct Answer</Label>
                    <Input
                      id="correct-answer"
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
          <p className="text-muted-foreground mb-2">No questions added yet.</p>
          <Button onClick={addQuestion} className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add First Question
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
                    {question.question || "(No question text)"}
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
