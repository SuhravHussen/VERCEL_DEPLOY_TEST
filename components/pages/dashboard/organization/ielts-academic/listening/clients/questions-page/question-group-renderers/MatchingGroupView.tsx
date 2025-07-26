import {
  IELTSListeningQuestionGroup,
  ListeningMatchingGroup,
} from "@/types/exam/ielts-academic/listening/listening";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft } from "lucide-react";

interface MatchingGroupViewProps {
  group: IELTSListeningQuestionGroup;
  getQuestionTypeLabel: (type: string) => string;
}

export function MatchingGroupView({
  group,
  getQuestionTypeLabel,
}: MatchingGroupViewProps) {
  const typedGroup = group as ListeningMatchingGroup;

  return (
    <div className="rounded-md border bg-card p-4">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {getQuestionTypeLabel(group.questionType)}
          </h3>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {group.instruction || "No instruction provided"}
        </p>
      </div>

      <Separator className="my-4" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column: Questions */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground mb-2">
            Questions
          </h4>

          {typedGroup.questions?.map((question, qIndex) => (
            <div
              key={qIndex}
              className="flex items-center gap-2 p-3 rounded-md border bg-muted/10"
            >
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center font-medium text-sm">
                {question.number || qIndex + 1}
              </div>
              <div className="flex-grow">{question.prompt}</div>
              <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
        </div>

        {/* Right column: Options and answers */}
        <div>
          <h4 className="font-medium text-sm text-muted-foreground mb-2">
            Options
          </h4>

          <div className="space-y-2 mb-6">
            {typedGroup.options?.map((option, oIndex) => {
              // Find if this option is a correct match for any question
              const matchedQuestion = typedGroup.questions?.find(
                (q) => q.correctMatch === option
              );

              return (
                <div
                  key={oIndex}
                  className={`p-2 rounded-md border ${
                    matchedQuestion
                      ? "border-primary/30 bg-primary/10"
                      : "bg-muted/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={matchedQuestion ? "font-medium" : ""}>
                      {option}
                    </span>

                    {matchedQuestion && (
                      <Badge
                        variant="outline"
                        className="bg-primary/20 text-primary"
                      >
                        Q{matchedQuestion.number || "?"}
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <h4 className="font-medium text-sm mb-2">Answer Key</h4>
          <div className="space-y-1 pl-2 text-sm">
            {typedGroup.questions?.map((question, qIndex) => (
              <div key={qIndex} className="flex items-center gap-2">
                <span className="font-medium">
                  Q{question.number || qIndex + 1}:
                </span>
                <span>{question.correctMatch}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
