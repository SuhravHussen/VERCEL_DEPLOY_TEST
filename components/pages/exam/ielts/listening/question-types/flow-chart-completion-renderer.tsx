"use client";

import { ListeningFlowChartCompletionGroup } from "@/types/exam/ielts-academic/listening/listening";
import Image from "next/image";
import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  useSensors,
  useSensor,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  closestCenter,
  UniqueIdentifier,
} from "@dnd-kit/core";
import { createPortal } from "react-dom";

interface FlowChartCompletionRendererProps {
  questionGroup: ListeningFlowChartCompletionGroup;
  answers: Record<string, string | string[]>;
  onAnswerChange: (questionId: string, answer: string | string[]) => void;
}

// Simple Draggable Item Component
function DraggableItem({
  id,
  content,
  isDragging,
  className = "",
  style = {},
}: {
  id: string;
  content: string;
  isDragging?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: { content, id },
  });

  const dragStyle = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0 : 1,
    ...style,
  };

  return (
    <div
      ref={setNodeRef}
      style={dragStyle}
      {...listeners}
      {...attributes}
      className={`cursor-grab active:cursor-grabbing select-none touch-none ${className}`}
    >
      <span className="truncate w-full text-center px-1">{content}</span>
    </div>
  );
}

// Simple Drop Zone Component
function DropZone({
  id,
  children,
  className = "",
  isOver = false,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  isOver?: boolean;
}) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`transition-all ${className} ${
        isOver ? "scale-105 bg-blue-50 border-blue-400" : ""
      }`}
    >
      {children}
    </div>
  );
}

// Drag Overlay Component
function DragOverlayContent({ content }: { content: string }) {
  return (
    <div className="px-3 py-2 bg-white border-2 border-blue-500 rounded-lg shadow-lg text-sm font-medium text-black transform rotate-3 opacity-90">
      {content}
    </div>
  );
}

export default function FlowChartCompletionRenderer({
  questionGroup,
  answers,
  onAnswerChange,
}: FlowChartCompletionRendererProps) {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [draggedContent, setDraggedContent] = useState<string>("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 8 },
    })
  );

  const getStringAnswer = (questionId: string): string => {
    const answer = answers[questionId];
    return typeof answer === "string" ? answer : "";
  };

  // Get available options (filter out used ones)
  const usedAnswers = new Set(
    Object.values(answers).filter(Boolean) as string[]
  );
  const availableOptions =
    questionGroup.options?.filter((option) => !usedAnswers.has(option)) || [];

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
    setDraggedContent(event.active.data.current?.content || "");
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);
    setDraggedContent("");

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    const draggedContent = active.data.current?.content;

    if (!draggedContent) return;

    // Handle dropping to options area (return option)
    if (overId === "options-area") {
      // Find which question had this answer and clear it
      Object.keys(answers).forEach((questionId) => {
        if (answers[questionId] === draggedContent) {
          onAnswerChange(questionId, "");
        }
      });
      return;
    }

    // Handle dropping to question slots
    if (overId.startsWith("question-")) {
      const questionId = overId.replace("question-", "");
      const currentAnswer = getStringAnswer(questionId);

      // If source is from another question slot, swap answers
      if (activeId.startsWith("answer-")) {
        const sourceQuestionId = activeId.replace("answer-", "");
        onAnswerChange(questionId, draggedContent);
        onAnswerChange(sourceQuestionId, currentAnswer);
      } else {
        // Source is from options, just place the answer
        onAnswerChange(questionId, draggedContent);
      }
    }
  };

  const renderFlowChart = () => {
    if (questionGroup.chartType === "image" && questionGroup.chartImage) {
      return (
        <div className="relative max-w-4xl mx-auto">
          <Image
            src={questionGroup.chartImage}
            alt="Flow chart"
            width={800}
            height={600}
            className="w-full h-auto"
          />

          {/* Overlay input positions */}
          {questionGroup.inputPositions?.map((position) => {
            const question = questionGroup.questions.find(
              (q) => q.stepId === position.stepId
            );
            if (!question) return null;

            const questionId = `q${position.stepId}`;
            const answer = getStringAnswer(questionId);
            const answerId = `answer-${questionId}`;
            const questionDropId = `question-${questionId}`;
            const isDragging = activeId === answerId;

            return (
              <div
                key={position.stepId}
                className="absolute"
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  transform: "translate(-50%, -50%)",
                  zIndex: 10,
                }}
              >
                <DropZone
                  id={questionDropId}
                  className="w-12 sm:w-16 md:w-20 h-5 sm:h-6 md:h-7"
                >
                  {questionGroup.options ? (
                    answer ? (
                      <DraggableItem
                        id={answerId}
                        content={answer}
                        isDragging={isDragging}
                        className="w-full h-full rounded-sm flex items-center justify-center text-xs bg-white text-black font-medium overflow-hidden"
                        style={{ border: "2px dashed black" }}
                      />
                    ) : (
                      <div
                        className="w-full h-full rounded-sm flex items-center justify-center text-xs bg-white text-black overflow-hidden"
                        style={{ border: "2px dashed black" }}
                      >
                        <span className="font-medium truncate px-1">
                          {position.stepId}
                        </span>
                      </div>
                    )
                  ) : (
                    <div className="relative w-full h-full">
                      <input
                        value={answer}
                        onChange={(e) =>
                          onAnswerChange(questionId, e.target.value)
                        }
                        className="w-full h-full text-center text-xs rounded-sm bg-white text-black outline-none px-1"
                        style={{ border: "2px dashed black" }}
                        placeholder={position.stepId}
                      />
                    </div>
                  )}
                </DropZone>
              </div>
            );
          }) || null}
        </div>
      );
    }

    if (questionGroup.chartType === "text" && questionGroup.textSteps) {
      return (
        <div className="p-4 bg-muted/20 rounded-lg">
          <div className="flex flex-col items-center space-y-4 max-w-2xl mx-auto">
            {questionGroup.textSteps.map((step, index) => {
              const questionId = `q${step.stepId}`;
              const answer = getStringAnswer(questionId);
              const answerId = `answer-${questionId}`;
              const questionDropId = `question-${questionId}`;
              const isDragging = activeId === answerId;
              const isLast = index === questionGroup.textSteps!.length - 1;

              return (
                <div
                  key={step.stepId}
                  className="flex flex-col items-center w-full"
                >
                  {/* Step Content */}
                  <div className="bg-white text-black rounded-lg border-2 border-gray-300 p-4 w-full max-w-md shadow-sm">
                    <div className="flex items-center justify-center space-x-2 text-sm sm:text-base">
                      {/* Step Number */}
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-xs shrink-0">
                        {step.stepNumber}
                      </div>

                      {/* Step Content */}
                      <div className="flex-1 flex items-center justify-center space-x-2 flex-wrap">
                        {step.textBefore && (
                          <span className="text-center">{step.textBefore}</span>
                        )}

                        {step.isGap && (
                          <DropZone
                            id={questionDropId}
                            className="min-w-[100px] sm:min-w-[120px] h-8"
                          >
                            {questionGroup.options ? (
                              answer ? (
                                <DraggableItem
                                  id={answerId}
                                  content={answer}
                                  isDragging={isDragging}
                                  className="w-full h-full rounded-sm flex items-center justify-center text-xs bg-white text-black font-medium px-3 overflow-hidden"
                                  style={{ border: "2px dashed black" }}
                                />
                              ) : (
                                <div
                                  className="w-full h-full rounded-sm flex items-center justify-center text-xs bg-white text-black px-3 overflow-hidden"
                                  style={{ border: "2px dashed black" }}
                                >
                                  <span className="font-medium truncate">
                                    {step.stepId}
                                  </span>
                                </div>
                              )
                            ) : (
                              <div className="relative w-full h-full">
                                <input
                                  value={answer}
                                  onChange={(e) =>
                                    onAnswerChange(questionId, e.target.value)
                                  }
                                  className="w-full h-full text-center text-xs rounded-sm bg-white text-black outline-none px-3"
                                  style={{ border: "2px dashed black" }}
                                  placeholder={step.stepId}
                                />
                              </div>
                            )}
                          </DropZone>
                        )}

                        {step.textAfter && (
                          <span className="text-center">{step.textAfter}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Arrow Down (if not last step) */}
                  {!isLast && (
                    <div className="flex justify-center py-2">
                      <svg
                        className="w-6 h-6 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // Fallback: Simple step-by-step layout
    return (
      <div className="space-y-4">
        {questionGroup.questions.map((question, index) => {
          const isLast = index === questionGroup.questions.length - 1;
          const questionId = `q${question.stepId}`;
          const answer = getStringAnswer(questionId);
          const answerId = `answer-${questionId}`;
          const questionDropId = `question-${questionId}`;
          const isDragging = activeId === answerId;

          return (
            <div key={question.stepId} className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                {index + 1}
              </div>
              <div className="flex-1 flex items-center space-x-3">
                <span className="text-foreground text-sm">
                  Step {index + 1}:
                </span>

                <DropZone
                  id={questionDropId}
                  className="min-w-[80px] sm:min-w-[100px] h-6 sm:h-7"
                >
                  {questionGroup.options ? (
                    answer ? (
                      <DraggableItem
                        id={answerId}
                        content={answer}
                        isDragging={isDragging}
                        className="w-full h-full rounded-sm flex items-center justify-center text-xs bg-white text-black font-medium px-3 overflow-hidden"
                        style={{ border: "2px dashed black" }}
                      />
                    ) : (
                      <div
                        className="w-full h-full rounded-sm flex items-center justify-center text-xs bg-white text-black px-3 overflow-hidden"
                        style={{ border: "2px dashed black" }}
                      >
                        <span className="font-medium truncate">
                          {question.stepId}
                        </span>
                      </div>
                    )
                  ) : (
                    <div className="relative w-full h-full">
                      <input
                        value={answer}
                        onChange={(e) =>
                          onAnswerChange(questionId, e.target.value)
                        }
                        className="w-full h-full text-center text-xs rounded-sm bg-white text-black outline-none px-3"
                        style={{ border: "2px dashed black" }}
                        placeholder={question.stepId}
                      />
                    </div>
                  )}
                </DropZone>
              </div>
              {!isLast && (
                <div className="w-8 h-8 flex items-center justify-center">
                  <div className="w-0.5 h-8 bg-border"></div>
                  <div className="absolute w-3 h-3 border-r-2 border-b-2 border-border transform rotate-45 translate-y-2"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6 sm:space-y-8">
        {/* Word limit instruction */}
        {questionGroup.wordLimit && (
          <div className="bg-muted/30 p-3 sm:p-4 rounded-lg">
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">
              {questionGroup.wordLimitText ||
                `Write NO MORE THAN ${questionGroup.wordLimit} WORDS for each answer.`}
            </p>
          </div>
        )}

        {/* Options for drag and drop */}
        {questionGroup.options && (
          <DropZone
            id="options-area"
            className="bg-card border border-border p-3 sm:p-4 rounded-lg"
          >
            <h4 className="font-medium mb-2 sm:mb-3 text-foreground text-sm sm:text-base">
              Choose from:
            </h4>
            <div className="flex flex-wrap gap-2 min-h-[2rem]">
              {availableOptions.map((option) => {
                const optionId = `option-${questionGroup.options!.indexOf(
                  option
                )}`;
                const isDragging = activeId === optionId;

                return (
                  <DraggableItem
                    key={optionId}
                    id={optionId}
                    content={option}
                    isDragging={isDragging}
                    className="px-2 sm:px-3 py-1 sm:py-2 bg-secondary text-secondary-foreground rounded text-xs sm:text-sm border hover:bg-secondary/80"
                  />
                );
              })}
              {availableOptions.length === 0 && (
                <p className="text-xs text-muted-foreground italic">
                  All options used. Drag answers back here to return them.
                </p>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Drag options to answer boxes, or drag answers back here to return
              them.
            </p>
          </DropZone>
        )}

        {/* Flow Chart */}
        <div className="bg-card border border-border p-4 sm:p-6 rounded-lg">
          {renderFlowChart()}
        </div>
      </div>

      {/* Drag Overlay */}
      {typeof window !== "undefined" &&
        createPortal(
          <DragOverlay>
            {activeId && draggedContent ? (
              <DragOverlayContent content={draggedContent} />
            ) : null}
          </DragOverlay>,
          document.body
        )}
    </DndContext>
  );
}
