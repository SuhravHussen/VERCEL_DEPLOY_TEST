import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, FileText, Users } from "lucide-react";
import { ExamModel } from "@/types/exam/exam";
import { User } from "@/types/user";
import { isAssigned } from "@/lib/exam-utils";

interface ExamActionsProps {
  exam: ExamModel;
  user: User | null;
  isExamAvailable: boolean;
  onViewDetails?: (examId: string) => void;
  onViewSubmissions?: (examId: string) => void;
  onViewSpeakingSessions?: (examId: string) => void;
}

export function ExamActions({
  exam,
  user,
  isExamAvailable,
  onViewDetails,
  onViewSubmissions,
  onViewSpeakingSessions,
}: ExamActionsProps) {
  // Check if user is assigned to speaking sessions
  const userIsAssigned = user ? isAssigned(exam, user.id) : false;

  return (
    <div className="flex gap-2 flex-wrap">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onViewDetails?.(exam.id)}
        className="flex-1 h-10 font-medium border-border/50 hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all duration-200 group/btn"
      >
        <Eye className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform duration-200" />
        View Details
      </Button>

      <Button
        size="sm"
        onClick={() => onViewSubmissions?.(exam.id)}
        disabled={!isExamAvailable}
        className="flex-1 h-10 font-medium bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 group/btn"
      >
        <FileText className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform duration-200" />
        View Submissions
      </Button>

      {/* Speaking Sessions Button - Only show if user is assigned */}
      {userIsAssigned && (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onViewSpeakingSessions?.(exam.id)}
          className="flex-1 h-10 font-medium bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-sm hover:shadow-md transition-all duration-200 group/btn"
        >
          <Users className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform duration-200" />
          Speaking Sessions
        </Button>
      )}
    </div>
  );
}
