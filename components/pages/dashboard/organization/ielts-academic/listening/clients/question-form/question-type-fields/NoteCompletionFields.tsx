import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2 } from "lucide-react";
import { ListeningNoteCompletionGroup } from "@/types/exam/ielts-academic/listening/listening";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface NoteCompletionFieldsProps {
  questionGroup: ListeningNoteCompletionGroup;
  updateQuestionGroup: (data: Partial<ListeningNoteCompletionGroup>) => void;
}

export default function NoteCompletionFields({
  questionGroup,
  updateQuestionGroup,
}: NoteCompletionFieldsProps) {
  const [currentGapIndex, setCurrentGapIndex] = useState<number | null>(
    questionGroup.questions?.length ? 0 : null
  );
  const [showOptions, setShowOptions] = useState(false);
  const [formattedNote, setFormattedNote] = useState<React.ReactNode>(null);

  const wordLimitOptions = [
    { value: "1", label: "ONE WORD ONLY" },
    { value: "2", label: "NO MORE THAN TWO WORDS" },
    { value: "3", label: "NO MORE THAN THREE WORDS" },
  ];

  // Initialize questions and note text if not present
  useEffect(() => {
    if (!questionGroup.questions) {
      updateQuestionGroup({ questions: [] });
    }

    if (!questionGroup.noteText) {
      updateQuestionGroup({
        noteText: `Example Note Title

This is an example note. You can include (1)_______ here where students need to fill in the blanks.
The note can have multiple paragraphs with more (2)_______ in them.

• Points can be included as bullet points
• With (3)_______ in them as well
• Each point might have a different topic

You can also include tables or lists if needed.`,
      });
    }
  }, [questionGroup.questions, questionGroup.noteText, updateQuestionGroup]);

  // Update formatted note when noteText changes
  useEffect(() => {
    if (questionGroup.noteText) {
      setFormattedNote(formatNoteText());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionGroup.noteText, questionGroup.questions]);

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
    setShowOptions(checked);
    if (checked && !questionGroup.options) {
      updateQuestionGroup({ options: ["Option 1", "Option 2", "Option 3"] });
    } else if (!checked) {
      updateQuestionGroup({ options: undefined });
    }
  };

  const addOption = () => {
    const options: string[] = Array.isArray(questionGroup.options)
      ? [...questionGroup.options]
      : [];
    options.push(`Option ${options.length + 1}`);
    updateQuestionGroup({ options });
  };

  const updateOption = (index: number, value: string) => {
    const options: string[] = Array.isArray(questionGroup.options)
      ? [...questionGroup.options]
      : [];
    options[index] = value || `Option ${index + 1}`;
    updateQuestionGroup({ options });
  };

  const deleteOption = (index: number) => {
    const options: string[] = Array.isArray(questionGroup.options)
      ? [...questionGroup.options]
      : [];
    options.splice(index, 1);

    if (options.length === 0) {
      setShowOptions(false);
      updateQuestionGroup({ options: undefined });
    } else {
      updateQuestionGroup({ options });
    }
  };

  const updateGapAnswer = (gapId: string, value: string) => {
    const updatedQuestions = Array.isArray(questionGroup.questions)
      ? [...questionGroup.questions]
      : [];
    const gapIndex = updatedQuestions.findIndex((q) => q.gapId === gapId);

    if (gapIndex >= 0) {
      updatedQuestions[gapIndex] = {
        ...updatedQuestions[gapIndex],
        correctAnswer: value,
      };
      updateQuestionGroup({ questions: updatedQuestions });
    }
  };

  const formatNoteText = () => {
    if (!questionGroup.noteText) return null;

    // Extract gaps from the note text
    const gapRegex = /\((\d+)\)_+/g;
    let match;
    const gaps: { id: string; index: number }[] = [];

    while ((match = gapRegex.exec(questionGroup.noteText)) !== null) {
      gaps.push({ id: match[1], index: match.index });
    }

    // Update questions to match gaps found in the text
    const questions = Array.isArray(questionGroup.questions)
      ? [...questionGroup.questions]
      : [];
    const currentGapIds = new Set(questions.map((q) => q.gapId));
    const newGaps = gaps.filter((g) => !currentGapIds.has(g.id));

    if (newGaps.length > 0) {
      const updatedQuestions = [...questions];

      newGaps.forEach((gap) => {
        updatedQuestions.push({
          gapId: gap.id,
          correctAnswer: "",
        });
      });

      // Update in the next tick to avoid state updates during render
      setTimeout(() => {
        updateQuestionGroup({ questions: updatedQuestions });
      }, 0);
    }

    return renderFormattedNote(questionGroup.noteText);
  };

  const renderFormattedNote = (text: string) => {
    // Replace gaps with React elements for highlighting
    const parts = text.split(/(\(\d+\)_+)/g);

    return (
      <div className="whitespace-pre-wrap">
        {parts.map((part, i) => {
          const gapMatch = part.match(/\((\d+)\)_+/);

          if (gapMatch) {
            const gapId = gapMatch[1];
            const questions = Array.isArray(questionGroup.questions)
              ? questionGroup.questions
              : [];

            return (
              <span
                key={i}
                className="bg-primary/10 text-primary font-medium px-1 rounded cursor-pointer"
                onClick={() => {
                  const index = questions.findIndex((q) => q.gapId === gapId);
                  if (index >= 0) setCurrentGapIndex(index);
                }}
              >
                ({gapId})_______
              </span>
            );
          }

          return <span key={i}>{part}</span>;
        })}
      </div>
    );
  };

  // Safely get the questions array
  const questions = Array.isArray(questionGroup.questions)
    ? questionGroup.questions
    : [];
  // Safely get the options array
  const options = Array.isArray(questionGroup.options)
    ? questionGroup.options
    : [];

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
            Example: &quot;Complete the notes below. Write NO MORE THAN TWO
            WORDS for each answer.&quot;
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="word-limit">Word Limit</Label>
          <Select
            value={(questionGroup.wordLimit || 3).toString()}
            onValueChange={handleWordLimitChange}
          >
            <SelectTrigger id="word-limit" className="w-full sm:w-[240px]">
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

        <div className="space-y-2">
          <Label htmlFor="word-limit-text">Word Limit Text</Label>
          <Input
            id="word-limit-text"
            value={questionGroup.wordLimitText || ""}
            onChange={(e) =>
              updateQuestionGroup({ wordLimitText: e.target.value })
            }
            placeholder="E.g., NO MORE THAN TWO WORDS"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="use-options"
              checked={showOptions}
              onCheckedChange={toggleWordBank}
            />
            <Label htmlFor="use-options">Use word bank / options list</Label>
          </div>

          {showOptions && (
            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-0">
                  <h3 className="text-lg font-medium">Word Bank Options</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addOption}
                    className="w-full sm:w-auto"
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add Option
                  </Button>
                </div>

                <div className="space-y-3">
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="flex-grow w-full"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="flex-shrink-0"
                        onClick={() => deleteOption(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Note Content</h3>
        </div>
        <Card className="p-4">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-2">
              Enter your note text. Use the format (1)_______ to create gaps.
              The number inside the parentheses will be the gap ID.
            </p>

            <Textarea
              value={questionGroup.noteText || ""}
              onChange={handleNoteTextChange}
              className="min-h-[300px] font-mono text-sm"
              placeholder="Example Note Title

This is an example note with (1)_______ gaps."
            />
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium mb-2">Note Preview</h3>
            <div className="border rounded-md p-4 bg-card">{formattedNote}</div>
          </div>
        </Card>
      </div>

      {questions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Gap Answers</h3>

          <div className="flex flex-col sm:flex-row">
            <div className="w-full sm:w-1/3 border-b sm:border-r sm:border-b-0 pb-4 sm:pb-0 sm:pr-4 mb-4 sm:mb-0">
              <div className="space-y-2">
                {questions.map((gap, index) => (
                  <div
                    key={gap.gapId}
                    className={`p-2 rounded cursor-pointer ${
                      currentGapIndex === index
                        ? "bg-primary/10 border border-primary"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => setCurrentGapIndex(index)}
                  >
                    <span className="font-medium">Gap ({gap.gapId})</span>
                    <p className="text-xs text-muted-foreground truncate">
                      {gap.correctAnswer || "(No answer provided)"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full sm:w-2/3 sm:pl-4">
              {currentGapIndex !== null && questions[currentGapIndex] && (
                <Card className="p-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="gap-id">Gap ID</Label>
                      <Input
                        id="gap-id"
                        value={`(${questions[currentGapIndex].gapId})`}
                        readOnly
                        className="w-full bg-muted"
                      />
                    </div>

                    <div>
                      <Label htmlFor="gap-answer">Correct Answer</Label>
                      <Input
                        id="gap-answer"
                        value={questions[currentGapIndex].correctAnswer || ""}
                        onChange={(e) =>
                          updateGapAnswer(
                            questions[currentGapIndex].gapId,
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
        </div>
      )}

      {questions.length === 0 && (
        <div className="text-center p-4 sm:p-10 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-2">
            No gaps added yet. Add gaps to your note text using the format
            (1)_______
          </p>
        </div>
      )}

      <Card className="p-4 bg-muted/30">
        <h3 className="text-lg font-medium mb-4">Answers Summary</h3>

        <div className="space-y-4">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="text-left py-2">Gap ID</th>
                <th className="text-left py-2">Correct Answer</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((gap) => (
                <tr key={gap.gapId} className="border-b">
                  <td className="py-2">({gap.gapId})</td>
                  <td className="py-2">
                    {gap.correctAnswer || (
                      <span className="text-muted-foreground italic">
                        (No answer provided)
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
