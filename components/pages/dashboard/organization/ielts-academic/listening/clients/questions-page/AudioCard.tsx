import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  FileAudio,
  FileQuestion,
  Clock,
  Calendar,
  Check,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IELTSListeningTestSection } from "@/types/exam/ielts-academic/listening/listening";
import Link from "next/link";

interface AudioCardProps {
  item: IELTSListeningTestSection;
  organizationId: number;
  getQuestionTypeLabel: (type: string) => string;
  isSelected: boolean;
  onSelect: () => void;
  onDelete?: (questionId: string) => void;
}

export function AudioCard({
  item,
  organizationId,
  getQuestionTypeLabel,
  isSelected,
  onSelect,
  onDelete,
}: AudioCardProps) {
  // Extract basic info
  const audioTitle = item.audio?.title || "Untitled Audio";
  const difficulty = item.audio?.difficulty || "medium";
  const totalQuestions = item.questions.reduce(
    (acc, group) => acc + (group.questions?.length || 0),
    0
  );

  // Get question types summary
  const questionTypes = item.questions.map((q) => q.questionType);
  const primaryQuestionType =
    questionTypes.length > 0
      ? getQuestionTypeLabel(questionTypes[0])
      : "No questions";

  // Format creation date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Placeholder date - in a real app, this would come from the API
  const creationDate = new Date().toISOString();

  return (
    <Card
      className={`p-3 sm:p-4 hover:bg-muted/50 active:bg-muted/70 transition-all duration-200 cursor-pointer relative touch-manipulation ${
        isSelected
          ? "ring-2 ring-primary bg-primary/5 border-primary/20"
          : "border-border/50"
      }`}
      onClick={onSelect}
    >
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-primary text-primary-foreground rounded-full p-1 z-10 shadow-sm">
          <Check className="h-3 w-3 sm:h-3 sm:w-3" />
        </div>
      )}

      <div className="flex items-start justify-between gap-2">
        <div className="flex gap-3 items-center">
          <div
            className={`p-2 rounded-md transition-colors ${
              isSelected ? "bg-primary/20" : "bg-primary/10"
            }`}
          >
            <FileAudio
              className={`h-5 w-5 ${
                isSelected ? "text-primary" : "text-primary"
              }`}
            />
          </div>
          <div>
            <h3
              className={`font-medium line-clamp-1 ${
                isSelected ? "text-primary" : ""
              }`}
            >
              {audioTitle}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <Badge
                variant="outline"
                className={`text-xs ${
                  difficulty === "easy"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : difficulty === "medium"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {difficulty}
              </Badge>
              <div className="flex items-center gap-1">
                <FileQuestion className="h-3 w-3" />
                <span>{totalQuestions} questions</span>
              </div>
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 sm:h-8 sm:w-8 touch-manipulation ${
                isSelected ? "mr-8" : ""
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link
                href={`/dashboard/organization/${organizationId}/ielts/listening/questions/edit/${
                  item.questions[0]?.id || ""
                }`}
              >
                Edit questions
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                const questionId = item.questions[0]?.id;
                if (questionId && onDelete) {
                  onDelete(questionId);
                }
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-2 mb-1">
          <div className="flex items-center gap-1">
            <FileQuestion className="h-3 w-3" />
            <span className="font-medium">{primaryQuestionType}</span>
            {questionTypes.length > 1 && (
              <span>+{questionTypes.length - 1} more</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Created {formatDate(creationDate)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>
              {item.audio?.transcript
                ? "Transcript available"
                : "No transcript"}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
