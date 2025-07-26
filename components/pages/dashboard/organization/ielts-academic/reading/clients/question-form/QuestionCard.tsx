"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { IELTSReadingQuestionGroup } from "@/types/exam/ielts-academic/reading/question/question";

interface QuestionCardProps {
  group: IELTSReadingQuestionGroup;
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
}

export function QuestionCard({
  group,
  index,
  isSelected,
  onClick,
  onDelete,
}: QuestionCardProps) {
  const getQuestionTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      multiple_choice: "Multiple Choice",
      multiple_choice_multiple_answers: "Multiple Choice (Multiple)",
      true_false_not_given: "True/False/Not Given",
      yes_no_not_given: "Yes/No/Not Given",
      matching_information: "Matching Information",
      matching_headings: "Matching Headings",
      matching_features: "Matching Features",
      matching_sentence_endings: "Matching Sentence Endings",
      sentence_completion: "Sentence Completion",
      summary_completion: "Summary Completion",
      note_completion: "Note Completion",
      table_completion: "Table Completion",
      flow_chart_completion: "Flow Chart",
      diagram_label_completion: "Diagram Label",
      short_answer: "Short Answer",
    };

    return types[type] || type;
  };

  return (
    <div
      className={cn(
        "border rounded-md p-3 cursor-pointer transition-colors",
        isSelected
          ? "border-primary bg-primary/5"
          : "hover:bg-accent hover:border-accent"
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="font-medium">Group {index + 1}</span>
          <span className="text-xs text-muted-foreground">
            {getQuestionTypeLabel(group.questionType)}
          </span>
        </div>
        <div className="flex items-center">
          <span className="text-xs px-2 py-1 bg-muted rounded-full">
            {group.questions?.length || 0}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 ml-1"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
