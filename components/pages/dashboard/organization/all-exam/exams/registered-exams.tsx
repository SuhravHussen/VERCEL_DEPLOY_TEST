"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
  CalendarDays,
  Clock,
  DollarSign,
  CheckCircle,
  AlertCircle,
  XCircle,
  Timer,
} from "lucide-react";
import { useGetRegisteredExams } from "@/hooks/user/exams/use-get-registered-exams";
import { getCurrentUser } from "@/lib/auth-client";
import { useCountdown } from "@/hooks/utils/use-countdown";
import { RegisteredExam } from "@/types/registered-exam";
import { format, parseISO } from "date-fns";

interface RegisteredExamsProps {
  className?: string;
}

interface ExamCardProps {
  registeredExam: RegisteredExam;
}

// Shared utility functions
const getStatusColor = (status: string) => {
  switch (status) {
    case "registered":
      return "bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800";
    case "cancelled":
      return "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800";
    case "completed":
      return "bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case "paid":
      return "bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800";
    case "pending":
      return "bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800";
    case "failed":
      return "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800";
    case "refunded":
      return "bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-800";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "registered":
      return <CheckCircle className="h-4 w-4" />;
    case "cancelled":
      return <XCircle className="h-4 w-4" />;
    case "completed":
      return <CheckCircle className="h-4 w-4" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
};

const getExamTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "ielts":
      return "🎯";
    case "toefl":
      return "📚";
    case "gre":
      return "🎓";
    case "sat":
      return "📝";
    case "gmat":
      return "💼";
    default:
      return "📋";
  }
};

const getExamTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case "ielts":
      return "bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800";
    case "toefl":
      return "bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800";
    case "gre":
      return "bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-800";
    case "sat":
      return "bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-800";
    case "gmat":
      return "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

// IELTS Exam Card Component
function IeltsExamCard({ registeredExam }: ExamCardProps) {
  const examDate = registeredExam.exam?.lrw_group?.exam_date || "";
  const { formattedTime, isExpired } = useCountdown(examDate || new Date());

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getExamTypeColor("ielts")}>
                <span className="mr-1">{getExamTypeIcon("ielts")}</span>
                IELTS
              </Badge>
            </div>
            <CardTitle className="text-lg">
              {registeredExam?.exam?.title}
            </CardTitle>
            <CardDescription className="text-sm">
              International English Language Testing System
            </CardDescription>
          </div>
          <Badge className={getStatusColor(registeredExam.status)}>
            <div className="flex items-center gap-1">
              {getStatusIcon(registeredExam.status)}
              <span className="capitalize">{registeredExam.status}</span>
            </div>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Exam Date and Countdown */}
        {examDate && (
          <div className="flex items-center justify-between p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {format(parseISO(examDate), "PPP")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Timer
                className={`h-4 w-4 ${
                  isExpired
                    ? "text-red-500 dark:text-red-400"
                    : "text-blue-500 dark:text-blue-400"
                }`}
              />
              <span
                className={`text-sm font-mono ${
                  isExpired
                    ? "text-red-600 dark:text-red-400"
                    : "text-blue-600 dark:text-blue-400"
                }`}
              >
                {formattedTime}
              </span>
            </div>
          </div>
        )}

        {/* LRW Schedule (if available) */}
        {registeredExam?.exam?.lrw_group && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-foreground mb-2">
              Exam Schedule
            </div>
            <div className="grid gap-2">
              {registeredExam.exam.lrw_group.listening_time_start && (
                <div className="flex items-center justify-between py-2 px-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-md">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-200">
                      Listening
                    </span>
                  </div>
                  <span className="text-sm font-mono text-blue-700 dark:text-blue-300">
                    {registeredExam.exam.lrw_group.listening_time_start}
                  </span>
                </div>
              )}
              {registeredExam.exam.lrw_group.reading_time_start && (
                <div className="flex items-center justify-between py-2 px-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-md">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full"></div>
                    <span className="text-sm font-medium text-green-900 dark:text-green-200">
                      Reading
                    </span>
                  </div>
                  <span className="text-sm font-mono text-green-700 dark:text-green-300">
                    {registeredExam.exam.lrw_group.reading_time_start}
                  </span>
                </div>
              )}
              {registeredExam.exam.lrw_group.writing_time_start && (
                <div className="flex items-center justify-between py-2 px-3 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-md">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full"></div>
                    <span className="text-sm font-medium text-purple-900 dark:text-purple-200">
                      Writing
                    </span>
                  </div>
                  <span className="text-sm font-mono text-purple-700 dark:text-purple-300">
                    {registeredExam.exam.lrw_group.writing_time_start}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Speaking Time (if available) */}
        {registeredExam.speaking_time && (
          <div className="p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <div className="text-sm font-medium text-orange-900 dark:text-orange-200 mb-1">
              Speaking Session
            </div>
            <div className="text-sm text-orange-700 dark:text-orange-300">
              {format(
                parseISO(registeredExam?.speaking_time?.date || ""),
                "PPP"
              )}{" "}
              • {registeredExam?.speaking_time?.start} -{" "}
              {registeredExam?.speaking_time?.end}
            </div>
          </div>
        )}

        {/* Payment Information */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {registeredExam?.exam?.is_free
                ? "Free"
                : `${registeredExam?.paid_amount} ${registeredExam?.currency}`}
            </span>
          </div>
          <Badge
            className={getPaymentStatusColor(registeredExam?.payment_status)}
          >
            <span className="capitalize">{registeredExam?.payment_status}</span>
          </Badge>
        </div>

        {/* Registration Date */}
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Registered on{" "}
            {format(parseISO(registeredExam.registered_at), "PPP")}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// TOEFL Exam Card Component
function ToeflExamCard({ registeredExam }: ExamCardProps) {
  const examDate = registeredExam.exam?.lrw_group?.exam_date || "";
  const { formattedTime, isExpired } = useCountdown(examDate || new Date());

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getExamTypeColor("toefl")}>
                <span className="mr-1">{getExamTypeIcon("toefl")}</span>
                TOEFL
              </Badge>
            </div>
            <CardTitle className="text-lg">
              {registeredExam?.exam?.title}
            </CardTitle>
            <CardDescription className="text-sm">
              Test of English as a Foreign Language
            </CardDescription>
          </div>
          <Badge className={getStatusColor(registeredExam.status)}>
            <div className="flex items-center gap-1">
              {getStatusIcon(registeredExam.status)}
              <span className="capitalize">{registeredExam.status}</span>
            </div>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Exam Date and Countdown */}
        {examDate && (
          <div className="flex items-center justify-between p-3 bg-green-50/50 dark:bg-green-950/20 rounded-lg">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {format(parseISO(examDate), "PPP")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Timer
                className={`h-4 w-4 ${
                  isExpired
                    ? "text-red-500 dark:text-red-400"
                    : "text-green-500 dark:text-green-400"
                }`}
              />
              <span
                className={`text-sm font-mono ${
                  isExpired
                    ? "text-red-600 dark:text-red-400"
                    : "text-green-600 dark:text-green-400"
                }`}
              >
                {formattedTime}
              </span>
            </div>
          </div>
        )}

        {/* Payment Information */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {registeredExam?.exam?.is_free
                ? "Free"
                : `${registeredExam?.paid_amount} ${registeredExam?.currency}`}
            </span>
          </div>
          <Badge
            className={getPaymentStatusColor(registeredExam?.payment_status)}
          >
            <span className="capitalize">{registeredExam?.payment_status}</span>
          </Badge>
        </div>

        {/* Registration Date */}
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Registered on{" "}
            {format(parseISO(registeredExam.registered_at), "PPP")}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// Generic Exam Card Component for other exam types
function GenericExamCard({ registeredExam }: ExamCardProps) {
  const examDate = registeredExam.exam?.lrw_group?.exam_date || "";
  const { formattedTime, isExpired } = useCountdown(examDate || new Date());
  const examType = registeredExam.exam?.type_of_exam || "other";

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getExamTypeColor(examType)}>
                <span className="mr-1">{getExamTypeIcon(examType)}</span>
                {examType.toUpperCase()}
              </Badge>
            </div>
            <CardTitle className="text-lg">
              {registeredExam?.exam?.title}
            </CardTitle>
            <CardDescription className="text-sm">
              {examType.charAt(0).toUpperCase() + examType.slice(1)} Examination
            </CardDescription>
          </div>
          <Badge className={getStatusColor(registeredExam.status)}>
            <div className="flex items-center gap-1">
              {getStatusIcon(registeredExam.status)}
              <span className="capitalize">{registeredExam.status}</span>
            </div>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Exam Date and Countdown */}
        {examDate && (
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {format(parseISO(examDate), "PPP")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Timer
                className={`h-4 w-4 ${
                  isExpired
                    ? "text-red-500 dark:text-red-400"
                    : "text-blue-500 dark:text-blue-400"
                }`}
              />
              <span
                className={`text-sm font-mono ${
                  isExpired
                    ? "text-red-600 dark:text-red-400"
                    : "text-blue-600 dark:text-blue-400"
                }`}
              >
                {formattedTime}
              </span>
            </div>
          </div>
        )}

        {/* Payment Information */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {registeredExam?.exam?.is_free
                ? "Free"
                : `${registeredExam?.paid_amount} ${registeredExam?.currency}`}
            </span>
          </div>
          <Badge
            className={getPaymentStatusColor(registeredExam?.payment_status)}
          >
            <span className="capitalize">{registeredExam?.payment_status}</span>
          </Badge>
        </div>

        {/* Registration Date */}
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Registered on{" "}
            {format(parseISO(registeredExam.registered_at), "PPP")}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// Dynamic Exam Card Renderer
function ExamCard({ registeredExam }: ExamCardProps) {
  const examType = registeredExam.exam?.type_of_exam?.toLowerCase();

  switch (examType) {
    case "ielts":
      return <IeltsExamCard registeredExam={registeredExam} />;
    case "toefl":
      return <ToeflExamCard registeredExam={registeredExam} />;
    case "gre":
    case "sat":
    case "gmat":
    default:
      return <GenericExamCard registeredExam={registeredExam} />;
  }
}

function LoadingSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>
        <Skeleton className="h-4 w-36" />
      </CardContent>
    </Card>
  );
}

export function RegisteredExams({ className }: RegisteredExamsProps) {
  const currentUser = getCurrentUser();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const {
    data: paginatedData,
    isLoading,
    error,
  } = useGetRegisteredExams({
    userId: currentUser?.id || "",
    enabled: !!currentUser?.id,
    page: currentPage,
    pageSize,
  });

  const registeredExams = paginatedData?.exams || [];
  const totalPages = paginatedData?.totalPages || 0;
  const totalExams = paginatedData?.totalExams || 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className={className}>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            Your Registered Exams
          </h2>
          <p className="text-muted-foreground">
            Manage and track your upcoming examinations
          </p>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
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
        ) : !registeredExams || registeredExams.length === 0 ? (
          <Card className="border-dashed">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <CalendarDays className="h-8 w-8 text-muted-foreground" />
              </div>
              <CardTitle className="text-xl">No Registered Exams</CardTitle>
              <CardDescription className="max-w-sm mx-auto">
                You haven&apos;t registered for any exams yet. Browse available
                exams to get started!
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Exam Results Summary */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {registeredExams.length} of {totalExams} registered
                exams
              </p>
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
            </div>

            {/* All Exams Grid */}
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {registeredExams.map((registeredExam) => (
                <ExamCard
                  key={registeredExam.id}
                  registeredExam={registeredExam}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(Math.max(1, currentPage - 1));
                        }}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => {
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handlePageChange(page);
                                }}
                                isActive={page === currentPage}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                        return null;
                      }
                    )}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(
                            Math.min(totalPages, currentPage + 1)
                          );
                        }}
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
