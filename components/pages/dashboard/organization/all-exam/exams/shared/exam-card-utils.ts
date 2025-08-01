import { Currency } from "@/types/currency";
import { ExamType, ExamModel } from "@/types/exam/exam";
import { BookOpen, GraduationCap, Award, Target } from "lucide-react";

// Utility functions
export const formatCurrency = (amount: number, currency: Currency): string => {
  const formatters: Record<Currency, (amount: number) => string> = {
    [Currency.USD]: (amount) => `$${amount.toFixed(2)}`,
    [Currency.BDT]: (amount) => `৳${amount.toFixed(0)}`,
    [Currency.EUR]: (amount) => `€${amount.toFixed(2)}`,
    [Currency.GBP]: (amount) => `£${amount.toFixed(2)}`,
    [Currency.INR]: (amount) => `₹${amount.toFixed(0)}`,
  };

  return formatters[currency]?.(amount) || `${amount}`;
};

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "TBD";
  }
};

export const formatTime = (timeString: string): string => {
  try {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const minute = parseInt(minutes, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minute.toString().padStart(2, "0")} ${ampm}`;
  } catch {
    return timeString;
  }
};

// Exam type configuration - using consistent design system colors
export const getExamTypeConfig = (examType: ExamType) => {
  const configs = {
    [ExamType.IELTS]: {
      icon: BookOpen,
      color: "bg-secondary text-secondary-foreground border-border",
      accent: "border-border hover:shadow-md",
      name: "IELTS",
    },
    [ExamType.TOEFL]: {
      icon: GraduationCap,
      color: "bg-secondary text-secondary-foreground border-border",
      accent: "border-border hover:shadow-md",
      name: "TOEFL",
    },
    [ExamType.GRE]: {
      icon: Target,
      color: "bg-secondary text-secondary-foreground border-border",
      accent: "border-border hover:shadow-md",
      name: "GRE",
    },
    [ExamType.SAT]: {
      icon: Award,
      color: "bg-secondary text-secondary-foreground border-border",
      accent: "border-border hover:shadow-md",
      name: "SAT",
    },
    [ExamType.GMAT]: {
      icon: GraduationCap,
      color: "bg-secondary text-secondary-foreground border-border",
      accent: "border-border hover:shadow-md",
      name: "GMAT",
    },
  };

  return configs[examType] || configs[ExamType.IELTS];
};

// Common interface for all exam card components
export interface ExamCardProps {
  exam: ExamModel;
  onViewDetails?: (examId: string) => void;
  onDelete?: (examId: string) => void;
  isDeleting?: boolean;
  showActions?: boolean;
}
