"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MatchingFeaturesGroup } from "@/types/exam/ielts-academic/reading/question/question";

interface MatchingFeaturesRendererProps {
  questionGroup: MatchingFeaturesGroup;
  answers: Record<string, string | string[]>;
  onAnswerChange: (questionId: string, answer: string | string[]) => void;
}

export default function MatchingFeaturesRenderer({
  questionGroup,
  answers,
  onAnswerChange,
}: MatchingFeaturesRendererProps) {
  const getStringAnswer = (questionId: string): string => {
    const answer = answers[questionId];
    return typeof answer === "string" ? answer : "";
  };

  const features = questionGroup.features || [];

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Instructions */}
      <div className="bg-muted/30 p-3 sm:p-4 rounded-lg">
        <p className="text-xs sm:text-sm text-muted-foreground font-medium">
          Match each statement with the correct feature from the list below. You
          may use any feature more than once.
        </p>
      </div>

      {/* List of Features */}
      <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
        <h4 className="font-medium text-foreground mb-4 text-sm sm:text-base">
          List of Features:
        </h4>
        <div className="grid grid-cols-1 gap-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-3 bg-muted/20 rounded border border-border"
            >
              <span className="font-bold text-muted-foreground text-sm shrink-0 mt-0.5 w-6">
                {feature.label}
              </span>
              <span className="text-foreground text-sm leading-relaxed">
                {feature.description}
              </span>
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

          <RadioGroup
            value={getStringAnswer(`q${question.number}`)}
            onValueChange={(value) =>
              onAnswerChange(`q${question.number}`, value)
            }
            className="space-y-2 sm:space-y-3"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {features.map((feature, fIndex) => (
                <div
                  key={fIndex}
                  className="flex items-start space-x-2 p-2 rounded border border-border hover:bg-muted/20 transition-colors"
                >
                  <RadioGroupItem
                    value={feature.label}
                    id={`q${question.number}_${feature.label}`}
                    className="border-border text-primary shrink-0 mt-0.5"
                  />
                  <Label
                    htmlFor={`q${question.number}_${feature.label}`}
                    className="text-foreground cursor-pointer text-xs sm:text-sm leading-relaxed flex-1"
                  >
                    <span className="font-medium">{feature.label}</span>
                    <span className="text-xs text-muted-foreground block mt-1 line-clamp-2">
                      {feature.description.length > 40
                        ? `${feature.description.substring(0, 40)}...`
                        : feature.description}
                    </span>
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
