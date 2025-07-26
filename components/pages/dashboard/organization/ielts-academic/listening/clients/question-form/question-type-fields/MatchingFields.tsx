import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2 } from "lucide-react";
import { ListeningMatchingGroup } from "@/types/exam/ielts-academic/listening/listening";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MatchingFieldsProps {
  questionGroup: ListeningMatchingGroup;
  updateQuestionGroup: (data: Partial<ListeningMatchingGroup>) => void;
}

export default function MatchingFields({
  questionGroup,
  updateQuestionGroup,
}: MatchingFieldsProps) {
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
          prompt: "",
          correctMatch: "",
        },
      ],
    });
  };

  const updateQuestion = (
    index: number,
    data: Partial<{
      number: number;
      prompt: string;
      correctMatch: string;
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
    const optionIndex = questionGroup.options?.length || 0;
    const defaultOption = `Option ${String.fromCharCode(65 + optionIndex)}`;

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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Matching Questions</h3>
        <div className="border p-4 rounded-md space-y-4">
          <div>
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              className="min-h-20"
              value={questionGroup.instruction || ""}
              onChange={(e) =>
                updateQuestionGroup({ instruction: e.target.value })
              }
              placeholder="Match the following names to the options below..."
            />
          </div>
        </div>

        {/* Options section */}
        <div className="border p-4 rounded-md space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Options (A, B, C, etc.)</h4>
            <Button onClick={addOption} variant="outline" size="sm">
              <PlusCircle className="h-4 w-4 mr-1" /> Add Option
            </Button>
          </div>

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

          {(!questionGroup.options || questionGroup.options.length === 0) && (
            <div className="text-center py-4">
              <p className="text-muted-foreground">No options added yet.</p>
              <Button onClick={addOption} variant="outline" className="mt-2">
                <PlusCircle className="h-4 w-4 mr-1" /> Add Option
              </Button>
            </div>
          )}
        </div>

        {/* Questions section */}
        <div className="flex justify-between items-center">
          <h4 className="font-medium">Matching Questions</h4>
          <Button onClick={addQuestion} variant="outline" size="sm">
            <PlusCircle className="h-4 w-4 mr-1" /> Add Question
          </Button>
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
              <Label htmlFor={`prompt-${qIndex}`}>Question Prompt</Label>
              <Textarea
                id={`prompt-${qIndex}`}
                value={question.prompt}
                onChange={(e) =>
                  updateQuestion(qIndex, { prompt: e.target.value })
                }
                placeholder="E.g., What did John say about..."
              />
            </div>

            <div>
              <Label htmlFor={`answer-${qIndex}`}>Correct Match</Label>
              <Select
                value={question.correctMatch || undefined}
                onValueChange={(value) =>
                  updateQuestion(qIndex, { correctMatch: value })
                }
              >
                <SelectTrigger id={`answer-${qIndex}`} className="w-full">
                  <SelectValue placeholder="Select correct option" />
                </SelectTrigger>
                <SelectContent>
                  {(questionGroup.options || []).map((option, oIndex) =>
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
    </div>
  );
}
