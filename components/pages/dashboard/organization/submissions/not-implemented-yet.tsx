import { ExamType } from "@/types/exam/exam";
import { Card, CardContent } from "@/components/ui/card";
import { Construction } from "lucide-react";

interface NotImplementedYetProps {
  examType: ExamType;
}

export function NotImplementedYet({ examType }: NotImplementedYetProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Construction className="h-16 w-16 text-muted-foreground" />
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              Grading Not Available
            </h3>
            <p className="text-muted-foreground max-w-md">
              Grading for {examType.toUpperCase()} exams is not yet implemented.
              Currently, only IELTS exam grading is supported.
            </p>
            <p className="text-sm text-muted-foreground">
              Please check back later or contact support for more information.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
