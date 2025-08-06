"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, PenTool, CheckCircle, AlertCircle } from "lucide-react";

interface WritingTestNavigationProps {
  currentTask: "task1" | "task2";
  onTaskChange: (task: "task1" | "task2") => void;
  task1WordCount: number;
  task2WordCount: number;
  task1MinWords: number;
  task2MinWords: number;
}

export default function WritingTestNavigation({
  currentTask,
  onTaskChange,
  task1WordCount,
  task2WordCount,
  task1MinWords,
  task2MinWords,
}: WritingTestNavigationProps) {
  const getWordCountStatus = (wordCount: number, minWords: number) => {
    if (wordCount >= minWords) return "complete";
    if (wordCount >= minWords * 0.8) return "warning";
    return "incomplete";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "complete":
        return "text-green-600";
      case "warning":
        return "text-orange-600";
      default:
        return "text-gray-500";
    }
  };

  const task1Status = getWordCountStatus(task1WordCount, task1MinWords);
  const task2Status = getWordCountStatus(task2WordCount, task2MinWords);

  return (
    <div className="w-80 bg-muted/20 border-r border-border p-4 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Writing Tasks
        </h2>
      </div>

      {/* Task 1 */}
      <Card
        className={`cursor-pointer transition-colors ${
          currentTask === "task1"
            ? "ring-2 ring-primary bg-primary/5"
            : "hover:bg-muted/50"
        }`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Task 1
            </CardTitle>
            {getStatusIcon(task1Status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Word Count:</span>
              <span className={`font-medium ${getStatusColor(task1Status)}`}>
                {task1WordCount}/{task1MinWords}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  task1Status === "complete"
                    ? "bg-green-600"
                    : task1Status === "warning"
                    ? "bg-orange-600"
                    : "bg-gray-400"
                }`}
                style={{
                  width: `${Math.min(
                    (task1WordCount / task1MinWords) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Recommended: ~20 minutes
            </p>
          </div>
          <Button
            variant={currentTask === "task1" ? "default" : "outline"}
            size="sm"
            onClick={() => onTaskChange("task1")}
            className="w-full"
          >
            {currentTask === "task1" ? "Currently Writing" : "Switch to Task 1"}
          </Button>
        </CardContent>
      </Card>

      {/* Task 2 */}
      <Card
        className={`cursor-pointer transition-colors ${
          currentTask === "task2"
            ? "ring-2 ring-primary bg-primary/5"
            : "hover:bg-muted/50"
        }`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <PenTool className="w-4 h-4" />
              Task 2
            </CardTitle>
            {getStatusIcon(task2Status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Word Count:</span>
              <span className={`font-medium ${getStatusColor(task2Status)}`}>
                {task2WordCount}/{task2MinWords}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  task2Status === "complete"
                    ? "bg-green-600"
                    : task2Status === "warning"
                    ? "bg-orange-600"
                    : "bg-gray-400"
                }`}
                style={{
                  width: `${Math.min(
                    (task2WordCount / task2MinWords) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Recommended: ~40 minutes
            </p>
          </div>
          <Button
            variant={currentTask === "task2" ? "default" : "outline"}
            size="sm"
            onClick={() => onTaskChange("task2")}
            className="w-full"
          >
            {currentTask === "task2" ? "Currently Writing" : "Switch to Task 2"}
          </Button>
        </CardContent>
      </Card>

      {/* Progress Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Overall Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Words:</span>
              <span className="font-medium">
                {task1WordCount + task2WordCount}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Minimum Required:</span>
              <span className="font-medium">
                {task1MinWords + task2MinWords}
              </span>
            </div>
            <div className="flex gap-1 mt-2">
              <Badge
                variant={task1Status === "complete" ? "default" : "secondary"}
                className="text-xs"
              >
                Task 1
              </Badge>
              <Badge
                variant={task2Status === "complete" ? "default" : "secondary"}
                className="text-xs"
              >
                Task 2
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
