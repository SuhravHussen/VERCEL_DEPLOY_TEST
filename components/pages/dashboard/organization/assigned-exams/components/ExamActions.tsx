import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, FileText } from "lucide-react";

interface ExamActionsProps {
  examId: string;
  isExamAvailable: boolean;
  onViewDetails?: (examId: string) => void;
  onViewSubmissions?: (examId: string) => void;
}

export function ExamActions({
  examId,
  isExamAvailable,
  onViewDetails,
  onViewSubmissions,
}: ExamActionsProps) {
  return (
    <div className="flex gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onViewDetails?.(examId)}
        className="flex-1 h-10 font-medium border-border/50 hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all duration-200 group/btn"
      >
        <Eye className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform duration-200" />
        View Details
      </Button>

      <Button
        size="sm"
        onClick={() => onViewSubmissions?.(examId)}
        disabled={!isExamAvailable}
        className="flex-1 h-10 font-medium bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 group/btn"
      >
        <FileText className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform duration-200" />
        View Submissions
      </Button>
    </div>
  );
}