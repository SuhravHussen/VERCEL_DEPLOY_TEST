"use client";

import { ListeningFormCompletionGroup } from "@/types/exam/ielts-academic/listening/listening";
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

interface FormCompletionRendererProps {
  questionGroup: ListeningFormCompletionGroup;
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

export default function FormCompletionRenderer({
  questionGroup,
  answers,
  onAnswerChange,
}: FormCompletionRendererProps) {
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

  const renderFormField = (sentence: string, questionNumber: number) => {
    // Split sentence by underscores or common blank patterns
    const parts = sentence.split(/(_+|\[.*?\]|\.\.\.|___)/);

    return (
      <div className="flex items-center space-x-3 min-h-[2.5rem] flex-wrap">
        {parts.map((part, index) => {
          if (part.match(/^(_+|\[.*?\]|\.\.\.|___)$/)) {
            const questionId = `q${questionNumber}`;
            const answer = getStringAnswer(questionId);
            const answerId = `answer-${questionId}`;
            const questionDropId = `question-${questionId}`;
            const isDragging = activeId === answerId;

            return (
              <DropZone
                key={index}
                id={questionDropId}
                className="min-w-[120px] h-10"
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
                        {questionNumber}
                      </span>
                    </div>
                  )
                ) : (
                  <input
                    value={answer}
                    onChange={(e) => onAnswerChange(questionId, e.target.value)}
                    className="w-full h-full text-center rounded-sm bg-white text-black outline-none px-1"
                    style={{ border: "2px dashed black" }}
                    placeholder={`${questionNumber}`}
                  />
                )}
              </DropZone>
            );
          }
          return (
            <span key={index} className="text-foreground">
              {part}
            </span>
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
      <div className="space-y-4 sm:space-y-6 lg:space-y-8">
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

        {/* Form */}
        <div className="bg-card border border-border p-4 sm:p-6 lg:p-8 rounded-lg shadow-sm">
          <div className="space-y-4 sm:space-y-5 lg:space-y-6">
            <div className="grid grid-cols-1 gap-y-4 sm:gap-y-5 lg:gap-y-6">
              {questionGroup.questions.map((question) => (
                <div
                  key={question.number}
                  id={`question-${question.number}`}
                  data-question={question.number}
                  className="space-y-2 sm:space-y-3 scroll-mt-20"
                >
                  <div className="font-medium text-foreground shrink-0 text-xs sm:text-sm lg:text-base sm:w-24 lg:w-36">
                    {question.number}.
                  </div>
                  <div className="flex-1">
                    {renderFormField(
                      question.sentenceWithBlank,
                      question.number
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
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
