"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IELTSExamModel } from "@/types/exam/ielts-academic/exam";
import { ValidationErrors } from "@/types/exam/ielts-academic/exam-creation";

interface ExamDetailsFormProps {
  examData: Partial<IELTSExamModel>;
  errors: ValidationErrors;
  onInputChange: (field: keyof IELTSExamModel, value: string | number) => void;
}

export const ExamDetailsForm: React.FC<ExamDetailsFormProps> = ({
  examData,
  errors,
  onInputChange,
}) => {
  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle className="text-lg text-foreground">Exam Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-foreground">
            Exam Title *
          </Label>
          <Input
            id="title"
            value={examData.title || ""}
            onChange={(e) => onInputChange("title", e.target.value)}
            placeholder="e.g., IELTS Academic - March 2024"
            className={`bg-background border-border text-foreground ${
              errors.title ? "border-destructive" : ""
            }`}
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-foreground">
            Description
          </Label>
          <Textarea
            id="description"
            value={examData.description || ""}
            onChange={(e) => onInputChange("description", e.target.value)}
            placeholder="Brief description of the exam (optional)"
            rows={3}
            className="bg-background border-border text-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="max_students" className="text-foreground">
            Maximum Students
          </Label>
          <Input
            id="max_students"
            type="number"
            value={examData.max_students || ""}
            onChange={(e) => onInputChange("max_students", parseInt(e.target.value) || 0)}
            placeholder="50"
            min="1"
            className="bg-background border-border text-foreground"
          />
        </div>
      </CardContent>
    </Card>
  );
};
