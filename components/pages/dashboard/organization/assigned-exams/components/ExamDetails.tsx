import React from "react";
import { CalendarDays, Clock, Users, User } from "lucide-react";
import { ExamModel } from "@/types/exam/exam";

interface ExamDetailsProps {
  exam: ExamModel;
}

interface DetailItemProps {
  icon: React.ComponentType<{ className?: string }>;
  iconBgColor: string;
  iconColor: string;
  text: string;
}

function DetailItem({ icon: Icon, iconBgColor, iconColor, text }: DetailItemProps) {
  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-200">
      <div className={`flex-shrink-0 w-6 h-6 rounded-full ${iconBgColor} flex items-center justify-center`}>
        <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
      </div>
      <span className="font-medium">{text}</span>
    </div>
  );
}

export function ExamDetails({ exam }: ExamDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2024-01-01T${timeString}:00`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const details = [];

  if (exam.lrw_group?.exam_date) {
    details.push({
      icon: CalendarDays,
      iconBgColor: "bg-primary/10",
      iconColor: "text-primary",
      text: formatDate(exam.lrw_group.exam_date),
    });
  }

  if (exam.lrw_group?.listening_time_start) {
    details.push({
      icon: Clock,
      iconBgColor: "bg-accent/10",
      iconColor: "text-accent-foreground",
      text: `Starts at ${formatTime(exam.lrw_group.listening_time_start)}`,
    });
  }

  if (exam.max_students) {
    details.push({
      icon: Users,
      iconBgColor: "bg-secondary/10",
      iconColor: "text-secondary-foreground",
      text: `Max ${exam.max_students} students`,
    });
  }

  if (exam.lrw_group?.assigned_instructors && exam.lrw_group.assigned_instructors.length > 0) {
    details.push({
      icon: User,
      iconBgColor: "bg-muted/20",
      iconColor: "text-muted-foreground",
      text: exam.lrw_group.assigned_instructors.length === 1
        ? "1 instructor"
        : `${exam.lrw_group.assigned_instructors.length} instructors`,
    });
  }

  if (details.length === 0) return null;

  return (
    <div className="space-y-3">
      {details.map((detail, index) => (
        <DetailItem key={index} {...detail} />
      ))}
    </div>
  );
}