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
      <div className="space-y-4">
        {/* Instructions - Move to top for better UX */}
        <div className="bg-muted/30 p-3 sm:p-4 rounded-lg">
          <p className="text-xs sm:text-sm text-muted-foreground">
            <strong>Instructions:</strong> Match each question with the correct
            option.{" "}
            {questionGroup.options
              ? "Drag the letters (A, B, C, etc.) to the answer boxes."
              : "Write the letter (A, B, C, etc.) in the answer box."}
          </p>
        </div>

        {/* Main Content - Side by Side Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 min-h-[500px]">
          {/* Left Column - Options */}
          {questionGroup.options && (
            <div className="lg:sticky lg:top-4 lg:self-start">
              <DropZone
                id="options-area"
                className="bg-card border border-border p-4 sm:p-5 rounded-lg h-full"
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h4 className="font-medium text-foreground text-sm sm:text-base lg:text-lg">
                    Options
                  </h4>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    {questionGroup.options.length} choices
                  </span>
                </div>

                {/* Options List - More compact */}
                <div className="space-y-2 mb-4 max-h-[300px] lg:max-h-[400px] overflow-y-auto">
                  {questionGroup.options.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 bg-muted/20 rounded hover:bg-muted/30 transition-colors"
                    >
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-xs sm:text-sm shrink-0">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-foreground text-xs sm:text-sm leading-relaxed">
                        {option}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Draggable Letters */}
                <div className="border-t border-border pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-foreground text-sm">
                      Available Letters
                    </h5>
                    <span className="text-xs text-muted-foreground">
                      {availableLetters.length} remaining
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 min-h-[3rem] p-2 bg-muted/10 rounded border-2 border-dashed border-muted-foreground/20">
                    {availableLetters.map((letter) => {
                      const optionId = `option-${letter}`;
                      const isDragging = activeId === optionId;

                      return (
                        <DraggableItem
                          key={optionId}
                          id={optionId}
                          content={letter}
                          isDragging={isDragging}
                          className="w-8 h-8 sm:w-10 sm:h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm hover:bg-primary/80 shadow-sm transition-all hover:scale-105"
                        />
                      );
                    })}
                    {availableLetters.length === 0 && (
                      <div className="w-full text-center py-2">
                        <p className="text-xs text-muted-foreground italic">
                          All letters used
                        </p>
                        <p className="text-xs text-muted-foreground/80 mt-1">
                          Drag answers back here to return them
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </DropZone>
            </div>
          )}

          {/* Right Column - Questions */}
          <div className="space-y-4 sm:space-y-5">
            <div className="mb-4">
              <h4 className="font-medium text-foreground text-sm sm:text-base lg:text-lg">
                Questions
              </h4>
            </div>

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
                  className="p-4 rounded-lg border-2 bg-card border-border hover:border-muted-foreground/30 transition-all scroll-mt-20"
                >
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-semibold text-xs sm:text-sm shrink-0">
                      {question.number}
                    </div>
                    <div className="flex-1 space-y-2 sm:space-y-3">
                      <p className="text-foreground text-xs sm:text-sm lg:text-base font-medium leading-relaxed">
                        {question.prompt}
                      </p>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <span className="text-muted-foreground text-xs sm:text-sm font-medium">
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
