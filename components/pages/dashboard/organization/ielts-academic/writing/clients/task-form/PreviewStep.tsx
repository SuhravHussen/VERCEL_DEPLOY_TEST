/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StepperContext } from "../CreateWritingPageClient";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import type { FormData } from "../CreateWritingPageClient";
import {
  IELTSAcademicTask1,
  IELTSGeneralTask1,
  IELTSTask2,
} from "@/types/exam/ielts-academic/writing/writing";

interface PreviewStepProps {
  formData: FormData;
  onSave: () => void;
  isSaving: boolean;
}

export default function PreviewStep({
  formData,
  onSave,
  isSaving,
}: PreviewStepProps) {
  const { stepperRef } = useContext(StepperContext);
  const isAcademic = formData.testType === "academic";
  const isTask1 = formData.taskType === "task_1";

  // Cast the task to the appropriate type based on task type and test type
  const academicTask1 =
    isTask1 && isAcademic
      ? (formData.task as Partial<IELTSAcademicTask1>)
      : null;
  const generalTask1 =
    isTask1 && !isAcademic
      ? (formData.task as Partial<IELTSGeneralTask1>)
      : null;
  const task2 = !isTask1 ? (formData.task as Partial<IELTSTask2>) : null;

  // Common task fields
  const instruction = formData.task.instruction;
  const prompt = formData.task.prompt;
  const timeLimit = formData.task.timeLimit;
  const minimumWords = formData.task.minimumWords;
  const sampleAnswer = formData.task.sampleAnswer;
  const detailType = formData.task.detailType;

  // Format the detail type for display
  const formatDetailType = (detailType: string | undefined) => {
    if (!detailType) return "";
    return detailType.replace(/_/g, " ");
  };

  return (
    <Card className="mt-4 border-0 shadow-none">
      <CardContent className="p-0">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">
              IELTS {isAcademic ? "Academic" : "General Training"} -{" "}
              {isTask1 ? "Task 1" : "Task 2"}
            </h2>
            <div className="flex flex-wrap gap-2">
              <Badge>{formData.testType.replace("_", " ")}</Badge>
              <Badge>{formData.taskType}</Badge>
              {detailType && <Badge>{formatDetailType(detailType)}</Badge>}
            </div>
          </div>

          <div className="space-y-4">
            {/* Task details */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">
                  {isTask1 ? "Task 1" : "Task 2"}
                </h3>
                <div className="flex items-center space-x-4">
                  {timeLimit && (
                    <span className="text-sm text-muted-foreground">
                      {timeLimit} minutes
                    </span>
                  )}
                  {minimumWords && (
                    <span className="text-sm text-muted-foreground">
                      Min {minimumWords} words
                    </span>
                  )}
                </div>
              </div>

              <Separator />

              {/* Preview for Academic Task 1 */}
              {academicTask1 && (
                <div className="space-y-4">
                  {instruction && (
                    <div className="space-y-2">
                      <p className="font-medium">Instructions:</p>
                      <p>{instruction}</p>
                    </div>
                  )}

                  {prompt && (
                    <div className="space-y-2">
                      <p className="font-medium">Prompt:</p>
                      <p>{prompt}</p>
                    </div>
                  )}

                  {academicTask1.visualData?.chartImage && (
                    <div className="space-y-2">
                      <p className="font-medium">Chart:</p>
                      <img
                        src={academicTask1.visualData.chartImage}
                        alt="Chart"
                        className="max-w-full h-auto border rounded-md"
                      />
                    </div>
                  )}

                  {academicTask1.visualData?.chartDescription && (
                    <div className="space-y-2">
                      <p className="font-medium">Chart Description:</p>
                      <p>{academicTask1.visualData.chartDescription}</p>
                    </div>
                  )}

                  {academicTask1.keyFeatures &&
                    academicTask1.keyFeatures.length > 0 && (
                      <div className="space-y-2">
                        <p className="font-medium">Key Features:</p>
                        <ul className="list-disc pl-6">
                          {academicTask1.keyFeatures.map((feature, i) => (
                            <li key={i}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
              )}

              {/* Preview for General Training Task 1 */}
              {generalTask1 && generalTask1.scenario && (
                <div className="space-y-4">
                  {instruction && (
                    <div className="space-y-2">
                      <p className="font-medium">Instructions:</p>
                      <p>{instruction}</p>
                    </div>
                  )}

                  {prompt && (
                    <div className="space-y-2">
                      <p className="font-medium">Prompt:</p>
                      <p>{prompt}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <p className="font-medium">Scenario:</p>
                    <p>{generalTask1.scenario}</p>
                  </div>

                  {generalTask1.recipient && (
                    <div className="space-y-2">
                      <p className="font-medium">Recipient:</p>
                      <p>{generalTask1.recipient}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <p className="font-medium">Tone:</p>
                    <p className="capitalize">
                      {generalTask1.tone || "Not specified"}
                    </p>
                  </div>

                  {generalTask1.bulletPoints &&
                    generalTask1.bulletPoints.length > 0 && (
                      <div className="space-y-2">
                        <p className="font-medium">You should include:</p>
                        <ul className="list-disc pl-6">
                          {generalTask1.bulletPoints.map((point, i) => (
                            <li key={i}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
              )}

              {/* Preview for Task 2 */}
              {task2 && task2.topic && task2.specificQuestion && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="font-medium">Topic:</p>
                    <p>{task2.topic}</p>
                  </div>

                  {instruction && (
                    <div className="space-y-2">
                      <p className="font-medium">Instructions:</p>
                      <p>{instruction}</p>
                    </div>
                  )}

                  {prompt && (
                    <div className="space-y-2">
                      <p className="font-medium">Prompt:</p>
                      <p>{prompt}</p>
                    </div>
                  )}

                  {task2.backgroundImage && (
                    <div className="space-y-2">
                      <p className="font-medium">Background Image:</p>
                      <div className="relative aspect-[16/9] max-w-2xl overflow-hidden rounded-md border">
                        <img
                          src={task2.backgroundImage}
                          alt="Background material"
                          className="object-contain w-full h-full"
                        />
                      </div>
                    </div>
                  )}

                  {task2.backgroundInfo && (
                    <div className="space-y-2">
                      <p className="font-medium">Background Information:</p>
                      <p>{task2.backgroundInfo}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <p className="font-medium">Specific Question:</p>
                    <p>{task2.specificQuestion}</p>
                  </div>

                  {task2.keyWords && task2.keyWords.length > 0 && (
                    <div className="space-y-2">
                      <p className="font-medium">Key Words:</p>
                      <div className="flex flex-wrap gap-2">
                        {task2.keyWords.map((word, i) => (
                          <Badge key={i} variant="secondary">
                            {word}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Sample answer (for any task type) */}
              {sampleAnswer && (
                <div className="space-y-2 border-t pt-4 mt-4">
                  <p className="font-medium">Sample Answer:</p>
                  <div className="bg-muted p-4 rounded-md">
                    <p className="whitespace-pre-line">{sampleAnswer}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => stepperRef.current?.prevStep()}
              >
                Previous
              </Button>
              <Button onClick={onSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Writing Task"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
