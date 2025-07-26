/* eslint-disable @next/next/no-img-element */
import { useContext } from "react";
import { TestStepperContext } from "../CreateTestPageClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, FileText, Save, AlertTriangle } from "lucide-react";
import { IELTSWritingTest } from "@/types/exam/ielts-academic/writing/writing";

interface PreviewStepProps {
  testData: Partial<IELTSWritingTest>;
  isSubmitting: boolean;
  onSubmit: () => void;
}

export default function PreviewStep({
  testData,
  isSubmitting,
  onSubmit,
}: PreviewStepProps) {
  const { stepperRef } = useContext(TestStepperContext);

  const onPrevious = () => {
    stepperRef.current?.prevStep();
  };

  // Helper function to get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "medium":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  // Format the task type for display
  const formatDetailType = (type: string) => {
    return type
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Cast tasks to their proper types for display
  const task1 = testData.task1;
  const task2 = testData.task2;

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0">
        {/* Test Header */}
        <div className="mb-6">
          <h3 className="text-xl font-bold">{testData.title}</h3>
          {testData.description && (
            <p className="mt-1 text-muted-foreground">{testData.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Badge
              className={`${getDifficultyColor(
                testData.difficulty || "medium"
              )}`}
            >
              {testData.difficulty
                ? testData.difficulty.charAt(0).toUpperCase() +
                  testData.difficulty.slice(1)
                : "Medium"}
            </Badge>
            <Badge
              variant={
                testData.status === "published" ? "default" : "secondary"
              }
            >
              {testData.status === "published" ? "Published" : "Archived"}
            </Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5 mr-1" />
              {testData.totalTimeLimit} minutes
            </div>
          </div>
        </div>

        {/* Instructions */}
        {testData.instructions && (
          <div className="mb-6">
            <h4 className="font-medium mb-2">General Instructions</h4>
            <div className="p-4 bg-muted/30 rounded-md whitespace-pre-wrap">
              {testData.instructions}
            </div>
          </div>
        )}

        <Separator className="my-6" />

        {/* Task 1 Preview */}
        <div className="mb-6">
          <h4 className="text-lg font-medium flex items-center gap-2 mb-4">
            Task 1
            {task1 && (
              <Badge variant="outline">
                {formatDetailType(task1.detailType)}
              </Badge>
            )}
          </h4>

          {task1 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{task1.timeLimit} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" />
                    <span>Min. {task1.minimumWords} words</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="font-medium">Instructions:</p>
                <p className="mt-1 p-3 bg-muted/30 rounded-md">
                  {task1.instruction}
                </p>
              </div>

              <div>
                <p className="font-medium">Prompt:</p>
                <p className="mt-1 p-3 bg-muted/30 rounded-md">
                  {task1.prompt}
                </p>
              </div>

              {/* Show visual data for academic task 1 */}
              {"visualData" in task1 && task1.visualData?.chartImage && (
                <div>
                  <p className="font-medium">Visual Data:</p>
                  <img
                    src={task1.visualData.chartImage}
                    alt="Chart"
                    className="mt-2 max-w-full h-auto rounded-md max-h-[400px] object-contain border"
                  />
                </div>
              )}

              {/* Show scenario and bullet points for general task 1 */}
              {"scenario" in task1 && (
                <>
                  <div>
                    <p className="font-medium">Scenario:</p>
                    <p className="mt-1 p-3 bg-muted/30 rounded-md">
                      {task1.scenario}
                    </p>
                  </div>
                  {task1.bulletPoints && task1.bulletPoints.length > 0 && (
                    <div>
                      <p className="font-medium">Points to Include:</p>
                      <ul className="mt-1 p-3 bg-muted/30 rounded-md list-disc pl-5 space-y-1">
                        {task1.bulletPoints.map((point, index) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center py-10 border rounded-md">
              <div className="text-center text-muted-foreground">
                <AlertTriangle className="mx-auto h-10 w-10 mb-2" />
                <p>Task 1 not selected</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    stepperRef.current?.prevStep();
                  }}
                >
                  Go back to select Task 1
                </Button>
              </div>
            </div>
          )}
        </div>

        <Separator className="my-6" />

        {/* Task 2 Preview */}
        <div className="mb-6">
          <h4 className="text-lg font-medium flex items-center gap-2 mb-4">
            Task 2
            {task2 && (
              <Badge variant="outline">
                {formatDetailType(task2.detailType)}
              </Badge>
            )}
          </h4>

          {task2 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{task2.timeLimit} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" />
                    <span>Min. {task2.minimumWords} words</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="font-medium">Topic:</p>
                <p className="mt-1 p-3 bg-muted/30 rounded-md">{task2.topic}</p>
              </div>

              <div>
                <p className="font-medium">Instructions:</p>
                <p className="mt-1 p-3 bg-muted/30 rounded-md">
                  {task2.instruction}
                </p>
              </div>

              <div>
                <p className="font-medium">Prompt:</p>
                <p className="mt-1 p-3 bg-muted/30 rounded-md">
                  {task2.prompt}
                </p>
              </div>

              {/* Background information */}
              {task2.backgroundInfo && (
                <div>
                  <p className="font-medium">Background Information:</p>
                  <p className="mt-1 p-3 bg-muted/30 rounded-md">
                    {task2.backgroundInfo}
                  </p>
                </div>
              )}

              {/* Background image */}
              {task2.backgroundImage && (
                <div>
                  <p className="font-medium">Background Image:</p>
                  <img
                    src={task2.backgroundImage}
                    alt="Background"
                    className="mt-2 max-w-full h-auto rounded-md max-h-[300px] object-contain border"
                  />
                </div>
              )}

              {/* Specific question */}
              <div>
                <p className="font-medium">Specific Question:</p>
                <p className="mt-1 p-3 bg-muted/30 rounded-md">
                  {task2.specificQuestion}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-10 border rounded-md">
              <div className="text-center text-muted-foreground">
                <AlertTriangle className="mx-auto h-10 w-10 mb-2" />
                <p>Task 2 not selected</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    stepperRef.current?.prevStep();
                  }}
                >
                  Go back to select Task 2
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onPrevious}>
            Previous
          </Button>
          <Button
            type="button"
            variant="default"
            className="flex items-center gap-2"
            onClick={onSubmit}
            disabled={isSubmitting || !task1 || !task2}
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? "Creating Test..." : "Create Test"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
