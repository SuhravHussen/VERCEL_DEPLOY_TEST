"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AudioCardProps, AudioStat } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Headphones, FileQuestion, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { addListeningQuestionNumbering } from "@/lib/addListeningQuestionNumbering";
import { IELTSListeningTestSection } from "@/types/exam/ielts-academic/listening/listening";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function AudioCard({
  audio,
  questions,
  isSelected,
  onClick,
  stats: providedStats,
}: AudioCardProps) {
  // Use provided stats if available, otherwise calculate them
  const audioStat: AudioStat =
    providedStats ||
    (() => {
      // Create a mock section with this audio and questions to get stats
      const section: IELTSListeningTestSection = {
        audio,
        questions,
      };

      // Get detailed stats using the utility
      const { audioStats } = addListeningQuestionNumbering([section]);
      return audioStats[0];
    })();

  // Get question type distribution
  const questionTypes = audioStat?.questionTypes || {};
  const questionTypeEntries = Object.entries(questionTypes);

  return (
    <Card
      className={cn(
        "relative cursor-pointer transition-all duration-200 hover:shadow-md",
        isSelected
          ? "border-2 border-primary bg-primary/5"
          : "hover:border-primary/50"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="font-semibold truncate">{audio.title}</h3>
          <Badge
            variant={
              audio.difficulty === "easy"
                ? "secondary"
                : audio.difficulty === "medium"
                ? "outline"
                : "destructive"
            }
            className="capitalize"
          >
            {audio.difficulty}
          </Badge>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <Headphones className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Audio Recording</span>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <FileQuestion className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {audioStat.questionCount} questions
          </span>
        </div>

        {questionTypeEntries.length > 0 && (
          <div className="mt-3 pt-3 border-t border-dashed">
            <div className="flex items-center gap-2 mb-2">
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Question Types:</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {questionTypeEntries.map(([type, count]) => (
                <TooltipProvider key={type}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="text-xs">
                        {formatQuestionType(type)} ({count})
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{formatQuestionTypeFullName(type)}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        )}

        {isSelected && (
          <div className="absolute top-2 right-2">
            <Check className="h-5 w-5 text-primary" />
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button variant="ghost" size="sm" className="w-full">
          Preview Audio
        </Button>
      </CardFooter>
    </Card>
  );
}

// Helper function to format question type for display
function formatQuestionType(type: string): string {
  const typeMap: Record<string, string> = {
    multiple_choice: "MC",
    multiple_choice_multiple_answers: "MCMA",
    sentence_completion: "SC",
    form_completion: "FC",
    note_completion: "NC",
    table_completion: "TC",
    flow_chart_completion: "FCC",
    diagram_label_completion: "DLC",
    matching: "Match",
    short_answer: "SA",
  };

  return typeMap[type] || type;
}

// Helper function to get full question type name
function formatQuestionTypeFullName(type: string): string {
  const typeMap: Record<string, string> = {
    multiple_choice: "Multiple Choice",
    multiple_choice_multiple_answers: "Multiple Choice (Multiple Answers)",
    sentence_completion: "Sentence Completion",
    form_completion: "Form Completion",
    note_completion: "Note Completion",
    table_completion: "Table Completion",
    flow_chart_completion: "Flow Chart Completion",
    diagram_label_completion: "Diagram Label Completion",
    matching: "Matching",
    short_answer: "Short Answer",
  };

  return typeMap[type] || type;
}
