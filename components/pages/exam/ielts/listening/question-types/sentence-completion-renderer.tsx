"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ListeningSentenceCompletionGroup } from "@/types/exam/ielts-academic/listening/listening";

interface SentenceCompletionRendererProps {
  questionGroup: ListeningSentenceCompletionGroup;
  answers: Record<string, string | string[]>;
  onAnswerChange: (questionId: string, answer: string | string[]) => void;
}

export default function SentenceCompletionRenderer({
  questionGroup,
  answers,
  onAnswerChange,
}: SentenceCompletionRendererProps) {
  const getStringAnswer = (questionId: string): string => {
    const answer = answers[questionId];
    return typeof answer === "string" ? answer : "";
  };

  const renderSentenceWithBlank = (
    sentence: string,
    questionNumber: number
  ) => {
    // Split sentence by underscores or common blank patterns
    const parts = sentence.split(/(_+|\[.*?\]|\.\.\.|___)/);

    return (
      <div className="flex flex-wrap items-center gap-2">
        {parts.map((part, index) => {
          if (part.match(/^(_+|\[.*?\]|\.\.\.|___)$/)) {
            return (
              <Input
                key={index}
                value={getStringAnswer(`q${questionNumber}`)}
                onChange={(e) =>
                  onAnswerChange(`q${questionNumber}`, e.target.value)
                }
                className="inline-block w-32 h-8 text-center border-b-2 border-x-0 border-t-0 rounded-none bg-transparent border-border focus:border-primary text-foreground"
                placeholder={`${questionNumber}`}
              />
            );
          }
          return (
            <span key={index} className="text-foreground">
              {part}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Word limit instruction */}
      {questionGroup.wordLimit && (
        <div className="bg-muted/30 p-3 sm:p-4 rounded-lg">
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">
            {questionGroup.wordLimitText ||
              `Write NO MORE THAN ${questionGroup.wordLimit} WORDS for each answer.`}
          </p>
        </div>
      )}

      {/* Questions */}
      <div className="space-y-4 sm:space-y-5 lg:space-y-6">
        {questionGroup.questions.map((question) => (
          <div
            key={question.number}
            id={`question-${question.number}`}
            data-question={question.number}
            className="space-y-2 sm:space-y-3 scroll-mt-20"
          >
            <Label className="font-medium text-foreground text-xs sm:text-sm lg:text-base block">
              {question.number}.
            </Label>
            <div className="text-xs sm:text-sm lg:text-base leading-relaxed">
              {renderSentenceWithBlank(
                question.sentenceWithBlank,
                question.number
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
