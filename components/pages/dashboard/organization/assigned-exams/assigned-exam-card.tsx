import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ExamModel } from "@/types/exam/exam";
import { ExamStatusBadge } from "./components/ExamStatusBadge";
import { ExamStatusIcon } from "./components/ExamStatusIcon";
import { ExamDetails } from "./components/ExamDetails";
import { ExamActions } from "./components/ExamActions";
import { GradingIndicator } from "./components/grading-indicator";

interface AssignedExamCardProps {
  exam: ExamModel;
  onViewSubmissions?: (examId: string) => void;
  onViewDetails?: (examId: string) => void;
}

export function AssignedExamCard({
  exam,
  onViewSubmissions,
  onViewDetails,
}: AssignedExamCardProps) {
  const getDaysUntilExam = () => {
    if (!exam.lrw_group?.exam_date) return null;
    const examDate = new Date(exam.lrw_group.exam_date);
    const today = new Date();
    const diffTime = examDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExamStatus = () => {
    if (!exam.lrw_group?.exam_date) return "no-date";

    const daysUntil = getDaysUntilExam();
    if (daysUntil === null) return "no-date";

    if (daysUntil < 0) return "completed";
    if (daysUntil === 0) return "today";
    if (daysUntil <= 7) return "upcoming";
    return "scheduled";
  };

  const isExamAvailable = () => {
    const status = getExamStatus();
    return (
      status === "today" || status === "upcoming" || status === "scheduled"
    );
  };

  const status = getExamStatus();
  const daysUntil = getDaysUntilExam();

  return (
    <Card className="group h-full hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 border-border/40 bg-card/95 backdrop-blur-sm overflow-hidden relative">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.01] via-transparent to-accent/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Subtle border glow effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>

      {/* Grading Required Indicator */}
      <GradingIndicator show={exam.require_grading || false} />

      <CardHeader className="relative z-10 pb-4 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0 space-y-3">
            <CardTitle className="text-xl font-bold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors duration-200">
              {exam.title}
            </CardTitle>

            <div className="flex items-center gap-3 flex-wrap">
              <Badge
                variant="secondary"
                className="text-xs font-semibold px-3 py-1.5 bg-secondary/15 text-secondary-foreground border-secondary/25 hover:bg-secondary/25 transition-all duration-200 shadow-sm"
              >
                {exam.type_of_exam.toUpperCase()}
              </Badge>
              <ExamStatusBadge status={status} daysUntil={daysUntil} />
            </div>
          </div>

          <div className="flex-shrink-0 opacity-80 group-hover:opacity-100 transition-all duration-200 group-hover:scale-105">
            <ExamStatusIcon status={status} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 space-y-5 px-6 pb-4">
        {exam.description && (
          <>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {exam.description}
            </p>
            <Separator className="opacity-50" />
          </>
        )}

        <ExamDetails exam={exam} />
      </CardContent>

      <CardFooter className="relative z-10 pt-6 px-6 pb-6 border-t border-border/20 bg-muted/5">
        <ExamActions
          examId={exam.id}
          isExamAvailable={isExamAvailable()}
          onViewDetails={onViewDetails}
          onViewSubmissions={onViewSubmissions}
        />
      </CardFooter>
    </Card>
  );
}
