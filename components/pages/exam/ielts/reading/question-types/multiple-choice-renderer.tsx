"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MultipleChoiceGroup } from "@/types/exam/ielts-academic/reading/question/question";

interface MultipleChoiceRendererProps {
  questionGroup: MultipleChoiceGroup;
  answers: Record<string, string | string[]>;
  onAnswerChange: (questionId: string, answer: string | string[]) => void;
}

export default function MultipleChoiceRenderer({
  questionGroup,
  answers,
  onAnswerChange,
}: MultipleChoiceRendererProps) {
  const getStringAnswer = (questionId: string): string => {
    const answer = answers[questionId];
    return typeof answer === "string" ? answer : "";
  };

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
            {question.number}. {question.question}
          </h4>
          <RadioGroup
            value={getStringAnswer(`q${question.number}`)}
            onValueChange={(value) =>
              onAnswerChange(`q${question.number}`, value)
            }
            className="space-y-2 sm:space-y-3"
          >
            {question.options.map((option, optionIndex) => (
              <div
                key={optionIndex}
                className="flex items-start space-x-2 sm:space-x-3"
              >
                <RadioGroupItem
                  value={option}
                  id={`q${question.number}_${optionIndex}`}
                  className="border-border text-primary mt-0.5 shrink-0"
                />
                <Label
                  htmlFor={`q${question.number}_${optionIndex}`}
                  className="text-foreground cursor-pointer text-xs sm:text-sm lg:text-base leading-relaxed"
                >
                  {String.fromCharCode(65 + optionIndex)} {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      ))}
    </div>
  );
}
