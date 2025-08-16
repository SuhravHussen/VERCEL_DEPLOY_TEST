// @ts-nocheck
/* eslint-disable */

"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useContext, useState } from "react";
import { StepperContext } from "../CreateQuestionPageClient";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  IELTSReadingQuestionGroup,
  IELTSReadingQuestionType,
} from "@/types/exam/ielts-academic/reading/question/question";
import { PlusCircle } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import MultipleChoiceFields from "./question-type-fields/MultipleChoiceFields";
import MultipleChoiceMultipleAnswersFields from "./question-type-fields/MultipleChoiceMultipleAnswersFields";
import TrueFalseNotGivenFields from "./question-type-fields/TrueFalseNotGivenFields";
import ShortAnswerFields from "./question-type-fields/ShortAnswerFields";
import MatchingHeadingsFields from "./question-type-fields/MatchingHeadingsFields";
import MatchingFeaturesFields from "./question-type-fields/MatchingFeaturesFields";
import DiagramLabelCompletionFields from "./question-type-fields/DiagramLabelCompletionFields";
import SummaryCompletionFields from "./question-type-fields/SummaryCompletionFields";
import FlowChartCompletionFields from "./question-type-fields/FlowChartCompletionFields";
import SentenceCompletionFields from "./question-type-fields/SentenceCompletionFields";
import TableCompletionFields from "./question-type-fields/TableCompletionFields";
import { Separator } from "@/components/ui/separator";
import { QuestionCard } from "./QuestionCard";
import { Badge } from "@/components/ui/badge";
import MatchingInformationFields from "./question-type-fields/MatchingInformationFields";
import MatchingSentenceEndingsFields from "./question-type-fields/MatchingSentenceEndingsFields";
import NoteCompletionFields from "./question-type-fields/NoteCompletionFields";

interface QuestionStepProps {
  formData: IELTSReadingQuestionGroup[];
  updateFormData: (data: IELTSReadingQuestionGroup[]) => void;
  passage: {
    title: string;
    content: string;
    difficulty: "easy" | "medium" | "hard";
  };
  organizationSlug: string;
}

const questionTypes = [
  { value: "multiple_choice", label: "Multiple Choice" },
  {
    value: "multiple_choice_multiple_answers",
    label: "Multiple Choice (Multiple Answers)",
  },
  { value: "true_false_not_given", label: "True/False/Not Given" },
  { value: "yes_no_not_given", label: "Yes/No/Not Given" },
  { value: "matching_information", label: "Matching Information" },
  { value: "matching_headings", label: "Matching Headings" },
  { value: "matching_features", label: "Matching Features" },
  { value: "matching_sentence_endings", label: "Matching Sentence Endings" },
  { value: "sentence_completion", label: "Sentence Completion" },
  { value: "summary_completion", label: "Summary Completion" },
  { value: "note_completion", label: "Note Completion" },
  { value: "table_completion", label: "Table Completion" },
  { value: "flow_chart_completion", label: "Flow Chart Completion" },
  { value: "diagram_label_completion", label: "Diagram Label Completion" },
  { value: "short_answer", label: "Short Answer" },
];

export default function QuestionStep({
  formData,
  updateFormData,
  passage,
  organizationSlug,
}: QuestionStepProps) {
  const { stepperRef } = useContext(StepperContext);
  const [selectedQuestionType, setSelectedQuestionType] = useState<
    IELTSReadingQuestionType | ""
  >("");
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    null
  );

  const handleNext = () => {
    if (stepperRef.current) {
      stepperRef.current.nextStep();
    }
  };

  const handlePrev = () => {
    if (stepperRef.current) {
      stepperRef.current.prevStep();
    }
  };

  const addQuestionGroup = () => {
    if (!selectedQuestionType) return;

    // Create a base question group object
    const baseGroup = {
      id: uuidv4(),
      instruction: "",
    };

    // Create the appropriate question group based on the selected type
    let newGroup: any; // Use 'any' temporarily to avoid TypeScript errors

    switch (selectedQuestionType) {
      case "multiple_choice":
        newGroup = {
          ...baseGroup,
          questionType: "multiple_choice",
          questions: [],
        };
        break;
      case "multiple_choice_multiple_answers":
        newGroup = {
          ...baseGroup,
          questionType: "multiple_choice_multiple_answers",
          questions: [],
          answersRequired: 2,
          options: [],
        };
        break;
      case "true_false_not_given":
        newGroup = {
          ...baseGroup,
          questionType: "true_false_not_given",
          questions: [],
        };
        break;
      case "yes_no_not_given":
        newGroup = {
          ...baseGroup,
          questionType: "yes_no_not_given",
          questions: [],
        };
        break;
      case "matching_information":
        newGroup = {
          ...baseGroup,
          questionType: "matching_information",
          questions: [],
          paragraphLabels: [],
        };
        break;
      case "matching_headings":
        newGroup = {
          ...baseGroup,
          questionType: "matching_headings",
          questions: [],
          headings: [],
        };
        break;
      case "matching_features":
        newGroup = {
          ...baseGroup,
          questionType: "matching_features",
          questions: [],
          features: [],
        };
        break;
      case "matching_sentence_endings":
        newGroup = {
          ...baseGroup,
          questionType: "matching_sentence_endings",
          questions: [],
          endings: [],
        };
        break;
      case "sentence_completion":
        newGroup = {
          ...baseGroup,
          questionType: "sentence_completion",
          questions: [],
        };
        break;
      case "summary_completion":
        newGroup = {
          ...baseGroup,
          questionType: "summary_completion",
          questions: [],
          summaryText: "",
        };
        break;
      case "note_completion":
        newGroup = {
          ...baseGroup,
          questionType: "note_completion",
          questions: [],
          noteText: "",
        };
        break;
      case "table_completion":
        newGroup = {
          ...baseGroup,
          questionType: "table_completion",
          questions: [],
          tableStructure: [[]],
        };
        break;
      case "flow_chart_completion":
        newGroup = {
          ...baseGroup,
          questionType: "flow_chart_completion",
          questions: [],
          chartStructure: "",
        };
        break;
      case "diagram_label_completion":
        newGroup = {
          ...baseGroup,
          questionType: "diagram_label_completion",
          questions: [],
          diagramDescription: "",
          diagramImage: "",
        };
        break;
      case "short_answer":
        newGroup = {
          ...baseGroup,
          questionType: "short_answer",
          questions: [],
          maxWords: 3,
        };
        break;
      default:
        // This shouldn't happen with our dropdown, but just in case
        throw new Error(`Unsupported question type: ${selectedQuestionType}`);
    }

    // @ts-ignore: Complex type issues between question.ts and component types
    // Use type assertion to satisfy TypeScript
    updateFormData([...formData, newGroup as IELTSReadingQuestionGroup]);
    setSelectedQuestionId(newGroup.id);
  };

  const updateQuestionGroup = (
    id: string,
    data: Partial<IELTSReadingQuestionGroup>
  ) => {
    const updatedFormData = formData.map((group) =>
      group.id === id
        ? ({ ...group, ...data } as IELTSReadingQuestionGroup)
        : group
    );
    updateFormData(updatedFormData);
  };

  const deleteQuestionGroup = (id: string) => {
    const updatedFormData = formData.filter((group) => group.id !== id);
    updateFormData(updatedFormData);
    if (selectedQuestionId === id) {
      setSelectedQuestionId(null);
    }
  };

  const renderQuestionFields = (questionGroup: IELTSReadingQuestionGroup) => {
    switch (questionGroup.questionType) {
      case "multiple_choice":
        // @ts-ignore: Type compatibility issues between component types and question.ts types
        return (
          <MultipleChoiceFields
            questionGroup={questionGroup}
            updateQuestionGroup={(data) =>
              updateQuestionGroup(questionGroup.id!, data)
            }
          />
        );
      case "multiple_choice_multiple_answers":
        // @ts-ignore: Type compatibility issues between component types and question.ts types
        return (
          <MultipleChoiceMultipleAnswersFields
            questionGroup={questionGroup}
            updateQuestionGroup={(data) =>
              updateQuestionGroup(questionGroup.id!, data)
            }
          />
        );
      case "true_false_not_given":
      case "yes_no_not_given":
        // @ts-ignore: Type compatibility issues between component types and question.ts types
        return (
          <TrueFalseNotGivenFields
            questionGroup={questionGroup}
            updateQuestionGroup={(data) =>
              updateQuestionGroup(questionGroup.id!, data)
            }
            questionType={questionGroup.questionType}
          />
        );
      case "short_answer":
        // @ts-ignore: Type compatibility issues between component types and question.ts types
        return (
          <ShortAnswerFields
            questionGroup={questionGroup}
            updateQuestionGroup={(data) =>
              updateQuestionGroup(questionGroup.id!, data)
            }
          />
        );
      case "matching_headings":
        // @ts-ignore: Type compatibility issues between component types and question.ts types
        return (
          <MatchingHeadingsFields
            questionGroup={questionGroup}
            updateQuestionGroup={(data) =>
              updateQuestionGroup(questionGroup.id!, data)
            }
          />
        );
      case "matching_features":
        // @ts-ignore: Type compatibility issues between component types and question.ts types
        return (
          <MatchingFeaturesFields
            questionGroup={questionGroup}
            updateQuestionGroup={(data) =>
              updateQuestionGroup(questionGroup.id!, data)
            }
          />
        );
      case "matching_information":
        // @ts-ignore: Type compatibility issues between component types and question.ts types
        return (
          <MatchingInformationFields
            questionGroup={questionGroup}
            updateQuestionGroup={(data) =>
              updateQuestionGroup(questionGroup.id!, data)
            }
          />
        );
      case "matching_sentence_endings":
        // @ts-ignore: Type compatibility issues between component types and question.ts types
        return (
          <MatchingSentenceEndingsFields
            questionGroup={questionGroup}
            updateQuestionGroup={(data) =>
              updateQuestionGroup(questionGroup.id!, data)
            }
          />
        );
      case "sentence_completion":
        // @ts-ignore: Type compatibility issues between component types and question.ts types
        return (
          <SentenceCompletionFields
            questionGroup={questionGroup}
            updateQuestionGroup={(data) =>
              updateQuestionGroup(questionGroup.id!, data)
            }
          />
        );
      case "summary_completion":
        return (
          <SummaryCompletionFields
            questionGroup={questionGroup}
            updateQuestionGroup={(data) =>
              updateQuestionGroup(questionGroup.id!, data)
            }
          />
        );
      case "note_completion":
        // @ts-ignore: Type compatibility issues between component types and question.ts types
        return (
          <NoteCompletionFields
            questionGroup={questionGroup}
            updateQuestionGroup={(data) =>
              updateQuestionGroup(questionGroup.id!, data)
            }
          />
        );
      case "table_completion":
        // @ts-ignore: Type compatibility issues between component types and question.ts types
        return (
          <TableCompletionFields
            questionGroup={questionGroup}
            updateQuestionGroup={(data) =>
              updateQuestionGroup(questionGroup.id!, data)
            }
          />
        );
      case "flow_chart_completion":
        // @ts-ignore: Type compatibility issues between component types and question.ts types
        return (
          <FlowChartCompletionFields
            questionGroup={questionGroup}
            updateQuestionGroup={(data) =>
              updateQuestionGroup(questionGroup.id!, data)
            }
            organizationId={organizationId}
          />
        );
      case "diagram_label_completion":
        // @ts-ignore: Type compatibility issues between component types and question.ts types
        return (
          <DiagramLabelCompletionFields
            questionGroup={questionGroup}
            updateQuestionGroup={(data) =>
              updateQuestionGroup(questionGroup.id!, data)
            }
            organizationId={organizationId}
          />
        );
      default:
        return (
          <p className="text-muted-foreground italic">
            This question type is not yet implemented. Please check back later.
          </p>
        );
    }
  };

  return (
    <div className="space-y-6 w-full max-w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <h2 className="text-lg font-semibold">Question Settings</h2>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Badge variant="outline" className="whitespace-nowrap">
            Passage: {passage.title || "Untitled"}
          </Badge>
          <Badge variant="outline" className="whitespace-nowrap">
            Difficulty: {passage.difficulty}
          </Badge>
        </div>
      </div>

      <Card className="p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left sidebar - question list */}
          <div className="col-span-1 md:col-span-4 lg:col-span-3 md:border-r md:pr-4 pb-6 md:pb-0 border-b md:border-b-0">
            <div className="space-y-4">
              <div>
                <Label htmlFor="question-type">Question Type</Label>
                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                  <Select
                    value={selectedQuestionType}
                    onValueChange={(value) =>
                      setSelectedQuestionType(value as IELTSReadingQuestionType)
                    }
                  >
                    <SelectTrigger
                      id="question-type"
                      className="w-full sm:w-[240px] truncate"
                    >
                      <SelectValue placeholder="Select question type" />
                    </SelectTrigger>
                    <SelectContent>
                      {questionTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={addQuestionGroup}
                    disabled={!selectedQuestionType}
                    className="whitespace-nowrap w-full sm:w-auto"
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>

              <Separator />

              {formData.length > 0 ? (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Question Groups</h3>
                  <div className="space-y-2">
                    {formData.map((group, index) => (
                      <QuestionCard
                        key={group.id}
                        group={group as IELTSReadingQuestionGroup}
                        index={index}
                        isSelected={selectedQuestionId === group.id}
                        onClick={() => setSelectedQuestionId(group.id ?? null)}
                        onDelete={() => deleteQuestionGroup(group.id ?? "")}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No questions added yet.</p>
                  <p className="text-sm">
                    Select a question type and add your first question group.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right content - question editing */}
          <div className="col-span-1 md:col-span-8 lg:col-span-9">
            {selectedQuestionId ? (
              <>
                {renderQuestionFields(
                  formData.find((g) => g.id === selectedQuestionId)!
                )}
              </>
            ) : (
              <div className="text-center py-12 sm:py-20 text-muted-foreground">
                <p>Select a question group to edit, or add a new one.</p>
              </div>
            )}
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
          onClick={handleNext}
          disabled={formData.length === 0}
          className="w-full sm:w-auto"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
