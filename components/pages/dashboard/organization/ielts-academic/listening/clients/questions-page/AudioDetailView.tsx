import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileAudio, FileText, Volume2 } from "lucide-react";
import { IELTSListeningTestSection } from "@/types/exam/ielts-academic/listening/listening";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { QuestionGroupRenderer } from "./question-group-renderers/QuestionGroupRenderer";

interface AudioDetailViewProps {
  selectedAudio: IELTSListeningTestSection | null;
  getQuestionTypeLabel: (type: string) => string;
}

export function AudioDetailView({
  selectedAudio,
  getQuestionTypeLabel,
}: AudioDetailViewProps) {
  if (!selectedAudio) {
    return (
      <Card className="h-full w-full rounded-lg border-2 border-dashed border-muted-foreground/30">
        <CardContent className="flex flex-col items-center justify-center h-full text-center p-4 sm:p-6 lg:p-8">
          <div className="p-3 sm:p-4 bg-muted rounded-full mb-3 sm:mb-4">
            <FileAudio className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold tracking-tight">
            Select an Audio
          </h3>
          <p className="text-muted-foreground text-sm sm:text-base mt-2 max-w-xs sm:max-w-sm px-2">
            Choose an audio from the list on the left to see its transcript and
            associated questions.
          </p>
        </CardContent>
      </Card>
    );
  }

  const audio = selectedAudio.audio;
  const questions = selectedAudio.questions;

  const difficultyColors: { [key: string]: string } = {
    hard: "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300",
    medium:
      "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300",
    easy: "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/40 dark:text-green-300",
  };

  const difficultyClass = audio?.difficulty
    ? difficultyColors[audio.difficulty]
    : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300";

  return (
    <Card className="h-full w-full flex flex-col">
      <CardHeader className="border-b p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="bg-primary/10 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
              <FileAudio className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <CardTitle className="text-lg sm:text-xl font-semibold tracking-tight truncate">
              {audio?.title || "Untitled Audio"}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
            {audio?.difficulty && (
              <Badge
                variant="secondary"
                className={`text-xs sm:text-sm ${difficultyClass}`}
              >
                {audio.difficulty.charAt(0).toUpperCase() +
                  audio.difficulty.slice(1)}
              </Badge>
            )}
            {audio?.audioUrl && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 sm:gap-2 text-xs sm:text-sm"
              >
                <Volume2 className="h-3 w-3 sm:h-4 sm:w-4" />
                Play Audio
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-0">
        <Tabs defaultValue="questions" className="h-full">
          <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger
                value="questions"
                className="flex-1 sm:flex-none text-sm"
              >
                Questions
              </TabsTrigger>
              <TabsTrigger
                value="transcript"
                className="flex-1 sm:flex-none text-sm"
              >
                Transcript
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="questions"
            className="h-[calc(100%-56px)] sm:h-[calc(100%-64px)] mt-0"
          >
            <ScrollArea className="h-full">
              <div className="p-3 sm:p-4 lg:p-6">
                {questions.length === 0 ? (
                  <div className="text-center py-6 sm:py-8 text-muted-foreground">
                    <p className="text-sm sm:text-base">
                      No questions found for this audio.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                    {questions.map((questionGroup, index) => (
                      <QuestionGroupRenderer
                        key={index}
                        group={questionGroup}
                        getQuestionTypeLabel={getQuestionTypeLabel}
                      />
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent
            value="transcript"
            className="h-[calc(100%-56px)] sm:h-[calc(100%-64px)] mt-0"
          >
            <ScrollArea className="h-full">
              <div className="p-3 sm:p-4 lg:p-6">
                <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3">
                  Transcript
                </h3>

                {audio?.transcript ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none rounded-md border bg-muted/20 p-3 sm:p-4">
                    <p className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed">
                      {audio.transcript}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-8 text-muted-foreground border rounded-md bg-muted/20 p-3 sm:p-4">
                    <FileText className="h-8 w-8 sm:h-10 sm:w-10 mx-auto mb-2 opacity-50" />
                    <p className="text-sm sm:text-base">
                      No transcript available for this audio.
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
