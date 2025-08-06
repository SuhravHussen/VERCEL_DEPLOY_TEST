"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FileText, PenTool } from "lucide-react";
import { IELTSWritingTask } from "@/types/exam/ielts-academic/writing/writing";
import { WritingTaskInstructionsContent } from "./writing-task-instructions-content";
import { WritingTaskAnswerContent } from "./writing-task-answer-content";

interface WritingMobileLayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentTaskData: IELTSWritingTask;
  currentResponse: string;
  handleResponseChange: (response: string) => void;
  currentTask: "task1" | "task2";
}

export function WritingMobileLayout({
  activeTab,
  setActiveTab,
  currentTaskData,
  currentResponse,
  handleResponseChange,
  currentTask,
}: WritingMobileLayoutProps) {
  return (
    <div className="block lg:hidden h-full">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="h-full flex flex-col"
      >
        <div className="px-4">
          <TabsList className="grid w-full grid-cols-2 p-0 mt-2">
            <TabsTrigger value="question" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Question
            </TabsTrigger>
            <TabsTrigger value="answer" className="flex items-center gap-2">
              <PenTool className="w-4 h-4" />
              Answer
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="question" className="flex-1 overflow-y-auto">
            <div className="h-full bg-background">
              <WritingTaskInstructionsContent task={currentTaskData} />
            </div>
          </TabsContent>

          <TabsContent value="answer" className="flex-1 overflow-y-auto">
            <div className="h-full bg-background">
              <WritingTaskAnswerContent
                task={currentTaskData}
                response={currentResponse}
                onResponseChange={handleResponseChange}
                taskNumber={currentTask === "task1" ? "1" : "2"}
              />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
