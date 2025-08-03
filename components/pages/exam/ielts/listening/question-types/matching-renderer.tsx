"use client";

import { ListeningMatchingGroup } from "@/types/exam/ielts-academic/listening/listening";
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

interface MatchingRendererProps {
  questionGroup: ListeningMatchingGroup;
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

export default function MatchingRenderer({
  questionGroup,
  answers,
  onAnswerChange,
}: MatchingRendererProps) {
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

  // Create letter options (A, B, C, etc.) for the available options
  const optionLetters =
    questionGroup.options?.map((_, index) => String.fromCharCode(65 + index)) ||
    [];

  const availableLetters = optionLetters.filter(
    (letter) => !usedAnswers.has(letter)
  );

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

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Options */}
        {questionGroup.options && (
          <DropZone
            id="options-area"
            className="bg-card border border-border p-4 sm:p-5 lg:p-6 rounded-lg"
          >
            <h4 className="font-medium mb-3 sm:mb-4 text-foreground text-sm sm:text-base lg:text-lg">
              Options:
            </h4>
            <div className="grid grid-cols-1 gap-2 sm:gap-3 mb-4">
              {questionGroup.options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 bg-muted/20 rounded"
                >
                  <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-xs sm:text-sm shrink-0">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-foreground text-xs sm:text-sm lg:text-base leading-relaxed">
                    {option}
                  </span>
                </div>
              ))}
            </div>

            {/* Draggable Letters */}
            <div className="border-t border-border pt-4">
              <h5 className="font-medium mb-2 text-foreground text-sm">
                Drag letters to answer boxes:
              </h5>
              <div className="flex flex-wrap gap-2 min-h-[2rem]">
                {availableLetters.map((letter) => {
                  const optionId = `option-${letter}`;
                  const isDragging = activeId === optionId;

                  return (
                    <DraggableItem
                      key={optionId}
                      id={optionId}
                      content={letter}
                      isDragging={isDragging}
                      className="w-8 h-8 sm:w-10 sm:h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm hover:bg-primary/80"
                    />
                  );
                })}
                {availableLetters.length === 0 && (
                  <p className="text-xs text-muted-foreground italic">
                    All letters used. Drag answers back here to return them.
                  </p>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Drag letters to answer boxes, or drag answers back here to
                return them.
              </p>
            </div>
          </DropZone>
        )}

        {/* Questions */}
        <div className="space-y-4 sm:space-y-5 lg:space-y-6">
          {questionGroup.questions.map((question) => {
            const questionId = `q${question.number}`;
            const answer = getStringAnswer(questionId);
            const answerId = `answer-${questionId}`;
            const questionDropId = `question-${questionId}`;
            const isDragging = activeId === answerId;

            return (
              <div
                key={question.number}
                id={`question-${question.number}`}
                data-question={question.number}
                className="space-y-3 sm:space-y-4 scroll-mt-20"
              >
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-semibold text-xs sm:text-sm lg:text-base shrink-0">
                    {question.number}
                  </div>
                  <div className="flex-1 space-y-2 sm:space-y-3">
                    <p className="text-foreground text-xs sm:text-sm lg:text-base font-medium">
                      {question.prompt}
                    </p>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <span className="text-muted-foreground text-xs sm:text-sm">
                        Answer:
                      </span>
                      <DropZone
                        id={questionDropId}
                        className="w-12 h-8 sm:w-14 sm:h-9 lg:w-16 lg:h-10"
                      >
                        {questionGroup.options ? (
                          answer ? (
                            <DraggableItem
                              id={answerId}
                              content={answer}
                              isDragging={isDragging}
                              className="w-full h-full rounded-sm bg-white text-black font-semibold flex items-center justify-center text-sm"
                              style={{ border: "2px dashed black" }}
                            />
                          ) : (
                            <div
                              className="w-full h-full rounded-sm bg-white text-black flex items-center justify-center text-xs"
                              style={{ border: "2px dashed black" }}
                            >
                              <span className="font-medium">?</span>
                            </div>
                          )
                        ) : (
                          <input
                            value={answer}
                            onChange={(e) =>
                              onAnswerChange(questionId, e.target.value)
                            }
                            placeholder="A, B, C..."
                            className="w-full h-full text-center rounded-sm bg-white text-black outline-none font-semibold text-sm"
                            style={{ border: "2px dashed black" }}
                            maxLength={1}
                          />
                        )}
                      </DropZone>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Instructions */}
        <div className="bg-muted/30 p-3 sm:p-4 rounded-lg">
          <p className="text-xs sm:text-sm text-muted-foreground">
            <strong>Instructions:</strong> Match each question with the correct
            option.{" "}
            {questionGroup.options
              ? "Drag the letters (A, B, C, etc.) to the answer boxes."
              : "Write the letter (A, B, C, etc.) in the answer box."}
          </p>
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
