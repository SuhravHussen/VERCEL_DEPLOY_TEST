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
    <div className="rounded-md border bg-card p-4">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {getQuestionTypeLabel(group.questionType)}
          </h3>

          {typedGroup.wordLimit && (
            <Badge variant="outline" className="bg-muted/50">
              {typedGroup.wordLimitText || `Max ${typedGroup.wordLimit} words`}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {group.instruction || "No instruction provided"}
        </p>
      </div>

      <Separator className="my-4" />

      <div className="space-y-6">
        {typedGroup.questions?.map((question, qIndex) => {
          // Helper function to highlight the blank in the sentence and add the question number before it
          const highlightBlank = (text: string) => {
            // Find the position of the blank (typically denoted by an underscore or blank space)
            const blankPattern = /(_+)|(\[\s*\.\.\.\s*\])/g;

            if (!blankPattern.test(text)) {
              return <p>{text}</p>;
            }

            // Insert the question number before the blank
            const parts = text.split(blankPattern);

            return (
              <p>
                {parts.map((part, i) => {
                  // For the blank part
                  if (
                    blankPattern.test(part) ||
                    (i % 2 !== 0 && part === undefined)
                  ) {
                    return (
                      <span key={i} className="inline-flex items-center gap-1">
                        <span className="px-2 py-0.5 bg-primary/20 rounded-sm border border-primary/30 text-primary font-medium">
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
              className="space-y-2 pl-4 border-l-2 border-muted"
            >
              <h4 className="font-medium">
                Question {question.number || `${qIndex + 1}`}
              </h4>

              {highlightBlank(question.sentenceWithBlank)}

              <div className="mt-2 text-sm px-3 py-2 bg-muted/50 rounded-md inline-block">
                <span className="font-medium">Answer: </span>
                {question.correctAnswer}
              </div>
            </div>
          );
        })}
      </div>

      {typedGroup.options && typedGroup.options.length > 0 && (
        <div className="mt-6 pt-4 border-t">
          <h4 className="font-medium mb-2">Options</h4>
          <div className="flex flex-wrap gap-2">
            {typedGroup.options.map((option, index) => (
              <Badge key={index} variant="outline" className="bg-muted/30">
                {option}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
