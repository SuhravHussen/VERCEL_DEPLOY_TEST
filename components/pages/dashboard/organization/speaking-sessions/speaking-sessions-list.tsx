import { Video } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SpeakingSessionCard } from "./speaking-session-card";
import { SpeakingSession } from "@/types/exam/speaking-session";

interface SpeakingSessionsListProps {
  sessions: SpeakingSession[];
  isUpdating: boolean;
  onStatusUpdate: (
    sessionId: string,
    status: "cancelled" | "completed"
  ) => Promise<void>;
  onOpenGradeDialog: (session: SpeakingSession) => void;
}

export function SpeakingSessionsList({
  sessions,
  isUpdating,
  onStatusUpdate,
  onOpenGradeDialog,
}: SpeakingSessionsListProps) {
  const isSessionLive = (session: SpeakingSession): boolean => {
    if (session.status !== "scheduled") return false;

    const now = new Date();
    const startDate = new Date(session.start_time);
    const endDate = new Date(session.end_time);

    return now >= startDate && now <= endDate;
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
        <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
          <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
            <Video className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          Speaking Sessions
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          All scheduled speaking sessions for this exam
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        {sessions.length > 0 ? (
          <div className="grid gap-3 sm:gap-4 lg:gap-6">
            {sessions.map((session) => {
              const isLive = isSessionLive(session);

              return (
                <SpeakingSessionCard
                  key={session.id}
                  session={session}
                  isLive={isLive}
                  isUpdating={isUpdating}
                  onStatusUpdate={onStatusUpdate}
                  onOpenGradeDialog={onOpenGradeDialog}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12 text-muted-foreground px-4">
            <div className="p-3 sm:p-4 bg-muted/10 rounded-full w-fit mx-auto mb-4">
              <Video className="h-10 w-10 sm:h-12 sm:w-12 opacity-50" />
            </div>
            <h3 className="font-semibold text-base sm:text-lg mb-2">
              No Sessions Scheduled
            </h3>
            <p className="text-xs sm:text-sm max-w-sm mx-auto">
              No speaking sessions have been scheduled for this exam yet.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
