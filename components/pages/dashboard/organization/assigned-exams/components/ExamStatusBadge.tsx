import React from "react";
import { Badge } from "@/components/ui/badge";

interface ExamStatusBadgeProps {
  status: "completed" | "today" | "upcoming" | "scheduled" | "no-date";
  daysUntil: number | null;
}

export function ExamStatusBadge({ status, daysUntil }: ExamStatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "completed":
        return {
          className: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 shadow-sm",
          text: "Completed",
        };
      case "today":
        return {
          className: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 shadow-sm animate-pulse",
          text: "Today",
        };
      case "upcoming":
        return {
          className: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 shadow-sm",
          text: `In ${daysUntil} ${daysUntil === 1 ? 'day' : 'days'}`,
        };
      case "scheduled":
        return {
          className: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 shadow-sm",
          text: `In ${daysUntil} ${daysUntil === 1 ? 'day' : 'days'}`,
        };
      default:
        return {
          className: "bg-muted/30 text-muted-foreground border-border/50 shadow-sm",
          text: "No Date",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Badge className={`px-3 py-1.5 font-semibold text-xs transition-all duration-200 ${config.className}`}>
      {config.text}
    </Badge>
  );
}