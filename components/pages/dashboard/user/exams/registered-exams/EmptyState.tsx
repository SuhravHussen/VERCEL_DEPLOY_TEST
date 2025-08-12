"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

export function EmptyState() {
  return (
    <Card className="border-dashed">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <CalendarDays className="h-8 w-8 text-muted-foreground" />
        </div>
        <CardTitle className="text-xl">No Registered Exams</CardTitle>
        <CardDescription className="max-w-sm mx-auto">
          You haven&apos;t registered for any exams yet. Browse available exams
          to get started!
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
