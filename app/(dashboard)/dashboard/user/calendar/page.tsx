"use client";

import { EventViewer } from "@/components/ui/event-viewer";
import mockStudentEvents from "@/mockdata/mockStudentEvents";

export default function StudentCalendarPage() {
  return (
    <div className="container mx-auto p-0 lg:p-6 space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
          My Calendar
        </h1>
        <p className="text-muted-foreground">
          Track your IELTS preparation schedule, practice sessions, and upcoming
          exams
        </p>
      </div>

      {/* Calendar Component */}
      <div className="w-full">
        <EventViewer
          events={mockStudentEvents}
          showEventCount={true}
          onEventClick={(event) => {
            console.log("Event clicked:", event);
            // TODO: Implement event details modal or navigation
          }}
          onDateClick={(date) => {
            console.log("Date clicked:", date);
            // TODO: Implement date selection or add event functionality
          }}
          onMonthChange={(date) => {
            console.log("Month changed:", date);
            // TODO: Implement month change functionality
          }}
          className="shadow-sm border-0 bg-card"
        />
      </div>
    </div>
  );
}
