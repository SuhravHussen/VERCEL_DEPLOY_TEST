"use client";

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { IELTSWritingTask } from "@/types/exam/ielts-academic/writing/writing";
import { WritingTaskInstructionsContent } from "./writing-task-instructions-content";
import { WritingTaskAnswerContent } from "./writing-task-answer-content";

interface WritingDesktopLayoutProps {
  currentTaskData: IELTSWritingTask;
  currentResponse: string;
  handleResponseChange: (response: string) => void;
  currentTask: "task1" | "task2";
}

export function WritingDesktopLayout({
  currentTaskData,
  currentResponse,
  handleResponseChange,
  currentTask,
}: WritingDesktopLayoutProps) {
  return (
    <div className="hidden lg:block h-full">
      <div className="h-full">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full overflow-y-auto bg-background border-r border-border">
              <WritingTaskInstructionsContent task={currentTaskData} />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full overflow-y-auto bg-background">
              <WritingTaskAnswerContent
                task={currentTaskData}
                response={currentResponse}
                onResponseChange={handleResponseChange}
                taskNumber={currentTask === "task1" ? "1" : "2"}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
