"use client";

import { useState } from "react";

export function useWritingTestState() {
  const [showOverlay, setShowOverlay] = useState(true);
  const [currentTask, setCurrentTask] = useState<"task1" | "task2">("task1");
  const [task1Response, setTask1Response] = useState("");
  const [task2Response, setTask2Response] = useState("");
  const [testStarted, setTestStarted] = useState(false);
  const [activeTab, setActiveTab] = useState("question");

  const handleTaskChange = (taskType: "task1" | "task2") => {
    setCurrentTask(taskType);
  };

  const handleResponseChange = (response: string) => {
    if (currentTask === "task1") {
      setTask1Response(response);
    } else {
      setTask2Response(response);
    }
  };

  const handleStartTest = () => {
    setShowOverlay(false);
    setTestStarted(true);
  };

  return {
    // State
    showOverlay,
    currentTask,
    task1Response,
    task2Response,
    testStarted,
    activeTab,

    // Setters
    setShowOverlay,
    setCurrentTask,
    setTask1Response,
    setTask2Response,
    setTestStarted,
    setActiveTab,

    // Handlers
    handleTaskChange,
    handleResponseChange,
    handleStartTest,
  };
}
