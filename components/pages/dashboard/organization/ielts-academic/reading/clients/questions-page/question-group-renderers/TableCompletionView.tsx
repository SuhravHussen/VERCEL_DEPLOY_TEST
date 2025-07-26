import { Badge } from "@/components/ui/badge";
import { IELTSReadingQuestionGroup } from "@/types/exam/ielts-academic/reading/question/question";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function TableCompletionView({
  group,
  getQuestionTypeLabel,
}: {
  group: IELTSReadingQuestionGroup;
  getQuestionTypeLabel: (type: string) => string;
}) {
  // Cast tableStructure to string[][] to ensure TypeScript knows it's a 2D array
  const tableData: string[][] = (group.tableStructure as string[][]) || [];

  return (
    <div className="mb-6">
      <Badge variant="secondary" className="mb-2 text-base">
        {getQuestionTypeLabel(group.questionType)}
      </Badge>
      <p className="text-sm italic text-muted-foreground mb-3">
        {group.instruction}
      </p>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {tableData.length > 0 &&
                tableData[0].map((header: string, i: number) => (
                  <TableHead key={i}>{header}</TableHead>
                ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.length > 1 &&
              tableData.slice(1).map((row: string[], rowIndex: number) => (
                <TableRow key={rowIndex}>
                  {row.map((cell: string, cellIndex: number) => {
                    // Adjust rowIndex since we sliced the header row
                    const question = group.questions.find(
                      (q) => q.cellId === `${rowIndex + 1}-${cellIndex}`
                    );
                    return (
                      <TableCell key={cellIndex}>
                        {question ? (
                          <div className="flex flex-col items-start gap-1">
                            <span>{cell}</span>
                            <Badge
                              variant="outline"
                              className="text-xs font-semibold bg-green-100 text-green-800 border-green-300"
                            >
                              {String(question.correctAnswer)}
                            </Badge>
                          </div>
                        ) : (
                          String(cell)
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
