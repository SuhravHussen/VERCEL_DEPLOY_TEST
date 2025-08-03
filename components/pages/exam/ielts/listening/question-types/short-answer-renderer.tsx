"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ListeningShortAnswerGroup } from "@/types/exam/ielts-academic/listening/listening";

interface ShortAnswerRendererProps {
  questionGroup: ListeningShortAnswerGroup;
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

  const maxWords = questionGroup.maxWords || 3;
  const useTextarea = maxWords > 5; // Use textarea for longer answers

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Word limit instruction */}
      <div className="bg-muted/30 p-3 sm:p-4 rounded-lg">
        <p className="text-xs sm:text-sm text-muted-foreground font-medium">
          {questionGroup.wordLimitText ||
            `Write NO MORE THAN ${maxWords} WORDS for each answer.`}
        </p>
      </div>

      {/* Questions */}
      <div className="space-y-4 sm:space-y-6 lg:space-y-8">
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

            <div className="space-y-2 sm:space-y-3">
              <Label
                htmlFor={`q${question.number}`}
                className="text-muted-foreground text-xs sm:text-sm"
              >
                Your answer (max {maxWords} words):
              </Label>

              {useTextarea ? (
                <Textarea
                  id={`q${question.number}`}
                  value={getStringAnswer(`q${question.number}`)}
                  onChange={(e) =>
                    onAnswerChange(`q${question.number}`, e.target.value)
                  }
                  placeholder="Type your answer here..."
                  className="w-full sm:max-w-lg border-border bg-background text-foreground focus:border-primary resize-none text-xs sm:text-sm"
                  rows={3}
                />
              ) : (
                <Input
                  id={`q${question.number}`}
                  value={getStringAnswer(`q${question.number}`)}
                  onChange={(e) =>
                    onAnswerChange(`q${question.number}`, e.target.value)
                  }
                  placeholder="Type your answer here..."
                  className="w-full sm:max-w-lg border-border bg-background text-foreground focus:border-primary text-xs sm:text-sm"
                />
              )}

              {/* Word count display */}
              <div className="text-xs text-muted-foreground">
                Words:{" "}
                {
                  getStringAnswer(`q${question.number}`)
                    .trim()
                    .split(/\s+/)
                    .filter((word) => word.length > 0).length
                }{" "}
                / {maxWords}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
