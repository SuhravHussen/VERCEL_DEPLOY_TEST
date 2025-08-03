"use client";

import { ListeningTableCompletionGroup } from "@/types/exam/ielts-academic/listening/listening";
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

interface TableCompletionRendererProps {
  questionGroup: ListeningTableCompletionGroup;
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
    visibility: isDragging ? ("hidden" as const) : ("visible" as const),
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

export default function TableCompletionRenderer({
  questionGroup,
  answers,
  onAnswerChange,
}: TableCompletionRendererProps) {
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

  const renderTable = () => {
    if (questionGroup.tableStructure) {
      return (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-border">
            {questionGroup.tableStructure.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => {
                  const isHeader = rowIndex === 0;
                  const Tag = isHeader ? "th" : "td";

                  // Check if this cell has a placeholder pattern like "_______ (15)"
                  const hasPlaceholder = cell && cell.includes("_______");
                  let question = null;
                  let questionNumber = null;
                  let displayText = cell;

                  if (hasPlaceholder) {
                    // Extract question number from placeholder like "_______ (15)"
                    const match = cell.match(/\((\d+)\)/);
                    if (match) {
                      const placeholderNum = match[1];
                      question = questionGroup.questions.find(
                        (q) => q.cellId === placeholderNum
                      );
                      questionNumber = question
                        ? (question as { number?: number }).number
                        : null;
                      // Remove the placeholder pattern for display
                      displayText = cell.replace(/_______ \(\d+\)/, "").trim();
                    }
                  }

                  return (
                    <Tag
                      key={cellIndex}
                      className={`border border-border p-3 text-left ${
                        isHeader ? "bg-muted font-medium" : "bg-background"
                      }`}
                    >
                      {hasPlaceholder && question ? (
                        <div className="flex items-center space-x-2">
                          {displayText && (
                            <span className="text-foreground">
                              {displayText}
                            </span>
                          )}
                          <DropZone
                            id={`question-q${questionNumber}`}
                            className="min-w-[100px] h-8"
                          >
                            {questionGroup.options ? (
                              getStringAnswer(`q${questionNumber}`) ? (
                                <DraggableItem
                                  id={`answer-q${questionNumber}`}
                                  content={getStringAnswer(
                                    `q${questionNumber}`
                                  )}
                                  isDragging={
                                    activeId === `answer-q${questionNumber}`
                                  }
                                  className="w-full h-full rounded-sm flex items-center justify-center text-xs bg-white text-black font-medium overflow-hidden"
                                  style={{ border: "2px dashed black" }}
                                />
                              ) : (
                                <div
                                  className="w-full h-full rounded-sm flex items-center justify-center text-xs bg-white text-black overflow-hidden"
                                  style={{ border: "2px dashed black" }}
                                >
                                  <span className="font-medium truncate px-1">
                                    {questionNumber}
                                  </span>
                                </div>
                              )
                            ) : (
                              <input
                                value={getStringAnswer(`q${questionNumber}`)}
                                onChange={(e) =>
                                  onAnswerChange(
                                    `q${questionNumber}`,
                                    e.target.value
                                  )
                                }
                                className="w-full h-full text-center rounded-sm bg-white text-black outline-none px-1"
                                style={{ border: "2px dashed black" }}
                                placeholder={`${questionNumber}`}
                              />
                            )}
                          </DropZone>
                        </div>
                      ) : (
                        <span className="text-foreground">{cell}</span>
                      )}
                    </Tag>
                  );
                })}
              </tr>
            ))}
          </table>
        </div>
      );
    }

    // Fallback: render as individual questions
    return (
      <div className="space-y-6">
        {questionGroup.questions.map((question) => {
          const questionNumber =
            (question as { number?: number }).number || question.cellId;
          const questionId = `q${questionNumber}`;
          const answer = getStringAnswer(questionId);
          const answerId = `answer-${questionId}`;
          const questionDropId = `question-${questionId}`;
          const isDragging = activeId === answerId;

          return (
            <div key={question.cellId} className="space-y-3">
              <div className="font-medium text-foreground text-base block">
                {questionNumber}. Cell {question.cellId}
              </div>
              <DropZone id={questionDropId} className="max-w-md h-10">
                {questionGroup.options ? (
                  answer ? (
                    <DraggableItem
                      id={answerId}
                      content={answer}
                      isDragging={isDragging}
                      className="w-full h-full rounded-sm flex items-center justify-center text-sm bg-white text-black font-medium overflow-hidden px-3"
                      style={{ border: "2px dashed black" }}
                    />
                  ) : (
                    <div
                      className="w-full h-full rounded-sm flex items-center justify-center text-sm bg-white text-black overflow-hidden px-3"
                      style={{ border: "2px dashed black" }}
                    >
                      <span className="font-medium truncate">
                        Drop answer here
                      </span>
                    </div>
                  )
                ) : (
                  <input
                    value={answer}
                    onChange={(e) => onAnswerChange(questionId, e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full h-full text-center rounded-sm bg-white text-black outline-none px-3"
                    style={{ border: "2px dashed black" }}
                  />
                )}
              </DropZone>
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
      <div className="space-y-8">
        {/* Word limit instruction */}
        {questionGroup.wordLimit && (
          <div className="bg-muted/30 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground font-medium">
              {questionGroup.wordLimitText ||
                `Write NO MORE THAN ${questionGroup.wordLimit} WORDS for each answer.`}
            </p>
          </div>
        )}

        {/* Options for drag and drop */}
        {questionGroup.options && (
          <DropZone
            id="options-area"
            className="bg-card border border-border p-4 rounded-lg"
          >
            <h4 className="font-medium mb-3 text-foreground">Choose from:</h4>
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

        {/* Table */}
        <div className="bg-card border border-border p-6 rounded-lg">
          {renderTable()}
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
