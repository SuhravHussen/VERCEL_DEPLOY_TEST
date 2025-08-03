/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useContext } from "react";
import { StepperContext, FormData } from "../shared/StepperContext";
import { Badge } from "@/components/ui/badge";
import React from "react";
import {
  IELTSListeningQuestionGroup,
  ListeningMultipleChoiceGroup,
  ListeningMultipleChoiceMultipleAnswersGroup,
  ListeningSentenceCompletionGroup,
  ListeningFormCompletionGroup,
  ListeningNoteCompletionGroup,
  ListeningTableCompletionGroup,
  ListeningFlowChartCompletionGroup,
  ListeningDiagramLabelCompletionGroup,
  ListeningMatchingGroup,
  ListeningShortAnswerGroup,
} from "@/types/exam/ielts-academic/listening/listening";

// Type definitions for flowchart components
interface InputPosition {
  stepId: string;
  x: number;
  y: number;
}

interface TextStep {
  stepId: string;
  stepNumber: number;
  textBefore?: string;
  textAfter?: string;
  isGap: boolean;
}

interface PreviewStepProps {
  formData: FormData;
  onSave?: () => void;
  isSaving?: boolean;
  submitButtonText?: string;
}

export default function PreviewStep({
  formData,
  onSave,
  isSaving,
  submitButtonText = "Create Question",
}: PreviewStepProps) {
  const { stepperRef } = useContext(StepperContext);

  const handlePrev = () => {
    if (stepperRef.current) {
      stepperRef.current.prevStep();
    }
  };

  return (
    <div className="space-y-6 w-full max-w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <h2 className="text-lg font-semibold">Step 3: Preview</h2>
        <Badge variant="outline" className="whitespace-nowrap">
          Total Questions:{" "}
          {formData.questions.reduce(
            (acc, group) => acc + (group.questions?.length || 0),
            0
          )}
        </Badge>
      </div>

      <Card className="p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-md p-3 sm:p-4">
            <h3 className="font-bold text-lg mb-3">
              Listening Audio: {formData.audio.title}
            </h3>
            <Badge className="mb-3">{formData.audio.difficulty}</Badge>
            <div className="space-y-4">
              {formData.audio.audioUrl && (
                <div className="mt-2">
                  <p className="text-sm font-medium mb-1">Audio Preview:</p>
                  <audio
                    controls
                    className="w-full"
                    src={formData.audio.audioUrl}
                  />
                </div>
              )}

              {formData.audio.transcript && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-1">Transcript:</p>
                  <div className="prose max-w-none text-sm overflow-x-auto border p-3 rounded-md bg-muted/20">
                    {formData.audio.transcript}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border rounded-md p-3 sm:p-4">
            <h3 className="font-bold text-lg mb-3">Questions</h3>
            <div className="space-y-6">
              {formData.questions.length > 0 ? (
                formData.questions.map((group) => (
                  <div
                    key={group.id}
                    className="border-t pt-3 first:border-t-0 first:pt-0"
                  >
                    <h4 className="font-medium mb-2">
                      {getQuestionTypeLabel(group.questionType)}
                    </h4>
                    <p className="mb-3 text-sm italic">{group.instruction}</p>
                    {renderQuestionGroupPreview(group, true)}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No questions added.</p>
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
        <Button
          onClick={handlePrev}
          variant="outline"
          className="w-full sm:w-auto"
        >
          Back
        </Button>
        <Button
          onClick={onSave}
          disabled={
            isSaving ||
            !formData.audio.title ||
            !formData.audio.audioUrl ||
            formData.questions.length === 0
          }
          className="w-full sm:w-auto"
        >
          {isSaving ? "Saving..." : submitButtonText}
        </Button>
      </div>
    </div>
  );
}

function getQuestionTypeLabel(type: string): string {
  const types: Record<string, string> = {
    multiple_choice: "Multiple Choice",
    multiple_choice_multiple_answers: "Multiple Choice (Multiple Answers)",
    sentence_completion: "Sentence Completion",
    form_completion: "Form Completion",
    note_completion: "Note Completion",
    table_completion: "Table Completion",
    flow_chart_completion: "Flow Chart Completion",
    diagram_label_completion: "Diagram Label Completion",
    matching: "Matching",
    short_answer: "Short Answer",
  };

  return types[type] || type;
}

function renderQuestionGroupPreview(
  group: IELTSListeningQuestionGroup,
  compact = false
): React.ReactNode {
  // Basic rendering for different question types
  switch (group.questionType) {
    case "multiple_choice": {
      const typedGroup = group as ListeningMultipleChoiceGroup;
      return typedGroup.questions?.map((q, i) => (
        <div key={i} className={compact ? "mb-2" : "mb-4"}>
          <p className={compact ? "text-sm" : ""}>
            <span className="font-medium">{q.number}.</span> {q.question}
          </p>
          <div
            className={`grid ${
              compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
            } gap-2 mt-1`}
          >
            {q.options?.map((option: string, j: number) => (
              <div key={j} className="flex items-center">
                <span className="text-sm mr-2">
                  {String.fromCharCode(65 + j)}.
                </span>
                <span className="text-sm">{option}</span>
              </div>
            ))}
          </div>
        </div>
      ));
    }

    case "multiple_choice_multiple_answers": {
      const typedGroup = group as ListeningMultipleChoiceMultipleAnswersGroup;
      return (
        <div>
          {typedGroup.options && (
            <div className="mb-4 bg-muted/30 p-2 rounded-md">
              <p className="font-medium text-sm mb-1">Options:</p>
              <div className="flex flex-wrap gap-2">
                {typedGroup.options.map((option: string, i: number) => (
                  <span key={i} className="px-2 py-1 bg-muted rounded text-sm">
                    {String.fromCharCode(65 + i)}: {option}
                  </span>
                ))}
              </div>
            </div>
          )}
          {typedGroup.questions?.map((q, i) => (
            <div key={i} className={compact ? "mb-2" : "mb-4"}>
              <p className={compact ? "text-sm" : ""}>
                <span className="font-medium">{q.number}.</span> {q.question}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Choose {typedGroup.answersRequired || 2} answers
              </p>
            </div>
          ))}
        </div>
      );
    }

    case "short_answer": {
      const typedGroup = group as ListeningShortAnswerGroup;
      return typedGroup.questions?.map((q, i) => (
        <div key={i} className={compact ? "mb-2" : "mb-4"}>
          <p className={compact ? "text-sm" : ""}>
            <span className="font-medium">{q.number}.</span> {q.question}
          </p>
          <div className="mt-1">
            <div className="border-b border-dotted border-gray-400 h-6 w-40"></div>
            {typedGroup.maxWords !== undefined && (
              <p className="text-xs text-muted-foreground mt-1">
                (Maximum {typedGroup.maxWords}{" "}
                {typedGroup.maxWords === 1 ? "word" : "words"})
              </p>
            )}
          </div>
        </div>
      ));
    }

    case "matching": {
      const typedGroup = group as ListeningMatchingGroup;
      return (
        <div>
          <div className="mb-4 bg-muted/30 p-2 rounded-md">
            <p className="font-medium text-sm mb-1">Options:</p>
            <div className="flex flex-wrap gap-2">
              {(typedGroup.options || []).map((option: string, i: number) => (
                <span key={i} className="px-2 py-1 bg-muted rounded text-sm">
                  {String.fromCharCode(65 + i)}: {option}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {typedGroup.questions?.map((q, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="font-medium">{q.number}.</span>
                <div>
                  <p className={`text-sm ${compact ? "" : "mb-1"}`}>
                    {q.prompt}
                  </p>
                  <div className="flex gap-2 mt-1 items-center">
                    <span className="text-xs">Match:</span>
                    <div className="border border-dotted border-gray-400 px-3 py-1 rounded text-xs">
                      ?
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "sentence_completion": {
      const typedGroup = group as ListeningSentenceCompletionGroup;
      return typedGroup.questions?.map((q, i) => (
        <div key={i} className={compact ? "mb-2" : "mb-4"}>
          <p className={compact ? "text-sm" : ""}>
            <span className="font-medium">{q.number}.</span>{" "}
            {q.sentenceWithBlank
              ?.split("_______")
              .map((part: string, j: number, parts: string[]) => (
                <React.Fragment key={j}>
                  {part}
                  {j < parts.length - 1 && (
                    <span className="mx-1 border-b border-dotted border-gray-400 inline-block w-16" />
                  )}
                </React.Fragment>
              ))}
          </p>
          {typedGroup.wordLimit !== undefined && (
            <p className="text-xs text-muted-foreground mt-1">
              {typedGroup.wordLimitText ||
                `No more than ${typedGroup.wordLimit} words`}
            </p>
          )}
        </div>
      ));
    }

    case "form_completion": {
      const typedGroup = group as ListeningFormCompletionGroup;
      return (
        <div>
          {typedGroup.options && typedGroup.options.length > 0 && (
            <div className="mb-4 bg-muted/30 p-2 rounded-md">
              <p className="font-medium text-sm mb-1">Word Bank:</p>
              <div className="flex flex-wrap gap-2">
                {typedGroup.options.map((option: string, i: number) => (
                  <span key={i} className="px-2 py-1 bg-muted rounded text-sm">
                    {option}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="space-y-3">
            {typedGroup.questions?.map((q, i) => (
              <div key={i} className={compact ? "mb-2" : "mb-4"}>
                <p className={compact ? "text-sm" : ""}>
                  <span className="font-medium">{q.number}.</span>{" "}
                  {q.sentenceWithBlank
                    ?.split("_______")
                    .map((part: string, j: number, parts: string[]) => (
                      <React.Fragment key={j}>
                        {part}
                        {j < parts.length - 1 && (
                          <span className="mx-1 border-b border-dotted border-gray-400 inline-block w-16" />
                        )}
                      </React.Fragment>
                    ))}
                </p>
                {typedGroup.wordLimit !== undefined && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {typedGroup.wordLimitText ||
                      `No more than ${typedGroup.wordLimit} words`}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "note_completion": {
      const typedGroup = group as ListeningNoteCompletionGroup;
      return (
        <div>
          {typedGroup.options && typedGroup.options.length > 0 && (
            <div className="mb-4 bg-muted/30 p-2 rounded-md">
              <p className="font-medium text-sm mb-1">Word Bank:</p>
              <div className="flex flex-wrap gap-2">
                {typedGroup.options.map((option: string, i: number) => (
                  <span key={i} className="px-2 py-1 bg-muted rounded text-sm">
                    {option}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="border rounded-md p-3 ">
            {typedGroup.noteText &&
              typedGroup.noteText
                .split("\n")
                .map((line: string, lineIndex: number) => {
                  if (line.trim().startsWith("# ")) {
                    // Heading
                    return (
                      <h4 key={lineIndex} className="font-medium mt-2 mb-1">
                        {line.substring(2)}
                      </h4>
                    );
                  } else if (line.trim().startsWith("* ")) {
                    // Bullet point with possible gaps
                    const content = line.substring(2);
                    const parts: React.ReactNode[] = [];
                    let lastIndex = 0;
                    let gapCounter = 0;
                    const regex = /\[gap\]/g;
                    let match;

                    while ((match = regex.exec(content)) !== null) {
                      parts.push(content.substring(lastIndex, match.index));
                      parts.push(
                        <span
                          key={`gap-${lineIndex}-${gapCounter}`}
                          className="mx-1 inline-flex items-center justify-center bg-primary/10 px-2 border border-dashed border-primary/30 rounded"
                        >
                          {gapCounter + 1}
                        </span>
                      );
                      lastIndex = match.index + 5; // Length of [gap]
                      gapCounter++;
                    }

                    parts.push(content.substring(lastIndex));

                    return (
                      <div key={lineIndex} className="flex ml-1 my-1">
                        <span className="mr-2">•</span>
                        <div className="text-sm">{parts}</div>
                      </div>
                    );
                  } else if (line.trim()) {
                    // Regular text
                    return (
                      <p key={lineIndex} className="my-1 text-sm">
                        {line}
                      </p>
                    );
                  }
                  return <div key={lineIndex} className="h-2"></div>;
                })}
          </div>
          {typedGroup.wordLimit !== undefined && (
            <p className="text-xs text-muted-foreground mt-1">
              {typedGroup.wordLimitText ||
                `No more than ${typedGroup.wordLimit} word${
                  typedGroup.wordLimit > 1 ? "s" : ""
                }`}
            </p>
          )}
        </div>
      );
    }

    case "table_completion": {
      const typedGroup = group as ListeningTableCompletionGroup;
      return (
        <div>
          {typedGroup.options && typedGroup.options.length > 0 && (
            <div className="mb-4 bg-muted/30 p-2 rounded-md">
              <p className="font-medium text-sm mb-1">Word Bank:</p>
              <div className="flex flex-wrap gap-2">
                {typedGroup.options.map((option: string, i: number) => (
                  <span key={i} className="px-2 py-1 bg-muted rounded text-sm">
                    {option}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="border-collapse w-full border min-w-[300px]">
              <tbody>
                {(typedGroup.tableStructure || []).map(
                  (row: string[], rowIndex: number) => (
                    <tr key={rowIndex}>
                      {row.map((cell: string, cellIndex: number) => {
                        // Check if this is a gap cell
                        const isGap = typedGroup.questions?.some(
                          (q) => q.cellId === `${rowIndex}-${cellIndex}`
                        );

                        return (
                          <td
                            key={cellIndex}
                            className={`border p-2 text-sm ${
                              rowIndex === 0 ? "font-medium bg-muted/20" : ""
                            }`}
                          >
                            {isGap ? (
                              <div className="flex justify-center">
                                <div className="border-b border-dotted border-gray-400 h-5 w-16"></div>
                              </div>
                            ) : (
                              cell
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
          {typedGroup.wordLimit !== undefined && (
            <p className="text-xs text-muted-foreground mt-1">
              {typedGroup.wordLimitText ||
                `No more than ${typedGroup.wordLimit} word${
                  typedGroup.wordLimit > 1 ? "s" : ""
                }`}
            </p>
          )}
        </div>
      );
    }

    case "flow_chart_completion": {
      const typedGroup = group as ListeningFlowChartCompletionGroup;
      return (
        <div>
          {/* Chart Type Badge */}
          {typedGroup.chartType && (
            <div className="mb-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {typedGroup.chartType === "image"
                  ? "📷 Image-based"
                  : "📝 Text-based"}
              </span>
            </div>
          )}

          {/* Image-based Chart */}
          {typedGroup.chartType === "image" && typedGroup.chartImage && (
            <div className="mb-4 border rounded overflow-hidden">
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
                {/* Show input positions as numbered markers */}
                {Array.isArray(typedGroup.inputPositions) &&
                  typedGroup.inputPositions.length > 0 && (
                    <div className="absolute inset-0 pointer-events-none">
                      {typedGroup.inputPositions.map(
                        (position: InputPosition, index: number) => (
                          <div
                            key={index}
                            className="absolute w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg border-2 border-white"
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
          )}

          {/* Text-based Chart */}
          {typedGroup.chartType === "text" &&
            Array.isArray(typedGroup.textSteps) &&
            typedGroup.textSteps.length > 0 && (
              <div className="mb-4 border rounded-md p-3">
                <div className="text-center mb-2 font-medium">
                  Flow Chart Steps
                </div>
                <div className="space-y-2">
                  {typedGroup.textSteps.map((step: TextStep, i: number) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2 border rounded"
                    >
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium">
                        {step.stepNumber}
                      </div>
                      <div className="flex-grow text-sm">
                        {step.textBefore && <span>{step.textBefore} </span>}
                        {step.isGap && (
                          <span className="inline-flex items-center justify-center bg-yellow-100 border border-yellow-300 px-2 py-1 rounded text-xs font-medium text-yellow-800">
                            GAP
                          </span>
                        )}
                        {step.textAfter && <span> {step.textAfter}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Fallback for old/simple structure */}
          {!typedGroup.chartType &&
            !typedGroup.chartImage &&
            typedGroup.questions && (
              <div className="mb-4 border rounded-md p-3">
                <div className="text-center mb-2 font-medium">Flow Chart</div>
                <div className="flex flex-col items-center">
                  {typedGroup.questions.map((q, i) => (
                    <div key={i} className="flex flex-col items-center mb-2">
                      <div className="border rounded p-2 w-full sm:w-48 text-center">
                        {q.stepId?.includes("gap") ? (
                          <div className="border-b border-dotted border-gray-400 h-6 w-32 mx-auto"></div>
                        ) : (
                          q.stepId
                        )}
                      </div>
                      {i < (typedGroup.questions?.length || 0) - 1 && (
                        <div className="h-6 border-l-2 border-gray-400"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          {typedGroup.questions && typedGroup.questions.length > 0 && (
            <div className="mb-4 p-3 bg-muted/20 rounded-md">
              <p className="font-medium text-sm mb-2">Answer Keys:</p>
              <div className="space-y-1">
                {typedGroup.questions.map((q, i) => (
                  <div key={i} className="text-sm">
                    <span className="font-medium">{i + 1}.</span>{" "}
                    <span className="text-muted-foreground">({q.stepId})</span>{" "}
                    → {q.correctAnswer}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Word Bank */}
          {typedGroup.options && typedGroup.options.length > 0 && (
            <div className="bg-muted/30 p-2 rounded-md">
              <p className="font-medium text-sm mb-1">Word Bank:</p>
              <div className="flex flex-wrap gap-2">
                {typedGroup.options.map((option: string, i: number) => (
                  <span key={i} className="px-2 py-1 bg-muted rounded text-sm">
                    {option}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Word Limit */}
          {typedGroup.wordLimit !== undefined && (
            <p className="text-xs text-muted-foreground mt-1">
              {typedGroup.wordLimitText ||
                `No more than ${typedGroup.wordLimit} word${
                  typedGroup.wordLimit > 1 ? "s" : ""
                }`}
            </p>
          )}
        </div>
      );
    }

    case "diagram_label_completion": {
      const typedGroup = group as ListeningDiagramLabelCompletionGroup;
      return (
        <div>
          {/* Diagram Image */}
          {typedGroup.diagramImage && (
            <div className="mb-4 border rounded overflow-hidden">
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
                {/* Show input positions as numbered markers */}
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
                            className="absolute w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg border-2 border-white"
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
          )}

          {/* Questions/Answers Preview */}
          {typedGroup.questions && typedGroup.questions.length > 0 && (
            <div className="mb-4 p-3 bg-muted/20 rounded-md">
              <p className="font-medium text-sm mb-2">Label Answers:</p>
              <div className="space-y-1">
                {typedGroup.questions.map((q, i) => (
                  <div key={i} className="text-sm">
                    <span className="font-medium">{i + 1}.</span>{" "}
                    <span className="text-muted-foreground">({q.labelId})</span>{" "}
                    → {q.correctAnswer}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Word Bank */}
          {typedGroup.options && typedGroup.options.length > 0 && (
            <div className="bg-muted/30 p-2 rounded-md">
              <p className="font-medium text-sm mb-1">Word Bank:</p>
              <div className="flex flex-wrap gap-2">
                {typedGroup.options.map((option: string, i: number) => (
                  <span key={i} className="px-2 py-1 bg-muted rounded text-sm">
                    {option}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Word Limit */}
          {typedGroup.wordLimit !== undefined && (
            <p className="text-xs text-muted-foreground mt-1">
              {typedGroup.wordLimitText ||
                `No more than ${typedGroup.wordLimit} word${
                  typedGroup.wordLimit > 1 ? "s" : ""
                }`}
            </p>
          )}
        </div>
      );
    }

    default:
      return (
        <p className="text-muted-foreground italic">
          Preview not available for this question type.
        </p>
      );
  }
}
