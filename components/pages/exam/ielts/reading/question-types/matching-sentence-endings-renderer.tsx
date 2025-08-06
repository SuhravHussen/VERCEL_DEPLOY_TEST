"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MatchingSentenceEndingsGroup } from "@/types/exam/ielts-academic/reading/question/question";

interface MatchingSentenceEndingsRendererProps {
  questionGroup: MatchingSentenceEndingsGroup;
  answers: Record<string, string | string[]>;
  onAnswerChange: (questionId: string, answer: string | string[]) => void;
}

export default function MatchingSentenceEndingsRenderer({
  questionGroup,
  answers,
  onAnswerChange,
}: MatchingSentenceEndingsRendererProps) {
  const getStringAnswer = (questionId: string): string => {
    const answer = answers[questionId];
    return typeof answer === "string" ? answer : "";
  };

  const endings = questionGroup.endings || [];

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Instructions */}
      <div className="bg-muted/30 p-3 sm:p-4 rounded-lg">
        <p className="text-xs sm:text-sm text-muted-foreground font-medium">
          Complete each sentence with the correct ending from the list below.
          There are more endings than sentences, so you will not use all of
          them.
        </p>
      </div>

      {/* List of Endings */}
      <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
        <h4 className="font-medium text-foreground mb-4 text-sm sm:text-base">
          List of Endings:
        </h4>
        <div className="grid grid-cols-1 gap-3">
          {endings.map((ending, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-3 bg-muted/20 rounded border border-border"
            >
              <span className="font-bold text-muted-foreground text-sm shrink-0 mt-0.5 w-6">
                {ending.label}
              </span>
              <span className="text-foreground text-sm leading-relaxed">
                {ending.text}
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
          <div className="bg-muted/30 border border-border rounded-lg p-3 sm:p-4">
            <h4 className="font-semibold text-sm sm:text-base lg:text-lg text-foreground">
              {question.number}. {question.sentenceStart}
            </h4>
          </div>

          <RadioGroup
            value={getStringAnswer(`q${question.number}`)}
            onValueChange={(value) =>
              onAnswerChange(`q${question.number}`, value)
            }
            className="space-y-2 sm:space-y-3"
          >
            <div className="grid grid-cols-1 gap-3">
              {endings.map((ending, eIndex) => (
                <div
                  key={eIndex}
                  className="flex items-start space-x-3 p-3 rounded border border-border hover:bg-muted/20 transition-colors"
                >
                  <RadioGroupItem
                    value={ending.label}
                    id={`q${question.number}_${ending.label}`}
                    className="border-border text-primary shrink-0 mt-1"
                  />
                  <Label
                    htmlFor={`q${question.number}_${ending.label}`}
                    className="text-foreground cursor-pointer text-xs sm:text-sm leading-relaxed flex-1"
                  >
                    <div className="flex items-start space-x-2">
                      <span className="font-medium text-muted-foreground shrink-0">
                        {ending.label}
                      </span>
                      <span className="text-foreground">{ending.text}</span>
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>

          {/* Preview of complete sentence */}
          {getStringAnswer(`q${question.number}`) && (
            <div className="bg-accent/20 border border-accent/30 rounded-lg p-3 sm:p-4">
              <p className="text-accent-foreground text-xs sm:text-sm">
                <strong>Complete sentence:</strong> {question.sentenceStart}{" "}
                {endings.find(
                  (e) => e.label === getStringAnswer(`q${question.number}`)
                )?.text || ""}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
