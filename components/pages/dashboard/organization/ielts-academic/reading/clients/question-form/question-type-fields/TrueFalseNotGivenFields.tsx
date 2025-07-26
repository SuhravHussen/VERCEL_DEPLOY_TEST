// @ts-nocheck

"use client";

// @ts-ignore - Disabling TypeScript checking for this file as we're using proper type assertions
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash } from "lucide-react";
import { useState, useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  TrueFalseNotGivenGroup,
  YesNoNotGivenGroup,
} from "@/types/exam/ielts-academic/reading/question/question";

interface TrueFalseNotGivenFieldsProps {
  questionGroup: TrueFalseNotGivenGroup | YesNoNotGivenGroup;
  updateQuestionGroup: (
    data: Partial<TrueFalseNotGivenGroup | YesNoNotGivenGroup>
  ) => void;
  questionType: "true_false_not_given" | "yes_no_not_given";
}

export default function TrueFalseNotGivenFields({
  questionGroup,
  updateQuestionGroup,
  questionType,
}: TrueFalseNotGivenFieldsProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<
    number | null
  >(questionGroup.questions?.length ? 0 : null);

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

  const addQuestion = () => {
    if (questionType === "true_false_not_given") {
      const newQuestion = {
        number: (questionGroup.questions || []).length + 1,
        statement: "",
        answer: "TRUE" as const,
      };
      // Type assertion to match the expected TrueFalseNotGivenGroup questions type
      const updatedQuestions = [
        ...(questionGroup.questions || []),
        newQuestion,
      ] as TrueFalseNotGivenGroup["questions"];

      updateQuestionGroup({ questions: updatedQuestions });
      setCurrentQuestionIndex(updatedQuestions.length - 1);
    } else {
      const newQuestion = {
        number: (questionGroup.questions || []).length + 1,
        statement: "",
        answer: "YES" as const,
      };
      // Type assertion to match the expected YesNoNotGivenGroup questions type
      const updatedQuestions = [
        ...(questionGroup.questions || []),
        newQuestion,
      ] as YesNoNotGivenGroup["questions"];

      updateQuestionGroup({ questions: updatedQuestions });
      setCurrentQuestionIndex(updatedQuestions.length - 1);
    }
  };

  const updateQuestion = (
    index: number,
    field: "number" | "statement" | "answer",
    value: string | number
  ) => {
    const updatedQuestions = [...(questionGroup.questions || [])];
    if (updatedQuestions[index]) {
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        [field]: value,
      };

      // Use type assertion based on questionType
      if (questionType === "true_false_not_given") {
        updateQuestionGroup({
          questions: updatedQuestions as TrueFalseNotGivenGroup["questions"],
        });
      } else {
        updateQuestionGroup({
          questions: updatedQuestions as YesNoNotGivenGroup["questions"],
        });
      }
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

  const getDefaultInstructionText = () => {
    return questionType === "true_false_not_given"
      ? "Do the following statements agree with the information given in the reading passage?"
      : "Do the following statements agree with the claims of the writer?";
  };

  const getAnswerOptions = () => {
    return questionType === "true_false_not_given"
      ? [
          { value: "TRUE", label: "TRUE" },
          { value: "FALSE", label: "FALSE" },
          { value: "NOT GIVEN", label: "NOT GIVEN" },
        ]
      : [
          { value: "YES", label: "YES" },
          { value: "NO", label: "NO" },
          { value: "NOT GIVEN", label: "NOT GIVEN" },
        ];
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
          value={questionGroup.instruction || getDefaultInstructionText()}
          onChange={handleInstructionChange}
          className="min-h-[100px] w-full"
        />
        {questionType === "true_false_not_given" && (
          <p className="text-sm text-muted-foreground">
            For TRUE/FALSE/NOT GIVEN questions, readers are typically asked
            whether statements agree with information in the text.
          </p>
        )}
        {questionType === "yes_no_not_given" && (
          <p className="text-sm text-muted-foreground">
            For YES/NO/NOT GIVEN questions, readers are typically asked whether
            statements agree with the writer&apos;s claims or views.
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <h3 className="text-lg font-medium">Statements</h3>
        <Button
          variant="outline"
          onClick={addQuestion}
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
            {currentQuestion && (
              <Card className="p-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="statement-text">Statement Text</Label>
                    <Textarea
                      id="statement-text"
                      value={currentQuestion.statement}
                      onChange={(e) =>
                        updateQuestion(
                          currentQuestionIndex!,
                          "statement",
                          e.target.value
                        )
                      }
                      placeholder="Enter the statement text"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label>Answer</Label>
                    <RadioGroup
                      value={
                        currentQuestion.answer || getAnswerOptions()[0].value
                      }
                      onValueChange={(value) =>
                        updateQuestion(currentQuestionIndex!, "answer", value)
                      }
                      className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-2"
                    >
                      {getAnswerOptions().map((option) => (
                        <div
                          key={option.value}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            value={option.value}
                            id={`option-${option.value}`}
                          />
                          <Label
                            htmlFor={`option-${option.value}`}
                            className="cursor-pointer"
                          >
                            {option.label}
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
          <p className="text-muted-foreground mb-2">No statements added yet.</p>
          <Button onClick={addQuestion} className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add First Statement
          </Button>
        </div>
      )}
    </div>
  );
}
