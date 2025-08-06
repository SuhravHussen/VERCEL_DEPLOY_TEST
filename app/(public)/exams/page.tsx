"use client";

import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Calendar, Users, Trophy } from "lucide-react";
import { BookExams } from "@/components/pages/dashboard/organization/all-exam/exams/book-exams";
import Link from "next/link";

// Loading fallback component
function ExamsPageSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4">
      <div className="space-y-2">
        <Skeleton className="h-6 sm:h-8 w-48 sm:w-64" />
        <Skeleton className="h-3 sm:h-4 w-64 sm:w-96" />
      </div>
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 sm:h-24 w-full" />
        ))}
      </div>
      <div className="space-y-3 sm:space-y-4">
        <Skeleton className="h-8 sm:h-10 w-60 sm:w-80" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

// Main page component
export default function ExamsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 mt-20 px-1 md:mt-28">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-6 sm:mb-10 space-y-4 sm:space-y-6">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary">
              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                Discover Exams
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-2">
                Find and register for examinations that match your goals
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800 hover:shadow-md transition-shadow">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="p-1.5 sm:p-2 bg-blue-500/10 rounded-lg">
                    <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-lg sm:text-2xl font-bold text-blue-900 dark:text-blue-100">
                      120+
                    </p>
                    <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
                      Available Exams
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800 hover:shadow-md transition-shadow">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="p-1.5 sm:p-2 bg-green-500/10 rounded-lg">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-lg sm:text-2xl font-bold text-green-900 dark:text-green-100">
                      5.2K+
                    </p>
                    <p className="text-xs sm:text-sm text-green-700 dark:text-green-300">
                      Test Takers
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800 hover:shadow-md transition-shadow">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="p-1.5 sm:p-2 bg-purple-500/10 rounded-lg">
                    <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-lg sm:text-2xl font-bold text-purple-900 dark:text-purple-100">
                      95%
                    </p>
                    <p className="text-xs sm:text-sm text-purple-700 dark:text-purple-300">
                      Success Rate
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border-orange-200 dark:border-orange-800 hover:shadow-md transition-shadow">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="p-1.5 sm:p-2 bg-orange-500/10 rounded-lg">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-lg sm:text-2xl font-bold text-orange-900 dark:text-orange-100">
                      24/7
                    </p>
                    <p className="text-xs sm:text-sm text-orange-700 dark:text-orange-300">
                      Support
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Practice Section */}
        <div className="mb-6 sm:mb-10">
          <Card className="bg-gradient-to-br from-accent/10 to-accent/20 border-accent/30 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/30 text-primary">
                    <BookOpen className="h-8 w-8 sm:h-10 sm:w-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                    Want to Practice First?
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
                    Sharpen your skills and build confidence before taking the
                    real exam. Our practice tests help you identify areas for
                    improvement.
                  </p>
                </div>
                <Link
                  href="/dashboard/user/practice"
                  className="inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-semibold text-primary-foreground bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  Start Practice Tests
                  <BookOpen className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="border-0 shadow-xl bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <Suspense fallback={<ExamsPageSkeleton />}>
              <BookExams />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
