"use client";

import { memo } from "react";
import { IELTSWritingTask } from "@/types/exam/ielts-academic/writing/writing";
import { WritingTaskAnswerArea } from "../writing-task-renderer";

interface WritingTaskAnswerContentProps {
  task: IELTSWritingTask;
  response: string;
  onResponseChange: (response: string) => void;
  taskNumber: string;
}

export const WritingTaskAnswerContent = memo(function WritingTaskAnswerContent({
  task,
  response,
  onResponseChange,
  taskNumber,
}: WritingTaskAnswerContentProps) {
  return (
    <WritingTaskAnswerArea
      task={task}
      response={response}
      onResponseChange={onResponseChange}
      taskNumber={taskNumber}
    />
  );
});
