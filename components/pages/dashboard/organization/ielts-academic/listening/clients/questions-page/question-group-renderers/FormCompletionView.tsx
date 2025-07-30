import {
  IELTSListeningQuestionGroup,
  ListeningFormCompletionGroup,
} from "@/types/exam/ielts-academic/listening/listening";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface FormCompletionViewProps {
  group: IELTSListeningQuestionGroup;
  getQuestionTypeLabel: (type: string) => string;
}

export function FormCompletionView({
  group,
  getQuestionTypeLabel,
}: FormCompletionViewProps) {
  const typedGroup = group as ListeningFormCompletionGroup;

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
          // Helper function to highlight the blank in the sentence and add the question number before it
          const highlightBlank = (text: string) => {
            // Find the position of the blank (typically denoted by an underscore or blank space)
            const blankPattern = /(_+)|(\[\s*\.\.\.\s*\])/g;

            if (!blankPattern.test(text)) {
              return (
                <p className="text-sm sm:text-base leading-relaxed">{text}</p>
              );
            }

            // Insert the question number before the blank
            const parts = text.split(blankPattern);

            return (
              <p className="text-sm sm:text-base leading-relaxed">
                {parts.map((part, i) => {
                  // For the blank part
                  if (
                    blankPattern.test(part) ||
                    (i % 2 !== 0 && part === undefined)
                  ) {
                    return (
                      <span key={i} className="inline-flex items-center gap-1">
                        <span className="px-2 py-0.5 bg-primary/20 rounded-sm border border-primary/30 text-primary font-medium text-xs sm:text-sm">
                          _______
                        </span>
                      </span>
                    );
                  }
                  // For non-blank parts
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

      {typedGroup.options && typedGroup.options.length > 0 && (
        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t">
          <h4 className="font-medium mb-2 text-sm sm:text-base">Options</h4>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {typedGroup.options.map((option, index) => (
              <Badge
                key={index}
                variant="outline"
                className="bg-muted/30 text-xs sm:text-sm"
              >
                {option}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
