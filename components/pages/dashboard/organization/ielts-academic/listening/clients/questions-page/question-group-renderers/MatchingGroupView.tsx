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
    <div className="rounded-md border bg-card p-3 sm:p-4">
      <div className="mb-3 sm:mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <h3 className="text-base sm:text-lg font-semibold">
            {getQuestionTypeLabel(group.questionType)}
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          {group.instruction || "No instruction provided"}
        </p>
      </div>

      <Separator className="my-3 sm:my-4" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Left column: Questions */}
        <div className="space-y-3 sm:space-y-4">
          <h4 className="font-medium text-xs sm:text-sm text-muted-foreground mb-2">
            Questions
          </h4>

          {typedGroup.questions?.map((question, qIndex) => (
            <div
              key={qIndex}
              className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2 p-2.5 sm:p-3 rounded-md border bg-muted/10"
            >
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center font-medium text-xs sm:text-sm">
                {question.number || qIndex + 1}
              </div>
              <div className="flex-grow text-sm sm:text-base leading-relaxed">
                {question.prompt}
              </div>
              <ArrowRightLeft className="h-4 w-4 text-muted-foreground self-start sm:self-center mt-1 sm:mt-0" />
            </div>
          ))}
        </div>

        {/* Right column: Options and answers */}
        <div>
          <h4 className="font-medium text-xs sm:text-sm text-muted-foreground mb-2">
            Options
          </h4>

          <div className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
            {typedGroup.options?.map((option, oIndex) => {
              // Find if this option is a correct match for any question
              const matchedQuestion = typedGroup.questions?.find(
                (q) => q.correctMatch === option
              );

              return (
                <div
                  key={oIndex}
                  className={`p-2 sm:p-2 rounded-md border ${
                    matchedQuestion
                      ? "border-primary/30 bg-primary/10"
                      : "bg-muted/10"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span
                      className={`text-sm sm:text-base leading-relaxed ${
                        matchedQuestion ? "font-medium" : ""
                      }`}
                    >
                      {option}
                    </span>

                    {matchedQuestion && (
                      <Badge
                        variant="outline"
                        className="bg-primary/20 text-primary text-xs sm:text-sm self-start sm:self-auto"
                      >
                        Q{matchedQuestion.number || "?"}
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <h4 className="font-medium text-sm sm:text-base mb-2">Answer Key</h4>
          <div className="space-y-1 pl-2 text-xs sm:text-sm">
            {typedGroup.questions?.map((question, qIndex) => (
              <div
                key={qIndex}
                className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2"
              >
                <span className="font-medium">
                  Q{question.number || qIndex + 1}:
                </span>
                <span className="leading-relaxed">{question.correctMatch}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
