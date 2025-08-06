import ReadingQuestionRenderer from "./reading-question-renderer";

interface ReadingTestContentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentQuestions: Array<any>;
  answers: Record<string, string | string[]>;
  onAnswerChange: (questionId: string, answer: string | string[]) => void;
}

export default function ReadingTestContent({
  currentQuestions,
  answers,
  onAnswerChange,
}: ReadingTestContentProps) {
  return (
    <div className="w-full max-w-none px-3 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6">
      {/* Question Groups */}
      <div className="space-y-4 sm:space-y-6 lg:space-y-8">
        {currentQuestions.map((questionGroup, index) => {
          // Get question numbers from the actual questions
          const questions =
            (questionGroup as { questions?: Array<{ number?: number }> })
              .questions || [];
          const questionNumbers = questions
            .map((q) => q.number)
            .filter((num): num is number => typeof num === "number");
          const firstQuestion =
            questionNumbers.length > 0 ? Math.min(...questionNumbers) : 1;
          const lastQuestion =
            questionNumbers.length > 0 ? Math.max(...questionNumbers) : 1;

          return (
            <div
              key={questionGroup.id || index}
              className="space-y-3 sm:space-y-4 lg:space-y-6"
            >
              {/* Question Range Header */}
              <div className="border-b border-border pb-2 sm:pb-3 lg:pb-4">
                <h2 className="font-semibold text-base sm:text-lg lg:text-xl text-foreground">
                  Question {firstQuestion}
                  {questionNumbers.length > 1 ? ` - ${lastQuestion}` : ""}
                </h2>
                <p className="text-muted-foreground mt-1 sm:mt-2 text-xs sm:text-sm lg:text-base">
                  {questionGroup.instruction}
                </p>
              </div>

              {/* Questions */}
              <ReadingQuestionRenderer
                questionGroup={questionGroup}
                answers={answers}
                onAnswerChange={onAnswerChange}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
