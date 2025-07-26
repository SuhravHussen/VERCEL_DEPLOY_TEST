import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { MultipleChoiceGroup } from "@/types/exam/ielts-academic/reading/question/question";

export function MultipleChoiceGroupView({
  group,
  getQuestionTypeLabel,
}: {
  group: MultipleChoiceGroup;
  getQuestionTypeLabel: (type: string) => string;
}) {
  return (
    <div className="mb-6">
      <Badge variant="secondary" className="mb-2 text-base">
        {getQuestionTypeLabel(group.questionType)}
      </Badge>
      <p className="text-sm italic text-muted-foreground mb-3">
        {group.instruction}
      </p>
      <div className="space-y-3">
        {group.questions.map((question, index) => (
          <div
            key={index}
            className="text-sm p-3 bg-muted/20 rounded-md border"
          >
            <div className="flex justify-between items-start mb-2">
              <p className="font-semibold text-primary/90">
                Question {question.number || index + 1}
              </p>
            </div>

            {question.question && (
              <p className="mt-1 font-medium">{question.question}</p>
            )}

            <ul className="space-y-2 mt-3">
              {question.options?.map((opt: string, i: number) => {
                // Extract the option letter (e.g., "A" from "A) 15%")
                const optionLetter = opt.match(/^([A-Z])\)/)?.[1];

                // Check if this option is correct based on the answer letter
                const isCorrect = question.answer === optionLetter;

                return (
                  <li
                    key={i}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-md border text-xs",
                      isCorrect
                        ? "bg-green-100 border-green-200 text-green-900 font-semibold"
                        : "bg-background"
                    )}
                  >
                    {isCorrect && <Check className="h-4 w-4" />}
                    <span>{opt}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
