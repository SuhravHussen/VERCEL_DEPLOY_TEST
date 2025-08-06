"use client";

import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import { RegisteredExams } from "@/components/pages/dashboard/organization/all-exam/exams/registered-exams";

// Loading fallback component
function ExamsPageSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4">
      <div className="space-y-2">
        <Skeleton className="h-6 sm:h-8 w-48 sm:w-64" />
        <Skeleton className="h-3 sm:h-4 w-64 sm:w-96" />
      </div>
      <div className="space-y-3 sm:space-y-4">
        <Skeleton className="h-8 sm:h-10 w-60 sm:w-80" />
        <Card>
          <CardHeader className="space-y-2 sm:space-y-3 p-3 sm:p-6">
            <Skeleton className="h-5 sm:h-6 w-36 sm:w-48" />
            <Skeleton className="h-3 sm:h-4 w-48 sm:w-72" />
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 sm:h-24 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Main page component
export default function ExamsPage() {
  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-0 md:px-2 sm:px-4 py-4 sm:py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-4 sm:mb-8 space-y-3 sm:space-y-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 text-primary">
              <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight  bg-clip-text">
                My Exams
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                View and manage your registered examinations
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Card className="border-0 shadow-sm bg-background/65">
          <CardContent className="p-0 md:p-4 sm:p-6 lg:p-8">
            <Suspense fallback={<ExamsPageSkeleton />}>
              <RegisteredExams />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
