import {
  IELTSListeningQuestionGroup,
  ListeningShortAnswerGroup,
} from "@/types/exam/ielts-academic/listening/listening";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface ShortAnswerGroupViewProps {
  group: IELTSListeningQuestionGroup;
  getQuestionTypeLabel: (type: string) => string;
}

export function ShortAnswerGroupView({
  group,
  getQuestionTypeLabel,
}: ShortAnswerGroupViewProps) {
  const typedGroup = group as ListeningShortAnswerGroup;

  return (
    <div className="rounded-md border bg-card p-3 sm:p-4">
      <div className="mb-3 sm:mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <h3 className="text-base sm:text-lg font-semibold">
            {getQuestionTypeLabel(group.questionType)}
          </h3>

          {typedGroup.maxWords && (
            <Badge
              variant="outline"
              className="bg-muted/50 text-xs sm:text-sm self-start sm:self-auto"
            >
              {typedGroup.wordLimitText || `Max ${typedGroup.maxWords} words`}
            </Badge>
          )}
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          {group.instruction || "No instruction provided"}
        </p>
      </div>

      <Separator className="my-3 sm:my-4" />

      <div className="space-y-4 sm:space-y-6">
        {typedGroup.questions?.map((question, qIndex) => (
          <div
            key={qIndex}
            className="space-y-2 pl-3 sm:pl-4 border-l-2 border-muted"
          >
            <h4 className="font-medium text-sm sm:text-base">
              Question {question.number || `${qIndex + 1}`}
            </h4>

            <p className="mb-2 text-sm sm:text-base leading-relaxed">
              {question.question}
            </p>

            <div className="px-2.5 sm:px-3 py-2 bg-muted/30 rounded-md border border-dashed border-muted-foreground/20 text-xs sm:text-sm text-muted-foreground">
              <span className="font-medium">Write your answer here</span>
            </div>

            <div className="mt-2 text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2 bg-muted/50 rounded-md inline-block">
              <span className="font-medium">Answer: </span>
              {question.correctAnswer}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
