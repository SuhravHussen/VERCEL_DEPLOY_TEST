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
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface BaseExamCardProps {
  exam: ExamModel;
  className?: string;
  onStartPractice?: (examId: string) => void;
}

export const BaseExamCard: React.FC<BaseExamCardProps> = ({
  exam,
  className,
  onStartPractice,
}) => {
  const getExamTypeColor = (type: ExamType) => {
    const colors = {
      [ExamType.IELTS]: "bg-blue-100 text-blue-800 border-blue-200",
      [ExamType.TOEFL]: "bg-green-100 text-green-800 border-green-200",
      [ExamType.GRE]: "bg-purple-100 text-purple-800 border-purple-200",
      [ExamType.SAT]: "bg-orange-100 text-orange-800 border-orange-200",
      [ExamType.GMAT]: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[type] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const handleStartPractice = () => {
    onStartPractice?.(exam.id);
  };

  return (
    <Card
      className={cn(
        "h-full flex flex-col transition-all duration-200 hover:shadow-md hover:scale-[1.02]",
        className
      )}
    >
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between">
          <Badge
            variant="outline"
            className={cn(
              "text-xs font-medium",
              getExamTypeColor(exam.type_of_exam)
            )}
          >
            {exam.type_of_exam.toUpperCase()}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            Free
          </Badge>
        </div>

        <CardTitle className="text-lg line-clamp-2 leading-tight">
          {exam.title}
        </CardTitle>

        {exam.description && (
          <CardDescription className="text-sm line-clamp-3">
            {exam.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-4 flex-grow">
        {/* Available Skill - Show only one */}
        <div className="space-y-2">
          {exam.listening_test && (
            <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">
                Listening Practice
              </span>
            </div>
          )}
          {!exam.listening_test && exam.reading_test && (
            <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">
                Reading Practice
              </span>
            </div>
          )}
          {!exam.listening_test && !exam.reading_test && exam.writing_test && (
            <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">
                Writing Practice
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
