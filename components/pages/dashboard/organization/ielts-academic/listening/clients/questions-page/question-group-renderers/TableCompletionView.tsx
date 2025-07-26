import {
  IELTSListeningQuestionGroup,
  ListeningTableCompletionGroup,
} from "@/types/exam/ielts-academic/listening/listening";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { TableIcon } from "lucide-react";

interface TableCompletionViewProps {
  group: IELTSListeningQuestionGroup;
  getQuestionTypeLabel: (type: string) => string;
}

export function TableCompletionView({
  group,
  getQuestionTypeLabel,
}: TableCompletionViewProps) {
  const typedGroup = group as ListeningTableCompletionGroup;

  return (
    <div className="rounded-md border bg-card p-4">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {getQuestionTypeLabel(group.questionType)}
          </h3>

          {typedGroup.wordLimit && (
            <Badge variant="outline" className="bg-muted/50">
              {typedGroup.wordLimitText || `Max ${typedGroup.wordLimit} words`}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {group.instruction || "No instruction provided"}
        </p>
      </div>

      {/* Display table structure if available */}
      {typedGroup.tableStructure && typedGroup.tableStructure.length > 0 && (
        <div className="mb-4 overflow-x-auto">
          <div className="flex items-center gap-2 mb-2">
            <TableIcon className="h-4 w-4 text-primary" />
            <h4 className="font-medium">Table</h4>
          </div>
          <table className="min-w-full border border-separate border-spacing-0 rounded-md overflow-hidden">
            <tbody>
              {typedGroup.tableStructure.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => {
                    // Check if this cell corresponds to a gap
                    const question = typedGroup.questions?.find(
                      (q) => q.cellId === `${rowIndex}-${cellIndex}`
                    );
                    const isGap = !!question;

                    return (
                      <td
                        key={cellIndex}
                        className={`border p-2 ${
                          isGap ? "bg-primary/10 font-medium" : ""
                        }`}
                      >
                        {isGap ? (
                          <div className="flex items-center justify-between gap-2">
                            <span className="px-2 py-0.5 bg-primary/20 rounded-sm border border-primary/30 text-primary">
                              Gap {question.cellId}
                            </span>
                          </div>
                        ) : (
                          cell
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Separator className="my-4" />

      <div className="space-y-4">
        {typedGroup.questions?.map((question, qIndex) => {
          return (
            <div
              key={qIndex}
              className="space-y-2 pl-4 border-l-2 border-muted"
            >
              <div className="flex items-center gap-2">
                <h4 className="font-medium">
                  Cell {question.cellId || `${qIndex + 1}`}
                </h4>
                <div className="px-2 py-0.5 bg-primary/20 rounded-sm border border-primary/30 text-primary font-medium">
                  {question.cellId || `Cell ${qIndex + 1}`}
                </div>
              </div>

              <div className="mt-2 text-sm px-3 py-2 bg-muted/50 rounded-md inline-block">
                <span className="font-medium">Answer: </span>
                {question.correctAnswer}
              </div>
            </div>
          );
        })}
      </div>

      {typedGroup.options && typedGroup.options.length > 0 && (
        <div className="mt-6 pt-4 border-t">
          <h4 className="font-medium mb-2">Options</h4>
          <div className="flex flex-wrap gap-2">
            {typedGroup.options.map((option, index) => (
              <Badge key={index} variant="outline" className="bg-muted/30">
                {option}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
