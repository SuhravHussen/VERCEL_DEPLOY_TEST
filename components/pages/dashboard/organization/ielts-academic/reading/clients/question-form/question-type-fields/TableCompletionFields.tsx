"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  PlusCircle,
  Trash,
  Table as TableIcon,
  RowsIcon,
  ColumnsIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import React from "react";
import { TableCompletionGroup } from "@/types/exam/ielts-academic/reading/question/question";

// Define specific types for this component
interface GapQuestion {
  cellId: string;
  correctAnswer: string;
  [key: string]: unknown; // For compatibility
}

interface TableCompletionFieldsProps {
  questionGroup: TableCompletionGroup;
  updateQuestionGroup: (data: Partial<TableCompletionGroup>) => void;
}

interface TableCellProps {
  value: string;
  rowIndex: number;
  colIndex: number;
  isGap: boolean;
  gapId?: string;
  onChange: (rowIndex: number, colIndex: number, value: string) => void;
  onToggleGap: (rowIndex: number, colIndex: number) => void;
  isHeader?: boolean;
}

const TableCell: React.FC<TableCellProps> = ({
  value,
  rowIndex,
  colIndex,
  isGap,
  gapId,
  onChange,
  onToggleGap,
  isHeader = false,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col border p-1",
        isHeader && "bg-muted font-medium",
        isGap && "bg-primary/5"
      )}
    >
      <Input
        className={cn(
          "border-0 focus-visible:ring-0 p-1",
          isGap ? "bg-primary/5" : "bg-transparent"
        )}
        value={value}
        onChange={(e) => onChange(rowIndex, colIndex, e.target.value)}
        placeholder={isGap ? "Gap" : "Cell content"}
      />
      {!isHeader && (
        <div className="flex items-center justify-end space-x-1 mt-1">
          <Switch
            checked={isGap}
            onCheckedChange={() => onToggleGap(rowIndex, colIndex)}
          />
          <span className="text-xs">{isGap ? `Gap ${gapId}` : "Make gap"}</span>
        </div>
      )}
    </div>
  );
};

export default function TableCompletionFields({
  questionGroup,
  updateQuestionGroup,
}: TableCompletionFieldsProps) {
  const [showOptions, setShowOptions] = useState(
    !!questionGroup.options?.length
  );
  const [wordLimitOptions] = useState([
    { value: "1", label: "ONE WORD ONLY" },
    { value: "2", label: "NO MORE THAN TWO WORDS" },
    { value: "3", label: "NO MORE THAN THREE WORDS" },
  ]);

  const tableStructure = questionGroup.tableStructure || [];
  const questions = questionGroup.questions || [];

  const [tableRows, setTableRows] = useState<number>(
    tableStructure.length || 3
  );
  const [tableCols, setTableCols] = useState<number>(
    tableStructure[0]?.length || 3
  );

  useEffect(() => {
    if (!questionGroup.tableStructure) {
      const newStructure = Array.from({ length: 3 }, () => Array(3).fill(""));
      updateQuestionGroup({ tableStructure: newStructure, questions: [] });
    }
  }, [questionGroup.tableStructure, updateQuestionGroup]);

  const handleInstructionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    updateQuestionGroup({ instruction: e.target.value });
  };

  const handleWordLimitChange = (value: string) => {
    updateQuestionGroup({
      wordLimit: parseInt(value),
      wordLimitText:
        wordLimitOptions.find((opt) => opt.value === value)?.label || "",
    });
  };

  const toggleOptionsList = (checked: boolean) => {
    setShowOptions(checked);
    if (checked && !questionGroup.options) {
      updateQuestionGroup({ options: ["", "", "", "", ""] });
    } else if (!checked) {
      updateQuestionGroup({ options: undefined });
    }
  };

  const addOption = () => {
    const options = [...(questionGroup.options || [])];
    options.push("");
    updateQuestionGroup({ options });
  };

  const updateOption = (index: number, value: string) => {
    const options = [...(questionGroup.options || [])];
    options[index] = value;
    updateQuestionGroup({ options });
  };

  const deleteOption = (index: number) => {
    const options = [...(questionGroup.options || [])];
    options.splice(index, 1);
    updateQuestionGroup({ options });

    if (options.length === 0) {
      setShowOptions(false);
    }
  };

  // Table structure management
  const addRow = () => {
    const newRow = Array(tableCols).fill("");
    const updatedStructure = [...tableStructure, newRow];
    updateQuestionGroup({ tableStructure: updatedStructure });
    setTableRows(updatedStructure.length);
  };

  const addColumn = () => {
    const updatedStructure = tableStructure.map((row) => [...row, ""]);
    updateQuestionGroup({ tableStructure: updatedStructure });
    setTableCols(updatedStructure[0].length);
  };

  const removeRow = () => {
    if (tableRows <= 2) return;
    const updatedStructure = tableStructure.slice(0, -1);
    updateGapsAfterStructureChange(updatedStructure);
    updateQuestionGroup({ tableStructure: updatedStructure });
    setTableRows(updatedStructure.length);
  };

  const removeColumn = () => {
    if (tableCols <= 2) return;
    const updatedStructure = tableStructure.map((row) => row.slice(0, -1));
    updateGapsAfterStructureChange(updatedStructure);
    updateQuestionGroup({ tableStructure: updatedStructure });
    setTableCols(updatedStructure[0].length);
  };

  const updateCellValue = (
    rowIndex: number,
    colIndex: number,
    value: string
  ) => {
    const updatedStructure = tableStructure.map((row, rIdx) =>
      rIdx === rowIndex
        ? row.map((cell, cIdx) => (cIdx === colIndex ? value : cell))
        : row
    );
    updateQuestionGroup({ tableStructure: updatedStructure });
  };

  // Gap management
  const toggleCellGap = (rowIndex: number, colIndex: number) => {
    if (rowIndex === 0) return; // Don't allow gaps in header row

    const cellId = `${rowIndex}-${colIndex}`;
    const existingGapIndex = questions.findIndex((q) => q.cellId === cellId);

    if (existingGapIndex >= 0) {
      const updatedQuestions = questions.filter((q) => q.cellId !== cellId);
      updateQuestionGroup({ questions: updatedQuestions });
    } else {
      const newGap: GapQuestion = { cellId, correctAnswer: "" };
      updateQuestionGroup({
        questions: [...questions, newGap],
      });
    }
  };

  const updateGapAnswer = (cellId: string, value: string) => {
    const updatedQuestions = questions.map((question) => {
      if (question.cellId === cellId) {
        return { ...question, correctAnswer: value };
      }
      return question;
    });
    updateQuestionGroup({ questions: updatedQuestions });
  };

  // Helper to update gaps after structure changes
  const updateGapsAfterStructureChange = (newStructure: string[][]) => {
    const updatedQuestions = questions.filter((q) => {
      const [rowIndex, colIndex] = q.cellId.split("-").map(Number);
      return (
        rowIndex < newStructure.length && colIndex < newStructure[0]?.length
      );
    });
    updateQuestionGroup({ questions: updatedQuestions });
  };

  const isCellGap = (rowIndex: number, colIndex: number): boolean => {
    if (rowIndex === 0) return false;
    return questions.some((q) => q.cellId === `${rowIndex}-${colIndex}`);
  };

  const getGapId = (rowIndex: number, colIndex: number): string => {
    const gap = questions.find((q) => q.cellId === `${rowIndex}-${colIndex}`);
    if (!gap) return "";
    const index = questions.indexOf(gap);
    return `${index + 1}`;
  };

  return (
    <div className="space-y-6 w-full max-w-full">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="instruction">Instructions</Label>
          <Textarea
            id="instruction"
            placeholder="Enter instructions for this question group"
            value={questionGroup.instruction}
            onChange={handleInstructionChange}
            className="min-h-[100px] w-full"
          />
          <p className="text-sm text-muted-foreground">
            Example: &quot;Complete the table below. Choose NO MORE THAN THREE
            WORDS from the passage for each answer.&quot;
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="word-limit">Word Limit</Label>
          <Select
            value={(questionGroup.wordLimit || 2).toString()}
            onValueChange={handleWordLimitChange}
          >
            <SelectTrigger id="word-limit" className="w-full sm:w-64">
              <SelectValue placeholder="Select word limit" />
            </SelectTrigger>
            <SelectContent>
              {wordLimitOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="use-options"
              checked={showOptions}
              onCheckedChange={toggleOptionsList}
            />
            <Label htmlFor="use-options">Use word bank</Label>
          </div>

          {showOptions && (
            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-0">
                  <h3 className="text-lg font-medium">Word Bank Options</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addOption}
                    className="w-full sm:w-auto"
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add Option
                  </Button>
                </div>

                <div className="space-y-3">
                  {(questionGroup.options || []).map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="flex-grow w-full"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="flex-shrink-0"
                        onClick={() => deleteOption(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4">
          <h3 className="text-lg font-medium">Table Structure</h3>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={addRow}
              title="Add Row"
              className="flex-1 sm:flex-none"
            >
              <RowsIcon className="h-4 w-4 mr-1" />
              Add Row
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={addColumn}
              title="Add Column"
              className="flex-1 sm:flex-none"
            >
              <ColumnsIcon className="h-4 w-4 mr-1" />
              Add Column
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={removeRow}
              disabled={tableRows <= 2}
              title="Remove Row"
              className="flex-1 sm:flex-none"
            >
              <RowsIcon className="h-4 w-4 mr-1" />
              Remove Row
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={removeColumn}
              disabled={tableCols <= 2}
              title="Remove Column"
              className="flex-1 sm:flex-none"
            >
              <ColumnsIcon className="h-4 w-4 mr-1" />
              Remove Column
            </Button>
          </div>
        </div>

        <Card className="p-4">
          <div className="flex items-center justify-center mb-4">
            <TableIcon className="h-6 w-6 mr-2 text-primary" />
            <h3 className="text-lg font-medium">Table Editor</h3>
          </div>

          <p className="text-sm text-muted-foreground mb-4 text-center">
            Click &quot;Make gap&quot; to designate a cell as a gap to be filled
            in by the test taker.
            <br />
            Header cells (first row) cannot be gaps.
          </p>

          <div className="overflow-x-auto">
            <div
              className="grid min-w-[300px]"
              style={{
                gridTemplateColumns: `repeat(${tableCols}, minmax(120px, 1fr))`,
              }}
            >
              {tableStructure.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <TableCell
                    key={`${rowIndex}-${colIndex}`}
                    value={cell}
                    rowIndex={rowIndex}
                    colIndex={colIndex}
                    isGap={isCellGap(rowIndex, colIndex)}
                    gapId={getGapId(rowIndex, colIndex)}
                    onChange={updateCellValue}
                    onToggleGap={toggleCellGap}
                    isHeader={rowIndex === 0}
                  />
                ))
              )}
            </div>
          </div>
        </Card>
      </div>

      {questions.length > 0 && (
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Gap Answers</h3>
          <div className="space-y-4">
            {questions.map((gap, index) => {
              const [rowIndex, colIndex] = gap.cellId.split("-").map(Number);
              const cellContent = tableStructure[rowIndex]?.[colIndex] || "";

              return (
                <div
                  key={gap.cellId}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-3 border p-3 rounded-md"
                >
                  <div className="flex-shrink-0 w-full sm:w-12 mb-2 sm:mb-0">
                    <div className="font-medium text-left sm:text-center">
                      Gap {index + 1}
                    </div>
                  </div>
                  <div className="flex-grow w-full">
                    <div className="mb-2 text-sm text-muted-foreground">
                      Cell: Row {rowIndex}, Column {colIndex} - {cellContent}
                    </div>
                    <Input
                      value={gap.correctAnswer || ""}
                      onChange={(e) =>
                        updateGapAnswer(gap.cellId, e.target.value)
                      }
                      placeholder={`Answer for Gap ${index + 1}`}
                      className="w-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {questions.length === 0 && (
        <div className="text-center p-4 sm:p-10 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-2">No gaps added yet.</p>
          <p className="text-sm text-muted-foreground">
            Edit the table above and toggle cells to &quot;Make gap&quot; to
            create gaps for answers.
          </p>
        </div>
      )}

      {tableStructure.length > 0 && (
        <Card className="p-4 bg-muted/30">
          <h3 className="text-lg font-medium mb-4">Preview</h3>
          <div className="overflow-x-auto">
            <table className="border-collapse w-full min-w-[300px]">
              <tbody>
                {tableStructure.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, colIndex) => {
                      const isGap = isCellGap(rowIndex, colIndex);
                      const gapNumber = isGap
                        ? questions.findIndex(
                            (q) => q.cellId === `${rowIndex}-${colIndex}`
                          ) + 1
                        : null;

                      return (
                        <td
                          key={colIndex}
                          className={cn(
                            "border p-2",
                            rowIndex === 0 ? "bg-muted font-medium" : "",
                            isGap ? "bg-primary/10" : ""
                          )}
                        >
                          {isGap ? (
                            <span className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-1">
                              <span className="bg-primary/20 px-2 py-1 rounded text-sm font-medium">
                                Gap {gapNumber}
                              </span>
                              {cell && (
                                <span className="text-muted-foreground text-sm">
                                  {cell}
                                </span>
                              )}
                            </span>
                          ) : (
                            cell
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
