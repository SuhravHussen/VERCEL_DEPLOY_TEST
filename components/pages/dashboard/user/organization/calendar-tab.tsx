"use client";

import EventViewer, { CalendarEvent } from "@/components/ui/event-viewer";
import { Calendar } from "lucide-react";

interface CalendarTabProps {
  organizationId: string;
}

export function CalendarTab({ organizationId }: CalendarTabProps) {
  // TODO: Use organizationId when implementing actual calendar functionality
  void organizationId;

  // Mock events for demonstration purposes
  const mockEvents: CalendarEvent[] = [
    {
      id: "1",
      title: "Team Standup",
      date: new Date(new Date().setHours(9, 0, 0, 0)),
      time: "09:00 AM",
      description: "Daily team standup meeting",
      color: "blue",
      category: "Meeting",
    },
    {
      id: "2",
      title: "Product Demo",
      date: new Date(new Date().setDate(new Date().getDate() + 1)),
      time: "02:00 PM",
      description: "Demo new features to stakeholders",
      color: "green",
      category: "Demo",
    },
    {
      id: "3",
      title: "Sprint Planning",
      date: new Date(new Date().setDate(new Date().getDate() + 2)),
      time: "11:00 AM",
      description: "Plan tasks for the next sprint",
      color: "purple",
      category: "Planning",
    },
    {
      id: "4",
      title: "1:1 with Manager",
      date: new Date(new Date().setDate(new Date().getDate() + 3)),
      time: "03:30 PM",
      description: "Monthly check-in with manager",
      color: "orange",
      category: "Meeting",
    },
    {
      id: "5",
      title: "Release Day",
      date: new Date(new Date().setDate(new Date().getDate() + 5)),
      description: "Release v2.0 to production",
      color: "red",
      category: "Release",
    },
    {
      id: "6",
      title: "Team Lunch",
      date: new Date(new Date().setDate(new Date().getDate() + 7)),
      time: "12:00 PM",
      description: "Team building lunch at local restaurant",
      color: "yellow",
      category: "Social",
    },
    {
      id: "7",
      title: "Retrospective",
      date: new Date(new Date().setDate(new Date().getDate() + 8)),
      time: "04:00 PM",
      description: "Sprint retrospective meeting",
      color: "teal",
      category: "Meeting",
    },
    {
      id: "8",
      title: "Team Building",
      date: new Date(new Date().setDate(new Date().getDate() + 8)),
      time: "04:00 PM",
      description: "Team building event at the local park",
      color: "teal",
      category: "Meeting",
    },
    {
      id: "9",
      title: "Retrospective",
      date: new Date(new Date().setDate(new Date().getDate() + 8)),
      time: "04:00 PM",
      description: "Sprint retrospective meeting",
      color: "teal",
      category: "Meeting",
    },
    {
      id: "10",
      title: "Team Building",
      date: new Date(new Date().setDate(new Date().getDate() + 8)),
      time: "04:00 PM",
      description: "Team building event at the local park",
      color: "teal",
      category: "Meeting",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
          <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">Calendar View</h3>
          <p className="text-sm text-muted-foreground">
            View organization events and schedules
          </p>
        </div>
      </div>
      <EventViewer events={mockEvents} loading={false} />
    </div>
  );
}
