import React from "react";
import { ExamModel } from "@/types/exam/exam";
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
import { BookOpen, Headphones, FileText, PenTool } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface IELTSExamCardProps {
  exam: ExamModel;
  className?: string;
  onStartPractice?: (examId: string) => void;
}

export const IELTSExamCard: React.FC<IELTSExamCardProps> = ({
  exam,
  className,
}) => {
  const router = useRouter();

  let testType = "writing";

  if (exam.listening_test) {
    testType = "listening";
  } else if (exam.reading_test) {
    testType = "reading";
  } else if (exam.writing_test) {
    testType = "writing";
  }

  console.log(exam);

  const handleStartPractice = () => {
    router.push(`/exam/ielts/${testType}?practiceId=${exam.id}`);
  };

  const getIELTSType = () => {
    if (exam.title.toLowerCase().includes("academic")) return "Academic";
    if (exam.title.toLowerCase().includes("general")) return "General Training";
    return "Practice Test";
  };

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
              IELTS
            </Badge>
            <Badge variant="outline" className="text-xs w-fit">
              {getIELTSType()}
            </Badge>
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
        {/* IELTS Skill - Show only one available skill */}
        <div className="space-y-2">
          {exam.listening_test && (
            <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/10">
              <Headphones className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">
                Listening Practice
              </span>
            </div>
          )}
          {!exam.listening_test && exam.reading_test && (
            <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/10">
              <FileText className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">
                Reading Practice
              </span>
            </div>
          )}
          {!exam.listening_test && !exam.reading_test && exam.writing_test && (
            <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/10">
              <PenTool className="h-5 w-5 text-primary" />
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
