"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MultipleChoiceMultipleAnswersGroup } from "@/types/exam/ielts-academic/reading/question/question";

interface MultipleChoiceMultipleAnswersRendererProps {
  questionGroup: MultipleChoiceMultipleAnswersGroup;
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

  const options = questionGroup.options || [];

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
        <p className="text-blue-800 text-xs sm:text-sm font-medium">
          Choose {questionGroup.answersRequired || 2} answers from the options
          below.
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
            className="space-y-3 sm:space-y-4 scroll-mt-20"
          >
            <h4 className="font-semibold text-sm sm:text-base lg:text-lg text-foreground">
              {question.number}. {question.question}
            </h4>

            <div className="text-xs text-muted-foreground mb-4">
              Select {maxAnswers} answers • {selectedAnswers.length}/
              {maxAnswers} selected
            </div>

            <div className="space-y-2 sm:space-y-3">
              {options.map((option, optionIndex) => {
                const optionValue = String.fromCharCode(65 + optionIndex); // A, B, C, etc.
                const isSelected = selectedAnswers.includes(optionValue);
                const isDisabled =
                  !isSelected && selectedAnswers.length >= maxAnswers;

                return (
                  <div
                    key={optionIndex}
                    className="flex items-start space-x-2 sm:space-x-3"
                  >
                    <Checkbox
                      id={`q${question.number}_${optionIndex}`}
                      checked={isSelected}
                      disabled={isDisabled}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(
                          question.number,
                          optionValue,
                          checked as boolean
                        )
                      }
                      className="border-border text-primary mt-0.5 shrink-0"
                    />
                    <Label
                      htmlFor={`q${question.number}_${optionIndex}`}
                      className={`text-foreground cursor-pointer text-xs sm:text-sm lg:text-base leading-relaxed ${
                        isDisabled ? "opacity-50" : ""
                      }`}
                    >
                      {optionValue} {option}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
