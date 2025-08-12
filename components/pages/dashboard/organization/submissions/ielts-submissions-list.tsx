"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Search,
  Download,
  Eye,
  Users,
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  CheckCircle,
  Clock,
  TrendingUp,
} from "lucide-react";
import { ExamSubmission, SubmissionStatus } from "@/types/exam/exam-submission";
import {
  useExamSubmissions,
  useExamSubmissionStats,
} from "@/hooks/organization/submissions/use-exam-submissions";

import { ExamModel } from "@/types/exam/exam";
import { getCurrentUser } from "@/lib/auth-client";
import { isAssigned, isAssignedToLRW } from "@/lib/exam-utils";

interface SubmissionsListProps {
  examId: string;
  examTitle?: string;
  exam?: ExamModel;
}

const statusColors = {
  [SubmissionStatus.DRAFT]: "bg-gray-100 text-gray-700",
  [SubmissionStatus.SUBMITTED]: "bg-blue-100 text-blue-700",
  [SubmissionStatus.UNDER_REVIEW]: "bg-yellow-100 text-yellow-700",
  [SubmissionStatus.GRADED]: "bg-green-100 text-green-700",
  [SubmissionStatus.COMPLETED]: "bg-purple-100 text-purple-700",
};

const statusLabels = {
  [SubmissionStatus.DRAFT]: "Draft",
  [SubmissionStatus.SUBMITTED]: "Submitted",
  [SubmissionStatus.UNDER_REVIEW]: "Under Review",
  [SubmissionStatus.GRADED]: "Graded",
  [SubmissionStatus.COMPLETED]: "Completed",
};

export default function SubmissionsListIelts({
  examId,
  examTitle,
  exam,
}: SubmissionsListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | "all">(
    "all"
  );
  const user = getCurrentUser();

  const [sortBy, setSortBy] = useState<
    "student_name" | "updated_at" | "status" | "overall_score"
  >("updated_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { submissions, totalPages, isLoading, error } = useExamSubmissions(
    examId,
    { page: currentPage, pageSize },
    {
      status: statusFilter,
      sortBy,
      sortOrder,
      searchQuery: searchQuery.trim() || undefined,
    }
  );

  const { stats, isLoading: isStatsLoading } = useExamSubmissionStats(examId);

  // Determine available test sections based on exam data and user assignments
  const availableSections = React.useMemo(() => {
    if (!exam || !user) return [];

    const sections: Array<{
      key: string;
      label: string;
      hasTest: boolean;
    }> = [];

    // Check if user is assigned to LRW group for LRW sections
    const isUserAssignedToLRW = isAssignedToLRW(exam, user.id);

    // Check if user is assigned to speaking group for speaking section
    const isUserAssignedToSpeaking = isAssigned(exam, user.id);

    // Only show LRW sections if user is assigned to LRW group and tests exist
    if (isUserAssignedToLRW) {
      if (exam.listening_test) {
        sections.push({
          key: "listening",
          label: "Listening",
          hasTest: true,
        });
      }

      if (exam.reading_test) {
        sections.push({
          key: "reading",
          label: "Reading",
          hasTest: true,
        });
      }

      if (exam.writing_test) {
        sections.push({
          key: "writing",
          label: "Writing",
          hasTest: true,
        });
      }
    }

    // Only show speaking section if user is assigned to speaking group and speaking group exists
    if (
      isUserAssignedToSpeaking &&
      exam.speaking_group &&
      exam.speaking_group.time_windows.length > 0
    ) {
      sections.push({
        key: "speaking",
        label: "Speaking",
        hasTest: true,
      });
    }

    return sections;
  }, [exam, user]);

  // Reset active tab if it's not available in current exam
  React.useEffect(() => {
    if (availableSections.length > 0 && activeTab !== "all") {
      const isCurrentTabAvailable = availableSections.some(
        (section) => section.key === activeTab
      );
      if (!isCurrentTabAvailable) {
        setActiveTab("all");
      }
    }
  }, [availableSections, activeTab]);

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Error loading submissions: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
            Exam Submissions
          </h1>
          {examTitle && (
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Submissions for: {examTitle}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs sm:text-sm">
            <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Dashboard */}
      <div className="space-y-6">
        {/* Primary Stats */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
            Overview
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card
              className="border-2"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--chart-1) 8%, transparent)",
                borderColor:
                  "color-mix(in srgb, var(--chart-1) 20%, transparent)",
              }}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className="text-xs sm:text-sm font-medium"
                      style={{ color: "var(--chart-1)" }}
                    >
                      Total Submissions
                    </p>
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                      {isStatsLoading ? (
                        <div className="h-6 sm:h-8 w-12 sm:w-16 bg-muted rounded animate-pulse"></div>
                      ) : (
                        stats.totalSubmissions
                      )}
                    </p>
                  </div>
                  <div
                    className="p-2 sm:p-3 rounded-full"
                    style={{
                      backgroundColor:
                        "color-mix(in srgb, var(--chart-1) 15%, transparent)",
                    }}
                  >
                    <Users
                      className="h-4 w-4 sm:h-6 sm:w-6"
                      style={{ color: "var(--chart-1)" }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className="border-2"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--chart-3) 8%, transparent)",
                borderColor:
                  "color-mix(in srgb, var(--chart-3) 20%, transparent)",
              }}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className="text-xs sm:text-sm font-medium"
                      style={{ color: "var(--chart-3)" }}
                    >
                      Total Graded
                    </p>
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                      {isStatsLoading ? (
                        <div className="h-6 sm:h-8 w-12 sm:w-16 bg-muted rounded animate-pulse"></div>
                      ) : (
                        stats.gradedCount
                      )}
                    </p>
                  </div>
                  <div
                    className="p-2 sm:p-3 rounded-full"
                    style={{
                      backgroundColor:
                        "color-mix(in srgb, var(--chart-3) 15%, transparent)",
                    }}
                  >
                    <CheckCircle
                      className="h-4 w-4 sm:h-6 sm:w-6"
                      style={{ color: "var(--chart-3)" }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className="border-2"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--chart-4) 8%, transparent)",
                borderColor:
                  "color-mix(in srgb, var(--chart-4) 20%, transparent)",
              }}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className="text-xs sm:text-sm font-medium"
                      style={{ color: "var(--chart-4)" }}
                    >
                      Needs Grading
                    </p>
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                      {isStatsLoading ? (
                        <div className="h-6 sm:h-8 w-12 sm:w-16 bg-muted rounded animate-pulse"></div>
                      ) : (
                        stats.needsGrading
                      )}
                    </p>
                  </div>
                  <div
                    className="p-2 sm:p-3 rounded-full"
                    style={{
                      backgroundColor:
                        "color-mix(in srgb, var(--chart-4) 15%, transparent)",
                    }}
                  >
                    <Clock
                      className="h-4 w-4 sm:h-6 sm:w-6"
                      style={{ color: "var(--chart-4)" }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className="border-2"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--chart-5) 8%, transparent)",
                borderColor:
                  "color-mix(in srgb, var(--chart-5) 20%, transparent)",
              }}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className="text-xs sm:text-sm font-medium"
                      style={{ color: "var(--chart-5)" }}
                    >
                      Average Score
                    </p>
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                      {isStatsLoading ? (
                        <div className="h-6 sm:h-8 w-12 sm:w-16 bg-muted rounded animate-pulse"></div>
                      ) : (
                        stats.averageBandScore || "N/A"
                      )}
                    </p>
                  </div>
                  <div
                    className="p-2 sm:p-3 rounded-full"
                    style={{
                      backgroundColor:
                        "color-mix(in srgb, var(--chart-5) 15%, transparent)",
                    }}
                  >
                    <TrendingUp
                      className="h-4 w-4 sm:h-6 sm:w-6"
                      style={{ color: "var(--chart-5)" }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Section-Specific Stats */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
            Section Breakdown
          </h3>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
            {availableSections.map((section, index) => {
              const sectionIcons = {
                listening: Headphones,
                reading: BookOpen,
                writing: PenTool,
                speaking: Mic,
              };

              const IconComponent =
                sectionIcons[section.key as keyof typeof sectionIcons] || Users;
              // Use chart colors from the design system, cycling through them
              const chartIndex = (index % 5) + 1;
              const chartColor = `var(--chart-${chartIndex})`;

              return (
                <Card
                  key={section.key}
                  className="hover:shadow-md transition-shadow border"
                >
                  <CardContent className="p-3 sm:p-5">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div
                        className="p-2 sm:p-3 rounded-lg"
                        style={{
                          backgroundColor: `color-mix(in srgb, ${chartColor} 12%, transparent)`,
                        }}
                      >
                        <IconComponent
                          className="h-4 w-4 sm:h-5 sm:w-5"
                          style={{ color: chartColor }}
                        />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                          {section.label}
                        </p>
                        <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
                          {isStatsLoading ? (
                            <div className="h-5 sm:h-6 w-6 sm:w-8 bg-muted rounded animate-pulse"></div>
                          ) : (
                            (stats[
                              `${section.key}Submissions` as keyof typeof stats
                            ] as number)
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by student name, email, or submission ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-7 sm:pl-8 text-sm"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto">
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as SubmissionStatus | "all")
                }
              >
                <SelectTrigger className="w-[100px] sm:w-[140px] text-xs sm:text-sm">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={sortBy}
                onValueChange={(value) =>
                  setSortBy(
                    value as
                      | "student_name"
                      | "updated_at"
                      | "status"
                      | "overall_score"
                  )
                }
              >
                <SelectTrigger className="w-[100px] sm:w-[140px] text-xs sm:text-sm">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updated_at">Last Updated</SelectItem>
                  <SelectItem value="student_name">Student</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="overall_score">Score</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="px-2 sm:px-3 text-xs sm:text-sm"
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dynamic IELTS Sections Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* Mobile: Horizontal scroll wrapper */}
        <div className="w-full md:hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground min-w-full">
              <TabsTrigger
                value="all"
                className="whitespace-nowrap text-xs px-2"
              >
                All Submissions
              </TabsTrigger>
              {availableSections.map((section) => (
                <TabsTrigger
                  key={section.key}
                  value={section.key}
                  className="whitespace-nowrap text-xs px-2"
                >
                  {section.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden md:block">
          <TabsList
            className="grid w-full"
            style={{
              gridTemplateColumns: `repeat(${
                availableSections.length + 1
              }, 1fr)`,
            }}
          >
            <TabsTrigger value="all">All Submissions</TabsTrigger>
            {availableSections.map((section) => (
              <TabsTrigger key={section.key} value={section.key}>
                {section.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="all">
          <SubmissionsTable
            submissions={submissions}
            isLoading={isLoading}
            showAllSections={true}
            availableSections={availableSections}
          />
        </TabsContent>

        {availableSections.map((section) => (
          <TabsContent key={section.key} value={section.key}>
            <SubmissionsTable
              submissions={submissions}
              isLoading={isLoading}
              focusSection={
                section.key as "listening" | "reading" | "writing" | "speaking"
              }
              availableSections={availableSections}
            />
          </TabsContent>
        ))}
      </Tabs>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage(currentPage - 1);
                }}
              />
            </PaginationItem>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === pageNum}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(pageNum);
                    }}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

interface SubmissionsTableProps {
  submissions: ExamSubmission[];
  isLoading: boolean;
  showAllSections?: boolean;
  focusSection?: "listening" | "reading" | "writing" | "speaking";
  availableSections: Array<{
    key: string;
    label: string;
    hasTest: boolean;
  }>;
}

function SubmissionsTable({
  submissions,
  isLoading,
  showAllSections = false,
  focusSection,
  availableSections,
}: SubmissionsTableProps) {
  const router = useRouter();
  const params = useParams();
  const organizationId = params?.id as string;
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getBandScoreDisplay = (
    submission: ExamSubmission,
    section: "listening" | "reading" | "writing" | "speaking"
  ) => {
    const grade = submission.grades?.[section];
    if (!grade) return "Not graded";

    if (section === "writing") {
      const writingGrade = grade as {
        task_1?: { band_score?: number };
        task_2?: { band_score?: number };
        overall?: { band_score?: number };
      };
      return `Band ${writingGrade.overall?.band_score || "N/A"}`;
    }
    const sectionGrade = grade as { band_score?: number };
    return `Band ${sectionGrade.band_score || "N/A"}`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-100 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (submissions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            No submissions found.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-left">
                <th className="p-4 font-medium">Student</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Submitted</th>
                {showAllSections && (
                  <>
                    {availableSections.map((section) => (
                      <th key={section.key} className="p-4 font-medium">
                        {section.label}
                      </th>
                    ))}
                    <th className="p-4 font-medium">Overall</th>
                  </>
                )}
                {focusSection && (
                  <th className="p-4 font-medium">
                    {focusSection.charAt(0).toUpperCase() +
                      focusSection.slice(1)}{" "}
                    Score
                  </th>
                )}
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div>
                      <div className="font-medium">
                        {submission.student?.name || "Unknown"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {submission.student?.email}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge className={statusColors[submission.status]}>
                      {statusLabels[submission.status]}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm">
                    {formatDate(submission.updated_at)}
                  </td>
                  {showAllSections && (
                    <>
                      {availableSections.map((section) => (
                        <td key={section.key} className="p-4 text-sm">
                          {getBandScoreDisplay(
                            submission,
                            section.key as
                              | "listening"
                              | "reading"
                              | "writing"
                              | "speaking"
                          )}
                        </td>
                      ))}
                      <td className="p-4 text-sm font-medium">
                        {submission.grades?.overall_band_score
                          ? `Band ${submission.grades.overall_band_score}`
                          : "Not graded"}
                      </td>
                    </>
                  )}
                  {focusSection && (
                    <td className="p-4 text-sm">
                      {getBandScoreDisplay(submission, focusSection)}
                    </td>
                  )}
                  <td className="p-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        router.push(
                          `/dashboard/organization/${organizationId}/assigned-exams/submissions/${submission.exam_id}/grade/${submission.id}`
                        );
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
