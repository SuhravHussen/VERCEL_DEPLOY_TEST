/* eslint-disable @next/next/no-img-element */
import {
  IELTSListeningQuestionGroup,
  ListeningDiagramLabelCompletionGroup,
} from "@/types/exam/ielts-academic/listening/listening";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ImageIcon } from "lucide-react";

interface DiagramLabelCompletionViewProps {
  group: IELTSListeningQuestionGroup;
  getQuestionTypeLabel: (type: string) => string;
}

export function DiagramLabelCompletionView({
  group,
  getQuestionTypeLabel,
}: DiagramLabelCompletionViewProps) {
  const typedGroup = group as ListeningDiagramLabelCompletionGroup;

  return (
    <div className="rounded-md border bg-card p-3 sm:p-4">
      <div className="mb-3 sm:mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <h3 className="text-base sm:text-lg font-semibold">
            {getQuestionTypeLabel(group.questionType)}
          </h3>

          {typedGroup.wordLimit && (
            <Badge
              variant="outline"
              className="bg-muted/50 text-xs sm:text-sm self-start sm:self-auto"
            >
              {typedGroup.wordLimitText || `Max ${typedGroup.wordLimit} words`}
            </Badge>
          )}
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          {group.instruction || "No instruction provided"}
        </p>
      </div>

      {/* Display diagram image */}
      {typedGroup.diagramImage && (
        <div className="mb-3 sm:mb-4">
          <div className="flex items-center gap-2 mb-2">
            <ImageIcon className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
            <h4 className="font-medium text-sm sm:text-base">Diagram</h4>
          </div>

          <div className="border rounded-md overflow-hidden">
            <div className="relative inline-block min-w-[400px] max-w-full">
              <img
                src={typedGroup.diagramImage}
                alt="Diagram"
                className="w-full h-auto object-contain"
                style={{
                  minHeight: "300px",
                  minWidth: "500px",
                }}
              />

              {/* Show input positions if available */}
              {Array.isArray(typedGroup.inputPositions) &&
                typedGroup.inputPositions.length > 0 && (
                  <div className="absolute inset-0 pointer-events-none">
                    {typedGroup.inputPositions.map(
                      (
                        position: { labelId: string; x: number; y: number },
                        index: number
                      ) => (
                        <div
                          key={index}
                          className="absolute w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg border-2 border-white"
                          style={{
                            left: `${position.x}%`,
                            top: `${position.y}%`,
                            transform: "translate(-50%, -50%)",
                          }}
                        >
                          {index + 1}
                        </div>
                      )
                    )}
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      <Separator className="my-3 sm:my-4" />

      <div className="space-y-3 sm:space-y-4">
        {typedGroup.questions?.map((question, qIndex) => {
          return (
            <div
              key={qIndex}
              className="space-y-2 pl-3 sm:pl-4 border-l-2 border-muted"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h4 className="font-medium text-sm sm:text-base">
                  Label {qIndex + 1}
                </h4>
                <div className="px-2 py-0.5 bg-primary/20 rounded-sm border border-primary/30 text-primary font-medium text-xs sm:text-sm w-fit">
                  ID: {question.labelId}
                </div>
              </div>

              <div className="mt-2 text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2 bg-muted/50 rounded-md inline-block">
                <span className="font-medium">Answer: </span>
                {question.correctAnswer}
              </div>
            </div>
          );
        })}
      </div>

      {typedGroup.options && typedGroup.options.length > 0 && (
        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t">
          <h4 className="font-medium mb-2 text-sm sm:text-base">Word Bank</h4>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {typedGroup.options.map((option, index) => (
              <Badge
                key={index}
                variant="outline"
                className="bg-muted/30 text-xs sm:text-sm"
              >
                {option}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Additional metadata */}
      {(typedGroup.totalLabels || typedGroup.instructions) && (
        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t">
          {typedGroup.totalLabels && (
            <p className="text-xs sm:text-sm text-muted-foreground mb-2">
              Total labels: {typedGroup.totalLabels}
            </p>
          )}
          {typedGroup.instructions && (
            <div className="text-xs sm:text-sm text-muted-foreground">
              <span className="font-medium">Additional instructions:</span>
              <p className="mt-1">{typedGroup.instructions}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
