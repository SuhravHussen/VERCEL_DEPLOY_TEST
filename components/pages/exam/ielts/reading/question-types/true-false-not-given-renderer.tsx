"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TrueFalseNotGivenGroup } from "@/types/exam/ielts-academic/reading/question/question";

interface TrueFalseNotGivenRendererProps {
  questionGroup: TrueFalseNotGivenGroup;
  answers: Record<string, string | string[]>;
  onAnswerChange: (questionId: string, answer: string | string[]) => void;
}

export default function TrueFalseNotGivenRenderer({
  questionGroup,
  answers,
  onAnswerChange,
}: TrueFalseNotGivenRendererProps) {
  const getStringAnswer = (questionId: string): string => {
    const answer = answers[questionId];
    return typeof answer === "string" ? answer : "";
  };

  const options = [
    { value: "true", label: "TRUE" },
    { value: "false", label: "FALSE" },
    { value: "not_given", label: "NOT GIVEN" },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Questions */}
      {questionGroup.questions.map((question) => (
        <div
          key={question.number}
          id={`question-${question.number}`}
          data-question={question.number}
          className="space-y-3 sm:space-y-4 scroll-mt-20"
        >
          <h4 className="font-semibold text-sm sm:text-base lg:text-lg text-foreground">
            {question.number}. {question.statement}
          </h4>
          <RadioGroup
            value={getStringAnswer(`q${question.number}`)}
            onValueChange={(value) =>
              onAnswerChange(`q${question.number}`, value)
            }
            className="space-y-2 sm:space-y-3"
          >
            {options.map((option) => (
              <div
                key={option.value}
                className="flex items-start space-x-2 sm:space-x-3"
              >
                <RadioGroupItem
                  value={option.value}
                  id={`q${question.number}_${option.value}`}
                  className="border-border text-primary mt-0.5 shrink-0"
                />
                <Label
                  htmlFor={`q${question.number}_${option.value}`}
                  className="text-foreground cursor-pointer text-xs sm:text-sm lg:text-base leading-relaxed"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      ))}
    </div>
  );
}
