"use client";

import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  ClockIcon,
  ListIcon,
  CalendarDaysIcon,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

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

type ViewMode = "calendar" | "list";

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

const dotColors = {
  blue: "bg-blue-500",
  green: "bg-green-500",
  purple: "bg-purple-500",
  orange: "bg-orange-500",
  red: "bg-red-500",
  pink: "bg-pink-500",
  yellow: "bg-yellow-500",
  teal: "bg-teal-500",
};

const EventBadge = React.forwardRef<
  HTMLDivElement,
  {
    event: CalendarEvent;
    compact?: boolean;
    screenSize?: "xs" | "sm" | "md" | "lg";
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
                : "mb-1 text-[10px] sm:text-xs px-1 sm:px-2 py-0.5 sm:py-1",
              screenSize === "xs" && "text-[9px] px-1 py-0.5"
            )}
          >
            {event.time && (
              <ClockIcon
                className={cn(
                  "shrink-0",
                  compact
                    ? "w-2 h-2 sm:w-2.5 sm:h-2.5"
                    : "w-2.5 h-2.5 sm:w-3 sm:h-3",
                  screenSize === "xs" && "w-2 h-2"
                )}
              />
            )}
            <span className="truncate">
              {compact || screenSize === "xs" || screenSize === "sm"
                ? event.title.length > 6
                  ? `${event.title.slice(0, 6)}...`
                  : event.title
                : event.title.length > 15
                ? `${event.title.slice(0, 15)}...`
                : event.title}
            </span>
            {event.time &&
              !compact &&
              screenSize !== "sm" &&
              screenSize !== "xs" && (
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

const EventModal = ({
  isOpen,
  onClose,
  events,
  selectedDate,
}: {
  isOpen: boolean;
  onClose: () => void;
  events: CalendarEvent[];
  selectedDate: Date | null;
}) => {
  if (!selectedDate) return null;

  const dayEvents = events.filter((event) =>
    isSameDay(event.date, selectedDate)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full max-h-[85vh] sm:max-w-md overflow-hidden flex flex-col">
        <DialogHeader className="shrink-0 pb-4">
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            <div className="flex flex-col">
              <span className="font-semibold">
                {format(selectedDate, "EEEE")}
              </span>
              <span className="text-sm text-muted-foreground font-normal">
                {format(selectedDate, "MMMM d, yyyy")}
              </span>
            </div>
          </DialogTitle>
          <DialogDescription className="text-sm">
            {dayEvents.length === 0
              ? "No events scheduled for this day"
              : `${dayEvents.length} event${
                  dayEvents.length !== 1 ? "s" : ""
                } scheduled`}
          </DialogDescription>
        </DialogHeader>

        {dayEvents.length > 0 && (
          <div className="flex-1 space-y-3 overflow-y-auto overscroll-contain">
            {dayEvents.map((event) => (
              <div
                key={event.id}
                className={cn(
                  "p-4 rounded-lg border-l-4 transition-all duration-200 active:scale-[0.98]",
                  event.color === "blue" &&
                    "border-l-blue-500 bg-blue-50 dark:bg-blue-950/30",
                  event.color === "green" &&
                    "border-l-green-500 bg-green-50 dark:bg-green-950/30",
                  event.color === "purple" &&
                    "border-l-purple-500 bg-purple-50 dark:bg-purple-950/30",
                  event.color === "orange" &&
                    "border-l-orange-500 bg-orange-50 dark:bg-orange-950/30",
                  event.color === "red" &&
                    "border-l-red-500 bg-red-50 dark:bg-red-950/30",
                  event.color === "pink" &&
                    "border-l-pink-500 bg-pink-50 dark:bg-pink-950/30",
                  event.color === "yellow" &&
                    "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/30",
                  event.color === "teal" &&
                    "border-l-teal-500 bg-teal-50 dark:bg-teal-950/30"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-sm leading-5">
                    {event.title}
                  </h3>
                  {event.category && (
                    <Badge variant="secondary" className="text-xs shrink-0">
                      {event.category}
                    </Badge>
                  )}
                </div>
                {event.time && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-2">
                    <ClockIcon className="w-3 h-3" />
                    {event.time}
                  </p>
                )}
                {event.description && (
                  <p className="text-sm mt-2 text-muted-foreground leading-5">
                    {event.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Mobile-specific close button */}
        <div className="shrink-0 pt-4 sm:hidden">
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full h-12 text-base"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ListView = ({
  events,
  currentDate,
  onEventClick,
  screenSize,
}: {
  events: CalendarEvent[];
  currentDate: Date;
  onEventClick?: (event: CalendarEvent) => void;
  screenSize: "xs" | "sm" | "md" | "lg";
}) => {
  const currentMonthEvents = events
    .filter((event) => isSameMonth(event.date, currentDate))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  if (currentMonthEvents.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <CalendarIcon className="w-8 h-8 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
        <h3 className="text-base sm:text-lg font-semibold mb-2">
          No events this month
        </h3>
        <p className="text-sm sm:text-base text-muted-foreground">
          There are no events scheduled for {format(currentDate, "MMMM yyyy")}.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      {currentMonthEvents.map((event) => (
        <div
          key={event.id}
          onClick={() => onEventClick?.(event)}
          className={cn(
            "p-3 sm:p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md active:scale-[0.98]",
            screenSize === "xs" || screenSize === "sm"
              ? "hover:scale-[1.01]"
              : "hover:scale-[1.02]",
            eventColors[event.color || "blue"]
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm sm:text-base mb-1 truncate">
                {event.title}
              </h3>
              <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm opacity-80 flex-wrap">
                <span className="flex items-center gap-1 shrink-0">
                  <CalendarIcon className="w-3 h-3" />
                  {screenSize === "xs"
                    ? format(event.date, "MMM d")
                    : format(event.date, "MMM d, yyyy")}
                </span>
                {event.time && (
                  <span className="flex items-center gap-1 shrink-0">
                    <ClockIcon className="w-3 h-3" />
                    {event.time}
                  </span>
                )}
              </div>
              {event.description &&
                (screenSize === "md" || screenSize === "lg") && (
                  <p className="text-xs sm:text-sm mt-2 opacity-70 line-clamp-2">
                    {event.description}
                  </p>
                )}
            </div>
            {event.category && (
              <Badge variant="secondary" className="text-xs shrink-0">
                {screenSize === "xs" && event.category.length > 8
                  ? `${event.category.slice(0, 8)}...`
                  : event.category}
              </Badge>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

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
            <Skeleton className="h-8 w-20 sm:h-8 sm:w-24" />
            <Skeleton className="h-8 w-20 sm:h-8 sm:w-24" />
          </div>
        </div>
        <Skeleton className="h-4 w-32 mt-1" />
      </CardHeader>

      <CardContent className="p-2 sm:p-4">
        {/* Week days header */}
        <div className="grid grid-cols-7 border-b mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-muted-foreground border-r last:border-r-0 bg-muted/30"
            >
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day.slice(0, 1)}</span>
            </div>
          ))}
        </div>

        {/* Calendar grid skeleton */}
        <div className="grid grid-cols-7 gap-px bg-border rounded-md overflow-hidden">
          {calendarDays.map((_, index) => (
            <div
              key={index}
              className={cn(
                "min-h-[50px] sm:min-h-[70px] md:min-h-[90px] lg:min-h-[110px] p-1 sm:p-2 bg-background",
                compact && "min-h-[40px] sm:min-h-[55px] md:min-h-[70px]"
              )}
            >
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-1">
                  <Skeleton className="w-4 h-4 sm:w-5 sm:h-5 rounded-full" />
                  {Math.random() > 0.6 && (
                    <Skeleton className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  {Math.random() > 0.7 && (
                    <Skeleton className="h-4 sm:h-5 rounded-md" />
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
  const [screenSize, setScreenSize] = React.useState<"xs" | "sm" | "md" | "lg">(
    "lg"
  );
  const [expandedDays, setExpandedDays] = React.useState<Set<string>>(
    new Set()
  );
  const [viewMode, setViewMode] = React.useState<ViewMode>("calendar");
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        if (window.innerWidth < 480) {
          setScreenSize("xs");
        } else if (window.innerWidth < 640) {
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
    if (screenSize === "xs" || screenSize === "sm") return 0; // Show dots only on small screens
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

  const getEventsForCurrentMonth = () => {
    return events.filter((event) => isSameMonth(event.date, currentDate));
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

  const handleDateClick = (date: Date) => {
    if (
      (screenSize === "xs" || screenSize === "sm") &&
      viewMode === "calendar"
    ) {
      // On small screens in calendar view, open modal
      setSelectedDate(date);
      setModalOpen(true);
    } else {
      // Regular date click behavior
      onDateClick?.(date);
    }
  };

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <>
      <Card className={cn("w-full", className)}>
        {loading ? (
          <CalendarSkeleton compact={compact} />
        ) : (
          <>
            <CardHeader className="pb-2 sm:pb-4 px-3 sm:px-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">
                    {format(currentDate, "MMMM yyyy")}
                  </span>
                  <span className="sm:hidden">
                    {format(currentDate, "MMM yyyy")}
                  </span>
                </CardTitle>

                <div className="flex items-center justify-between gap-2">
                  {/* View Mode Toggle */}
                  <div className="flex items-center gap-0.5 p-0.5 bg-muted rounded-lg">
                    <Button
                      variant={viewMode === "calendar" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("calendar")}
                      className="h-8 px-2 text-xs sm:h-9 sm:px-3 sm:text-sm"
                    >
                      <CalendarDaysIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      {screenSize === "xs" ? "Cal" : "Calendar"}
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="h-8 px-2 text-xs sm:h-9 sm:px-3 sm:text-sm"
                    >
                      <ListIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      List
                    </Button>
                  </div>

                  {/* Navigation Controls */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigateMonth("prev")}
                      className="h-8 w-8 sm:h-9 sm:w-9"
                    >
                      <ChevronLeftIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentDate(new Date())}
                      className="h-8 px-2 text-xs sm:h-9 sm:px-3 sm:text-sm whitespace-nowrap"
                    >
                      Today
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigateMonth("next")}
                      className="h-8 w-8 sm:h-9 sm:w-9"
                    >
                      <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              {showEventCount &&
                (() => {
                  const currentMonthEvents = getEventsForCurrentMonth();
                  return (
                    currentMonthEvents.length > 0 && (
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {currentMonthEvents.length} event
                        {currentMonthEvents.length !== 1 ? "s" : ""} this month
                      </p>
                    )
                  );
                })()}
            </CardHeader>

            <CardContent className="p-2 sm:p-4">
              {viewMode === "list" ? (
                <ListView
                  events={events}
                  currentDate={currentDate}
                  onEventClick={onEventClick}
                  screenSize={screenSize}
                />
              ) : (
                <div>
                  {/* Week days header */}
                  <div className="grid grid-cols-7 border-b mb-2">
                    {weekDays.map((day) => (
                      <div
                        key={day}
                        className="p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-muted-foreground border-r last:border-r-0 bg-muted/30"
                      >
                        <span className="hidden sm:inline">{day}</span>
                        <span className="sm:hidden">{day.slice(0, 1)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Calendar grid with improved mobile spacing */}
                  <div className="grid grid-cols-7 gap-px bg-border rounded-md overflow-hidden">
                    {calendarDays.map((day, index) => {
                      const dayEvents = getEventsForDate(day);
                      const isCurrentMonth = isSameMonth(day, currentDate);
                      const isCurrentDay = isToday(day);
                      const hasEvents = dayEvents.length > 0;
                      const isExpanded = isDayExpanded(day);
                      const eventsToShow = isExpanded
                        ? dayEvents.length
                        : maxEvents;

                      return (
                        <div
                          key={index}
                          onClick={() => handleDateClick(day)}
                          className={cn(
                            "min-h-[50px] sm:min-h-[70px] md:min-h-[90px] lg:min-h-[110px] p-1 sm:p-2 transition-all duration-200 bg-background",
                            "hover:bg-muted/50 cursor-pointer active:bg-muted/70",
                            !isCurrentMonth && "bg-muted/20",
                            compact &&
                              "min-h-[40px] sm:min-h-[55px] md:min-h-[70px]",
                            screenSize === "xs" &&
                              "min-h-[45px] touch-manipulation"
                          )}
                        >
                          <div className="h-full flex flex-col">
                            <div className="flex items-center justify-between mb-1">
                              <span
                                className={cn(
                                  "text-xs sm:text-sm font-medium flex items-center justify-center min-w-[1.5rem] h-6 sm:min-w-[1.75rem] sm:h-7 rounded-full transition-colors",
                                  isCurrentDay &&
                                    "bg-primary text-primary-foreground",
                                  !isCurrentMonth &&
                                    !isCurrentDay &&
                                    "text-muted-foreground",
                                  compact && "text-[10px] min-w-[1.25rem] h-5"
                                )}
                              >
                                {format(day, "d")}
                              </span>
                              {/* Enhanced dots display for mobile */}
                              {hasEvents && (
                                <div className="flex items-center gap-0.5 flex-wrap max-w-[50%]">
                                  {screenSize === "xs" ||
                                  screenSize === "sm" ? (
                                    // Enhanced dot display for small screens
                                    <>
                                      {dayEvents
                                        .slice(0, screenSize === "xs" ? 2 : 3)
                                        .map((event, eventIndex) => (
                                          <div
                                            key={eventIndex}
                                            className={cn(
                                              "w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shadow-sm",
                                              dotColors[event.color || "blue"]
                                            )}
                                          />
                                        ))}
                                      {dayEvents.length >
                                        (screenSize === "xs" ? 2 : 3) && (
                                        <span className="text-[8px] sm:text-[10px] text-muted-foreground font-medium">
                                          +
                                          {dayEvents.length -
                                            (screenSize === "xs" ? 2 : 3)}
                                        </span>
                                      )}
                                    </>
                                  ) : (
                                    // Single indicator dot for larger screens
                                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-primary shadow-sm" />
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Show events only on larger screens */}
                            {screenSize !== "xs" && screenSize !== "sm" && (
                              <div className="flex-1 space-y-0.5 sm:space-y-1 overflow-hidden">
                                {dayEvents
                                  .slice(0, eventsToShow)
                                  .map((event) => (
                                    <EventBadge
                                      key={event.id}
                                      event={event}
                                      compact={compact}
                                      screenSize={screenSize}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onEventClick?.(event);
                                      }}
                                    />
                                  ))}

                                {!isExpanded &&
                                  dayEvents.length > maxEvents && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleDayExpansion(day);
                                      }}
                                      className="text-[10px] sm:text-xs text-primary hover:text-primary/80 font-medium cursor-pointer transition-colors text-left"
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
                                    className="text-[10px] sm:text-xs text-primary hover:text-primary/80 font-medium cursor-pointer transition-colors text-left"
                                  >
                                    show less
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </>
        )}
      </Card>

      {/* Enhanced Event Details Modal */}
      <EventModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        events={events}
        selectedDate={selectedDate}
      />
    </>
  );
}

export default EventViewer;
