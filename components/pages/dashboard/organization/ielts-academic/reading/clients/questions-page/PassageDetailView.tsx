import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookOpen, FileText } from "lucide-react";
import { QuestionGroupRenderer } from "./question-group-renderers/QuestionGroupRenderer";
import { IELTSReadingTestSection } from "@/types/exam/ielts-academic/reading/question/question";

interface PassageDetailViewProps {
  selectedPassage: IELTSReadingTestSection | null;
  getQuestionTypeLabel: (type: string) => string;
}

export function PassageDetailView({
  selectedPassage,
  getQuestionTypeLabel,
}: PassageDetailViewProps) {
  if (!selectedPassage) {
    return (
      <Card className="h-full w-full rounded-lg border-2 border-dashed border-muted-foreground/30">
        <CardContent className="flex flex-col items-center justify-center h-full text-center p-8">
          <div className="p-4 bg-muted rounded-full mb-4">
            <FileText className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold tracking-tight">Select a Passage</h3>
          <p className="text-muted-foreground text-base mt-2 max-w-sm">
            Choose a passage from the list on the left to see its content and
            associated questions.
          </p>
        </CardContent>
      </Card>
    );
  }

  const difficultyColors: { [key: string]: string } = {
    hard: "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300",
    medium:
      "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300",
    easy: "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/40 dark:text-green-300",
  };

  const difficultyClass = selectedPassage.passage?.difficulty
    ? difficultyColors[selectedPassage.passage.difficulty]
    : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300";

  return (
    <Card className="h-full w-full flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl font-semibold tracking-tight">
              {selectedPassage.passage?.title}
            </CardTitle>
          </div>
          {selectedPassage.passage?.difficulty && (
            <Badge variant="secondary" className={difficultyClass}>
              {selectedPassage.passage.difficulty.charAt(0).toUpperCase() +
                selectedPassage.passage.difficulty.slice(1)}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-6 space-y-8">
        <div>
          <h3 className="font-semibold text-lg mb-3">Passage Content</h3>
          <div
            className="prose prose-sm dark:prose-invert max-w-none rounded-md border bg-muted/20 p-4"
            dangerouslySetInnerHTML={{
              __html: selectedPassage.passage?.content || "",
            }}
          />
        </div>

        {selectedPassage.questions && selectedPassage.questions.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg mb-4">Questions</h3>
              <div className="space-y-6">
                {selectedPassage.questions.map((group) => (
                  <QuestionGroupRenderer
                    key={group.id}
                    group={group}
                    getQuestionTypeLabel={getQuestionTypeLabel}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
