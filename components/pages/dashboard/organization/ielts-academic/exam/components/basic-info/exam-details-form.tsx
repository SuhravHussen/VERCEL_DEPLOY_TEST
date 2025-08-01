"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { DatePicker } from "@/components/ui/date-picker";
import { ExamModel } from "@/types/exam/exam";
import { ValidationErrors } from "@/types/exam/ielts-academic/exam-creation";

interface ExamDetailsFormProps {
  examData: Partial<ExamModel>;
  errors: ValidationErrors;
  onInputChange: (
    field: keyof ExamModel,
    value: string | number | boolean
  ) => void;
  isAdmin?: boolean;
}

export const ExamDetailsForm: React.FC<ExamDetailsFormProps> = ({
  examData,
  errors,
  onInputChange,
  isAdmin,
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
            onChange={(e) =>
              onInputChange("max_students", parseInt(e.target.value) || 0)
            }
            placeholder="50"
            min="1"
            className="bg-background border-border text-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="registration_deadline" className="text-foreground">
            Registration Deadline
          </Label>
          <DatePicker
            value={
              examData.registration_deadline
                ? new Date(examData.registration_deadline)
                : undefined
            }
            onChange={(date) =>
              onInputChange(
                "registration_deadline",
                date ? date.toISOString() : ""
              )
            }
            placeholder="Select registration deadline"
            minDate={new Date()}
            className={`w-full ${
              errors.registration_deadline ? "border-destructive" : ""
            }`}
          />
          {errors.registration_deadline && (
            <p className="text-sm text-destructive">
              {errors.registration_deadline}
            </p>
          )}
        </div>

        {isAdmin && (
          <div className="flex items-center space-x-2">
            <Switch
              id="is_practice_exam"
              checked={examData.is_practice_exam || false}
              onCheckedChange={(checked) =>
                onInputChange("is_practice_exam", checked)
              }
            />
            <Label htmlFor="is_practice_exam" className="text-foreground">
              Practice Exam (This is a practice exam for students)
            </Label>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Switch
            id="is_published"
            checked={examData.is_published || false}
            onCheckedChange={(checked) =>
              onInputChange("is_published", checked)
            }
          />
          <Label htmlFor="is_published" className="text-foreground">
            Publish Exam (Students can see and register for this exam)
          </Label>
        </div>
      </CardContent>
    </Card>
  );
};
