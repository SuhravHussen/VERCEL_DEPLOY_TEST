import {
  Calendar,
  CalendarDays,
  Clock,
  Users,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TimeWindow } from "@/types/exam/exam";

interface TimeWindowsListProps {
  timeWindows: TimeWindow[] | undefined;
}

export function TimeWindowsList({ timeWindows }: TimeWindowsListProps) {
  const formatTimeWindow = (timeWindow: TimeWindow) => {
    const date = new Date(timeWindow.date);

    // Time windows use simple time strings like "13:00", create UTC strings
    const startUtcString = `${timeWindow.date}T${timeWindow.start_time}:00.000Z`;
    const endUtcString = `${timeWindow.date}T${timeWindow.end_time}:00.000Z`;

    const startDate = new Date(startUtcString);
    const endDate = new Date(endUtcString);

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };

    const startTime = startDate.toLocaleTimeString("en-US", timeOptions);
    const endTime = endDate.toLocaleTimeString("en-US", timeOptions);

    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      timeRange: `${startTime} - ${endTime}`,
      startTime,
      endTime,
    };
  };

  // Header Section
  const header = (
    <div className="text-center space-y-2">
      <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="p-2 sm:p-3 bg-gradient-to-br from-primary/20 to-primary/30 rounded-lg sm:rounded-xl">
          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-primary" />
        </div>
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
          Your Assigned Time Slots
        </h2>
      </div>
      <p className="text-xs sm:text-sm lg:text-base text-muted-foreground max-w-2xl mx-auto px-4 my-3">
        These are the scheduled time periods when you&apos;re available to
        conduct speaking sessions for this exam
      </p>
    </div>
  );

  if (!timeWindows || timeWindows.length === 0) {
    return (
      <div className="space-y-4 sm:space-y-6">
        {header}
        <Card className="border-dashed border-2">
          <CardContent className="text-center py-12 sm:py-16 px-4">
            <div className="space-y-4 sm:space-y-6">
              <div className="relative">
                <div className="p-4 sm:p-6 bg-muted/10 rounded-full w-fit mx-auto">
                  <Calendar className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground/50" />
                </div>
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 p-1.5 sm:p-2 bg-orange-500/10 rounded-full">
                  <AlertCircle className="h-4 w-4 sm:h-6 sm:w-6 text-orange-500" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-semibold text-foreground">
                  No Time Slots Assigned
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
                  You haven&apos;t been assigned any time windows for this exam
                  yet. Please contact your administrator to get scheduled.
                </p>
              </div>

              <Button variant="outline" size="sm" className="mt-4">
                <Users className="h-4 w-4 mr-2" />
                Contact Administrator
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {header}
      <div className="grid gap-4 sm:gap-6 lg:gap-8">
        {timeWindows.map((timeWindow, index) => {
          const formatted = formatTimeWindow(timeWindow);
          const dayOfWeek = new Date(timeWindow.date).toLocaleDateString(
            "en-US",
            {
              weekday: "long",
            }
          );

          return (
            <Card
              key={timeWindow.id || index}
              className="group relative overflow-hidden bg-gradient-to-br from-card via-card/95 to-muted/20 border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <CardContent className="relative p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
                  {/* Date and Time Section */}
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="p-2 sm:p-3 bg-primary/10 rounded-lg sm:rounded-xl group-hover:bg-primary/20 transition-colors">
                        <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-foreground">
                          {dayOfWeek}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {formatted.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 pl-10 sm:pl-14 lg:pl-16">
                      <div className="p-1.5 sm:p-2 bg-blue-500/10 rounded-lg">
                        <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm sm:text-base font-semibold text-foreground">
                          {formatted.timeRange}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Available for sessions
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-2 p-2 sm:p-3 bg-green-500/10 rounded-lg sm:rounded-xl border border-green-500/20">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-xs sm:text-sm font-medium text-green-700 dark:text-green-400">
                        Active Schedule
                      </span>
                    </div>

                    <div className="text-left sm:text-center lg:text-center">
                      <p className="text-xs text-muted-foreground">
                        Duration:{" "}
                        {(() => {
                          // Use the same UTC pattern as formatTimeWindow
                          const startUtcString = `${timeWindow.date}T${timeWindow.start_time}:00.000Z`;
                          const endUtcString = `${timeWindow.date}T${timeWindow.end_time}:00.000Z`;

                          const start = new Date(startUtcString);
                          const end = new Date(endUtcString);

                          const diffMs = end.getTime() - start.getTime();
                          const hours = Math.floor(diffMs / (1000 * 60 * 60));
                          const minutes = Math.floor(
                            (diffMs % (1000 * 60 * 60)) / (1000 * 60)
                          );

                          return `${hours}h ${minutes}m`;
                        })()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-border/30">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                    <span>
                      Time Zone:{" "}
                      {Intl.DateTimeFormat().resolvedOptions().timeZone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Available for speaking sessions
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
