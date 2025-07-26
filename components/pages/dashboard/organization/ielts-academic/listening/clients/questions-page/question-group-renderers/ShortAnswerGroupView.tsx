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
    <div className="rounded-md border bg-card p-4">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {getQuestionTypeLabel(group.questionType)}
          </h3>

          {typedGroup.maxWords && (
            <Badge variant="outline" className="bg-muted/50">
              {typedGroup.wordLimitText || `Max ${typedGroup.maxWords} words`}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {group.instruction || "No instruction provided"}
        </p>
      </div>

      <Separator className="my-4" />

      <div className="space-y-6">
        {typedGroup.questions?.map((question, qIndex) => (
          <div key={qIndex} className="space-y-2 pl-4 border-l-2 border-muted">
            <h4 className="font-medium">
              Question {question.number || `${qIndex + 1}`}
            </h4>

            <p className="mb-2">{question.question}</p>

            <div className="px-3 py-2 bg-muted/30 rounded-md border border-dashed border-muted-foreground/20 text-sm text-muted-foreground">
              <span className="font-medium">Write your answer here</span>
            </div>

            <div className="mt-2 text-sm px-3 py-2 bg-muted/50 rounded-md inline-block">
              <span className="font-medium">Answer: </span>
              {question.correctAnswer}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
