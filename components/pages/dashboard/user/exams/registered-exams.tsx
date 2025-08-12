"use client";

import { useState } from "react";
import { useGetRegisteredExams } from "@/hooks/user/exams/use-get-registered-exams";
import { getCurrentUser } from "@/lib/auth-client";
import { ExamCard } from "@/components/pages/dashboard/user/exams/registered-exams/ExamCards";
import { LoadingSkeleton } from "@/components/pages/dashboard/user/exams/registered-exams/LoadingSkeleton";
import { ErrorState } from "@/components/pages/dashboard/user/exams/registered-exams/ErrorState";
import { EmptyState } from "@/components/pages/dashboard/user/exams/registered-exams/EmptyState";
import { PaginationControls } from "@/components/pages/dashboard/user/exams/registered-exams/PaginationControls";

interface RegisteredExamsProps {
  className?: string;
}

// container component only

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
      <div className="space-y-8 ">
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
          <ErrorState />
        ) : !registeredExams || registeredExams.length === 0 ? (
          <EmptyState />
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
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
