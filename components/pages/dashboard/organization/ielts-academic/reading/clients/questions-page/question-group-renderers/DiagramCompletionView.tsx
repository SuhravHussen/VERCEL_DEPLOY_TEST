import { Badge } from "@/components/ui/badge";
import { IELTSReadingQuestionGroup } from "@/types/exam/ielts-academic/reading/question/question";
import Image from "next/image";

export function DiagramCompletionView({
  group,
  getQuestionTypeLabel,
}: {
  group: IELTSReadingQuestionGroup;
  getQuestionTypeLabel: (type: string) => string;
}) {
  const imageUrl = (group.diagramImage ||
    group.chartImage ||
    group.groupImage) as string | undefined;
  const diagramDescription = group.diagramDescription as string | undefined;

  return (
    <div className="mb-6">
      <Badge variant="secondary" className="mb-2 text-base">
        {getQuestionTypeLabel(group.questionType)}
      </Badge>
      <p className="text-sm italic text-muted-foreground mb-3">
        {group.instruction}
      </p>

      {diagramDescription && (
        <p className="mb-3 text-sm">{diagramDescription}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        {imageUrl && (
          <div className="relative w-full h-64 rounded-md border overflow-hidden">
            <Image
              src={imageUrl}
              alt="Diagram"
              layout="fill"
              objectFit="contain"
            />
          </div>
        )}

        <div className="space-y-2">
          <h4 className="font-semibold text-sm mb-2">Questions</h4>
          {group.questions.map((q, i) => (
            <div
              key={i}
              className="text-sm p-3 bg-muted/50 rounded-md border flex justify-between items-center"
            >
              <span>{q.number || q.stepId || i + 1}.</span>
              <Badge
                variant="outline"
                className="text-xs bg-green-100 text-green-800"
              >
                {q.answer || q.correctAnswer}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
