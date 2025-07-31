"use client";

import { EventViewer } from "@/components/ui/event-viewer";
import mockStudentEvents from "@/mockdata/mockStudentEvents";

export default function StudentCalendarPage() {
  return (
    <div className="container mx-auto p-4 lg:p-6 space-y-6">
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
          className="shadow-sm border-0 bg-card"
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="font-semibold text-sm text-muted-foreground mb-2">
            Practice Tests
          </h3>
          <p className="text-2xl font-bold text-blue-600">
            {
              mockStudentEvents.filter(
                (event) => event.category === "Practice Test"
              ).length
            }
          </p>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="font-semibold text-sm text-muted-foreground mb-2">
            Speaking Sessions
          </h3>
          <p className="text-2xl font-bold text-orange-600">
            {
              mockStudentEvents.filter((event) => event.category === "Speaking")
                .length
            }
          </p>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="font-semibold text-sm text-muted-foreground mb-2">
            Writing Workshops
          </h3>
          <p className="text-2xl font-bold text-purple-600">
            {
              mockStudentEvents.filter((event) => event.category === "Writing")
                .length
            }
          </p>
        </div>
      </div>
    </div>
  );
}
