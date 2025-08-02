import React from "react";
import { ExamModel, ExamType } from "@/types/exam/exam";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  GraduationCap,
  Brain,
  Calculator,
  PenTool,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OtherExamCardProps {
  exam: ExamModel;
  className?: string;
  onStartPractice?: (examId: string) => void;
}

export const OtherExamCard: React.FC<OtherExamCardProps> = ({
  exam,
  className,
  onStartPractice,
}) => {
  const handleStartPractice = () => {
    onStartPractice?.(exam.id);
  };

  const getExamConfig = (type: ExamType) => {
    const configs: Record<
      ExamType,
      {
        color: string;
        icon: React.ComponentType<{ className?: string }>;
        borderColor: string;
        bgColor: string;
        textColor: string;
        accentColor: string;
        buttonColor: string;
        skillBg: string;
        skillText: string;
        skillIcon: string;
        sections: string[];
      }
    > = {
      [ExamType.IELTS]: {
        color: "blue",
        icon: GraduationCap,
        borderColor: "border-blue-200",
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
        accentColor: "text-blue-700",
        buttonColor: "bg-blue-600 hover:bg-blue-700",
        skillBg: "bg-blue-50",
        skillText: "text-blue-700",
        skillIcon: "text-blue-600",
        sections: ["Listening", "Reading", "Writing", "Speaking"],
      },
      [ExamType.TOEFL]: {
        color: "green",
        icon: GraduationCap,
        borderColor: "border-green-200",
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        accentColor: "text-green-700",
        buttonColor: "bg-green-600 hover:bg-green-700",
        skillBg: "bg-green-50",
        skillText: "text-green-700",
        skillIcon: "text-green-600",
        sections: ["Reading", "Listening", "Speaking", "Writing"],
      },
      [ExamType.GRE]: {
        color: "purple",
        icon: Brain,
        borderColor: "border-purple-200",
        bgColor: "bg-purple-100",
        textColor: "text-purple-800",
        accentColor: "text-purple-700",
        buttonColor: "bg-purple-600 hover:bg-purple-700",
        skillBg: "bg-purple-50",
        skillText: "text-purple-700",
        skillIcon: "text-purple-600",
        sections: [
          "Verbal Reasoning",
          "Quantitative Reasoning",
          "Analytical Writing",
        ],
      },
      [ExamType.SAT]: {
        color: "orange",
        icon: GraduationCap,
        borderColor: "border-orange-200",
        bgColor: "bg-orange-100",
        textColor: "text-orange-800",
        accentColor: "text-orange-700",
        buttonColor: "bg-orange-600 hover:bg-orange-700",
        skillBg: "bg-orange-50",
        skillText: "text-orange-700",
        skillIcon: "text-orange-600",
        sections: [
          "Evidence-Based Reading",
          "Writing & Language",
          "Mathematics",
        ],
      },
      [ExamType.GMAT]: {
        color: "red",
        icon: Calculator,
        borderColor: "border-red-200",
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        accentColor: "text-red-700",
        buttonColor: "bg-red-600 hover:bg-red-700",
        skillBg: "bg-red-50",
        skillText: "text-red-700",
        skillIcon: "text-red-600",
        sections: ["Quantitative", "Verbal", "Data Insights"],
      },
    };
    return configs[type];
  };

  const config = getExamConfig(exam.type_of_exam);
  const Icon = config.icon;

  return (
    <Card
      className={cn(
        "h-full flex flex-col transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-primary/20",
        className
      )}
    >
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-medium w-fit">
              <Icon className="mr-1 h-3 w-3" />
              {exam.type_of_exam.toUpperCase()}
            </Badge>
            {exam.type_of_exam === ExamType.TOEFL && (
              <Badge variant="outline" className="text-xs w-fit">
                iBT Format
              </Badge>
            )}
            {exam.type_of_exam === ExamType.GMAT && (
              <Badge variant="outline" className="text-xs w-fit">
                Focus Edition
              </Badge>
            )}
          </div>
          <Badge variant="secondary" className="text-xs">
            Free
          </Badge>
        </div>

        <CardTitle className="text-lg line-clamp-2 leading-tight text-foreground">
          {exam.title}
        </CardTitle>

        {exam.description && (
          <CardDescription className="text-sm line-clamp-3">
            {exam.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-4 flex-grow">
        {/* Exam Section - Show only one available section */}
        <div className="space-y-2">
          {config.sections.length > 0 && (
            <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/10">
              <PenTool className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">
                {config.sections[0]} Practice
              </span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button onClick={handleStartPractice} className="w-full">
          <BookOpen className="mr-2 h-4 w-4" />
          Start Practice
        </Button>
      </CardFooter>
    </Card>
  );
};
