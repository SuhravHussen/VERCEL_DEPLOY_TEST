"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  IELTSReadingQuestionGroup,
  SummaryCompletionGroup,
} from "@/types/exam/ielts-academic/reading/question/question";

// Define the props interface
interface SummaryCompletionFieldsProps {
  questionGroup: IELTSReadingQuestionGroup;
  updateQuestionGroup: (data: Partial<IELTSReadingQuestionGroup>) => void;
}

export default function SummaryCompletionFields({
  questionGroup,
  updateQuestionGroup,
}: SummaryCompletionFieldsProps) {
  // Cast the questionGroup to SummaryCompletionGroup to access specific properties
  const summaryGroup = questionGroup as SummaryCompletionGroup;

  const [showOptions, setShowOptions] = useState(
    !!summaryGroup.options?.length
  );
  const [wordLimitOptions] = useState([
    { value: "1", label: "ONE WORD ONLY" },
    { value: "2", label: "NO MORE THAN TWO WORDS" },
    { value: "3", label: "NO MORE THAN THREE WORDS" },
  ]);

  const handleInstructionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    updateQuestionGroup({ instruction: e.target.value });
  };

  const handleSummaryTextChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    updateQuestionGroup({ summaryText: e.target.value });
  };

  const handleWordLimitChange = (value: string) => {
    updateQuestionGroup({
      wordLimit: parseInt(value),
      wordLimitText:
        wordLimitOptions.find((opt) => opt.value === value)?.label || "",
    });
  };

  const toggleOptionsList = (checked: boolean) => {
    setShowOptions(checked);
    if (checked && !summaryGroup.options) {
      updateQuestionGroup({ options: ["", "", "", "", ""] });
    } else if (!checked) {
      updateQuestionGroup({ options: undefined });
    }
  };

  const addOption = () => {
    const options = [...(summaryGroup.options || [])];
    options.push("");
    updateQuestionGroup({ options });
  };

  const updateOption = (index: number, value: string) => {
    const options = [...(summaryGroup.options || [])];
    options[index] = value;
    updateQuestionGroup({ options });
  };

  const deleteOption = (index: number) => {
    const options = [...(summaryGroup.options || [])];
    options.splice(index, 1);
    updateQuestionGroup({ options });

    if (options.length === 0) {
      setShowOptions(false);
    }
  };

  const addGap = () => {
    const gapId = `gap-${summaryGroup.questions.length + 1}`;
    const newGap = {
      gapId,
      correctAnswer: "",
    };

    // Update the summary text to include the new gap
    let updatedSummaryText = summaryGroup.summaryText || "";
    updatedSummaryText += ` [${gapId}]`;

    const updatedQuestions = [...summaryGroup.questions, newGap];
    updateQuestionGroup({
      questions: updatedQuestions,
      summaryText: updatedSummaryText,
    });
  };

  const updateGap = (index: number, field: string, value: string) => {
    const updatedQuestions = [...summaryGroup.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value,
    };

    updateQuestionGroup({ questions: updatedQuestions });
  };

  const deleteGap = (index: number) => {
    const gapId = summaryGroup.questions[index].gapId;
    const updatedQuestions = [...summaryGroup.questions];
    updatedQuestions.splice(index, 1);

    // Remove the gap from the summary text
    let updatedSummaryText = summaryGroup.summaryText || "";
    updatedSummaryText = updatedSummaryText.replace(`[${gapId}]`, "___");

    updateQuestionGroup({
      questions: updatedQuestions,
      summaryText: updatedSummaryText,
    });
  };

  const extractGapsFromSummary = () => {
    // This function extracts gaps from the summary text when editing an existing summary
    const summaryText = summaryGroup.summaryText || "";
    const gapRegex = /\[(gap-\d+)\]/g;
    let match;
    const existingGaps = new Set(summaryGroup.questions.map((q) => q.gapId));
    const newGaps = [];

    while ((match = gapRegex.exec(summaryText)) !== null) {
      const gapId = match[1];
      if (!existingGaps.has(gapId)) {
        newGaps.push({
          gapId,
          correctAnswer: "",
        });
      }
    }

    if (newGaps.length > 0) {
      updateQuestionGroup({
        questions: [...summaryGroup.questions, ...newGaps],
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="instruction">Instructions</Label>
          <Textarea
            id="instruction"
            placeholder="Enter instructions for this question group"
            value={summaryGroup.instruction}
            onChange={handleInstructionChange}
            className="min-h-[100px]"
          />
          <p className="text-sm text-muted-foreground">
            Example: &quot;Complete the summary below. Choose NO MORE THAN TWO
            WORDS from the passage for each answer.&quot;
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="summary-text">Summary Text</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={extractGapsFromSummary}
            >
              Extract Gaps
            </Button>
          </div>
          <Textarea
            id="summary-text"
            placeholder="Enter the summary text with gaps marked as [gap-1], [gap-2], etc."
            value={summaryGroup.summaryText || ""}
            onChange={handleSummaryTextChange}
            className="min-h-[200px]"
          />
          <p className="text-sm text-muted-foreground">
            Add your summary text and mark gaps as [gap-1], [gap-2], etc. The
            &quot;Add Gap&quot; button will append a new gap to the end.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="word-limit">Word Limit</Label>
          <Select
            value={(summaryGroup.wordLimit || 2).toString()}
            onValueChange={handleWordLimitChange}
          >
            <SelectTrigger id="word-limit" className="w-64">
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

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="use-options"
              checked={showOptions}
              onCheckedChange={toggleOptionsList}
            />
            <Label htmlFor="use-options">
              Use word bank (usually for box completion)
            </Label>
          </div>

          {showOptions && (
            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Word Bank Options</h3>
                  <Button variant="outline" size="sm" onClick={addOption}>
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add Option
                  </Button>
                </div>

                <div className="space-y-3">
                  {(summaryGroup.options || []).map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="flex-grow"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="flex-shrink-0"
                        onClick={() => deleteOption(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Gaps and Answers</h3>
        <Button variant="outline" onClick={addGap}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Gap
        </Button>
      </div>

      {summaryGroup.questions.length > 0 ? (
        <Card className="p-6">
          <div className="space-y-4">
            {summaryGroup.questions.map((gap, index) => (
              <div
                key={index}
                className="flex items-center gap-4 border p-3 rounded-md"
              >
                <div className="flex-shrink-0 w-12">
                  <div className="font-medium text-center">{gap.gapId}</div>
                </div>
                <div className="flex-grow">
                  <Input
                    value={gap.correctAnswer || ""}
                    onChange={(e) =>
                      updateGap(index, "correctAnswer", e.target.value)
                    }
                    placeholder={`Answer for ${gap.gapId}`}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0"
                  onClick={() => deleteGap(index)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <div className="text-center p-10 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-2">No gaps added yet.</p>
          <Button onClick={addGap}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add First Gap
          </Button>
        </div>
      )}

      {summaryGroup.summaryText && (
        <Card className="p-4 bg-muted/30">
          <h3 className="text-lg font-medium mb-2">Preview</h3>
          <div className="prose prose-sm max-w-none">
            {summaryGroup.summaryText.split(/(\[gap-\d+\])/).map((part, i) => {
              const match = part.match(/\[(gap-\d+)\]/);
              if (match) {
                const gapId = match[1];
                const gap = summaryGroup.questions.find(
                  (q) => q.gapId === gapId
                );
                return (
                  <span key={i} className="bg-primary/10 px-1 rounded mx-1">
                    {gap ? `[${gap.gapId}]` : part}
                  </span>
                );
              }
              return <span key={i}>{part}</span>;
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
