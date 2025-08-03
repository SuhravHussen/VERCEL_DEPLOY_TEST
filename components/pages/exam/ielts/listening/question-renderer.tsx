/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { IELTSListeningQuestionGroup } from "@/types/exam/ielts-academic/listening/listening";

interface QuestionRendererProps {
  questionGroup: IELTSListeningQuestionGroup;
  answers: Record<string, string | string[]>;
  onAnswerChange: (questionId: string, answer: string | string[]) => void;
}

export default function QuestionRenderer({
  questionGroup,
  answers,
  onAnswerChange,
}: QuestionRendererProps) {
  const handleStringAnswer = (questionId: string, value: string) => {
    onAnswerChange(questionId, value);
  };

  const handleArrayAnswer = (questionId: string, value: string[]) => {
    onAnswerChange(questionId, value);
  };

  const getStringAnswer = (questionId: string): string => {
    const answer = answers[questionId];
    return typeof answer === "string" ? answer : "";
  };

  const getArrayAnswer = (questionId: string): string[] => {
    const answer = answers[questionId];
    return Array.isArray(answer) ? answer : [];
  };

  const renderBasicQuestions = () => {
    const questions = (questionGroup as any).questions || [];
    const wordLimit = (questionGroup as any).wordLimit;

    return (
      <div className="space-y-6">
        {wordLimit && (
          <p className="text-sm text-gray-600 font-medium">
            Write NO MORE THAN {wordLimit} WORDS for each answer.
          </p>
        )}
        {questions.map((question: any) => (
          <div key={question.number || question.gapId} className="space-y-2">
            <Label
              htmlFor={`q${question.number || question.gapId}`}
              className="font-medium"
            >
              {question.number && `${question.number}.`}{" "}
              {question.question ||
                question.sentenceWithBlank ||
                `Gap ${question.gapId}:`}
            </Label>
            <Input
              id={`q${question.number || question.gapId}`}
              value={getStringAnswer(`q${question.number || question.gapId}`)}
              onChange={(e) =>
                handleStringAnswer(
                  `q${question.number || question.gapId}`,
                  e.target.value
                )
              }
              placeholder="Type your answer here..."
              className="max-w-md"
            />
          </div>
        ))}
      </div>
    );
  };

  const renderMultipleChoice = () => {
    const questions = (questionGroup as any).questions || [];

    return (
      <div className="space-y-6">
        {questions.map((question: any) => (
          <div key={question.number} className="space-y-3">
            <h4 className="font-medium">
              {question.number}. {question.question}
            </h4>
            <RadioGroup
              value={getStringAnswer(`q${question.number}`)}
              onValueChange={(value) =>
                handleStringAnswer(`q${question.number}`, value)
              }
            >
              {(question.options || []).map(
                (option: string, optionIndex: number) => (
                  <div
                    key={optionIndex}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem
                      value={option}
                      id={`q${question.number}_${optionIndex}`}
                    />
                    <Label htmlFor={`q${question.number}_${optionIndex}`}>
                      {String.fromCharCode(65 + optionIndex)} {option}
                    </Label>
                  </div>
                )
              )}
            </RadioGroup>
          </div>
        ))}
      </div>
    );
  };

  const renderMultipleChoiceMultipleAnswers = () => {
    const options = (questionGroup as any).options || [];
    const answersRequired = (questionGroup as any).answersRequired || 2;

    return (
      <div className="space-y-6">
        <p className="text-sm text-gray-600">
          Choose {answersRequired} answers from the options below.
        </p>
        <div className="space-y-2">
          {options.map((option: string, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <Checkbox
                id={`option_${index}`}
                checked={getArrayAnswer(`group_${questionGroup.id}`).includes(
                  option
                )}
                onCheckedChange={(checked) => {
                  const currentAnswers = getArrayAnswer(
                    `group_${questionGroup.id}`
                  );
                  const newAnswers = checked
                    ? [...currentAnswers, option]
                    : currentAnswers.filter((a: string) => a !== option);
                  handleArrayAnswer(`group_${questionGroup.id}`, newAnswers);
                }}
              />
              <Label htmlFor={`option_${index}`}>
                {String.fromCharCode(65 + index)} {option}
              </Label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMatching = () => {
    const questions = (questionGroup as any).questions || [];
    const options = (questionGroup as any).options || [];

    return (
      <div className="space-y-6">
        {options.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Options:</h4>
            <div className="grid grid-cols-2 gap-2">
              {options.map((option: string, index: number) => (
                <div key={index} className="text-sm">
                  {String.fromCharCode(65 + index)} {option}
                </div>
              ))}
            </div>
          </div>
        )}
        {questions.map((question: any) => (
          <div key={question.number} className="space-y-2">
            <Label htmlFor={`q${question.number}`} className="font-medium">
              {question.number}. {question.prompt || question.question}
            </Label>
            <Input
              id={`q${question.number}`}
              value={getStringAnswer(`q${question.number}`)}
              onChange={(e) =>
                handleStringAnswer(`q${question.number}`, e.target.value)
              }
              placeholder="Enter letter (A, B, C, etc.)"
              className="max-w-xs"
            />
          </div>
        ))}
      </div>
    );
  };

  const renderShortAnswer = () => {
    const questions = (questionGroup as any).questions || [];
    const maxWords = (questionGroup as any).maxWords;

    return (
      <div className="space-y-6">
        {maxWords && (
          <p className="text-sm text-gray-600 font-medium">
            Write NO MORE THAN {maxWords} WORDS for each answer.
          </p>
        )}
        {questions.map((question: any) => (
          <div key={question.number} className="space-y-2">
            <Label htmlFor={`q${question.number}`} className="font-medium">
              {question.number}. {question.question}
            </Label>
            <Textarea
              id={`q${question.number}`}
              value={getStringAnswer(`q${question.number}`)}
              onChange={(e) =>
                handleStringAnswer(`q${question.number}`, e.target.value)
              }
              placeholder="Type your answer here..."
              className="max-w-lg"
              rows={2}
            />
          </div>
        ))}
      </div>
    );
  };

  const renderQuestion = () => {
    switch (questionGroup.questionType) {
      case "multiple_choice":
        return renderMultipleChoice();
      case "multiple_choice_multiple_answers":
        return renderMultipleChoiceMultipleAnswers();
      case "sentence_completion":
      case "form_completion":
      case "note_completion":
      case "table_completion":
      case "flow_chart_completion":
      case "diagram_label_completion":
        return renderBasicQuestions();
      case "matching":
        return renderMatching();
      case "short_answer":
        return renderShortAnswer();
      default:
        return (
          <div>Question type not supported: {questionGroup.questionType}</div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-bold text-lg mb-2">
          {questionGroup.questionType.replace(/_/g, " ").toUpperCase()}
        </h3>
        <p className="text-gray-700">{questionGroup.instruction}</p>
      </div>
      {renderQuestion()}
    </div>
  );
}
