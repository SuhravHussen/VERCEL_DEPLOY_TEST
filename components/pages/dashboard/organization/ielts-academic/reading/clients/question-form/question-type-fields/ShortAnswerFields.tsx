"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Trash } from "lucide-react";
import { useState, useEffect } from "react";
import { ShortAnswerGroup } from "@/types/exam/ielts-academic/reading/question/question";

// Define specific types for this component
interface ShortAnswerQuestion {
  number: number;
  question: string;
  correctAnswer: string;
  [key: string]: unknown; // For compatibility
}

interface ShortAnswerFieldsProps {
  questionGroup: ShortAnswerGroup;
  updateQuestionGroup: (data: Partial<ShortAnswerGroup>) => void;
}

export default function ShortAnswerFields({
  questionGroup,
  updateQuestionGroup,
}: ShortAnswerFieldsProps) {
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

  const currentQuestion =
    currentQuestionIndex !== null
      ? (questionGroup.questions || [])[currentQuestionIndex]
      : null;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="instruction">Instructions</Label>
          <Textarea
            id="instruction"
            placeholder="Enter instructions for this question group"
            value={questionGroup.instruction}
            onChange={handleInstructionChange}
            className="min-h-[100px]"
          />
          <p className="text-sm text-muted-foreground">
            Example: &quot;Answer the questions below. Write NO MORE THAN THREE
            WORDS for each answer.&quot;
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="word-limit">Word Limit</Label>
          <Select
            value={(questionGroup.maxWords || 3).toString()}
            onValueChange={handleWordLimitChange}
          >
            <SelectTrigger id="word-limit">
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

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Questions</h3>
        <Button variant="outline" onClick={addQuestion}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Question
        </Button>
      </div>

      {(questionGroup.questions || []).length > 0 && (
        <div className="flex">
          <div className="w-1/4 border-r pr-4">
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
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {question.question || "(No question text)"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="w-3/4 pl-4">
            {currentQuestion && (
              <Card className="p-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="question-text">Question Text</Label>
                    <Textarea
                      id="question-text"
                      value={currentQuestion.question}
                      onChange={(e) =>
                        updateQuestion(
                          currentQuestionIndex!,
                          "question",
                          e.target.value
                        )
                      }
                      placeholder="Enter the question text"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="answer-text">Correct Answer</Label>
                    <Input
                      id="answer-text"
                      value={currentQuestion.correctAnswer || ""}
                      onChange={(e) =>
                        updateQuestion(
                          currentQuestionIndex!,
                          "correctAnswer",
                          e.target.value
                        )
                      }
                      placeholder={`Answer (max ${
                        questionGroup.maxWords || 3
                      } words)`}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Correct answer will be used for auto-grading. Multiple
                      correct answers can be separated by a semicolon (;).
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {(questionGroup.questions || []).length === 0 && (
        <div className="text-center p-10 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-2">No questions added yet.</p>
          <Button onClick={addQuestion}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        </div>
      )}
    </div>
  );
}
