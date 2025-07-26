import { Card } from "@/components/ui/card";
import { IELTSWritingTask } from "@/types/exam/ielts-academic/writing/writing";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BookOpen, Clock } from "lucide-react";

export interface QuestionCardProps {
  question: IELTSWritingTask;
  isSelected: boolean;
  onSelect: () => void;
  getQuestionTypeLabel: (type: string) => string;
  getQuestionTypeFromQuestion: (question: IELTSWritingTask) => string;
}

export function QuestionCard({
  question,
  isSelected,
  onSelect,
  getQuestionTypeLabel,
  getQuestionTypeFromQuestion,
}: QuestionCardProps) {
  // Determine if it's Academic or General Training
  const academicTaskTypes = [
    "line_graph",
    "bar_chart",
    "pie_chart",
    "table",
    "diagram_process",
    "diagram_map",
    "mixed_charts",
  ];

  const generalTaskTypes = [
    "formal_letter",
    "semi_formal_letter",
    "informal_letter",
  ];

  const isAcademic =
    question.taskType === "task_1" &&
    academicTaskTypes.includes(question.detailType);
  const isGeneral =
    question.taskType === "task_1" &&
    generalTaskTypes.includes(question.detailType);

  // Update the examType determination:
  // For Task 1, use Academic or General based on properties
  // For Task 2, it's the same for both Academic and General Training
  const examType =
    question.taskType === "task_2"
      ? "Academic & General"
      : isAcademic
      ? "Academic"
      : isGeneral
      ? "General"
      : "Unknown";

  // Get specific type details
  const questionTypeLabel = getQuestionTypeLabel(
    getQuestionTypeFromQuestion(question)
  );

  // Format the detail type for display
  const formatDetailType = (detailType: string) => {
    if (!detailType) return "";
    return detailType.replace(/_/g, " ");
  };

  return (
    <Card
      className={cn(
        "p-4 cursor-pointer transition-all duration-200 hover:scale-[1.01]",
        isSelected
          ? "border-primary bg-primary/5 shadow-md"
          : "hover:border-primary/50 hover:bg-accent/50"
      )}
      onClick={onSelect}
    >
      <div className="flex flex-col space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <Badge>
                {question.taskType === "task_1" ? "Task 1" : "Task 2"}
              </Badge>

              {question.taskType === "task_2" ? (
                <Badge
                  variant="outline"
                  className="text-xs font-normal flex items-center gap-1"
                >
                  {examType}
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs font-normal",
                    isAcademic ? "text-primary" : "text-green-600"
                  )}
                >
                  {examType}
                </Badge>
              )}
            </div>
            <h3 className="font-medium text-sm line-clamp-1">
              {questionTypeLabel}
            </h3>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {question.instruction}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{question.timeLimit} min</span>
          </div>

          <div className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            <span>Min {question.minimumWords} words</span>
          </div>

          {isSelected && (
            <Badge variant="secondary" className="text-xs ml-auto">
              Selected
            </Badge>
          )}
        </div>

        {/* Additional metadata */}
        <div className="flex flex-wrap gap-1 mt-1">
          {question.detailType && (
            <Badge
              variant="secondary"
              className={cn(
                "text-[10px]",
                isAcademic &&
                  "bg-blue-500/10 text-primary hover:bg-blue-500/20",
                isGeneral &&
                  "bg-green-500/10 text-green-700 hover:bg-green-500/20",
                question.taskType === "task_2" &&
                  "bg-amber-500/10 text-amber-700 hover:bg-amber-500/20"
              )}
            >
              {formatDetailType(question.detailType)}
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}
