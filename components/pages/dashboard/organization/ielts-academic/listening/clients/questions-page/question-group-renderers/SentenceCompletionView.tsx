import {
  IELTSListeningQuestionGroup,
  ListeningSentenceCompletionGroup,
} from "@/types/exam/ielts-academic/listening/listening";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface SentenceCompletionViewProps {
  group: IELTSListeningQuestionGroup;
  getQuestionTypeLabel: (type: string) => string;
}

export function SentenceCompletionView({
  group,
  getQuestionTypeLabel,
}: SentenceCompletionViewProps) {
  const typedGroup = group as ListeningSentenceCompletionGroup;

  return (
    <div className="rounded-md border bg-card p-3 sm:p-4">
      <div className="mb-3 sm:mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <h3 className="text-base sm:text-lg font-semibold">
            {getQuestionTypeLabel(group.questionType)}
          </h3>

          {typedGroup.wordLimit && (
            <Badge
              variant="outline"
              className="bg-muted/50 text-xs sm:text-sm self-start sm:self-auto"
            >
              {typedGroup.wordLimitText || `Max ${typedGroup.wordLimit} words`}
            </Badge>
          )}
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          {group.instruction || "No instruction provided"}
        </p>
      </div>

      <Separator className="my-3 sm:my-4" />

      <div className="space-y-4 sm:space-y-6">
        {typedGroup.questions?.map((question, qIndex) => {
          // Helper function to highlight the blank in the sentence
          const highlightBlank = (text: string) => {
            // Find the position of the blank (typically denoted by an underscore or blank space)
            const blankPattern = /(_+)|(\[\s*\.\.\.\s*\])/g;

            if (!blankPattern.test(text)) {
              return (
                <p className="text-sm sm:text-base leading-relaxed">{text}</p>
              );
            }

            const parts = text.split(blankPattern);

            return (
              <p className="text-sm sm:text-base leading-relaxed">
                {parts.map((part, i) => {
                  if (
                    blankPattern.test(part) ||
                    (i % 2 !== 0 && part === undefined)
                  ) {
                    return (
                      <span
                        key={i}
                        className="px-2 py-0.5 mx-1 bg-primary/20 rounded-sm border border-primary/30 text-primary font-medium text-xs sm:text-sm"
                      >
                        _______
                      </span>
                    );
                  }
                  return <span key={i}>{part}</span>;
                })}
              </p>
            );
          };

          return (
            <div
              key={qIndex}
              className="space-y-2 pl-3 sm:pl-4 border-l-2 border-muted"
            >
              <h4 className="font-medium text-sm sm:text-base">
                Question {question.number || `${qIndex + 1}`}
              </h4>

              {highlightBlank(question.sentenceWithBlank)}

              <div className="mt-2 text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2 bg-muted/50 rounded-md inline-block">
                <span className="font-medium">Answer: </span>
                {question.correctAnswer}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
