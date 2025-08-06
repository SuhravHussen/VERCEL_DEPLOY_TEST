"use client";

import { ListeningMultipleChoiceMultipleAnswersGroup } from "@/types/exam/ielts-academic/listening/listening";

interface MultipleChoiceMultipleAnswersRendererProps {
  questionGroup: ListeningMultipleChoiceMultipleAnswersGroup;
  answers: Record<string, string | string[]>;
  onAnswerChange: (questionId: string, answer: string | string[]) => void;
}

export default function MultipleChoiceMultipleAnswersRenderer({
  questionGroup,
  answers,
  onAnswerChange,
}: MultipleChoiceMultipleAnswersRendererProps) {
  const getArrayAnswer = (questionId: string): string[] => {
    const answer = answers[questionId];
    return Array.isArray(answer) ? answer : [];
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
        // Don't add if at max capacity
        return;
      }
    } else {
      newAnswers = currentAnswers.filter((a) => a !== option);
    }

    onAnswerChange(questionId, newAnswers);
  };

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <div className="bg-muted/30 p-3 sm:p-4 rounded-lg">
        <p className="text-xs sm:text-sm text-muted-foreground">
          <strong>Instructions:</strong> Choose{" "}
          {questionGroup.answersRequired || 2} answers from the options below.
          Use checkboxes to select your answers.
        </p>
      </div>

      {/* Questions */}
      {questionGroup.questions.map((question) => {
        const questionId = `q${question.number}`;
        const selectedAnswers = getArrayAnswer(questionId);
        const maxAnswers = questionGroup.answersRequired || 2;

        return (
          <div
            key={question.number}
            id={`question-${question.number}`}
            data-question={question.number}
            className="p-4 rounded-lg border-2 bg-card border-border hover:border-muted-foreground/30 transition-all scroll-mt-20"
          >
            <div className="space-y-4">
              {/* Question Header */}
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-semibold text-xs sm:text-sm shrink-0">
                  {question.number}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm sm:text-base lg:text-lg text-foreground leading-relaxed mb-3">
                    {question.question}
                  </h4>
                  <div className="text-xs text-muted-foreground mb-4">
                    Select {maxAnswers} answers • {selectedAnswers.length}/
                    {maxAnswers} selected
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2 sm:space-y-3 ml-11 sm:ml-14">
                {(questionGroup.options || question.answers).map(
                  (option, index) => {
                    const optionLetter = String.fromCharCode(65 + index);
                    const isSelected = selectedAnswers.includes(option);
                    const isDisabled =
                      !isSelected && selectedAnswers.length >= maxAnswers;

                    return (
                      <div
                        key={index}
                        className={`flex items-start space-x-3 p-3 rounded-lg border transition-all ${
                          isSelected
                            ? "bg-primary/5 border-primary/20"
                            : isDisabled
                            ? "bg-muted/30 border-muted opacity-60"
                            : "bg-background border-border hover:border-muted-foreground/30 hover:bg-muted/20"
                        }`}
                      >
                        <input
                          type="checkbox"
                          id={`q${question.number}_${index}`}
                          checked={isSelected}
                          disabled={isDisabled}
                          onChange={(e) =>
                            handleCheckboxChange(
                              question.number,
                              option,
                              e.target.checked
                            )
                          }
                          className="border-border mt-0.5 shrink-0 h-4 w-4"
                        />
                        <div className="flex items-start space-x-2 flex-1">
                          <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-semibold text-xs shrink-0">
                            {optionLetter}
                          </div>
                          <label
                            htmlFor={`q${question.number}_${index}`}
                            className={`cursor-pointer text-xs sm:text-sm leading-relaxed ${
                              isDisabled
                                ? "text-muted-foreground"
                                : "text-foreground"
                            }`}
                          >
                            {option}
                          </label>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>

              {/* Selected answers summary */}
              {selectedAnswers.length > 0 && (
                <div className="ml-11 sm:ml-14 p-2 bg-muted/20 rounded text-xs text-muted-foreground">
                  <strong>Selected:</strong>{" "}
                  {selectedAnswers
                    .map((answer) => {
                      const optionIndex = (
                        questionGroup.options || question.answers
                      ).indexOf(answer);
                      const letter =
                        optionIndex >= 0
                          ? String.fromCharCode(65 + optionIndex)
                          : answer;
                      return letter;
                    })
                    .join(", ")}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
