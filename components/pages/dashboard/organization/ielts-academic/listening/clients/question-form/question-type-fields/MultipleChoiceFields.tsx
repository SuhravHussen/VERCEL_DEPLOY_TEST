import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2 } from "lucide-react";
import { ListeningMultipleChoiceGroup } from "@/types/exam/ielts-academic/listening/listening";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface MultipleChoiceQuestion {
  number: number;
  question: string;
  options: string[];
  answer: string;
}

interface MultipleChoiceFieldsProps {
  questionGroup: ListeningMultipleChoiceGroup;
  updateQuestionGroup: (data: Partial<ListeningMultipleChoiceGroup>) => void;
}

export default function MultipleChoiceFields({
  questionGroup,
  updateQuestionGroup,
}: MultipleChoiceFieldsProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<
    number | null
  >(questionGroup.questions?.length ? 0 : null);

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

  const addQuestion = () => {
    const nextNumber =
      (questionGroup.questions || []).length > 0
        ? Math.max(...(questionGroup.questions || []).map((q) => q.number)) + 1
        : 1;

    const newQuestion: MultipleChoiceQuestion = {
      number: nextNumber,
      question: "",
      options: ["Option A", "Option B", "Option C", "Option D"],
      answer: "",
    };

    const updatedQuestions = [...(questionGroup.questions || []), newQuestion];
    updateQuestionGroup({ questions: updatedQuestions });
    setCurrentQuestionIndex(updatedQuestions.length - 1);
  };

  const updateQuestion = (
    index: number,
    field: keyof MultipleChoiceQuestion,
    value: string | string[]
  ) => {
    const updatedQuestions = [...(questionGroup.questions || [])];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value,
    };

    updateQuestionGroup({ questions: updatedQuestions });
  };

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const updatedQuestions = [...(questionGroup.questions || [])];
    const options = [...updatedQuestions[questionIndex].options];
    options[optionIndex] =
      value || `Option ${String.fromCharCode(65 + optionIndex)}`; // Ensure no empty strings
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options,
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

  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...(questionGroup.questions || [])];
    const options = [...updatedQuestions[questionIndex].options];
    const newOptionLetter = String.fromCharCode(65 + options.length);
    options.push(`Option ${newOptionLetter}`);
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options,
    };
    updateQuestionGroup({ questions: updatedQuestions });
  };

  const deleteOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...(questionGroup.questions || [])];
    const options = [...updatedQuestions[questionIndex].options];

    // Don't allow deleting if only 2 options remain
    if (options.length <= 2) return;

    // If deleting the option that was selected as answer, reset the answer
    if (updatedQuestions[questionIndex].answer === options[optionIndex]) {
      updatedQuestions[questionIndex].answer = "";
    }

    options.splice(optionIndex, 1);
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options,
    };
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
            value={questionGroup.instruction || ""}
            onChange={handleInstructionChange}
            className="min-h-[100px] w-full"
          />
          <p className="text-sm text-muted-foreground">
            Example: &quot;Choose the correct letter, A, B, C or D.&quot;
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <h3 className="text-lg font-medium">Multiple Choice Questions</h3>
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
                      placeholder="Enter your question"
                      rows={3}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label>Options</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addOption(currentQuestionIndex)}
                      >
                        <PlusCircle className="h-4 w-4 mr-1" />
                        Add Option
                      </Button>
                    </div>

                    {(questionGroup.questions || [])[
                      currentQuestionIndex
                    ]?.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-2">
                        <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center border rounded-full">
                          {String.fromCharCode(65 + oIndex)}
                        </div>
                        <Input
                          value={option}
                          onChange={(e) =>
                            updateOption(
                              currentQuestionIndex,
                              oIndex,
                              e.target.value
                            )
                          }
                          placeholder={`Option ${String.fromCharCode(
                            65 + oIndex
                          )}`}
                          className="flex-grow"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            deleteOption(currentQuestionIndex, oIndex)
                          }
                          disabled={
                            (questionGroup.questions || [])[
                              currentQuestionIndex
                            ]?.options.length <= 2
                          }
                          className="flex-shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div>
                    <Label htmlFor="correct-answer">Correct Answer</Label>
                    <Select
                      value={
                        (questionGroup.questions || [])[currentQuestionIndex]
                          ?.answer || undefined
                      }
                      onValueChange={(value) =>
                        updateQuestion(currentQuestionIndex, "answer", value)
                      }
                    >
                      <SelectTrigger id="correct-answer" className="w-full">
                        <SelectValue placeholder="Select correct answer" />
                      </SelectTrigger>
                      <SelectContent>
                        {(questionGroup.questions || [])[
                          currentQuestionIndex
                        ]?.options.map((option, oIndex) =>
                          option ? (
                            <SelectItem key={oIndex} value={option}>
                              {String.fromCharCode(65 + oIndex)}: {option}
                            </SelectItem>
                          ) : null
                        )}
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
          <p className="text-muted-foreground mb-2">No questions added yet.</p>
          <Button onClick={addQuestion} className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add First Question
          </Button>
        </div>
      )}

      {(questionGroup.questions || []).length > 0 && (
        <Card className="p-4 bg-muted/30">
          <h3 className="text-lg font-medium mb-4">Questions Preview</h3>

          <div className="space-y-8">
            {(questionGroup.questions || []).map((question, qIndex) => (
              <div key={qIndex} className="space-y-4">
                <div className="flex space-x-2">
                  <div className="w-8 shrink-0 font-semibold">
                    {question.number}.
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">
                      {question.question || "(No question text)"}
                    </div>

                    <div className="mt-2 space-y-1 ml-2">
                      {question.options.map((option, oIndex) => {
                        const isCorrect = question.answer === option;

                        return (
                          <div
                            key={oIndex}
                            className={`flex items-center gap-2 ${
                              isCorrect ? "font-medium text-primary" : ""
                            }`}
                          >
                            <div
                              className={`w-5 h-5 flex-shrink-0 flex items-center justify-center rounded-full text-xs ${
                                isCorrect
                                  ? "bg-primary text-primary-foreground"
                                  : "border"
                              }`}
                            >
                              {String.fromCharCode(65 + oIndex)}
                            </div>
                            <span>{option}</span>
                            {isCorrect && (
                              <span className="text-sm text-muted-foreground ml-2">
                                (Correct)
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
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
