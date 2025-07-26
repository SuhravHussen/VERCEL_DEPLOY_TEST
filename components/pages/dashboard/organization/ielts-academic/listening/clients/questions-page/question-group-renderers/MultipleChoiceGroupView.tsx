import {
  IELTSListeningQuestionGroup,
  ListeningMultipleChoiceGroup,
} from "@/types/exam/ielts-academic/listening/listening";
import { Separator } from "@/components/ui/separator";

interface MultipleChoiceGroupViewProps {
  group: IELTSListeningQuestionGroup;
  getQuestionTypeLabel: (type: string) => string;
}

export function MultipleChoiceGroupView({
  group,
  getQuestionTypeLabel,
}: MultipleChoiceGroupViewProps) {
  const typedGroup = group as ListeningMultipleChoiceGroup;

  return (
    <div className="rounded-md border bg-card p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">
          {getQuestionTypeLabel(group.questionType)}
        </h3>
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

            <p>{question.question}</p>

            <div className="mt-1 pl-4 space-y-1">
              {question.options?.map((option, oIndex) => {
                const isCorrect = option.startsWith(question.answer + ".");

                return (
                  <div
                    key={oIndex}
                    className={`flex items-center gap-2 ${
                      isCorrect ? "font-medium text-primary" : ""
                    }`}
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${
                        isCorrect ? "bg-primary" : "bg-muted-foreground"
                      }`}
                    />
                    <span>{option}</span>
                    {isCorrect && (
                      <span className="text-xs ml-2 text-primary">
                        (Correct)
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-2 text-sm px-3 py-2 bg-muted/50 rounded-md inline-block">
              <span className="font-medium">Answer: </span>
              {question.answer}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
