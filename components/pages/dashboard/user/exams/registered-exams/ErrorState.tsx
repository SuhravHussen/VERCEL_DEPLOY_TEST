"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export function ErrorState() {
  return (
    <Card className="border-dashed border-red-200 dark:border-red-800">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/20">
          <AlertCircle className="h-8 w-8 text-red-500 dark:text-red-400" />
        </div>
        <CardTitle className="text-xl text-red-700 dark:text-red-300">
          Error Loading Exams
        </CardTitle>
        <CardDescription className="max-w-sm mx-auto text-red-600 dark:text-red-400">
          Unable to load your registered exams. Please try again later.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
