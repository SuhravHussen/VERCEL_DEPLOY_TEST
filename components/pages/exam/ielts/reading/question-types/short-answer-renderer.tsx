"use client";

import { Input } from "@/components/ui/input";
import { ShortAnswerGroup } from "@/types/exam/ielts-academic/reading/question/question";

interface ShortAnswerRendererProps {
  questionGroup: ShortAnswerGroup;
  answers: Record<string, string | string[]>;
  onAnswerChange: (questionId: string, answer: string | string[]) => void;
}

export default function ShortAnswerRenderer({
  questionGroup,
  answers,
  onAnswerChange,
}: ShortAnswerRendererProps) {
  const getStringAnswer = (questionId: string): string => {
    const answer = answers[questionId];
    return typeof answer === "string" ? answer : "";
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Word limit information */}
      {questionGroup.wordLimitText && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
          <p className="text-blue-800 text-xs sm:text-sm font-medium">
            {questionGroup.wordLimitText}
          </p>
        </div>
      )}

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
          <Input
            type="text"
            value={getStringAnswer(`q${question.number}`)}
            onChange={(e) =>
              onAnswerChange(`q${question.number}`, e.target.value)
            }
            placeholder="Enter your answer"
            className="max-w-md border-border focus:border-primary"
          />
        </div>
      ))}
    </div>
  );
}
