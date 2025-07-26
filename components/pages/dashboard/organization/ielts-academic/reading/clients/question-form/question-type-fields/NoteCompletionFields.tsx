"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash, Sparkles } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { NoteCompletionGroup } from "@/types/exam/ielts-academic/reading/question/question";

// Define specific types for this component
interface GapQuestion {
  gapId: string;
  correctAnswer?: string; // Make optional to match the type in question.ts
  [key: string]: unknown; // For compatibility
}

interface NoteCompletionFieldsProps {
  questionGroup: NoteCompletionGroup;
  updateQuestionGroup: (data: Partial<NoteCompletionGroup>) => void;
}

export default function NoteCompletionFields({
  questionGroup,
  updateQuestionGroup,
}: NoteCompletionFieldsProps) {
  const [showWordBank, setShowWordBank] = useState<boolean>(
    !!questionGroup.options?.length
  );
  const [gapCount, setGapCount] = useState<number>(0);
  const [wordLimitOptions] = useState([
    { value: "1", label: "ONE WORD ONLY" },
    { value: "2", label: "NO MORE THAN TWO WORDS" },
    { value: "3", label: "NO MORE THAN THREE WORDS" },
  ]);

  // Initialize and extract gaps
  useEffect(() => {
    if (!questionGroup.noteText) {
      updateQuestionGroup({
        noteText:
          "# Note Title\n\n* Point one\n* Point two [gap]\n* Point three [gap]",
        questions: [],
      });
    } else {
      const gapRegex = /\[gap\]/gi;
      const matches = questionGroup.noteText.match(gapRegex);
      const currentGapCount = matches ? matches.length : 0;
      setGapCount(currentGapCount);

      const existingGaps = questionGroup.questions || [];
      const newQuestions: GapQuestion[] = [];

      for (let i = 0; i < currentGapCount; i++) {
        const gapId = `gap-${i}`;
        const existingGap = existingGaps.find((g) => g.gapId === gapId);
        newQuestions.push(existingGap || { gapId, correctAnswer: "" });
      }

      if (
        JSON.stringify(newQuestions) !== JSON.stringify(existingGaps) ||
        existingGaps.length !== currentGapCount
      ) {
        updateQuestionGroup({ questions: newQuestions });
      }
    }
  }, [questionGroup.noteText, questionGroup.questions, updateQuestionGroup]);

  const handleInstructionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    updateQuestionGroup({ instruction: e.target.value });
  };

  const handleNoteTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateQuestionGroup({ noteText: e.target.value });
  };

  const handleWordLimitChange = (value: string) => {
    updateQuestionGroup({
      wordLimit: parseInt(value),
      wordLimitText:
        wordLimitOptions.find((opt) => opt.value === value)?.label || "",
    });
  };

  const toggleWordBank = (checked: boolean) => {
    setShowWordBank(checked);
    if (checked && !questionGroup.options) {
      updateQuestionGroup({ options: ["", "", "", "", ""] });
    } else if (!checked) {
      updateQuestionGroup({ options: undefined });
    }
  };

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

    if (options.length === 0) {
      setShowWordBank(false);
    }
  };

  const updateGapAnswer = (gapId: string, value: string) => {
    const updatedQuestions = (questionGroup.questions || []).map((q) => {
      if (q.gapId === gapId) {
        return { ...q, correctAnswer: value };
      }
      return q;
    });

    updateQuestionGroup({ questions: updatedQuestions });
  };

  // Auto-format the note text (convert to markdown-like format)
  const formatNoteText = () => {
    if (!questionGroup.noteText) return;

    // Simple formatting - replace common patterns
    const formatted = questionGroup.noteText
      // Ensure heading lines have the # prefix
      .replace(/^(.+?)(?:\r\n|\n|$)/gm, (match, heading) => {
        if (heading.trim().startsWith("#")) return match;
        return `# ${heading.trim()}\n`;
      })
      // Convert simple lines with dashes or asterisks to proper bullet points
      .replace(/^[ \t]*[-*][ \t](.+)/gm, "* $1")
      // Add spacing between sections if needed
      .replace(/(\n[*#])/g, "\n\n$1");

    updateQuestionGroup({ noteText: formatted });
  };

  // Render the note in a more structured way
  const renderFormattedNote = (text: string) => {
    if (!text) return null;

    // Replace [gap] with numbered gaps
    const lines = text.split("\n");
    let gapIndex = 0;

    return (
      <div className="space-y-2 font-normal">
        {lines.map((line, index) => {
          const trimmedLine = line.trim();

          // Heading
          if (trimmedLine.startsWith("# ")) {
            return (
              <h3 key={index} className="text-lg font-semibold mt-3">
                {trimmedLine.substring(2)}
              </h3>
            );
          }

          // Bullet point
          if (trimmedLine.startsWith("* ")) {
            const parts: React.ReactNode[] = [];
            const lineContent = trimmedLine.substring(2);
            const gapRegex = /\[gap\]/gi;
            let lastIndex = 0;
            let match;

            while ((match = gapRegex.exec(lineContent)) !== null) {
              parts.push(lineContent.substring(lastIndex, match.index));
              gapIndex++;
              parts.push(
                <span
                  key={`gap-${index}-${gapIndex}`}
                  className="inline-block bg-primary/10 px-4 py-0.5 mx-1 rounded border-b-2 border-dashed border-primary/30"
                >
                  [{gapIndex}]
                </span>
              );
              lastIndex = match.index + 5; // Length of [gap]
            }
            parts.push(lineContent.substring(lastIndex));

            return (
              <div key={index} className="flex">
                <span className="mr-2">•</span>
                <div>{parts}</div>
              </div>
            );
          }

          // Regular text
          if (trimmedLine) {
            return <p key={index}>{trimmedLine}</p>;
          }

          // Empty line
          return <div key={index} className="h-2"></div>;
        })}
      </div>
    );
  };

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
            Example: &quot;Complete the notes below. Choose NO MORE THAN TWO
            WORDS from the passage for each answer.&quot;
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="word-limit">Word Limit</Label>
          <Select
            value={(questionGroup.wordLimit || 2).toString()}
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
              checked={showWordBank}
              onCheckedChange={toggleWordBank}
            />
            <Label htmlFor="use-options">Use word bank</Label>
          </div>

          {showWordBank && (
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
                  {(questionGroup.options || []).map((option, index) => (
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

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="note-text">Note Text</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={formatNoteText}
              title="Auto-format note text"
            >
              <Sparkles className="h-4 w-4 mr-1" />
              Format
            </Button>
          </div>
          <Textarea
            id="note-text"
            placeholder="Enter note text with [gap] placeholders for answers"
            value={questionGroup.noteText || ""}
            onChange={handleNoteTextChange}
            className="min-h-[200px] font-mono text-sm"
          />
          <p className="text-sm text-muted-foreground">
            Enter your note text and use [gap] where answers should go. Use #
            for headings and * for bullet points.
          </p>
        </div>
      </div>

      {gapCount > 0 && (
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Gap Answers</h3>
          <div className="space-y-4">
            {(questionGroup.questions || []).map((gap, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12">
                  <div className="font-medium text-center">Gap {index + 1}</div>
                </div>
                <div className="flex-grow">
                  <Input
                    value={gap.correctAnswer || ""}
                    onChange={(e) => updateGapAnswer(gap.gapId, e.target.value)}
                    placeholder={`Answer for Gap ${index + 1}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {gapCount === 0 && (
        <div className="text-center p-6 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">
            No gaps found in your note text. Add [gap] placeholders where
            answers should go.
          </p>
        </div>
      )}

      {questionGroup.noteText && (
        <Card className="p-4 bg-muted/30">
          <h3 className="text-lg font-medium mb-4">Preview</h3>
          <div className="prose prose-sm max-w-none">
            {renderFormattedNote(questionGroup.noteText)}
          </div>

          {gapCount > 0 &&
            (questionGroup.questions || []).some((q) => q.correctAnswer) && (
              <div className="mt-6 pt-4 border-t">
                <h4 className="font-medium mb-2">Answers:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {(questionGroup.questions || []).map((gap, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="font-medium">{index + 1}:</span>
                      <span>{gap.correctAnswer || "(not set)"}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </Card>
      )}
    </div>
  );
}
