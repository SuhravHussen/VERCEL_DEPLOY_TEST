"use client";

import { useState, useEffect } from "react";
import {
  IELTSWritingTask,
  IELTSAcademicTask1,
  IELTSGeneralTask1,
  IELTSTask2,
} from "@/types/exam/ielts-academic/writing/writing";
import { AcademicTask1Renderer } from "./components/task-renderers/academic-task1-renderer";
import { GeneralTask1Renderer } from "./components/task-renderers/general-task1-renderer";
import { Task2Renderer } from "./components/task-renderers/task2-renderer";

interface WritingTaskInstructionsProps {
  task: IELTSWritingTask;
}

interface WritingTaskAnswerAreaProps {
  task: IELTSWritingTask;
  response: string;
  onResponseChange: (response: string) => void;
  taskNumber: string;
}

// Component for left panel - Task Instructions
export function WritingTaskInstructions({
  task,
}: WritingTaskInstructionsProps) {
  const renderTask1Content = (
    task1: IELTSAcademicTask1 | IELTSGeneralTask1
  ) => {
    if (task1.taskType !== "task_1") return null;

    // Academic Task 1
    if ("visualData" in task1) {
      return <AcademicTask1Renderer task={task1 as IELTSAcademicTask1} />;
    }

    // General Training Task 1
    if ("scenario" in task1) {
      return <GeneralTask1Renderer task={task1 as IELTSGeneralTask1} />;
    }

    return null;
  };

  const renderTask2Content = (task2: IELTSTask2) => {
    return <Task2Renderer task={task2} />;
  };

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {task.instruction}
        </p>
        <p className="text-sm leading-relaxed">{task.prompt}</p>

        {task.taskType === "task_1" &&
          renderTask1Content(task as IELTSAcademicTask1 | IELTSGeneralTask1)}
        {task.taskType === "task_2" && renderTask2Content(task as IELTSTask2)}
      </div>
    </div>
  );
}

// Component for right panel - Writing Area
export function WritingTaskAnswerArea({
  task,
  response,
  onResponseChange,
  taskNumber,
}: WritingTaskAnswerAreaProps) {
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    const words = response
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    setWordCount(words.length);
  }, [response]);

  const getWordCountStatus = () => {
    if (wordCount >= task.minimumWords) return "sufficient";
    if (wordCount >= task.minimumWords * 0.8) return "warning";
    return "insufficient";
  };

  const getStatusColor = () => {
    const status = getWordCountStatus();
    switch (status) {
      case "sufficient":
        return "text-green-600";
      case "warning":
        return "text-orange-600";
      default:
        return "text-red-600";
    }
  };

  return (
    <div className="h-full flex flex-col p-4 sm:p-6">
      {/* Answer Area Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Question {taskNumber}</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Words:</span>
            <span className={`font-medium ${getStatusColor()}`}>
              {wordCount}/{task.minimumWords}
            </span>
          </div>
          {wordCount < task.minimumWords && (
            <span className="text-xs text-orange-600">
              {task.minimumWords - wordCount} more needed
            </span>
          )}
        </div>
      </div>

      {/* Writing Area */}
      <div className="flex-1 flex flex-col space-y-3">
        <textarea
          placeholder={`Start writing your Task ${taskNumber} response here...`}
          value={response}
          onChange={(e) => onResponseChange(e.target.value)}
          className="flex-1 w-full p-4 text-sm leading-relaxed border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
          style={{ minHeight: "400px" }}
        />

        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>Minimum {task.minimumWords} words required</span>
          <span>
            {wordCount >= task.minimumWords
              ? "✓ Word count met"
              : `${task.minimumWords - wordCount} words remaining`}
          </span>
        </div>
      </div>
    </div>
  );
}

// Default export for backward compatibility
export default function WritingTaskRenderer({
  task,
  response,
  onResponseChange,
  taskNumber,
}: {
  task: IELTSWritingTask;
  response: string;
  onResponseChange: (response: string) => void;
  taskNumber: string;
}) {
  return (
    <WritingTaskAnswerArea
      task={task}
      response={response}
      onResponseChange={onResponseChange}
      taskNumber={taskNumber}
    />
  );
}
