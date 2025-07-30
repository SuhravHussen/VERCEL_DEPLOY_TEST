import {
  IELTSListeningQuestionGroup,
  ListeningMultipleChoiceMultipleAnswersGroup,
} from "@/types/exam/ielts-academic/listening/listening";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface MultipleChoiceMultipleAnswersGroupViewProps {
  group: IELTSListeningQuestionGroup;
  getQuestionTypeLabel: (type: string) => string;
}

export function MultipleChoiceMultipleAnswersGroupView({
  group,
  getQuestionTypeLabel,
}: MultipleChoiceMultipleAnswersGroupViewProps) {
  const typedGroup = group as ListeningMultipleChoiceMultipleAnswersGroup;

  return (
    <div className="rounded-md border bg-card p-3 sm:p-4">
      <div className="mb-3 sm:mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <h3 className="text-base sm:text-lg font-semibold">
            {getQuestionTypeLabel(group.questionType)}
          </h3>

          {typedGroup.answersRequired && (
            <Badge
              variant="outline"
              className="bg-muted/50 text-xs sm:text-sm self-start sm:self-auto"
            >
              Choose {typedGroup.answersRequired} answers
            </Badge>
          )}
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          {group.instruction || "No instruction provided"}
        </p>
      </div>

      <Separator className="my-3 sm:my-4" />

      {typedGroup.questions?.map((question, qIndex) => (
        <div key={qIndex} className="space-y-3 sm:space-y-4">
          <div className="pl-3 sm:pl-4 border-l-2 border-muted">
            <h4 className="font-medium text-sm sm:text-base">
              Question {question.number || qIndex + 1}
            </h4>

            <p className="mb-2 sm:mb-3 text-sm sm:text-base leading-relaxed">
              {question.question}
            </p>

            {/* Display all options */}
            <div className="space-y-1.5 sm:space-y-2 mt-3 sm:mt-4">
              {typedGroup.options?.map((option, oIndex) => {
                // Check if this option is among the correct answers
                const optionLetter = option.split(" ")[0]; // Extract "A", "B", etc.
                const isCorrect = question.answers.includes(optionLetter);

                return (
                  <div
                    key={oIndex}
                    className={`flex items-start gap-2 p-2 sm:p-2 rounded-md ${
                      isCorrect ? "bg-primary/10 border border-primary/20" : ""
                    }`}
                  >
                    <div
                      className={`h-3 w-3 rounded-full mt-1 sm:mt-1.5 flex-shrink-0 ${
                        isCorrect ? "bg-primary" : "bg-muted-foreground/40"
                      }`}
                    />
                    <div className="flex-grow text-sm sm:text-base leading-relaxed">
                      {option}
                    </div>
                    {isCorrect && (
                      <Badge
                        variant="outline"
                        className="bg-primary/20 text-primary text-xs sm:text-sm self-start"
                      >
                        Correct
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-3 sm:mt-4">
              <span className="font-medium text-xs sm:text-sm">
                Correct answers:{" "}
              </span>
              <div className="inline-flex flex-wrap gap-1 mt-1">
                {question.answers.map((answer, aIndex) => (
                  <Badge
                    key={aIndex}
                    variant="outline"
                    className="bg-primary/10 text-xs sm:text-sm"
                  >
                    {answer}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
