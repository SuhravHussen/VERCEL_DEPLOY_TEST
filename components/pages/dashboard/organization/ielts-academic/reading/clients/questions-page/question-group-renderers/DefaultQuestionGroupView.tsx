import { Badge } from "@/components/ui/badge";
import { IELTSReadingQuestionGroup } from "@/types/exam/ielts-academic/reading/question/question";

interface QuestionItemProps {
  question: IELTSReadingQuestionGroup["questions"][number];
  index: number;
}

const QuestionItem = ({ question, index }: QuestionItemProps) => {
  return (
    <div className="text-sm p-3 bg-muted/20 rounded-md border">
      <div className="flex justify-between items-start mb-2">
        <p className="font-semibold text-primary/90">
          Question {question.number || index + 1}
        </p>
        {question.correctAnswer && (
          <Badge
            variant="outline"
            className="text-xs font-semibold bg-green-100 text-green-800 border-green-300"
          >
            Answer:{" "}
            {Array.isArray(question.correctAnswer)
              ? question.correctAnswer.join(", ")
              : question.correctAnswer}
          </Badge>
        )}
      </div>

      {question.question && (
        <p className="mt-1 font-medium">{question.question}</p>
      )}
      {question.statement && (
        <p className="mt-1 font-medium">{question.statement}</p>
      )}
      {question.sentenceStart && (
        <p className="mt-1 font-medium">{question.sentenceStart}...</p>
      )}
    </div>
  );
};

export function DefaultQuestionGroupView({
  group,
  getQuestionTypeLabel,
}: {
  group: IELTSReadingQuestionGroup;
  getQuestionTypeLabel: (type: string) => string;
}) {
  return (
    <div className="mb-6">
      <Badge variant="secondary" className="mb-2 text-base">
        {getQuestionTypeLabel(group.questionType)}
      </Badge>
      <p className="text-sm italic text-muted-foreground mb-3">
        {group.instruction}
      </p>
      <div className="space-y-3">
        {group.questions.map((q, i) => (
          <QuestionItem key={i} question={q} index={i} />
        ))}
      </div>
    </div>
  );
}
