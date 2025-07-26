import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { IELTSReadingQuestionGroup } from "@/types/exam/ielts-academic/reading/question/question";
import { CheckCircle } from "lucide-react";

type OptionType =
  | {
      label?: string;
      description?: string;
      text?: string;
    }
  | string;

export function MatchingGroupView({
  group,
  getQuestionTypeLabel,
}: {
  group: IELTSReadingQuestionGroup;
  getQuestionTypeLabel: (type: string) => string;
}) {
  // Cast each property to the appropriate type and provide an empty array fallback
  const features = (group.features || []) as OptionType[];
  const headings = (group.headings || []) as OptionType[];
  const endings = (group.endings || []) as OptionType[];
  const paragraphLabels = (group.paragraphLabels || []) as OptionType[];

  // Use the first non-empty array or default to empty array
  const options: OptionType[] =
    features.length > 0
      ? features
      : headings.length > 0
      ? headings
      : endings.length > 0
      ? endings
      : paragraphLabels.length > 0
      ? paragraphLabels
      : [];

  return (
    <div className="mb-6">
      <Badge variant="secondary" className="mb-2 text-base">
        {getQuestionTypeLabel(group.questionType)}
      </Badge>
      <p className="text-sm italic text-muted-foreground mb-3">
        {group.instruction}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="space-y-3">
          <h4 className="font-semibold text-sm mb-2">Questions</h4>
          {group.questions.map(
            (q: IELTSReadingQuestionGroup["questions"][number], i: number) => {
              const answer =
                q.correctFeature ||
                q.correctHeading ||
                q.correctEnding ||
                q.correctParagraph;
              const answerDetail =
                typeof answer === "string" &&
                options.find(
                  (opt) =>
                    (typeof opt === "object" && opt.label === answer) ||
                    opt === answer
                );

              return (
                <Card key={i} className="p-3">
                  <p className="text-sm mb-2">
                    {q.number || i + 1}.{" "}
                    {q.statement || q.sentenceStart || "..."}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-semibold">{answer}</span>
                    {typeof answerDetail === "object" && answerDetail && (
                      <span className="text-muted-foreground italic truncate">
                        - &quot;{answerDetail.description || answerDetail.text}
                        &quot;
                      </span>
                    )}
                  </div>
                </Card>
              );
            }
          )}
        </div>

        {options.length > 0 && (
          <div className="lg:sticky lg:top-24">
            <h4 className="font-semibold text-sm mb-2">Options</h4>
            <Card>
              <CardContent className="p-3 space-y-2">
                {options.map((opt, i: number) => (
                  <div
                    key={i}
                    className="text-sm flex items-start gap-2 p-1 border-b last:border-b-0"
                  >
                    <span className="font-bold text-primary w-8">
                      {typeof opt === "object"
                        ? opt.label
                        : String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-muted-foreground">
                      {typeof opt === "object"
                        ? opt.description || opt.text
                        : opt}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
