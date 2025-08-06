"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MatchingHeadingsGroup } from "@/types/exam/ielts-academic/reading/question/question";

interface MatchingHeadingsRendererProps {
  questionGroup: MatchingHeadingsGroup;
  answers: Record<string, string | string[]>;
  onAnswerChange: (questionId: string, answer: string | string[]) => void;
}

export default function MatchingHeadingsRenderer({
  questionGroup,
  answers,
  onAnswerChange,
}: MatchingHeadingsRendererProps) {
  const getStringAnswer = (questionId: string): string => {
    const answer = answers[questionId];
    return typeof answer === "string" ? answer : "";
  };

  const headings = questionGroup.headings || [];

  // Generate roman numerals for headings
  const romanNumerals = [
    "i",
    "ii",
    "iii",
    "iv",
    "v",
    "vi",
    "vii",
    "viii",
    "ix",
    "x",
    "xi",
    "xii",
  ];

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Instructions */}
      <div className="bg-muted/30 p-3 sm:p-4 rounded-lg">
        <p className="text-xs sm:text-sm text-muted-foreground font-medium">
          Choose the correct heading for each paragraph from the list of
          headings below. There are more headings than paragraphs, so you will
          not use all of them.
        </p>
      </div>

      {/* List of Headings */}
      <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
        <h4 className="font-medium text-foreground mb-4 text-sm sm:text-base">
          List of Headings:
        </h4>
        <div className="grid grid-cols-1 gap-3">
          {headings.map((heading, index) => (
            <div key={index} className="flex items-start space-x-3">
              <span className="font-medium text-muted-foreground text-sm shrink-0 mt-0.5">
                {romanNumerals[index]}
              </span>
              <span className="text-foreground text-sm leading-relaxed">
                {heading}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Questions */}
      {questionGroup.questions.map((question, questionIndex) => (
        <div
          key={questionIndex}
          className="space-y-3 sm:space-y-4 scroll-mt-20"
        >
          <h4 className="font-semibold text-sm sm:text-base lg:text-lg text-foreground">
            Paragraph {question.paragraph}
          </h4>

          <RadioGroup
            value={getStringAnswer(`paragraph_${question.paragraph}`)}
            onValueChange={(value) =>
              onAnswerChange(`paragraph_${question.paragraph}`, value)
            }
            className="space-y-2 sm:space-y-3"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {headings.map((heading, hIndex) => {
                const romanNumeral = romanNumerals[hIndex];
                return (
                  <div
                    key={hIndex}
                    className="flex items-start space-x-2 p-2 rounded border border-border hover:bg-muted/20 transition-colors"
                  >
                    <RadioGroupItem
                      value={romanNumeral}
                      id={`paragraph_${question.paragraph}_${romanNumeral}`}
                      className="border-border text-primary shrink-0 mt-0.5"
                    />
                    <Label
                      htmlFor={`paragraph_${question.paragraph}_${romanNumeral}`}
                      className="text-foreground cursor-pointer text-xs sm:text-sm leading-relaxed flex-1"
                    >
                      <span className="font-medium">{romanNumeral}</span>
                      <span className="text-xs text-muted-foreground block mt-1 line-clamp-2">
                        {heading.length > 50
                          ? `${heading.substring(0, 50)}...`
                          : heading}
                      </span>
                    </Label>
                  </div>
                );
              })}
            </div>
          </RadioGroup>
        </div>
      ))}
    </div>
  );
}
