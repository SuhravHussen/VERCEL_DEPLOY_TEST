/* eslint-disable @next/next/no-img-element */
"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MatchingInformationGroup } from "@/types/exam/ielts-academic/reading/question/question";

interface MatchingInformationRendererProps {
  questionGroup: MatchingInformationGroup;
  answers: Record<string, string | string[]>;
  onAnswerChange: (questionId: string, answer: string | string[]) => void;
}

export default function MatchingInformationRenderer({
  questionGroup,
  answers,
  onAnswerChange,
}: MatchingInformationRendererProps) {
  const getStringAnswer = (questionId: string): string => {
    const answer = answers[questionId];
    return typeof answer === "string" ? answer : "";
  };

  const paragraphLabels = questionGroup.paragraphLabels || [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
  ];

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Instructions */}
      <div className="bg-muted/30 p-3 sm:p-4 rounded-lg">
        <p className="text-xs sm:text-sm text-muted-foreground font-medium">
          Match each statement with the correct paragraph (
          {paragraphLabels.join(", ")}). You may use any letter more than once.
        </p>
      </div>

      {/* Paragraph reference */}
      <div className="bg-card border border-border rounded-lg p-3 sm:p-4">
        <h4 className="text-sm font-medium text-foreground mb-2">
          Paragraph Labels:
        </h4>
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
          {paragraphLabels.map((label) => (
            <div
              key={label}
              className="flex items-center justify-center w-8 h-8 bg-muted/20 border border-border rounded font-medium text-sm"
            >
              {label}
            </div>
          ))}
        </div>
      </div>

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

          {question.imageUrl && (
            <div className="my-3">
              <img
                src={question.imageUrl}
                alt={`Question ${question.number} diagram`}
                className="max-w-full h-auto rounded border"
              />
            </div>
          )}

          <RadioGroup
            value={getStringAnswer(`q${question.number}`)}
            onValueChange={(value) =>
              onAnswerChange(`q${question.number}`, value)
            }
            className="space-y-2 sm:space-y-3"
          >
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
              {paragraphLabels.map((label) => (
                <div key={label} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={label}
                    id={`q${question.number}_${label}`}
                    className="border-border text-primary shrink-0"
                  />
                  <Label
                    htmlFor={`q${question.number}_${label}`}
                    className="text-foreground cursor-pointer text-xs sm:text-sm lg:text-base font-medium"
                  >
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
      ))}
    </div>
  );
}
