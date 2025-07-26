"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash } from "lucide-react";
import { useState, useEffect } from "react";
import { MultipleChoiceGroup } from "@/types/exam/ielts-academic/reading/question/question";

interface MultipleChoiceFieldsProps {
  questionGroup: MultipleChoiceGroup;
  updateQuestionGroup: (data: Partial<MultipleChoiceGroup>) => void;
}

export default function MultipleChoiceFields({
  questionGroup,
  updateQuestionGroup,
}: MultipleChoiceFieldsProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<
    number | null
  >(questionGroup.questions?.length ? 0 : null);

  // Initialize questions if not present
  useEffect(() => {
    if (!questionGroup.questions) {
      updateQuestionGroup({
        questions: [],
      });
    }
  }, [questionGroup.questions, updateQuestionGroup]);

  const handleInstructionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    updateQuestionGroup({ instruction: e.target.value });
  };

  const addQuestion = () => {
    const newQuestion: MultipleChoiceGroup["questions"][number] = {
      number: (questionGroup.questions || []).length + 1,
      question: "",
      options: ["", "", "", ""],
      answer: "",
    };

    const updatedQuestions = [...(questionGroup.questions || []), newQuestion];
    updateQuestionGroup({ questions: updatedQuestions });
    setCurrentQuestionIndex(updatedQuestions.length - 1);
  };

  const updateQuestion = (
    index: number,
    field: keyof MultipleChoiceGroup["questions"][number],
    value: string | string[]
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

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const updatedQuestions = [...(questionGroup.questions || [])];
    const question = updatedQuestions[questionIndex];
    if (question) {
      const options = [...(question.options || [])];
      options[optionIndex] = value;
      question.options = options;
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

  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...(questionGroup.questions || [])];
    const question = updatedQuestions[questionIndex];
    if (question) {
      const options = [...(question.options || []), ""];
      question.options = options;
      updateQuestionGroup({ questions: updatedQuestions });
    }
  };

  const deleteOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...(questionGroup.questions || [])];
    const question = updatedQuestions[questionIndex];
    if (question) {
      const options = [...(question.options || [])];
      options.splice(optionIndex, 1);
      question.options = options;

      // Reset answer if the selected option is deleted
      const deletedOptionLetter = String.fromCharCode(65 + optionIndex);
      if (question.answer === deletedOptionLetter) {
        question.answer = "";
      }

      updateQuestionGroup({ questions: updatedQuestions });
    }
  };

  const currentQuestion =
    currentQuestionIndex !== null
      ? (questionGroup.questions || [])[currentQuestionIndex]
      : null;

  return (
    <div className="space-y-6 w-full max-w-full">
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
          Example: &quot;Choose the correct letter, A, B, C or D.&quot;
        </p>
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

          <div className="w-full sm:w-3/4 sm:pl-4">
            {currentQuestion && (
              <Card className="p-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="question-text">Question Text</Label>
                    <Input
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
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2 gap-2 sm:gap-0">
                      <Label>Options</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addOption(currentQuestionIndex!)}
                        disabled={(currentQuestion.options || []).length >= 6}
                        className="w-full sm:w-auto"
                      >
                        <PlusCircle className="h-3 w-3 mr-1" />
                        Add Option
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {(currentQuestion.options || []).map(
                        (option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className="flex items-center gap-2"
                          >
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              {String.fromCharCode(65 + optionIndex)}
                            </div>
                            <Input
                              value={option}
                              onChange={(e) =>
                                updateOption(
                                  currentQuestionIndex!,
                                  optionIndex,
                                  e.target.value
                                )
                              }
                              placeholder={`Option ${String.fromCharCode(
                                65 + optionIndex
                              )}`}
                              className="flex-grow w-full"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="flex-shrink-0"
                              onClick={() =>
                                deleteOption(currentQuestionIndex!, optionIndex)
                              }
                              disabled={
                                (currentQuestion.options || []).length <= 2
                              }
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <Label>Correct Answer</Label>
                    <RadioGroup
                      value={currentQuestion.answer}
                      onValueChange={(value) =>
                        updateQuestion(currentQuestionIndex!, "answer", value)
                      }
                      className="flex flex-wrap gap-4 mt-2"
                    >
                      {(currentQuestion.options || []).map((_, optionIndex) => (
                        <div
                          key={optionIndex}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            value={String.fromCharCode(65 + optionIndex)}
                            id={`option-${optionIndex}`}
                          />
                          <Label
                            htmlFor={`option-${optionIndex}`}
                            className="cursor-pointer"
                          >
                            {String.fromCharCode(65 + optionIndex)}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
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
    </div>
  );
}
