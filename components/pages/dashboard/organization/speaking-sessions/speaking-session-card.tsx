import {
  Calendar,
  Clock,
  Video,
  CheckCircle,
  XCircle,
  UserIcon,
  Radio,
  GraduationCap,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SpeakingSession } from "@/types/exam/speaking-session";

interface SpeakingSessionCardProps {
  session: SpeakingSession;
  isLive: boolean;
  isUpdating: boolean;
  onStatusUpdate: (
    sessionId: string,
    status: "cancelled" | "completed"
  ) => Promise<void>;
  onOpenGradeDialog: (session: SpeakingSession) => void;
}

export function SpeakingSessionCard({
  session,
  isLive,
  isUpdating,
  onStatusUpdate,
  onOpenGradeDialog,
}: SpeakingSessionCardProps) {
  const getStatusIcon = (
    status: SpeakingSession["status"],
    isLive: boolean = false
  ) => {
    if (isLive) {
      return <Radio className="h-4 w-4 text-red-500 animate-pulse" />;
    }

    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "scheduled":
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusBadge = (
    status: SpeakingSession["status"],
    isLive: boolean = false
  ) => {
    if (isLive) {
      return (
        <div className="flex gap-2">
          <Badge className="bg-red-500 hover:bg-red-600 text-white animate-pulse shadow-lg">
            <Radio className="h-3 w-3 mr-1" />
            LIVE
          </Badge>
          <Badge className="bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400 hover:bg-blue-500/20">
            Scheduled
          </Badge>
        </div>
      );
    }

    const statusConfig = {
      scheduled: {
        variant: "default" as const,
        className:
          "bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400 hover:bg-blue-500/20",
        label: "Scheduled",
      },
      completed: {
        variant: "outline" as const,
        className:
          "bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400 hover:bg-green-500/20",
        label: "Completed",
      },
      cancelled: {
        variant: "outline" as const,
        className:
          "bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400 hover:bg-red-500/20",
        label: "Cancelled",
      },
    };

    const config = statusConfig[status] || statusConfig.scheduled;

    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const formatDateTime = (dateStr: string, timeStr: string) => {
    const date = new Date(dateStr);
    const time = new Date(timeStr);

    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: time.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const formatted = formatDateTime(session.date, session.start_time);
  const endFormatted = formatDateTime(session.date, session.end_time);

  return (
    <div
      className={`group p-3 sm:p-4 lg:p-6 border rounded-lg sm:rounded-xl transition-all duration-200 hover:shadow-lg ${
        isLive
          ? "border-red-500/50 bg-gradient-to-r from-red-50 to-red-100/50 dark:from-red-950/20 dark:to-red-900/20 shadow-red-500/10"
          : "border-border/50 bg-gradient-to-r from-background to-muted/20 hover:from-muted/20 hover:to-muted/40"
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3 sm:gap-4">
        <div className="space-y-3 flex-1">
          <div className="flex flex-col gap-2 sm:gap-3">
            <div className="flex items-start gap-2">
              {getStatusIcon(session.status, isLive)}
              <div className="space-y-1 flex-1">
                <div className="text-sm sm:text-base font-semibold text-foreground flex items-center gap-2">
                  <UserIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  {session.student?.name || `Student ID: ${session.student_id}`}
                </div>
                {session.instructor && (
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Instructor: {session.instructor.name}
                  </div>
                )}
              </div>
              <div className="sm:hidden">
                {getStatusBadge(session.status, isLive)}
              </div>
            </div>
            <div className="hidden sm:flex">
              {getStatusBadge(session.status, isLive)}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{formatted.date}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>
                {formatted.time} - {endFormatted.time}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 lg:min-w-0 lg:flex-shrink-0">
          {session.status === "scheduled" && (
            <>
              <Button
                size="sm"
                asChild
                className={`w-full lg:w-auto text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all duration-200 ${
                  isLive
                    ? "bg-red-600 hover:bg-red-700 text-white animate-pulse"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                <a
                  href={session.meeting_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 sm:gap-2"
                >
                  <Video className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="truncate">
                    {isLive ? "Join Live Session" : "Join Meeting"}
                  </span>
                </a>
              </Button>

              <div className="grid grid-cols-3 gap-1.5 sm:gap-2 lg:flex lg:flex-col">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onStatusUpdate(session.id!, "completed")}
                  disabled={isUpdating}
                  className="text-xs bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400 hover:bg-green-500/20"
                >
                  {isUpdating ? (
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 lg:mr-2" />
                      <span className="hidden lg:inline">Complete</span>
                    </>
                  )}
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onStatusUpdate(session.id!, "cancelled")}
                  disabled={isUpdating}
                  className="text-xs bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400 hover:bg-red-500/20"
                >
                  {isUpdating ? (
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                  ) : (
                    <>
                      <XCircle className="h-3 w-3 sm:h-4 sm:w-4 lg:mr-2" />
                      <span className="hidden lg:inline">Cancel</span>
                    </>
                  )}
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onOpenGradeDialog(session)}
                  className="text-xs bg-primary/10 border-primary/20 text-primary hover:bg-primary/20"
                >
                  <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 lg:mr-2" />
                  <span className="hidden lg:inline">Grade</span>
                </Button>
              </div>
            </>
          )}

          {session.status === "completed" && (
            <div className="flex flex-col gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled
                className="text-xs sm:text-sm bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400"
              >
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Completed
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => onOpenGradeDialog(session)}
                className="text-xs sm:text-sm bg-primary/10 border-primary/20 text-primary hover:bg-primary/20"
              >
                <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Grade
              </Button>
            </div>
          )}

          {session.status === "cancelled" && (
            <Button
              size="sm"
              variant="outline"
              disabled
              className="text-xs sm:text-sm bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400"
            >
              <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Cancelled
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
