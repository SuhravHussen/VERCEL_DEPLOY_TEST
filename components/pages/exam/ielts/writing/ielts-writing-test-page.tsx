"use client";

import { useState } from "react";
import { IELTSWritingTest } from "@/types/exam/ielts-academic/writing/writing";

import WritingTestSectionHeader from "./writing-test-section-header";

import { WritingDesktopLayout } from "./components/writing-desktop-layout";
import { WritingMobileLayout } from "./components/writing-mobile-layout";
import { useWritingTestState } from "./hooks/use-writing-test-state";
import { useConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useWritingTestFullData } from "@/hooks/use-exam-test-data";
import WritingTestOverlay from "./writing-test-overlay";
import WritingTestHeader from "./writing-test-header";
import WritingTestBottomNav from "./writing-test-bottom-nav";

interface IELTSWritingTestPageProps {
  writingTest: IELTSWritingTest;
  regId?: string;
}

export default function IELTSWritingTestPage({
  writingTest,
  regId,
}: IELTSWritingTestPageProps) {
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();
  const { fetchWritingTestFullData } = useWritingTestFullData();

  const {
    showOverlay,
    currentTask,
    task1Response,
    task2Response,
    testStarted,
    activeTab,
    setActiveTab,
    handleTaskChange,
    handleResponseChange,
    setShowOverlay,
    setTestStarted,
  } = useWritingTestState();

  // Additional state for two-phase data fetching
  const [fullTestData, setFullTestData] = useState<IELTSWritingTest | null>(
    null
  );
  const [isStartingTest, setIsStartingTest] = useState(false);

  // Use full test data if available, otherwise use basic info
  const currentTestData = fullTestData || writingTest;

  const currentTaskData =
    currentTask === "task1" ? currentTestData.task1 : currentTestData.task2;
  const currentResponse =
    currentTask === "task1" ? task1Response : task2Response;

  const handleNext = () => {
    if (currentTask === "task1") {
      handleTaskChange("task2");
    }
  };

  const handlePrevious = () => {
    if (currentTask === "task2") {
      handleTaskChange("task1");
    }
  };

  const handleStartTest = async () => {
    try {
      setIsStartingTest(true);

      // Fetch full exam data with questions if regId is provided
      if (regId) {
        console.log("Fetching full writing test data...");
        const fullData = await fetchWritingTestFullData(regId);

        if (!fullData) {
          throw new Error("Failed to fetch full exam data");
        }

        setFullTestData(fullData);
      }

      setShowOverlay(false);
      setTestStarted(true);
    } catch (error) {
      console.error("Error starting test:", error);
      showConfirmation({
        title: "Error Starting Test",
        description: "Failed to load exam data. Please try again.",
        confirmText: "OK",
        variant: "destructive",
        onConfirm: () => {},
      });
    } finally {
      setIsStartingTest(false);
    }
  };

  const handleSubmit = () => {
    showConfirmation({
      title: "Submit Test?",
      description:
        "Are you sure you want to submit your writing test? This cannot be undone.",
      confirmText: "Submit",
      variant: "warning",
      onConfirm: () => {
        console.log("Writing test submitted:", {
          task1: task1Response,
          task2: task2Response,
        });
      },
    });
  };

  useKeyboardShortcuts(
    testStarted,
    currentTask === "task1" ? 1 : 2,
    handlePrevious,
    handleNext,
    handleSubmit
  );

  // Show overlay if test hasn't started yet
  if (!testStarted) {
    return (
      <WritingTestOverlay
        isOpen={showOverlay}
        onStartTest={handleStartTest}
        writingTest={currentTestData}
        isLoading={isStartingTest}
      />
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <WritingTestHeader
        onSubmit={handleSubmit}
        onTimeUp={handleSubmit}
        testType={writingTest.testType}
      />

      <WritingTestSectionHeader currentTask={currentTask} />

      <div className="flex-1 overflow-hidden">
        <WritingMobileLayout
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentTaskData={currentTaskData}
          currentResponse={currentResponse}
          handleResponseChange={handleResponseChange}
          currentTask={currentTask}
        />

        <WritingDesktopLayout
          currentTaskData={currentTaskData}
          currentResponse={currentResponse}
          handleResponseChange={handleResponseChange}
          currentTask={currentTask}
        />
      </div>

      <WritingTestBottomNav
        currentTask={currentTask}
        onTaskChange={handleTaskChange}
        task1WordCount={
          task1Response
            .trim()
            .split(/\s+/)
            .filter((word) => word.length > 0).length
        }
        task2WordCount={
          task2Response
            .trim()
            .split(/\s+/)
            .filter((word) => word.length > 0).length
        }
        task1MinWords={writingTest.task1.minimumWords}
        task2MinWords={writingTest.task2.minimumWords}
      />

      <ConfirmationDialog />
    </div>
  );
}
