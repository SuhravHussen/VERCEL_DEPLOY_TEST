import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MatchingSentenceEndingsGroup } from "@/types/exam/ielts-academic/reading/question/question";
import { CheckCircle } from "lucide-react";

export function MatchingSentenceEndingsGroupView({
  group,
  getQuestionTypeLabel,
}: {
  group: MatchingSentenceEndingsGroup;
  getQuestionTypeLabel: (type: string) => string;
}) {
  // Get endings from the group or default to empty array
  const endings = group.endings || [];

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
          <h4 className="font-semibold text-sm mb-2">Sentence Beginnings</h4>
          {group.questions.map((question, i) => {
            // Find the ending that corresponds to the correct ending label
            const ending = endings.find(
              (e) => e.label === question.correctEnding
            );

            return (
              <Card key={i} className="p-3">
                <p className="text-sm mb-2">
                  {question.number || i + 1}. {question.sentenceStart}...
                </p>
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-semibold">
                    {question.correctEnding}
                  </span>
                  {ending && (
                    <span className="text-muted-foreground italic truncate">
                      - &quot;{ending.text}&quot;
                    </span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {endings.length > 0 && (
          <div className="lg:sticky lg:top-24">
            <h4 className="font-semibold text-sm mb-2">Sentence Endings</h4>
            <Card>
              <CardContent className="p-3 space-y-2">
                {endings.map((ending, i) => (
                  <div
                    key={i}
                    className="text-sm flex items-start gap-2 p-1 border-b last:border-b-0"
                  >
                    <span className="font-bold text-primary w-8">
                      {ending.label}
                    </span>
                    <span className="text-muted-foreground">{ending.text}</span>
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
