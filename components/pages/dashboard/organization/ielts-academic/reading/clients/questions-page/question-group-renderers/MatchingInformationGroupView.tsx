/* eslint-disable @next/next/no-img-element */
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MatchingInformationGroup } from "@/types/exam/ielts-academic/reading/question/question";
import { CheckCircle } from "lucide-react";

export function MatchingInformationGroupView({
  group,
  getQuestionTypeLabel,
}: {
  group: MatchingInformationGroup;
  getQuestionTypeLabel: (type: string) => string;
}) {
  // Use paragraph labels from the group or generate default A-Z labels
  const paragraphLabels = group.paragraphLabels || [];

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
          {group.questions.map((question, i) => (
            <Card key={i} className="p-3">
              <p className="text-sm mb-2">
                {question.number || i + 1}. {question.statement}
                {question.imageUrl && (
                  <img
                    src={question.imageUrl}
                    alt={`Question ${question.number || i + 1}`}
                    className="mt-2 max-w-full h-auto rounded-md"
                  />
                )}
              </p>
              <div className="flex items-center gap-2 text-sm text-green-700">
                <CheckCircle className="h-4 w-4" />
                <span className="font-semibold">
                  Paragraph {question.correctParagraph}
                </span>
              </div>
            </Card>
          ))}
        </div>

        {paragraphLabels.length > 0 && (
          <div className="lg:sticky lg:top-24">
            <h4 className="font-semibold text-sm mb-2">Paragraphs</h4>
            <Card>
              <CardContent className="p-3 space-y-2">
                {paragraphLabels.map((label, i) => (
                  <div
                    key={i}
                    className="text-sm flex items-start gap-2 p-1 border-b last:border-b-0"
                  >
                    <span className="font-bold text-primary w-8">{label}</span>
                    <span className="text-muted-foreground">
                      Paragraph {label}
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
