"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash } from "lucide-react";
import { MultipleChoiceMultipleAnswersGroup } from "@/types/exam/ielts-academic/reading/question/question";
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define specific types for this component
interface MultipleChoiceMultiAnswerQuestion {
  number: number;
  question: string;
  answers: string[];
  [key: string]: unknown; // For compatibility
}

interface MultipleChoiceMultipleAnswersFieldsProps {
  questionGroup: MultipleChoiceMultipleAnswersGroup;
  updateQuestionGroup: (
    data: Partial<MultipleChoiceMultipleAnswersGroup>
  ) => void;
}

export default function MultipleChoiceMultipleAnswersFields({
  questionGroup,
  updateQuestionGroup,
}: MultipleChoiceMultipleAnswersFieldsProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<
    number | null
  >(questionGroup.questions?.length ? 0 : null);

  // Initialize questions and options if not present
  useEffect(() => {
    if (!questionGroup.questions) {
      updateQuestionGroup({ questions: [] });
    }
    if (!questionGroup.options) {
      updateQuestionGroup({ options: ["", "", "", "", ""] });
    }
    if (!questionGroup.answersRequired) {
      updateQuestionGroup({ answersRequired: 2 });
    }
  }, [questionGroup, updateQuestionGroup]);

  const handleInstructionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    updateQuestionGroup({ instruction: e.target.value });
  };

  // Initialize or update answersRequired
  const updateAnswersRequired = (value: string) => {
    updateQuestionGroup({
      answersRequired: parseInt(value) as 2 | 3,
    });
  };

  // Update the options at the group level
  const addOption = () => {
    const options = [...(questionGroup.options || [])];
    options.push("");
    updateQuestionGroup({ options });
  };

  const updateOption = (index: number, value: string) => {
    const options = [...(questionGroup.options || [])];
    options[index] = value;
    updateQuestionGroup({ options });
  };

  const deleteOption = (index: number) => {
    const options = [...(questionGroup.options || [])];
    options.splice(index, 1);
    updateQuestionGroup({ options });

    // Update any answers that reference this option
    const updatedQuestions = [...(questionGroup.questions || [])];
    updatedQuestions.forEach((question) => {
      const optionLetter = String.fromCharCode(65 + index);
      question.answers = (question.answers || []).filter(
        (ans) => ans !== optionLetter
      );

      // Adjust any answers that point to options after the deleted one
      question.answers = question.answers.map((ans) => {
        const charCode = ans.charCodeAt(0);
        if (charCode > 65 + index) {
          return String.fromCharCode(charCode - 1);
        }
        return ans;
      });
    });

    updateQuestionGroup({ questions: updatedQuestions });
  };

  const addQuestion = () => {
    const newQuestion: MultipleChoiceMultiAnswerQuestion = {
      number: (questionGroup.questions || []).length + 1,
      question: "",
      answers: [],
    };

    const updatedQuestions = [...(questionGroup.questions || []), newQuestion];
    updateQuestionGroup({ questions: updatedQuestions });
    setCurrentQuestionIndex(updatedQuestions.length - 1);
  };

  const updateQuestion = (
    index: number,
    field: keyof MultipleChoiceMultiAnswerQuestion,
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

  const toggleAnswer = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...(questionGroup.questions || [])];
    const question = updatedQuestions[questionIndex];
    if (!question) return;

    const optionLetter = String.fromCharCode(65 + optionIndex);
    let answers = [...(question.answers || [])];

    if (answers.includes(optionLetter)) {
      answers = answers.filter((a) => a !== optionLetter);
    } else {
      answers.push(optionLetter);
      // Limit to answersRequired if set
      if (
        questionGroup.answersRequired &&
        answers.length > questionGroup.answersRequired
      ) {
        answers.shift(); // Remove the first (oldest) element
      }
    }

    question.answers = answers;
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
          Example: &quot;Choose TWO letters, A-E. Which TWO statements are true
          according to the text?&quot;
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="answers-required">Number of Answers Required</Label>
          <Select
            value={String(questionGroup.answersRequired || 2)}
            onValueChange={updateAnswersRequired}
          >
            <SelectTrigger id="answers-required" className="w-full sm:w-48">
              <SelectValue placeholder="Select number" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">TWO answers</SelectItem>
              <SelectItem value="3">THREE answers</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-0">
              <h3 className="text-lg font-medium">Common Options (A-E)</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={addOption}
                disabled={(questionGroup.options?.length || 0) >= 10}
                className="w-full sm:w-auto"
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Add Option
              </Button>
            </div>

            <div className="space-y-3">
              {(questionGroup.options || []).map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <Input
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    className="flex-grow w-full"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0"
                    onClick={() => deleteOption(index)}
                    disabled={(questionGroup.options?.length || 0) <= 3}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {!questionGroup.options?.length && (
                <div className="text-center p-4 border-2 border-dashed rounded-md">
                  <p className="text-muted-foreground mb-2">
                    No options added yet.
                  </p>
                  <Button
                    onClick={addOption}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add First Option
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <h3 className="text-lg font-medium">Questions</h3>
        <Button
          variant="outline"
          onClick={addQuestion}
          disabled={!questionGroup.options?.length}
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
            {currentQuestion && (questionGroup.options?.length || 0) > 0 && (
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
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label className="mb-2 block">
                      Correct Answers (Select{" "}
                      {questionGroup.answersRequired || 2})
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {(questionGroup.options || []).map(
                        (option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`option-${currentQuestionIndex}-${optionIndex}`}
                              checked={(currentQuestion.answers || []).includes(
                                String.fromCharCode(65 + optionIndex)
                              )}
                              onCheckedChange={() =>
                                toggleAnswer(currentQuestionIndex!, optionIndex)
                              }
                            />
                            <Label
                              htmlFor={`option-${currentQuestionIndex}-${optionIndex}`}
                              className="cursor-pointer flex-1"
                            >
                              <span className="font-semibold mr-2">
                                {String.fromCharCode(65 + optionIndex)}.
                              </span>
                              {option}
                            </Label>
                          </div>
                        )
                      )}
                    </div>
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
            {!questionGroup.options?.length
              ? "Please add options first before creating questions."
              : "No questions added yet."}
          </p>
          {(questionGroup.options?.length || 0) > 0 && (
            <Button onClick={addQuestion} className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add First Question
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
