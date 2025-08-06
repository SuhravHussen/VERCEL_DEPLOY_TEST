"use client";

import { Input } from "@/components/ui/input";
import { DiagramLabelCompletionGroup } from "@/types/exam/ielts-academic/reading/question/question";
import { useState } from "react";
import Image from "next/image";
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

interface DiagramLabelCompletionRendererProps {
  questionGroup: DiagramLabelCompletionGroup;
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
        isOver ? "scale-105 bg-muted/50 border-primary" : ""
      }`}
    >
      {children}
    </div>
  );
}

// Drag Overlay Component
function DragOverlayContent({ content }: { content: string }) {
  return (
    <div className="px-3 py-2 bg-card border-2 border-primary rounded-lg shadow-lg text-sm font-medium text-foreground transform rotate-3 opacity-90">
      {content}
    </div>
  );
}

export default function DiagramLabelCompletionRenderer({
  questionGroup,
  answers,
  onAnswerChange,
}: DiagramLabelCompletionRendererProps) {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [draggedContent, setDraggedContent] = useState("");

  const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor));

  const getStringAnswer = (questionId: string): string => {
    const answer = answers[questionId];
    return typeof answer === "string" ? answer : "";
  };

  // Get available options (not yet used in answers)
  const availableOptions = questionGroup.options
    ? questionGroup.options.filter(
        (option) => !Object.values(answers).includes(option)
      )
    : [];

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

  const renderDiagram = () => {
    if (!questionGroup.diagramImage) {
      // Fallback: render questions as simple inputs if no diagram
      return (
        <div className="mb-4 sm:mb-6 p-4 bg-muted/20 rounded-lg">
          <p className="text-foreground text-center text-sm sm:text-base mb-4">
            Diagram will be displayed here
          </p>
          <div className="space-y-3">
            {questionGroup.questions.map((question) => {
              const questionId = `q${question.labelId.replace("label-", "")}`;
              const answer = getStringAnswer(questionId);
              const answerId = `answer-${questionId}`;
              const questionDropId = `question-${questionId}`;
              const isDragging = activeId === answerId;

              return (
                <div
                  key={question.labelId}
                  className="flex items-center space-x-3"
                >
                  <span className="text-foreground font-medium min-w-0">
                    {question.labelId.replace("label-", "")}:
                  </span>
                  <DropZone
                    id={questionDropId}
                    className="flex-1 max-w-sm h-10"
                  >
                    {questionGroup.options ? (
                      answer ? (
                        <DraggableItem
                          id={answerId}
                          content={answer}
                          isDragging={isDragging}
                          className="w-full h-full rounded border border-border bg-secondary text-secondary-foreground flex items-center justify-center text-xs sm:text-sm font-medium hover:bg-secondary/80"
                        />
                      ) : (
                        <div className="w-full h-full rounded border-2 border-dashed border-muted-foreground/50 bg-muted/20 flex items-center justify-center text-xs text-muted-foreground">
                          Enter label
                        </div>
                      )
                    ) : (
                      <Input
                        type="text"
                        value={answer}
                        onChange={(e) =>
                          onAnswerChange(questionId, e.target.value)
                        }
                        placeholder="Enter label"
                        className="w-full h-full"
                        data-question={question.labelId.replace("label-", "")}
                        id={`question-${question.labelId.replace(
                          "label-",
                          ""
                        )}`}
                      />
                    )}
                  </DropZone>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <div className="mb-4 sm:mb-6">
        <div className="relative max-w-4xl mx-auto">
          <Image
            src={questionGroup.diagramImage}
            alt="Diagram"
            width={800}
            height={600}
            className="w-full h-auto"
          />

          {/* Overlay input positions */}
          {questionGroup.inputPositions?.map((position) => {
            const question = questionGroup.questions.find(
              (q) => q.labelId === position.labelId
            );
            if (!question) return null;

            const questionNumber = question.labelId.replace("label-", "");
            const questionId = `q${questionNumber}`;
            const answer = getStringAnswer(questionId);
            const answerId = `answer-${questionId}`;
            const questionDropId = `question-${questionId}`;
            const isDragging = activeId === answerId;

            return (
              <div
                key={position.labelId}
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
                          {position.labelId}
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
                        placeholder={position.labelId}
                      />
                    </div>
                  )}
                </DropZone>
              </div>
            );
          }) || null}
        </div>
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
        {/* Word limit information */}
        {questionGroup.wordLimitText && (
          <div className="bg-muted/30 p-3 sm:p-4 rounded-lg">
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">
              {questionGroup.wordLimitText}
            </p>
          </div>
        )}

        {/* Options bank for drag and drop */}
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

        {/* Diagram */}
        <div className="bg-card border border-border p-4 sm:p-6 rounded-lg">
          <h4 className="font-semibold text-sm sm:text-base lg:text-lg text-foreground mb-4">
            Label the diagram below
          </h4>
          {renderDiagram()}
        </div>

        {/* Question numbers reference */}
        <div className="text-xs text-muted-foreground">
          Questions:{" "}
          {questionGroup.questions
            .map((q) => q.labelId.replace("label-", ""))
            .join(", ")}
        </div>
      </div>

      {/* Drag Overlay */}
      {typeof window !== "undefined" &&
        createPortal(
          <DragOverlay>
            {activeId && draggedContent && (
              <DragOverlayContent content={draggedContent} />
            )}
          </DragOverlay>,
          document.body
        )}
    </DndContext>
  );
}
