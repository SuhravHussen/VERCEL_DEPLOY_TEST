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
    <div className="rounded-md border bg-card p-4">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {getQuestionTypeLabel(group.questionType)}
          </h3>

          {typedGroup.answersRequired && (
            <Badge variant="outline" className="bg-muted/50">
              Choose {typedGroup.answersRequired} answers
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {group.instruction || "No instruction provided"}
        </p>
      </div>

      <Separator className="my-4" />

      {typedGroup.questions?.map((question, qIndex) => (
        <div key={qIndex} className="space-y-4">
          <div className="pl-4 border-l-2 border-muted">
            <h4 className="font-medium">
              Question {question.number || qIndex + 1}
            </h4>

            <p className="mb-3">{question.question}</p>

            {/* Display all options */}
            <div className="space-y-2 mt-4">
              {typedGroup.options?.map((option, oIndex) => {
                // Check if this option is among the correct answers
                const optionLetter = option.split(" ")[0]; // Extract "A", "B", etc.
                const isCorrect = question.answers.includes(optionLetter);

                return (
                  <div
                    key={oIndex}
                    className={`flex items-center gap-2 p-2 rounded-md ${
                      isCorrect ? "bg-primary/10 border border-primary/20" : ""
                    }`}
                  >
                    <div
                      className={`h-3 w-3 rounded-full ${
                        isCorrect ? "bg-primary" : "bg-muted-foreground/40"
                      }`}
                    />
                    <div className="flex-grow">{option}</div>
                    {isCorrect && (
                      <Badge
                        variant="outline"
                        className="bg-primary/20 text-primary"
                      >
                        Correct
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-4">
              <span className="font-medium text-sm">Correct answers: </span>
              {question.answers.map((answer, aIndex) => (
                <Badge
                  key={aIndex}
                  variant="outline"
                  className="ml-1 bg-primary/10"
                >
                  {answer}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
