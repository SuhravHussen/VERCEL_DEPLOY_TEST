/* eslint-disable @next/next/no-img-element */
import {
  IELTSListeningQuestionGroup,
  ListeningFlowChartCompletionGroup,
} from "@/types/exam/ielts-academic/listening/listening";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { GitBranch, Image, Type } from "lucide-react";

interface FlowChartCompletionViewProps {
  group: IELTSListeningQuestionGroup;
  getQuestionTypeLabel: (type: string) => string;
}

// Extended type to include optional properties that may exist
type ExtendedFlowChartCompletionGroup = ListeningFlowChartCompletionGroup & {
  options?: string[];
  totalGaps?: number;
  instructions?: string;
};

export function FlowChartCompletionView({
  group,
  getQuestionTypeLabel,
}: FlowChartCompletionViewProps) {
  const typedGroup = group as ExtendedFlowChartCompletionGroup;

  return (
    <div className="rounded-md border bg-card p-3 sm:p-4">
      <div className="mb-3 sm:mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <h3 className="text-base sm:text-lg font-semibold">
            {getQuestionTypeLabel(group.questionType)}
          </h3>

          <div className="flex flex-wrap gap-2">
            {typedGroup.chartType && (
              <Badge
                variant="secondary"
                className="text-xs sm:text-sm self-start sm:self-auto"
              >
                {typedGroup.chartType === "image" ? (
                  <>
                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                    <Image className="h-3 w-3 mr-1" />
                    Image-based
                  </>
                ) : (
                  <>
                    <Type className="h-3 w-3 mr-1" />
                    Text-based
                  </>
                )}
              </Badge>
            )}
            {typedGroup.wordLimit && (
              <Badge
                variant="outline"
                className="bg-muted/50 text-xs sm:text-sm self-start sm:self-auto"
              >
                {typedGroup.wordLimitText ||
                  `Max ${typedGroup.wordLimit} words`}
              </Badge>
            )}
          </div>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          {group.instruction || "No instruction provided"}
        </p>
      </div>

      {/* Display flow chart based on type */}
      {typedGroup.chartType === "image" && typedGroup.chartImage && (
        <div className="mb-3 sm:mb-4">
          <div className="flex items-center gap-2 mb-2">
            <GitBranch className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
            <h4 className="font-medium text-sm sm:text-base">
              Flow Chart Image
            </h4>
          </div>

          <div className="border rounded-md overflow-hidden">
            <div className="relative inline-block min-w-[400px] max-w-full">
              <img
                src={typedGroup.chartImage}
                alt="Flow Chart"
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
                        position: { stepId: string; x: number; y: number },
                        index: number
                      ) => (
                        <div
                          key={index}
                          className="absolute w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg border-2 "
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

      {typedGroup.chartType === "text" &&
        Array.isArray(typedGroup.textSteps) &&
        typedGroup.textSteps.length > 0 && (
          <div className="mb-3 sm:mb-4">
            <div className="flex items-center gap-2 mb-2">
              <GitBranch className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              <h4 className="font-medium text-sm sm:text-base">
                Flow Chart Steps
              </h4>
            </div>

            <div className="p-3 sm:p-4 bg-muted/20 border rounded-md">
              <div className="space-y-3">
                {typedGroup.textSteps.map(
                  (
                    step: {
                      stepId: string;
                      stepNumber: number;
                      textBefore?: string;
                      textAfter?: string;
                      isGap: boolean;
                    },
                    index: number
                  ) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-center gap-2"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                        {step.stepNumber}
                      </div>
                      <div className="flex-grow">
                        <div className="text-sm">
                          {step.textBefore && (
                            <span className="mr-2">{step.textBefore}</span>
                          )}
                          {step.isGap && (
                            <span className="inline-flex items-center justify-center bg-yellow-100 border-2 border-dashed  px-3 py-1 rounded text-xs font-medium text-yellow-800">
                              GAP {index + 1}
                            </span>
                          )}
                          {step.textAfter && (
                            <span className="ml-2">{step.textAfter}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
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
                  Question {qIndex + 1}
                </h4>
                <div className="px-2 py-0.5 bg-primary/20 rounded-sm border border-primary/30 text-primary font-medium text-xs sm:text-sm w-fit">
                  Step ID: {question.stepId}
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

      {/* Word Bank */}
      {typedGroup.options &&
        Array.isArray(typedGroup.options) &&
        typedGroup.options.length > 0 && (
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
      {(typedGroup.totalGaps || typedGroup.instructions) && (
        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t">
          {typedGroup.totalGaps && (
            <p className="text-xs sm:text-sm text-muted-foreground mb-2">
              Total gaps: {typedGroup.totalGaps}
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
