import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MatchingHeadingsGroup } from "@/types/exam/ielts-academic/reading/question/question";
import { CheckCircle } from "lucide-react";

export function MatchingHeadingsGroupView({
  group,
  getQuestionTypeLabel,
}: {
  group: MatchingHeadingsGroup;
  getQuestionTypeLabel: (type: string) => string;
}) {
  // Prepare headings array
  const headings = group.headings || [];

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
          <h4 className="font-semibold text-sm mb-2">Paragraphs</h4>
          {group.questions.map((question, i) => {
            // Find the heading text that corresponds to the correct heading code
            const headingIndex = headings.findIndex((h) =>
              typeof h === "string"
                ? h.startsWith(`${question.correctHeading}.`) ||
                  h.startsWith(`${question.correctHeading})`)
                : false
            );

            const headingText =
              headingIndex >= 0
                ? headings[headingIndex].replace(
                    /^[ivx]+\.\s*|^[ivx]+\)\s*/i,
                    ""
                  )
                : `Heading ${question.correctHeading}`;

            return (
              <Card key={i} className="p-3">
                <p className="text-sm mb-2">Paragraph {question.paragraph}</p>
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-semibold">
                    Heading {question.correctHeading}
                  </span>
                  <span className="text-muted-foreground italic truncate">
                    - &quot;{headingText}&quot;
                  </span>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="lg:sticky lg:top-24">
          <h4 className="font-semibold text-sm mb-2">Headings</h4>
          <Card>
            <CardContent className="p-3 space-y-2">
              {headings.map((heading, i) => {
                const headingLabel =
                  typeof heading === "string"
                    ? heading.match(/^([ivx]+)/i)?.[1] || (i + 1).toString()
                    : (i + 1).toString();

                const headingText =
                  typeof heading === "string"
                    ? heading.replace(/^[ivx]+\.\s*|^[ivx]+\)\s*/i, "")
                    : heading;

                return (
                  <div
                    key={i}
                    className="text-sm flex items-start gap-2 p-1 border-b last:border-b-0"
                  >
                    <span className="font-bold text-primary w-8">
                      {headingLabel}
                    </span>
                    <span className="text-muted-foreground">{headingText}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
