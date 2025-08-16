/* eslint-disable @next/next/no-async-client-component */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, BookOpen } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePaginatedExams } from "@/hooks/organization/ielts-academic/exam/use-paginated-exams";
import { useDeleteExam } from "@/hooks/organization/ielts-academic/exam/use-delete-exam";
import { useToasts } from "@/components/ui/toast";
import { PageLayout } from "@/components/ui/page-layout";
import { SearchFiltersBar } from "@/components/ui/search-filters-bar";
import { EmptyState } from "@/components/ui/empty-state";
import { ExamCard } from "@/components/pages/dashboard/organization/ielts-academic/exam/components/exam-card";
import { ExamCardSkeletonGrid } from "@/components/pages/dashboard/organization/ielts-academic/exam/components/exam-card-skeleton";

interface ExamPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ExamPage({ params }: ExamPageProps) {
  const resolvedParams = await params;

  const organizationSlug = resolvedParams.slug;

  return <ExamPageClient organizationSlug={organizationSlug} />;
}

function ExamPageClient({ organizationSlug }: { organizationSlug: string }) {
  const router = useRouter();
  const toast = useToasts();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const pageSize = 6;

  const {
    exams,
    totalExams,
    totalPages,
    currentPage: actualCurrentPage,
    isLoading,
    hasNextPage,
    hasPreviousPage,
  } = usePaginatedExams({
    page: currentPage,
    pageSize,
    searchQuery,
  });

  const deleteExamMutation = useDeleteExam();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleViewDetails = (examId: string) => {
    router.push(
      `/dashboard/organization/${organizationSlug}/ielts/exam/${examId}`
    );
  };

  const handleRegister = (examId: string) => {
    // TODO: Navigate to registration page
    console.log("Register for exam:", examId);
  };

  const handleDeleteExam = async (examId: string) => {
    try {
      await deleteExamMutation.mutateAsync(examId);
      toast.success("Exam deleted successfully!");
    } catch (error) {
      console.error("Error deleting exam:", error);
      toast.error("Failed to delete exam. Please try again.");
    }
  };

  const handleCreateExam = () => {
    router.push(
      `/dashboard/organization/${organizationSlug}/ielts/exam/create`
    );
  };

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(i);
              }}
              isActive={i === actualCurrentPage}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(1);
            }}
            isActive={1 === actualCurrentPage}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show ellipsis if needed
      if (actualCurrentPage > 4) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show pages around current page
      const start = Math.max(2, actualCurrentPage - 1);
      const end = Math.min(totalPages - 1, actualCurrentPage + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(i);
              }}
              isActive={i === actualCurrentPage}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Show ellipsis if needed
      if (actualCurrentPage < totalPages - 3) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show last page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(totalPages);
              }}
              isActive={totalPages === actualCurrentPage}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  return (
    <PageLayout
      title="IELTS Academic Exams"
      description="Manage and organize IELTS Academic examinations"
      actionButton={{
        label: "Create New Exam",
        onClick: handleCreateExam,
        icon: <Plus className="h-4 w-4" />,
      }}
    >
      {/* Search and Filters */}
      <SearchFiltersBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search exams by title, description, or ID..."
        totalItems={totalExams}
        itemName="exam"
      />

      {/* Results */}
      {isLoading ? (
        <ExamCardSkeletonGrid count={pageSize} />
      ) : exams.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {exams.map((exam) => (
              <ExamCard
                key={exam.id}
                exam={exam}
                onViewDetails={handleViewDetails}
                onRegister={handleRegister}
                onDelete={handleDeleteExam}
                isDeleting={deleteExamMutation.isPending}
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
        <EmptyState
          icon={<BookOpen className="h-8 w-8 text-muted-foreground" />}
          title="No exams available"
          description="There are no IELTS Academic exams available at the moment."
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery("")}
          primaryAction={{
            label: "Create First Exam",
            onClick: handleCreateExam,
            icon: <Plus className="h-4 w-4" />,
          }}
        />
      )}
    </PageLayout>
  );
}
