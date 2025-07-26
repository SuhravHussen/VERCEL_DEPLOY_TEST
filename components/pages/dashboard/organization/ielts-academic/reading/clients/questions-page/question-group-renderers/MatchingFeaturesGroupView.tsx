import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MatchingFeaturesGroup } from "@/types/exam/ielts-academic/reading/question/question";
import { CheckCircle } from "lucide-react";

export function MatchingFeaturesGroupView({
  group,
  getQuestionTypeLabel,
}: {
  group: MatchingFeaturesGroup;
  getQuestionTypeLabel: (type: string) => string;
}) {
  // Get features from the group or default to empty array
  const features = group.features || [];

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
          {group.questions.map((question, i) => {
            // Find the feature description that corresponds to the correct feature
            const feature = features.find(
              (f) => f.label === question.correctFeature
            );

            return (
              <Card key={i} className="p-3">
                <p className="text-sm mb-2">
                  {question.number || i + 1}. {question.statement}
                </p>
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-semibold">
                    {question.correctFeature}
                  </span>
                  {feature && (
                    <span className="text-muted-foreground italic truncate">
                      - &quot;{feature.description}&quot;
                    </span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {features.length > 0 && (
          <div className="lg:sticky lg:top-24">
            <h4 className="font-semibold text-sm mb-2">Features</h4>
            <Card>
              <CardContent className="p-3 space-y-2">
                {features.map((feature, i) => (
                  <div
                    key={i}
                    className="text-sm flex items-start gap-2 p-1 border-b last:border-b-0"
                  >
                    <span className="font-bold text-primary w-8">
                      {feature.label}
                    </span>
                    <span className="text-muted-foreground">
                      {feature.description}
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
