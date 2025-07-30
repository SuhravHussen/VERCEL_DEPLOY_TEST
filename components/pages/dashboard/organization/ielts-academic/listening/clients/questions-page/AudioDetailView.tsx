import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileAudio, FileText, Volume2 } from "lucide-react";
import { IELTSListeningTestSection } from "@/types/exam/ielts-academic/listening/listening";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
        <CardContent className="flex flex-col items-center justify-center h-full text-center p-8">
          <div className="p-4 bg-muted rounded-full mb-4">
            <FileAudio className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold tracking-tight">Select an Audio</h3>
          <p className="text-muted-foreground text-base mt-2 max-w-sm">
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
      <CardHeader className="border-b">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <FileAudio className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl font-semibold tracking-tight">
              {audio?.title || "Untitled Audio"}
            </CardTitle>
          </div>
          <div className="flex items-center gap-3">
            {audio?.difficulty && (
              <Badge variant="secondary" className={difficultyClass}>
                {audio.difficulty.charAt(0).toUpperCase() +
                  audio.difficulty.slice(1)}
              </Badge>
            )}
            {audio?.audioUrl && (
              <Button variant="outline" size="sm" className="gap-2">
                <Volume2 className="h-4 w-4" />
                Play Audio
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-0">
        <Tabs defaultValue="questions" className="h-full">
          <div className="px-6 py-4 border-b ">
            <TabsList>
              <TabsTrigger value="questions">Questions</TabsTrigger>
              <TabsTrigger value="transcript">Transcript</TabsTrigger>
            </TabsList>
          </div>

          <TabsContents>
            <TabsContent value="questions" className="h-[calc(100%-56px)] mt-0">
              <ScrollArea className="h-full">
                <div className="p-6">
                  {questions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No questions found for this audio.</p>
                    </div>
                  ) : (
                    <div className="space-y-8">
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
              className="h-[calc(100%-56px)] mt-0"
            >
              <ScrollArea className="h-full">
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-3">Transcript</h3>

                  {audio?.transcript ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none rounded-md border bg-muted/20 p-4">
                      <p className="whitespace-pre-wrap">{audio.transcript}</p>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground border rounded-md bg-muted/20 p-4">
                      <FileText className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <p>No transcript available for this audio.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </TabsContents>
        </Tabs>
      </CardContent>
    </Card>
  );
}
