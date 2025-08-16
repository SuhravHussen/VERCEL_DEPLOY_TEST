"use client";

import React, { useContext, useState } from "react";
import {
  IELTSListeningQuestionGroup,
  IELTSListeningAudio,
  IELTSListeningQuestionType,
} from "@/types/exam/ielts-academic/listening/listening";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StepperContext } from "../shared/StepperContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import MultipleChoiceFields from "./question-type-fields/MultipleChoiceFields";
import MultipleChoiceMultipleAnswersFields from "./question-type-fields/MultipleChoiceMultipleAnswersFields";
import SentenceCompletionFields from "./question-type-fields/SentenceCompletionFields";
import ShortAnswerFields from "./question-type-fields/ShortAnswerFields";
import FormCompletionFields from "./question-type-fields/FormCompletionFields";
import MatchingFields from "./question-type-fields/MatchingFields";
import TableCompletionFields from "./question-type-fields/TableCompletionFields";
import NoteCompletionFields from "./question-type-fields/NoteCompletionFields";
import DiagramLabelCompletionFields from "./question-type-fields/DiagramLabelCompletionFields";
import FlowChartCompletionFields from "./question-type-fields/FlowChartCompletionFields";

interface QuestionStepProps {
  formData: IELTSListeningQuestionGroup[];
  updateFormData: (data: IELTSListeningQuestionGroup[]) => void;
  audio: IELTSListeningAudio;
  organizationSlug: string;
}

const questionTypes = [
  { value: "multiple_choice", label: "Multiple Choice" },
  {
    value: "multiple_choice_multiple_answers",
    label: "Multiple Choice (Multiple Answers)",
  },
  { value: "sentence_completion", label: "Sentence Completion" },
  { value: "form_completion", label: "Form Completion" },
  { value: "note_completion", label: "Note Completion" },
  { value: "table_completion", label: "Table Completion" },
  { value: "flow_chart_completion", label: "Flow Chart Completion" },
  { value: "diagram_label_completion", label: "Diagram Label Completion" },
  { value: "matching", label: "Matching" },
  { value: "short_answer", label: "Short Answer" },
];

export default function QuestionStep({
  formData,
  updateFormData,
  audio,
}: QuestionStepProps) {
  const { stepperRef } = useContext(StepperContext);
  const [selectedQuestionType, setSelectedQuestionType] = useState<
    IELTSListeningQuestionType | ""
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
      questionType: selectedQuestionType,
      questions: [],
    };

    // Create the appropriate question group based on the selected type
    let newGroup: IELTSListeningQuestionGroup;

    switch (selectedQuestionType) {
      case "multiple_choice":
        newGroup = {
          ...baseGroup,
          questions: [],
        };
        break;
      case "multiple_choice_multiple_answers":
        newGroup = {
          ...baseGroup,
          questions: [],
          options: ["Option A", "Option B", "Option C"],
          answersRequired: 2,
        };
        break;
      case "sentence_completion":
        newGroup = {
          ...baseGroup,
          questions: [],
          wordLimit: 3,
          wordLimitText: "NO MORE THAN THREE WORDS",
        };
        break;
      case "form_completion":
        newGroup = {
          ...baseGroup,
          questions: [],
          formContent: "",
          wordLimit: 3,
          wordLimitText: "NO MORE THAN THREE WORDS",
          options: undefined, // Support for word bank
        };
        break;
      case "note_completion":
        newGroup = {
          ...baseGroup,
          questions: [],
          noteText: "",
          wordLimit: 3,
          wordLimitText: "NO MORE THAN THREE WORDS",
          options: undefined, // Support for word bank
        };
        break;
      case "table_completion":
        newGroup = {
          ...baseGroup,
          questions: [],
          tableStructure: [
            ["Cell 1", "Cell 2"],
            ["Cell 3", "Cell 4"],
          ],
          wordLimit: 3,
          wordLimitText: "NO MORE THAN THREE WORDS",
          options: undefined, // Support for word bank
        };
        break;
      case "flow_chart_completion":
        newGroup = {
          ...baseGroup,
          questions: [],
          chartStructure: "Step 1 → Step 2 → Step 3",
          wordLimit: 3,
          wordLimitText: "NO MORE THAN THREE WORDS",
          options: undefined, // Support for word bank
        };
        break;
      case "diagram_label_completion":
        newGroup = {
          ...baseGroup,
          questions: [],
          diagramImage: "",
          diagramDescription: "",
          wordLimit: 3,
          wordLimitText: "NO MORE THAN THREE WORDS",
          options: undefined, // Support for word bank
        };
        break;
      case "matching":
        newGroup = {
          ...baseGroup,
          questions: [],
          options: ["Option A", "Option B", "Option C"],
        };
        break;
      case "short_answer":
        newGroup = {
          ...baseGroup,
          questions: [],
          maxWords: 3,
          wordLimitText: "NO MORE THAN THREE WORDS",
        };
        break;
      default:
        newGroup = baseGroup;
        break;
    }

    updateFormData([...formData, newGroup]);
    setSelectedQuestionId(newGroup.id);
  };

  const updateQuestionGroup = (
    id: string,
    data: Partial<IELTSListeningQuestionGroup>
  ) => {
    const updatedFormData = formData.map((group) =>
      group.id === id
        ? ({ ...group, ...data } as IELTSListeningQuestionGroup)
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

  const renderQuestionFields = (questionGroup: IELTSListeningQuestionGroup) => {
    switch (questionGroup.questionType) {
      case "multiple_choice":
        return (
          <MultipleChoiceFields
            questionGroup={
              questionGroup as unknown as import("@/types/exam/ielts-academic/listening/listening").ListeningMultipleChoiceGroup
            }
            updateQuestionGroup={(data) =>
              updateQuestionGroup(questionGroup.id!, data)
            }
          />
        );
      case "multiple_choice_multiple_answers":
        return (
          <MultipleChoiceMultipleAnswersFields
            questionGroup={
              questionGroup as unknown as import("@/types/exam/ielts-academic/listening/listening").ListeningMultipleChoiceMultipleAnswersGroup
            }
            updateQuestionGroup={(data) =>
              updateQuestionGroup(questionGroup.id!, data)
            }
          />
        );
      case "sentence_completion":
        return (
          <SentenceCompletionFields
            questionGroup={
              questionGroup as unknown as import("@/types/exam/ielts-academic/listening/listening").ListeningSentenceCompletionGroup
            }
            updateQuestionGroup={(data) =>
              updateQuestionGroup(questionGroup.id!, data)
            }
          />
        );
      case "form_completion":
        return (
          <FormCompletionFields
            questionGroup={
              questionGroup as unknown as import("@/types/exam/ielts-academic/listening/listening").ListeningFormCompletionGroup
            }
            updateQuestionGroup={(data) =>
              updateQuestionGroup(questionGroup.id!, data)
            }
          />
        );
      case "table_completion":
        return (
          <TableCompletionFields
            questionGroup={
              questionGroup as unknown as import("@/types/exam/ielts-academic/listening/listening").ListeningTableCompletionGroup
            }
            updateQuestionGroup={(data) =>
              updateQuestionGroup(questionGroup.id!, data)
            }
          />
        );
      case "note_completion":
        return (
          <NoteCompletionFields
            questionGroup={
              questionGroup as unknown as import("@/types/exam/ielts-academic/listening/listening").ListeningNoteCompletionGroup
            }
            updateQuestionGroup={(data) =>
              updateQuestionGroup(questionGroup.id!, data)
            }
          />
        );
      case "flow_chart_completion":
        return (
          <FlowChartCompletionFields
            questionGroup={
              questionGroup as unknown as import("@/types/exam/ielts-academic/listening/listening").ListeningFlowChartCompletionGroup
            }
            updateQuestionGroup={(data) =>
              updateQuestionGroup(questionGroup.id!, data)
            }
          />
        );
      case "diagram_label_completion":
        return (
          <DiagramLabelCompletionFields
            questionGroup={
              questionGroup as unknown as import("@/types/exam/ielts-academic/listening/listening").ListeningDiagramLabelCompletionGroup
            }
            updateQuestionGroup={(data) =>
              updateQuestionGroup(questionGroup.id!, data)
            }
          />
        );
      case "short_answer":
        return (
          <ShortAnswerFields
            questionGroup={
              questionGroup as unknown as import("@/types/exam/ielts-academic/listening/listening").ListeningShortAnswerGroup
            }
            updateQuestionGroup={(data) =>
              updateQuestionGroup(questionGroup.id!, data)
            }
          />
        );
      case "matching":
        return (
          <MatchingFields
            questionGroup={
              questionGroup as unknown as import("@/types/exam/ielts-academic/listening/listening").ListeningMatchingGroup
            }
            updateQuestionGroup={(data) =>
              updateQuestionGroup(questionGroup.id!, data)
            }
          />
        );
      default:
        return (
          <div className="p-4 border rounded-md">
            <div className="space-y-4">
              <div>
                <Label htmlFor="instruction">Instruction</Label>
                <textarea
                  id="instruction"
                  className="w-full p-2 border rounded-md mt-1"
                  rows={3}
                  value={questionGroup.instruction || ""}
                  onChange={(e) =>
                    updateQuestionGroup(questionGroup.id!, {
                      instruction: e.target.value,
                    })
                  }
                  placeholder="Enter instructions for this question group"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Question type: {questionGroup.questionType}
              </p>
              <p className="text-yellow-600 text-sm">
                Note: Detailed question field editors for this question type
                will be implemented in the next phase.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 w-full max-w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <h2 className="text-lg font-semibold">Question Settings</h2>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Badge variant="outline" className="whitespace-nowrap">
            Audio: {audio.title || "Untitled"}
          </Badge>
          <Badge variant="outline" className="whitespace-nowrap">
            Difficulty: {audio.difficulty}
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
                    value={selectedQuestionType || undefined}
                    onValueChange={(value) =>
                      setSelectedQuestionType(
                        value as IELTSListeningQuestionType
                      )
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
                      <div
                        key={group.id}
                        className={`p-3 border rounded-md cursor-pointer transition-colors ${
                          selectedQuestionId === group.id
                            ? "border-primary bg-primary/5"
                            : "hover:bg-muted/50"
                        }`}
                        onClick={() => setSelectedQuestionId(group.id ?? null)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">
                              Question Group {index + 1}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {group.questionType.replace(/_/g, " ")}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteQuestionGroup(group.id ?? "");
                            }}
                          >
                            &times;
                          </Button>
                        </div>
                      </div>
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
