import { Badge } from "@/components/ui/badge";
import { IELTSReadingQuestionGroup } from "@/types/exam/ielts-academic/reading/question/question";

export function SentenceCompletionView({
  group,
  getQuestionTypeLabel,
}: {
  group: IELTSReadingQuestionGroup;
  getQuestionTypeLabel: (type: string) => string;
}) {
  return (
    <div className="mb-6">
      <Badge variant="secondary" className="mb-2 text-base">
        {getQuestionTypeLabel(group.questionType)}
      </Badge>
      <p className="text-sm italic text-muted-foreground mb-3">
        {group.instruction}
      </p>

      <div className="space-y-3">
        {group.questions.map((q, i) => (
          <div key={i} className="text-sm p-3 bg-muted/20 rounded-md border">
            <p className="font-medium">
              {q.number || i + 1}. {q.sentenceWithBlank?.replace("___", "")}
              <Badge
                variant="outline"
                className="ml-2 text-xs font-semibold bg-green-100 text-green-800 border-green-300"
              >
                {q.correctAnswer as string}
              </Badge>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
