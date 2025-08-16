"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { AllExamsCard } from "@/components/pages/dashboard/organization/all-exam/exams/all-exams-card";
import { AllExamsFilters } from "@/components/pages/dashboard/organization/all-exam/exams/all-exams-filters";
import { AllExamsStats } from "@/components/pages/dashboard/organization/all-exam/exams/all-exams-stats";
import { useOrganizationAllExams } from "@/hooks/organization/all-exam/use-organization-all-exams";
import { ExamFilters } from "@/types/exam/exam";

const EmptyState = ({ filters }: { filters: ExamFilters }) => (
  <Card className="border-dashed">
    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <Plus className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="mt-6 text-lg font-semibold">
        {filters.searchQuery ||
        filters.examType !== "all" ||
        filters.priceFilter !== "all"
          ? "No exams match your filters"
          : "No exams available"}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        {filters.searchQuery ||
        filters.examType !== "all" ||
        filters.priceFilter !== "all"
          ? "Try adjusting your search criteria or filters to find more exams."
          : "Get started by creating your first exam for students to register."}
      </p>
    </CardContent>
  </Card>
);

const ExamGridSkeleton = ({ count = 12 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <Card key={i} className="h-[400px] animate-pulse">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-muted rounded"></div>
              <div className="h-6 w-16 bg-muted rounded"></div>
            </div>
            <div className="h-6 w-20 bg-muted rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-6 w-3/4 bg-muted rounded"></div>
            <div className="h-4 w-full bg-muted rounded"></div>
            <div className="h-4 w-2/3 bg-muted rounded"></div>
          </div>
          <div className="space-y-3 flex-1">
            <div className="h-4 w-1/2 bg-muted rounded"></div>
            <div className="h-4 w-2/3 bg-muted rounded"></div>
            <div className="h-4 w-1/3 bg-muted rounded"></div>
          </div>
          <div className="flex gap-2 pt-4">
            <div className="h-9 flex-1 bg-muted rounded"></div>
            <div className="h-9 flex-1 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default function AllExamsPage() {
  const router = useRouter();
  const { slug } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<ExamFilters>({
    examType: "all",
    priceFilter: "all",
    sortBy: "created_at",
    sortOrder: "desc",
    searchQuery: "",
  });

  const pageSize = 12;

  const {
    exams,
    totalCount,
    totalPages,
    currentPage: actualCurrentPage,
    hasNextPage,
    hasPreviousPage,
    stats,
    isLoading,
    error,
  } = useOrganizationAllExams({
    organizationSlug: slug as string,
    page: currentPage,
    pageSize,
    filters,
  });

  const handleFiltersChange = (newFilters: ExamFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewDetails = (examId: string) => {
    // Navigate to exam details based on exam type
    const exam = exams.find((e) => e.id === examId);
    if (exam) {
      // For now, navigate to IELTS exam details (extend this for other types)
      router.push(`/dashboard/organization/${slug}/ielts/exam/${examId}`);
    }
  };

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    const maxVisible = 5;
    const start = Math.max(1, actualCurrentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (start > 1) {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(1);
            }}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (start > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    for (let i = start; i <= end; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            isActive={i === actualCurrentPage}
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(i);
            }}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(totalPages);
            }}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  if (!slug) {
    return <ExamGridSkeleton />;
  }

  return (
    <div className="space-y-8 p-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Exams</h1>
          <p className="text-muted-foreground">
            Manage all exam types including IELTS, TOEFL, GRE, SAT, and GMAT
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <AllExamsStats stats={stats} isLoading={isLoading} />

      {/* Filters */}
      <AllExamsFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        totalCount={totalCount}
        isLoading={isLoading}
      />

      {/* Error State */}
      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-destructive">
              <div className="h-4 w-4 rounded-full bg-destructive"></div>
              <span className="font-medium">Error loading exams</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      {isLoading ? (
        <ExamGridSkeleton count={pageSize} />
      ) : exams.length > 0 ? (
        <>
          {/* Exams Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {exams.map((exam) => (
              <AllExamsCard
                key={exam.id}
                exam={exam}
                onViewDetails={handleViewDetails}
                showActions={true}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (hasPreviousPage) {
                          handlePageChange(actualCurrentPage - 1);
                        }
                      }}
                      className={
                        !hasPreviousPage ? "pointer-events-none opacity-50" : ""
                      }
                    />
                  </PaginationItem>

                  {renderPaginationItems()}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (hasNextPage) {
                          handlePageChange(actualCurrentPage + 1);
                        }
                      }}
                      className={
                        !hasNextPage ? "pointer-events-none opacity-50" : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      ) : (
        <EmptyState filters={filters} />
      )}
    </div>
  );
}
