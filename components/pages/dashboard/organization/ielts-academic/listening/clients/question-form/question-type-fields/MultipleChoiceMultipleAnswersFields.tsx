import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2 } from "lucide-react";
import { ListeningMultipleChoiceMultipleAnswersGroup } from "@/types/exam/ielts-academic/listening/listening";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MultipleChoiceMultipleAnswersFieldsProps {
  questionGroup: ListeningMultipleChoiceMultipleAnswersGroup;
  updateQuestionGroup: (
    data: Partial<ListeningMultipleChoiceMultipleAnswersGroup>
  ) => void;
}

export default function MultipleChoiceMultipleAnswersFields({
  questionGroup,
  updateQuestionGroup,
}: MultipleChoiceMultipleAnswersFieldsProps) {
  const addQuestion = () => {
    const nextNumber =
      questionGroup.questions.length > 0
        ? Math.max(...questionGroup.questions.map((q) => q.number)) + 1
        : 1;

    updateQuestionGroup({
      questions: [
        ...questionGroup.questions,
        {
          number: nextNumber,
          question: "",
          answers: [],
        },
      ],
    });
  };

  const updateQuestion = (
    index: number,
    data: Partial<{
      number: number;
      question: string;
      answers: string[];
    }>
  ) => {
    const updatedQuestions = [...questionGroup.questions];
    updatedQuestions[index] = { ...updatedQuestions[index], ...data };
    updateQuestionGroup({ questions: updatedQuestions });
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = [...questionGroup.questions];
    updatedQuestions.splice(index, 1);
    updateQuestionGroup({ questions: updatedQuestions });
  };

  const addOption = () => {
    const optionLetter = questionGroup.options?.length || 0;
    const defaultOption = `Option ${String.fromCharCode(65 + optionLetter)}`;

    if (!questionGroup.options) {
      updateQuestionGroup({ options: [defaultOption] });
      return;
    }
    updateQuestionGroup({ options: [...questionGroup.options, defaultOption] });
  };

  const updateOption = (index: number, value: string) => {
    if (!questionGroup.options) return;

    const newOptions = [...questionGroup.options];
    newOptions[index] = value || `Option ${String.fromCharCode(65 + index)}`; // Ensure no empty values
    updateQuestionGroup({ options: newOptions });
  };

  const removeOption = (index: number) => {
    if (!questionGroup.options) return;

    const newOptions = [...questionGroup.options];
    newOptions.splice(index, 1);
    updateQuestionGroup({ options: newOptions });
  };

  const toggleAnswer = (questionIndex: number, answer: string) => {
    if (!answer) return; // Skip empty options

    const question = questionGroup.questions[questionIndex];
    const answers = question.answers || [];

    if (answers.includes(answer)) {
      // Remove the answer
      updateQuestion(questionIndex, {
        answers: answers.filter((a) => a !== answer),
      });
    } else {
      // Add the answer
      updateQuestion(questionIndex, {
        answers: [...answers, answer],
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">
          Multiple Choice (Multiple Answers)
        </h3>
        <div className="border p-4 rounded-md space-y-4 mb-4">
          <Label>Common Options</Label>
          <div className="space-y-2">
            {(questionGroup.options || []).map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-6 h-6 flex items-center justify-center border rounded-full">
                  {String.fromCharCode(65 + index)}
                </div>
                <Input
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + index)}`}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeOption(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button onClick={addOption} variant="outline" size="sm">
            <PlusCircle className="h-4 w-4 mr-1" /> Add Option
          </Button>
        </div>

        <div className="flex justify-between items-center">
          <div className="space-x-2">
            <Label htmlFor="required-answers">Required Answers:</Label>
            <Select
              value={questionGroup.answersRequired?.toString() || "2"}
              onValueChange={(value) =>
                updateQuestionGroup({
                  answersRequired: parseInt(value) as 2 | 3,
                })
              }
            >
              <SelectTrigger id="required-answers" className="w-[100px]">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={addQuestion} variant="outline" size="sm">
            <PlusCircle className="h-4 w-4 mr-1" /> Add Question
          </Button>
        </div>
      </div>

      {questionGroup.questions.map((question, qIndex) => (
        <div key={qIndex} className="border p-4 rounded-md space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Question {question.number}</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeQuestion(qIndex)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div>
            <Label htmlFor={`question-${qIndex}`}>Question</Label>
            <Input
              id={`question-${qIndex}`}
              value={question.question}
              onChange={(e) =>
                updateQuestion(qIndex, { question: e.target.value })
              }
              placeholder="Enter your question"
            />
          </div>

          <div className="space-y-2">
            <Label>
              Correct Answers (Select {questionGroup.answersRequired || 2})
            </Label>
            {(questionGroup.options || []).map((option, oIndex) =>
              option ? (
                <div key={oIndex} className="flex items-center gap-2">
                  <Checkbox
                    id={`q${qIndex}-opt${oIndex}`}
                    checked={question.answers?.includes(option) || false}
                    onCheckedChange={() => toggleAnswer(qIndex, option)}
                  />
                  <Label htmlFor={`q${qIndex}-opt${oIndex}`}>
                    {String.fromCharCode(65 + oIndex)}: {option}
                  </Label>
                </div>
              ) : null
            )}
          </div>
        </div>
      ))}

      {questionGroup.questions.length === 0 && (
        <div className="text-center py-8 border rounded-md bg-muted/20">
          <p>No questions added yet.</p>
          <Button onClick={addQuestion} variant="outline" className="mt-2">
            <PlusCircle className="h-4 w-4 mr-1" /> Add Question
          </Button>
        </div>
      )}
    </div>
  );
}
