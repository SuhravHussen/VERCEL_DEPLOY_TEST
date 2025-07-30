import { IELTSListeningQuestionGroup } from "@/types/exam/ielts-academic/listening/listening";
import { Separator } from "@/components/ui/separator";

interface DefaultQuestionGroupViewProps {
  group: IELTSListeningQuestionGroup;
  getQuestionTypeLabel: (type: string) => string;
}

interface QuestionItem {
  number?: number;
  question?: string;
  sentenceWithBlank?: string;
  options?: string[];
  answer?: string;
  correctAnswer?: string;
  answers?: string[];
  gapId?: string;
  stepId?: string;
  cellId?: string;
  labelId?: string;
  prompt?: string;
  correctMatch?: string;
}

export function DefaultQuestionGroupView({
  group,
  getQuestionTypeLabel,
}: DefaultQuestionGroupViewProps) {
  return (
    <div className="rounded-md border bg-card p-3 sm:p-4">
      <div className="mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold">
          {getQuestionTypeLabel(group.questionType)}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          {group.instruction || "No instruction provided"}
        </p>
      </div>

      <Separator className="my-3 sm:my-4" />

      <div className="space-y-4 sm:space-y-6">
        {group.questions?.map((question: QuestionItem, qIndex: number) => (
          <div
            key={qIndex}
            className="space-y-2 pl-3 sm:pl-4 border-l-2 border-muted"
          >
            <h4 className="font-medium text-sm sm:text-base">
              Question {question.number || `${qIndex + 1}`}
            </h4>

            {question.question && (
              <p className="text-sm sm:text-base leading-relaxed">
                {question.question}
              </p>
            )}

            {question.sentenceWithBlank && (
              <p className="text-sm sm:text-base leading-relaxed">
                {question.sentenceWithBlank}
              </p>
            )}

            {question.options && (
              <div className="mt-2 pl-2 sm:pl-4 space-y-1.5 sm:space-y-1">
                {question.options.map((option: string, oIndex: number) => (
                  <div key={oIndex} className="flex items-start gap-2 sm:gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary mt-1.5 sm:mt-2 flex-shrink-0" />
                    <span className="text-sm sm:text-base leading-relaxed">
                      {option}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-2 text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2 bg-muted/50 rounded-md inline-block">
              <span className="font-medium">Answer: </span>
              {question.answer ||
                question.correctAnswer ||
                (Array.isArray(question.answers)
                  ? question.answers.join(", ")
                  : "Not provided")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
