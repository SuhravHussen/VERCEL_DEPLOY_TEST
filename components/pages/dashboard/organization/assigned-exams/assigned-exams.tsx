"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PaginationWrapper } from "@/components/ui/pagination-wrapper";
import {
  useAssignedExamsStats,
  usePastAndTodayExams,
  useUpcomingExams,
} from "@/hooks/organization/assigned-exams";
import { AssignedExamCard } from "./assigned-exam-card";
import { AssignedExamsStats } from "./assigned-exams-stats";
import { ExamFilters, ExamModel } from "@/types/exam/exam";
import { getCurrentUser } from "@/lib/auth-client";

interface AssignedExamsProps {
  organizationId: string;
  className?: string;
}

export function AssignedExams({
  organizationId,
  className,
}: AssignedExamsProps) {
  const user = getCurrentUser();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [pastAndTodayPage, setPastAndTodayPage] = useState(1);
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [filters, setFilters] = useState<ExamFilters>({
    examType: "all",
    priceFilter: "all",
    sortBy: "date",
    sortOrder: "desc",
  });

  // Get statistics for the header (independent of filters)
  const { stats, isLoading: statsLoading } = useAssignedExamsStats({
    organizationId,
  });

  // Get paginated past and today exams
  const pastAndTodayResult = usePastAndTodayExams({
    organizationId,
    page: pastAndTodayPage,
    pageSize: 6,
    filters: {
      ...filters,
      searchQuery,
    },
  });

  // Get paginated upcoming exams
  const upcomingResult = useUpcomingExams({
    organizationId,
    page: upcomingPage,
    pageSize: 6,
    filters: {
      ...filters,
      searchQuery,
    },
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Reset pagination when searching
    setPastAndTodayPage(1);
    setUpcomingPage(1);
  };

  const handleFilterChange = (key: keyof ExamFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    // Reset pagination when filtering
    setPastAndTodayPage(1);
    setUpcomingPage(1);
  };

  const handleViewSubmissions = (examId: string) => {
    // Navigate to exam submissions page
    router.push(
      `/dashboard/organization/${organizationId}/assigned-exams/submissions/${examId}`
    );
  };

  const handleViewDetails = (examId: string) => {
    // Navigate to exam details page
    router.push(
      `/dashboard/organization/${organizationId}/ielts/exam/${examId}`
    );
  };

  const handleViewSpeakingSessions = (examId: string) => {
    // Navigate to speaking sessions page
    router.push(
      `/dashboard/organization/${organizationId}/assigned-exams/speaking-sessions/${examId}`
    );
  };

  const renderExamSection = (
    title: string,
    result: {
      exams: ExamModel[];
      totalCount: number;
      totalPages: number;
      currentPage: number;
      isLoading: boolean;
      error: string | null;
    },
    emptyMessage: string,
    setCurrentPage: (page: number) => void
  ) => {
    if (result.isLoading) {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-32 bg-muted/50 rounded-lg animate-pulse"></div>
            <div className="h-6 w-16 bg-muted/30 rounded-md animate-pulse"></div>
          </div>
          <ExamGridSkeleton count={3} />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
              {result.totalCount} {result.totalCount === 1 ? "exam" : "exams"}
            </span>
          </div>
        </div>

        {result.exams.length === 0 ? (
          <Card className="border-dashed border-2 border-border/50 bg-muted/20">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-muted-foreground/60" />
              </div>
              <p className="text-lg font-medium text-muted-foreground mb-2">
                No exams found
              </p>
              <p className="text-muted-foreground/80 max-w-md">
                {emptyMessage}
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {result.exams.map(
                (exam) =>
                  exam.type_of_exam === "ielts" && (
                    <AssignedExamCard
                      key={exam.id}
                      exam={exam}
                      user={user}
                      onViewSubmissions={handleViewSubmissions}
                      onViewDetails={handleViewDetails}
                      onViewSpeakingSessions={handleViewSpeakingSessions}
                    />
                  )
              )}
            </div>

            {result.totalPages > 1 && (
              <div className="flex justify-center pt-4">
                <div className="inline-flex items-center gap-1 p-1 bg-muted/30 rounded-lg border border-border/50">
                  <PaginationWrapper
                    currentPage={result.currentPage}
                    totalPages={result.totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen bg-dashboard-background ${className || ""}`}>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 mb-4">
            <Calendar className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Assigned Exams
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Review and grade exams that have been assigned to you with
            streamlined workflow and intuitive interface
          </p>
        </div>

        {/* Statistics */}
        <AssignedExamsStats stats={stats} isLoading={statsLoading} />

        {/* Filters and Search */}
        <Card className="backdrop-blur-sm bg-card/60 border-border/50 shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search */}
              <div>
                <Input
                  placeholder="Search exams by title or description..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="px-4 h-12 text-base border-border/50 bg-background/50 focus:bg-background transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
                <div className="space-y-2 flex-1 min-w-0">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Exam Type
                  </label>
                  <Select
                    value={filters.examType || "all"}
                    onValueChange={(value) =>
                      handleFilterChange("examType", value)
                    }
                  >
                    <SelectTrigger className="w-full sm:w-[160px] h-11 border-border/50 bg-background/50 hover:bg-background transition-all duration-200">
                      <SelectValue placeholder="Select exam type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="ielts">IELTS</SelectItem>
                      <SelectItem value="toefl">TOEFL</SelectItem>
                      <SelectItem value="gre">GRE</SelectItem>
                      <SelectItem value="sat">SAT</SelectItem>
                      <SelectItem value="gmat">GMAT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 flex-1 min-w-0">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Sort By
                  </label>
                  <Select
                    value={filters.sortBy || "date"}
                    onValueChange={(value) =>
                      handleFilterChange("sortBy", value)
                    }
                  >
                    <SelectTrigger className="w-full sm:w-[160px] h-11 border-border/50 bg-background/50 hover:bg-background transition-all duration-200">
                      <SelectValue placeholder="Select sort option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Exam Date</SelectItem>
                      <SelectItem value="title">Title</SelectItem>
                      <SelectItem value="created_at">Created</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        {pastAndTodayResult.error || upcomingResult.error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {pastAndTodayResult.error || upcomingResult.error} Please try
              refreshing the page.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-8">
            {/* Past & Today Section */}
            {renderExamSection(
              "Past & Today",
              pastAndTodayResult,
              "No past or today's exams found.",
              setPastAndTodayPage
            )}

            {/* Upcoming Exams Section */}
            {renderExamSection(
              "Upcoming Exams",
              upcomingResult,
              "No upcoming exams scheduled.",
              setUpcomingPage
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Loading skeleton component
function ExamGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Card
          key={i}
          className="h-full bg-card/50 border-border/30 overflow-hidden"
        >
          <div className="p-6 space-y-4 relative">
            {/* Shimmer overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-muted/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite] bg-[length:200%_100%]"></div>

            {/* Header skeleton */}
            <div className="space-y-3">
              <div className="h-6 bg-muted/50 rounded-lg animate-pulse"></div>
              <div className="flex gap-2">
                <div className="h-5 w-16 bg-muted/40 rounded-full animate-pulse"></div>
                <div className="h-5 w-20 bg-primary/10 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Content skeleton */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="h-4 bg-muted/30 rounded animate-pulse"></div>
                <div className="h-4 w-4/5 bg-muted/20 rounded animate-pulse"></div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 bg-muted/40 rounded animate-pulse"></div>
                  <div className="h-4 w-28 bg-muted/30 rounded animate-pulse"></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 bg-muted/40 rounded animate-pulse"></div>
                  <div className="h-4 w-32 bg-muted/30 rounded animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Footer skeleton */}
            <div className="flex gap-3 pt-6 border-t border-border/30">
              <div className="h-10 flex-1 bg-muted/40 rounded-lg animate-pulse"></div>
              <div className="h-10 flex-1 bg-primary/10 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
