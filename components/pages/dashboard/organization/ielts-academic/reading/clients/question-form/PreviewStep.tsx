/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useContext } from "react";
import { StepperContext } from "../CreateQuestionPageClient";
import { Badge } from "@/components/ui/badge";
import React from "react";
import {
  IELTSReadingQuestionGroup,
  MultipleChoiceGroup,
  MultipleChoiceMultipleAnswersGroup,
  TrueFalseNotGivenGroup,
  YesNoNotGivenGroup,
  MatchingInformationGroup,
  MatchingHeadingsGroup,
  MatchingFeaturesGroup,
  MatchingSentenceEndingsGroup,
  SentenceCompletionGroup,
  SummaryCompletionGroup,
  NoteCompletionGroup,
  TableCompletionGroup,
  FlowChartCompletionGroup,
  DiagramLabelCompletionGroup,
  ShortAnswerGroup,
} from "@/types/exam/ielts-academic/reading/question/question";

// Define specific types for PreviewStep

interface PreviewStepProps {
  formData: {
    passage: {
      title: string;
      content: string;
      difficulty: "easy" | "medium" | "hard";
    };
    questions: IELTSReadingQuestionGroup[];
  };
  onSave?: () => void;
  isSaving?: boolean;
}

export default function PreviewStep({
  formData,
  onSave,
  isSaving,
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
              Reading Passage: {formData.passage.title}
            </h3>
            <Badge className="mb-3">{formData.passage.difficulty}</Badge>
            <div
              className="prose max-w-none text-sm overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: formData.passage.content }}
            />
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
            !formData.passage.title ||
            !formData.passage.content ||
            formData.questions.length === 0
          }
          className="w-full sm:w-auto"
        >
          {isSaving ? "Saving..." : "Create Question"}
        </Button>
      </div>
    </div>
  );
}

function getQuestionTypeLabel(type: string): string {
  const types: Record<string, string> = {
    multiple_choice: "Multiple Choice",
    multiple_choice_multiple_answers: "Multiple Choice (Multiple Answers)",
    true_false_not_given: "True/False/Not Given",
    yes_no_not_given: "Yes/No/Not Given",
    matching_information: "Matching Information",
    matching_headings: "Matching Headings",
    matching_features: "Matching Features",
    matching_sentence_endings: "Matching Sentence Endings",
    sentence_completion: "Sentence Completion",
    summary_completion: "Summary Completion",
    note_completion: "Note Completion",
    table_completion: "Table Completion",
    flow_chart_completion: "Flow Chart Completion",
    diagram_label_completion: "Diagram Label Completion",
    short_answer: "Short Answer",
  };

  return types[type] || type;
}

function renderQuestionGroupPreview(
  group: IELTSReadingQuestionGroup,
  compact = false
): React.ReactNode {
  // Basic rendering for different question types
  switch (group.questionType) {
    case "multiple_choice": {
      const typedGroup = group as MultipleChoiceGroup;
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
      const typedGroup = group as MultipleChoiceMultipleAnswersGroup;
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

    case "true_false_not_given":
    case "yes_no_not_given": {
      const typedGroup = group as TrueFalseNotGivenGroup | YesNoNotGivenGroup;
      return typedGroup.questions?.map((q, i) => (
        <div key={i} className={compact ? "mb-2" : "mb-4"}>
          <p className={compact ? "text-sm" : ""}>
            <span className="font-medium">{q.number}.</span> {q.statement}
          </p>
          <div className="flex flex-wrap gap-3 mt-1">
            {group.questionType === "true_false_not_given" ? (
              <>
                <span className="text-xs border px-2 py-1 rounded">TRUE</span>
                <span className="text-xs border px-2 py-1 rounded">FALSE</span>
                <span className="text-xs border px-2 py-1 rounded">
                  NOT GIVEN
                </span>
              </>
            ) : (
              <>
                <span className="text-xs border px-2 py-1 rounded">YES</span>
                <span className="text-xs border px-2 py-1 rounded">NO</span>
                <span className="text-xs border px-2 py-1 rounded">
                  NOT GIVEN
                </span>
              </>
            )}
          </div>
        </div>
      ));
    }

    case "short_answer": {
      const typedGroup = group as ShortAnswerGroup;
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

    case "matching_headings": {
      const typedGroup = group as MatchingHeadingsGroup;
      return (
        <div>
          <div className="mb-4 bg-muted/30 p-2 rounded-md">
            <p className="font-medium text-sm mb-1">Headings:</p>
            <div className="space-y-1">
              {(typedGroup.headings || []).map((heading: string, i: number) => (
                <div key={i} className="text-sm">
                  <span className="font-medium mr-2">{i + 1}</span>
                  {heading}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {typedGroup.questions?.map((q, i) => (
              <div key={i} className="border-l-2 border-primary/30 pl-3">
                <p className="text-sm font-medium">Paragraph {i + 1}</p>
                <p
                  className={`text-sm ${
                    compact ? "line-clamp-2" : "line-clamp-4"
                  }`}
                >
                  {q.paragraph}
                </p>
                <div className="flex gap-2 mt-1 items-center">
                  <span className="text-xs">Heading:</span>
                  <div className="border border-dotted border-gray-400 px-3 py-1 rounded text-xs">
                    ?
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "matching_features": {
      const typedGroup = group as MatchingFeaturesGroup;
      return (
        <div>
          <div className="mb-4 bg-muted/30 p-2 rounded-md">
            <p className="font-medium text-sm mb-1">Features:</p>
            <div className="space-y-1">
              {(typedGroup.features || []).map((feature, i: number) => (
                <div key={i} className="text-sm">
                  <span className="font-medium mr-2">{feature.label}</span>
                  {feature.description}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {typedGroup.questions?.map((q, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="font-medium">{q.number}.</span>
                <div>
                  <p className={`text-sm ${compact ? "" : "mb-1"}`}>
                    {q.statement}
                  </p>
                  <div className="flex gap-2 mt-1 items-center">
                    <span className="text-xs">Feature:</span>
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

    case "matching_information": {
      const typedGroup = group as MatchingInformationGroup;
      return (
        <div>
          <div className="mb-4 bg-muted/30 p-2 rounded-md">
            <p className="font-medium text-sm mb-1">Paragraphs:</p>
            <div className="flex flex-wrap gap-2">
              {(typedGroup.paragraphLabels || []).map(
                (label: string, i: number) => (
                  <span key={i} className="px-2 py-1 bg-muted rounded text-sm">
                    {label}
                  </span>
                )
              )}
            </div>
          </div>
          <div className="space-y-3">
            {typedGroup.questions?.map((q, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="font-medium">{q.number}.</span>
                <div>
                  <p className={`text-sm ${compact ? "" : "mb-1"}`}>
                    {q.statement}
                  </p>
                  {q.imageUrl && (
                    <img
                      src={q.imageUrl}
                      alt={`Visual for statement ${q.number}`}
                      className="mt-1 max-h-20 object-contain"
                    />
                  )}
                  <div className="flex gap-2 mt-1 items-center">
                    <span className="text-xs">Paragraph:</span>
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

    case "matching_sentence_endings": {
      const typedGroup = group as MatchingSentenceEndingsGroup;
      return (
        <div>
          <div className="mb-4 bg-muted/30 p-2 rounded-md">
            <p className="font-medium text-sm mb-1">Endings:</p>
            <div className="space-y-1">
              {(typedGroup.endings || []).map((ending, i: number) => (
                <div key={i} className="text-sm">
                  <span className="font-medium mr-2">{ending.label}</span>
                  {ending.text}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {typedGroup.questions?.map((q, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="font-medium">{q.number}.</span>
                <div>
                  <p className={`text-sm ${compact ? "" : "mb-1"}`}>
                    {q.sentenceStart}
                  </p>
                  <div className="flex gap-2 mt-1 items-center">
                    <span className="text-xs">Ending:</span>
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
      const typedGroup = group as SentenceCompletionGroup;
      return typedGroup.questions?.map((q, i) => (
        <div key={i} className={compact ? "mb-2" : "mb-4"}>
          <p className={compact ? "text-sm" : ""}>
            <span className="font-medium">{q.number}.</span>{" "}
            {q.sentenceWithBlank
              ?.split("___")
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

    case "summary_completion": {
      const typedGroup = group as SummaryCompletionGroup;
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
          <div className="border rounded-md p-3 bg-white">
            <div>
              {typedGroup.summaryText &&
                typedGroup.summaryText
                  .split(/(\[gap-\d+\])/)
                  .map((part: string, i: number) => (
                    <React.Fragment key={i}>
                      {part}
                      {part.match(/\[gap-\d+\]/) && (
                        <span className="mx-1 inline-flex items-center justify-center bg-primary/10 px-2 border border-dashed border-primary/30 rounded">
                          {i + 1}
                        </span>
                      )}
                    </React.Fragment>
                  ))}
            </div>
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

    case "note_completion": {
      const typedGroup = group as NoteCompletionGroup;
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
          <div className="border rounded-md p-3 bg-white">
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
      const typedGroup = group as TableCompletionGroup;
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
      const typedGroup = group as FlowChartCompletionGroup;
      return (
        <div>
          {typedGroup.chartImage ? (
            <div className="mb-4 border rounded overflow-hidden">
              <img
                src={typedGroup.chartImage}
                alt="Flow Chart"
                className="max-w-full h-auto object-contain mx-auto"
                style={compact ? { maxHeight: "200px" } : {}}
              />
            </div>
          ) : (
            <div className="mb-4 border rounded-md p-3 bg-white">
              <div className="text-center mb-2 font-medium">Flow Chart</div>
              <div className="flex flex-col items-center">
                {typedGroup.questions?.map((q, i) => (
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
      const typedGroup = group as DiagramLabelCompletionGroup;
      return (
        <div>
          {typedGroup.diagramImage && (
            <div className="mb-4 border rounded overflow-hidden">
              <img
                src={typedGroup.diagramImage}
                alt="Diagram"
                className="max-w-full h-auto object-contain mx-auto"
                style={compact ? { maxHeight: "200px" } : {}}
              />
            </div>
          )}
          <div className="space-y-2">
            {typedGroup.questions?.map((q, i) => (
              <div key={i} className="flex items-center">
                <span className="font-medium mr-2">{q.stepId}</span>
                <div className="border-b border-dotted border-gray-400 h-6 w-32"></div>
              </div>
            ))}
          </div>
          {typedGroup.options && typedGroup.options.length > 0 && (
            <div className="mt-3 bg-muted/30 p-2 rounded-md">
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
