"use client";

import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  ClockIcon,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
} from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time?: string;
  description?: string;
  color?:
    | "blue"
    | "green"
    | "purple"
    | "orange"
    | "red"
    | "pink"
    | "yellow"
    | "teal";
  category?: string;
}

interface EventViewerProps {
  events?: CalendarEvent[];
  className?: string;
  onEventClick?: (event: CalendarEvent) => void;
  onDateClick?: (date: Date) => void;
  showEventCount?: boolean;
  compact?: boolean;
  loading?: boolean;
}

const eventColors = {
  blue: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  green:
    "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
  purple:
    "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
  orange:
    "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
  red: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
  pink: "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-800",
  yellow:
    "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800",
  teal: "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800",
};

const EventBadge = React.forwardRef<
  HTMLDivElement,
  {
    event: CalendarEvent;
    compact?: boolean;
    screenSize?: "sm" | "md" | "lg";
    onClick?: (event: React.MouseEvent) => void;
  }
>(({ event, compact = false, screenSize = "lg", onClick }, ref) => {
  const colorClass = eventColors[event.color || "blue"];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            ref={ref}
            onClick={onClick}
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-sm border",
              colorClass,
              compact
                ? "text-[10px] px-1.5 py-0.5"
                : "mb-1 text-[10px] sm:text-xs px-1 sm:px-2 py-0.5 sm:py-1"
            )}
          >
            {event.time && (
              <ClockIcon
                className={cn(
                  "shrink-0",
                  compact
                    ? "w-2 h-2 sm:w-2.5 sm:h-2.5"
                    : "w-2.5 h-2.5 sm:w-3 sm:h-3"
                )}
              />
            )}
            <span className="truncate">
              {compact || screenSize === "sm"
                ? event.title.length > 8
                  ? `${event.title.slice(0, 8)}...`
                  : event.title
                : event.title.length > 15
                ? `${event.title.slice(0, 15)}...`
                : event.title}
            </span>
            {event.time && !compact && screenSize !== "sm" && (
              <span className="text-[8px] sm:text-[10px] opacity-75 ml-auto">
                {event.time}
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-1">
            <p className="font-medium">{event.title}</p>
            {event.time && (
              <p className="text-sm flex items-center gap-1">
                <ClockIcon className="w-3 h-3" />
                {event.time}
              </p>
            )}
            {event.description && (
              <p className="text-sm opacity-80">{event.description}</p>
            )}
            {event.category && (
              <p className="text-xs opacity-70">Category: {event.category}</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

EventBadge.displayName = "EventBadge";

const CalendarSkeleton = ({ compact = false }: { compact?: boolean }) => {
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const calendarDays = Array.from({ length: 35 }, (_, i) => i); // 5 weeks

  return (
    <>
      {/* Header Skeleton */}
      <CardHeader className="pb-2 sm:pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 sm:w-5 sm:h-5" />
            <Skeleton className="h-5 w-24 sm:w-32" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-7 w-7 sm:h-8 sm:w-8" />
            <Skeleton className="h-7 w-12 sm:h-8 sm:w-16" />
            <Skeleton className="h-7 w-7 sm:h-8 sm:w-8" />
          </div>
        </div>
        <Skeleton className="h-4 w-32 mt-1" />
      </CardHeader>

      <CardContent className="p-0">
        {/* Week days header */}
        <div className="grid grid-cols-7 border-b">
          {weekDays.map((day) => (
            <div
              key={day}
              className="p-1.5 sm:p-3 text-center text-xs sm:text-sm font-medium text-muted-foreground border-r last:border-r-0 bg-muted/30"
            >
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day.slice(0, 1)}</span>
            </div>
          ))}
        </div>

        {/* Calendar grid skeleton */}
        <div className="grid grid-cols-7">
          {calendarDays.map((_, index) => (
            <div
              key={index}
              className={cn(
                "min-h-[60px] sm:min-h-[80px] md:min-h-[100px] lg:min-h-[120px] p-1 sm:p-1.5 md:p-2 border-r border-b last:border-r-0",
                compact && "min-h-[50px] sm:min-h-[60px] md:min-h-[80px] p-1"
              )}
            >
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                  <Skeleton className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full" />
                  {/* Randomly show event indicators */}
                  {Math.random() > 0.6 && (
                    <Skeleton
                      className={cn(
                        "w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full",
                        compact && "w-1 h-1 sm:w-1.5 sm:h-1.5"
                      )}
                    />
                  )}
                </div>
                <div className="flex-1 space-y-0.5 sm:space-y-1">
                  {/* Randomly show event skeletons */}
                  {Math.random() > 0.7 && (
                    <Skeleton
                      className={cn(
                        "h-5 rounded-md",
                        compact ? "h-4" : "h-5 sm:h-6"
                      )}
                    />
                  )}
                  {Math.random() > 0.8 && (
                    <Skeleton
                      className={cn(
                        "h-5 rounded-md w-3/4",
                        compact ? "h-4" : "h-5 sm:h-6"
                      )}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </>
  );
};

export function EventViewer({
  events = [],
  className,
  onEventClick,
  onDateClick,
  showEventCount = true,
  compact = false,
  loading = false,
}: EventViewerProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [screenSize, setScreenSize] = React.useState<"sm" | "md" | "lg">("lg");
  const [expandedDays, setExpandedDays] = React.useState<Set<string>>(
    new Set()
  );

  React.useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        if (window.innerWidth < 640) {
          setScreenSize("sm");
        } else if (window.innerWidth < 768) {
          setScreenSize("md");
        } else {
          setScreenSize("lg");
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getMaxEventsForScreen = () => {
    if (compact) return 1;
    if (screenSize === "sm") return 1;
    if (screenSize === "md") return 2;
    return 3;
  };

  const maxEvents = getMaxEventsForScreen();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => isSameDay(event.date, date));
  };

  const getDayKey = (date: Date) => {
    return format(date, "yyyy-MM-dd");
  };

  const toggleDayExpansion = (date: Date) => {
    const dayKey = getDayKey(date);
    setExpandedDays((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dayKey)) {
        newSet.delete(dayKey);
      } else {
        newSet.add(dayKey);
      }
      return newSet;
    });
  };

  const isDayExpanded = (date: Date) => {
    return expandedDays.has(getDayKey(date));
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate(
      direction === "prev"
        ? subMonths(currentDate, 1)
        : addMonths(currentDate, 1)
    );
    // Clear expanded days when navigating months
    setExpandedDays(new Set());
  };

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <Card className={cn("w-full", className)}>
      {loading ? (
        <CalendarSkeleton compact={compact} />
      ) : (
        <>
          <CardHeader className="pb-2 sm:pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">
                  {format(currentDate, "MMMM yyyy")}
                </span>
                <span className="sm:hidden">
                  {format(currentDate, "MMM yyyy")}
                </span>
              </CardTitle>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigateMonth("prev")}
                  className="h-7 w-7 sm:h-8 sm:w-8"
                >
                  <ChevronLeftIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentDate(new Date())}
                  className="h-7 px-2 text-xs sm:h-8 sm:px-3 sm:text-sm"
                >
                  Today
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigateMonth("next")}
                  className="h-7 w-7 sm:h-8 sm:w-8"
                >
                  <ChevronRightIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
            {showEventCount && events.length > 0 && (
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {events.length} event{events.length !== 1 ? "s" : ""} this month
              </p>
            )}
          </CardHeader>

          <CardContent className="p-0">
            <div className="grid grid-cols-7 border-b">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="p-1.5 sm:p-3 text-center text-xs sm:text-sm font-medium text-muted-foreground border-r last:border-r-0 bg-muted/30"
                >
                  <span className="hidden sm:inline">{day}</span>
                  <span className="sm:hidden">{day.slice(0, 1)}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {calendarDays.map((day, index) => {
                const dayEvents = getEventsForDate(day);
                const isCurrentMonth = isSameMonth(day, currentDate);
                const isCurrentDay = isToday(day);
                const hasEvents = dayEvents.length > 0;
                const isExpanded = isDayExpanded(day);
                const eventsToShow = isExpanded ? dayEvents.length : maxEvents;

                return (
                  <div
                    key={index}
                    onClick={() => onDateClick?.(day)}
                    className={cn(
                      "min-h-[60px] sm:min-h-[80px] md:min-h-[100px] lg:min-h-[120px] p-1 sm:p-1.5 md:p-2 border-r border-b last:border-r-0 transition-colors duration-200",
                      "hover:bg-muted/50 cursor-pointer",
                      !isCurrentMonth && "bg-muted/20",
                      compact &&
                        "min-h-[50px] sm:min-h-[60px] md:min-h-[80px] p-1"
                    )}
                  >
                    <div className="h-full flex flex-col">
                      <div className="flex items-center justify-between mb-1 sm:mb-2">
                        <span
                          className={cn(
                            "text-xs sm:text-sm font-medium flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full transition-colors",
                            isCurrentDay &&
                              "bg-primary text-primary-foreground",
                            !isCurrentMonth &&
                              !isCurrentDay &&
                              "text-muted-foreground",
                            compact &&
                              "text-[10px] sm:text-xs w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5"
                          )}
                        >
                          {format(day, "d")}
                        </span>
                        {hasEvents && (
                          <div
                            className={cn(
                              "w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary",
                              compact && "w-1 h-1 sm:w-1.5 sm:h-1.5"
                            )}
                          />
                        )}
                      </div>

                      <div className="flex-1 space-y-0.5 sm:space-y-1 overflow-hidden">
                        {dayEvents.slice(0, eventsToShow).map((event) => (
                          <EventBadge
                            key={event.id}
                            event={event}
                            compact={compact || screenSize === "sm"}
                            screenSize={screenSize}
                            onClick={(e) => {
                              e.stopPropagation();
                              onEventClick?.(event);
                            }}
                          />
                        ))}

                        {!isExpanded && dayEvents.length > maxEvents && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDayExpansion(day);
                            }}
                            className={cn(
                              "text-[10px] sm:text-xs text-primary hover:text-primary/80 font-medium cursor-pointer transition-colors text-left",
                              compact && "text-[8px] sm:text-[10px]"
                            )}
                          >
                            +{dayEvents.length - maxEvents} more
                          </button>
                        )}

                        {isExpanded && dayEvents.length > maxEvents && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDayExpansion(day);
                            }}
                            className={cn(
                              "text-[10px] sm:text-xs text-primary hover:text-primary/80 font-medium cursor-pointer transition-colors text-left",
                              compact && "text-[8px] sm:text-[10px]"
                            )}
                          >
                            show less
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
}

export default EventViewer;
