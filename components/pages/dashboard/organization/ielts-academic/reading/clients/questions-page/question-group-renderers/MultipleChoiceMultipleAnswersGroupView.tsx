import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { MultipleChoiceMultipleAnswersGroup } from "@/types/exam/ielts-academic/reading/question/question";

export function MultipleChoiceMultipleAnswersGroupView({
  group,
  getQuestionTypeLabel,
}: {
  group: MultipleChoiceMultipleAnswersGroup;
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
              <Badge
                variant="outline"
                className="text-xs font-semibold bg-blue-100 text-blue-800 border-blue-300"
              >
                {group.answersRequired || question.answers.length} answers
                required
              </Badge>
            </div>

            {question.question && (
              <p className="mt-1 font-medium">{question.question}</p>
            )}

            <ul className="space-y-2 mt-3">
              {group.options?.map((opt: string, i: number) => {
                // Extract the option letter (e.g., "A" from "A) Text")
                const optionLetter = opt.match(/^([A-Z])\)/)?.[1];

                // Check if this option is among the correct answers (with null check)
                const isCorrect = optionLetter
                  ? question.answers.includes(optionLetter)
                  : false;

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
