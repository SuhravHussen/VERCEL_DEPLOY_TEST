import { Badge } from "@/components/ui/badge";
import { IELTSReadingQuestionGroup } from "@/types/exam/ielts-academic/reading/question/question";

export function CompletionGroupView({
  group,
  getQuestionTypeLabel,
}: {
  group: IELTSReadingQuestionGroup;
  getQuestionTypeLabel: (type: string) => string;
}) {
  const text = group.summaryText || group.noteText || "";
  const questions = group.questions || [];

  const filledText = questions.reduce((acc, q) => {
    const answer = `<span class="font-semibold text-green-800 bg-green-100 px-1 rounded-sm">${q.correctAnswer}</span>`;
    return acc.replace(`[${q.gapId}]`, answer);
  }, text);

  // Cast options to ensure TypeScript recognizes it as a potential array
  const options = group.options as string[] | undefined;

  return (
    <div className="mb-6">
      <Badge variant="secondary" className="mb-2 text-base">
        {getQuestionTypeLabel(group.questionType)}
      </Badge>
      <p className="text-sm italic text-muted-foreground mb-3">
        {group.instruction}
      </p>

      {options && options.length > 0 && (
        <div className="mb-4 p-3 border rounded-md bg-muted/30">
          <h4 className="font-semibold text-sm mb-2">Word Bank</h4>
          <div className="flex flex-wrap gap-2">
            {options.map((opt: string, i: number) => (
              <Badge key={i} variant="outline">
                {opt}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div
        className="prose prose-sm dark:prose-invert"
        dangerouslySetInnerHTML={{
          __html: typeof filledText === "string" ? filledText : "",
        }}
      />
    </div>
  );
}
