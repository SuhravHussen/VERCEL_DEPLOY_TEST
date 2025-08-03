"use client";

import { ListeningMultipleChoiceMultipleAnswersGroup } from "@/types/exam/ielts-academic/listening/listening";
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

interface MultipleChoiceMultipleAnswersRendererProps {
  questionGroup: ListeningMultipleChoiceMultipleAnswersGroup;
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

export default function MultipleChoiceMultipleAnswersRenderer({
  questionGroup,
  answers,
  onAnswerChange,
}: MultipleChoiceMultipleAnswersRendererProps) {
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

  const getArrayAnswer = (questionId: string): string[] => {
    const answer = answers[questionId];
    return Array.isArray(answer) ? answer : [];
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
    setDraggedContent(event.active.data.current?.content || "");
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);
    setDraggedContent("");

    if (!over) return;

    const overId = over.id as string;
    const draggedContent = active.data.current?.content;

    if (!draggedContent) return;

    // Handle dropping to options area (remove from selected)
    if (overId === "options-area") {
      questionGroup.questions.forEach((question) => {
        const questionId = `q${question.number}`;
        const currentAnswers = getArrayAnswer(questionId);
        if (currentAnswers.includes(draggedContent)) {
          const newAnswers = currentAnswers.filter((a) => a !== draggedContent);
          onAnswerChange(questionId, newAnswers);
        }
      });
      return;
    }

    // Handle dropping to selected answers area
    if (overId.startsWith("selected-")) {
      const questionNumber = overId.replace("selected-", "");
      const questionId = `q${questionNumber}`;
      const currentAnswers = getArrayAnswer(questionId);
      const maxAnswers = questionGroup.answersRequired || 2;

      // Don't add if already selected
      if (currentAnswers.includes(draggedContent)) return;

      // Don't add if at max capacity
      if (currentAnswers.length >= maxAnswers) return;

      // Add the new answer
      const newAnswers = [...currentAnswers, draggedContent];
      onAnswerChange(questionId, newAnswers);
    }
  };

  const handleCheckboxChange = (
    questionNumber: number,
    option: string,
    checked: boolean
  ) => {
    const questionId = `q${questionNumber}`;
    const currentAnswers = getArrayAnswer(questionId);
    const maxAnswers = questionGroup.answersRequired || 2;

    let newAnswers: string[];
    if (checked) {
      if (currentAnswers.length < maxAnswers) {
        newAnswers = [...currentAnswers, option];
      } else {
        newAnswers = currentAnswers;
      }
    } else {
      newAnswers = currentAnswers.filter((a) => a !== option);
    }

    onAnswerChange(questionId, newAnswers);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Instructions */}
        <div className="bg-muted/30 p-3 sm:p-4 rounded-lg">
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">
            Choose {questionGroup.answersRequired || 2} answers from the options
            below.{" "}
            {questionGroup.options
              ? "You can drag options to the selected answers area or use checkboxes."
              : "Use checkboxes to select answers."}
          </p>
        </div>

        {/* Questions with shared options */}
        {questionGroup.questions.map((question) => {
          const questionId = `q${question.number}`;
          const selectedAnswers = getArrayAnswer(questionId);
          const maxAnswers = questionGroup.answersRequired || 2;

          return (
            <div
              key={question.number}
              id={`question-${question.number}`}
              data-question={question.number}
              className="space-y-3 sm:space-y-4 scroll-mt-20"
            >
              <h4 className="font-semibold text-sm sm:text-base lg:text-lg text-foreground">
                {question.number}. {question.question}
              </h4>

              {/* Options as draggable items */}
              {questionGroup.options && (
                <DropZone
                  id="options-area"
                  className="bg-card border border-border p-3 sm:p-4 rounded-lg"
                >
                  <h5 className="font-medium mb-2 sm:mb-3 text-foreground text-sm">
                    Options (drag to select):
                  </h5>
                  <div className="flex flex-wrap gap-2 min-h-[2rem]">
                    {questionGroup.options.map((option, index) => {
                      const optionLetter = String.fromCharCode(65 + index);
                      const optionId = `option-${question.number}-${index}`;
                      const isDragging = activeId === optionId;
                      const isSelected = selectedAnswers.includes(option);

                      return (
                        <DraggableItem
                          key={optionId}
                          id={optionId}
                          content={`${optionLetter} ${option}`}
                          isDragging={isDragging}
                          className={`px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm border ${
                            isSelected
                              ? "bg-primary/20 text-primary border-primary"
                              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          }`}
                        />
                      );
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Drag options to the selected answers area below, or use
                    checkboxes.
                  </p>
                </DropZone>
              )}

              {/* Selected Answers Area */}
              {questionGroup.options && (
                <DropZone
                  id={`selected-${question.number}`}
                  className="bg-green-50 border-2 border-dashed border-green-300 p-3 sm:p-4 rounded-lg min-h-[4rem]"
                >
                  <h5 className="font-medium mb-2 text-green-800 text-sm">
                    Selected Answers ({selectedAnswers.length}/{maxAnswers}):
                  </h5>
                  <div className="flex flex-wrap gap-2 min-h-[2rem]">
                    {selectedAnswers.map((answer, answerIndex) => {
                      const answerId = `answer-${question.number}-${answerIndex}`;
                      const isDragging = activeId === answerId;
                      const optionIndex =
                        questionGroup.options!.indexOf(answer);
                      const optionLetter = String.fromCharCode(
                        65 + optionIndex
                      );

                      return (
                        <DraggableItem
                          key={answerId}
                          id={answerId}
                          content={`${optionLetter} ${answer}`}
                          isDragging={isDragging}
                          className="px-2 sm:px-3 py-1 sm:py-2 bg-green-100 text-green-800 rounded text-xs sm:text-sm border border-green-300 font-medium"
                        />
                      );
                    })}
                    {selectedAnswers.length === 0 && (
                      <p className="text-xs text-green-600 italic">
                        Drag {maxAnswers} options here
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-green-600 mt-2">
                    Drag answers back to the options area to remove them.
                  </p>
                </DropZone>
              )}

              {/* Fallback: Traditional checkboxes if no options */}
              {!questionGroup.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {question.answers.map((answer, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-2 sm:space-x-3"
                    >
                      <input
                        type="checkbox"
                        id={`q${question.number}_${index}`}
                        checked={selectedAnswers.includes(answer)}
                        onChange={(e) =>
                          handleCheckboxChange(
                            question.number,
                            answer,
                            e.target.checked
                          )
                        }
                        className="border-border mt-0.5 shrink-0"
                      />
                      <label
                        htmlFor={`q${question.number}_${index}`}
                        className="text-foreground cursor-pointer text-xs sm:text-sm lg:text-base leading-relaxed"
                      >
                        {String.fromCharCode(65 + index)} {answer}
                      </label>
                    </div>
                  ))}
                </div>
              )}

              {/* Selected answers display */}
              <div className="text-xs sm:text-sm text-muted-foreground">
                Selected: {selectedAnswers.length} / {maxAnswers}
                {selectedAnswers.length > 0 && (
                  <span className="ml-2">
                    (
                    {selectedAnswers
                      .map((answer) => {
                        const optionIndex =
                          questionGroup.options?.indexOf(answer) ?? -1;
                        const letter =
                          optionIndex >= 0
                            ? String.fromCharCode(65 + optionIndex)
                            : answer;
                        return letter;
                      })
                      .join(", ")}
                    )
                  </span>
                )}
              </div>
            </div>
          );
        })}
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
