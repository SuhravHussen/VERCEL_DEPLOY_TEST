"use client";

import { memo } from "react";
import { IELTSWritingTask } from "@/types/exam/ielts-academic/writing/writing";
import { WritingTaskInstructions } from "../writing-task-renderer";

interface WritingTaskInstructionsContentProps {
  task: IELTSWritingTask;
}

export const WritingTaskInstructionsContent = memo(
  function WritingTaskInstructionsContent({
    task,
  }: WritingTaskInstructionsContentProps) {
    return <WritingTaskInstructions task={task} />;
  }
);
