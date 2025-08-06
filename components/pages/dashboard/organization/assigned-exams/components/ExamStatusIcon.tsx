import React from "react";
import { CheckCircle, AlertCircle, Clock, CalendarDays } from "lucide-react";

interface ExamStatusIconProps {
  status: "completed" | "today" | "upcoming" | "scheduled" | "no-date";
}

export function ExamStatusIcon({ status }: ExamStatusIconProps) {
  const getIconConfig = () => {
    switch (status) {
      case "completed":
        return {
          icon: CheckCircle,
          className: "w-9 h-9 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shadow-sm",
          iconClassName: "w-4 h-4 text-emerald-600",
        };
      case "today":
        return {
          icon: AlertCircle,
          className: "w-9 h-9 rounded-full bg-red-50 border border-red-200 flex items-center justify-center animate-pulse shadow-sm",
          iconClassName: "w-4 h-4 text-red-600",
        };
      case "upcoming":
        return {
          icon: Clock,
          className: "w-9 h-9 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shadow-sm",
          iconClassName: "w-4 h-4 text-blue-600",
        };
      case "scheduled":
        return {
          icon: Clock,
          className: "w-9 h-9 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shadow-sm",
          iconClassName: "w-4 h-4 text-amber-600",
        };
      default:
        return {
          icon: CalendarDays,
          className: "w-9 h-9 rounded-full bg-muted/20 border border-muted/30 flex items-center justify-center shadow-sm",
          iconClassName: "w-4 h-4 text-muted-foreground",
        };
    }
  };

  const config = getIconConfig();
  const IconComponent = config.icon;

  return (
    <div className={config.className}>
      <IconComponent className={config.iconClassName} />
    </div>
  );
}