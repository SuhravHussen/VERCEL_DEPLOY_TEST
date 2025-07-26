import { Badge } from "@/components/ui/badge";
import { IELTSReadingQuestionGroup } from "@/types/exam/ielts-academic/reading/question/question";
import { Check } from "lucide-react";

export function TrueFalseYesNoGroupView({
  group,
  getQuestionTypeLabel,
}: {
  group: IELTSReadingQuestionGroup;
  getQuestionTypeLabel: (type: string) => string;
}) {
  const options =
    group.questionType === "true_false_not_given"
      ? ["TRUE", "FALSE", "NOT GIVEN"]
      : ["YES", "NO", "NOT GIVEN"];

  return (
    <div className="mb-6">
      <Badge variant="secondary" className="mb-2 text-base">
        {getQuestionTypeLabel(group.questionType)}
      </Badge>
      <p className="text-sm italic text-muted-foreground mb-3">
        {group.instruction}
      </p>

      <div className="space-y-3">
        {group.questions.map((q, i) => (
          <div key={i} className="text-sm p-3 bg-muted/20 rounded-md border">
            <p className="font-medium mb-3">
              {q.number || i + 1}. {q.statement}
            </p>
            <div className="flex items-center gap-2">
              {options.map((opt) => {
                // Normalize the answer for comparison:
                // 1. Convert to uppercase
                // 2. Replace underscore with space for "not_given"
                let normalizedAnswer = q.answer?.toUpperCase() || "";
                normalizedAnswer = normalizedAnswer.replace("_", " ");

                const isSelected = normalizedAnswer === opt;
                return (
                  <Badge
                    key={opt}
                    variant={isSelected ? "default" : "outline"}
                    className={
                      isSelected ? "bg-primary text-primary-foreground" : ""
                    }
                  >
                    {isSelected && <Check className="h-3.5 w-3.5 mr-1" />}
                    {opt}
                  </Badge>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
