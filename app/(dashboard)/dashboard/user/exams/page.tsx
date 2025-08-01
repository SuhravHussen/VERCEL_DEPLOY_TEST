"use client";

import { Suspense } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BookOpen, FileText, GraduationCap } from "lucide-react";
import { RegisteredExams } from "@/components/pages/dashboard/organization/all-exam/exams/registered-exams";
import { BookExams } from "@/components/pages/dashboard/organization/all-exam/exams/book-exams";

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

// Tab content wrapper with enhanced error boundaries
function TabContentWrapper({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <Suspense fallback={fallback || <ExamsPageSkeleton />}>{children}</Suspense>
  );
}

// Main page component
export default function ExamsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-4 sm:mb-8 space-y-3 sm:space-y-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 text-primary">
              <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                Examination Center
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Manage your examinations and discover new opportunities
              </p>
            </div>
          </div>

          {/* Quick Stats - Placeholder */}
          <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="p-1.5 sm:p-2 bg-blue-500/10 rounded-lg">
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-lg sm:text-2xl font-bold text-blue-900 dark:text-blue-100">
                      --
                    </p>
                    <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
                      Registered
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="p-1.5 sm:p-2 bg-green-500/10 rounded-lg">
                    <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-lg sm:text-2xl font-bold text-green-900 dark:text-green-100">
                      --
                    </p>
                    <p className="text-xs sm:text-sm text-green-700 dark:text-green-300">
                      Available
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="p-1.5 sm:p-2 bg-purple-500/10 rounded-lg">
                    <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-lg sm:text-2xl font-bold text-purple-900 dark:text-purple-100">
                      --
                    </p>
                    <p className="text-xs sm:text-sm text-purple-700 dark:text-purple-300">
                      Completed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border-orange-200 dark:border-orange-800">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="p-1.5 sm:p-2 bg-orange-500/10 rounded-lg">
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-lg sm:text-2xl font-bold text-orange-900 dark:text-orange-100">
                      --
                    </p>
                    <p className="text-xs sm:text-sm text-orange-700 dark:text-orange-300">
                      Upcoming
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content with Tabs */}
        <Card className="border-0 shadow-xl bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
          <CardContent className="p-1 sm:p-2">
            <Tabs defaultValue="registered" className="w-full">
              <TabsList className="my-2 sm:my-4 w-full grid grid-cols-2 h-auto">
                <TabsTrigger
                  value="registered"
                  className="flex-col sm:flex-row py-2 sm:py-1.5 text-xs sm:text-sm"
                >
                  <FileText className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2 mb-1 sm:mb-0" />
                  <span className="hidden sm:inline">Registered Exams</span>
                  <span className="sm:hidden text-[10px] leading-tight">
                    Registered
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="book"
                  className="flex-col sm:flex-row py-2 sm:py-1.5 text-xs sm:text-sm"
                >
                  <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2 mb-1 sm:mb-0" />
                  <span className="hidden sm:inline">Book Exam</span>
                  <span className="sm:hidden text-[10px] leading-tight">
                    Book New
                  </span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="registered" className="mt-0 px-1 sm:px-4">
                <TabContentWrapper>
                  <RegisteredExams />
                </TabContentWrapper>
              </TabsContent>

              <TabsContent value="book" className="mt-0 px-1 sm:px-4">
                <TabContentWrapper>
                  <BookExams />
                </TabContentWrapper>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
