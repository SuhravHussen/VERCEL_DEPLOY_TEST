/* eslint-disable @next/next/no-async-client-component */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, BookOpen, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { usePaginatedExams } from "@/hooks/organization/ielts-academic/exam/use-paginated-exams";
import { useDeleteExam } from "@/hooks/organization/ielts-academic/exam/use-delete-exam";
import { useToasts } from "@/components/ui/toast";
import { ExamCard } from "@/components/pages/dashboard/organization/ielts-academic/exam/components/exam-card";
import { ExamSearch } from "@/components/pages/dashboard/organization/ielts-academic/exam/components/exam-search";
import { ExamCardSkeletonGrid } from "@/components/pages/dashboard/organization/ielts-academic/exam/components/exam-card-skeleton";

interface ExamPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ExamPage({ params }: ExamPageProps) {
  const resolvedParams = await params;

  const organizationId = resolvedParams.id;

  return <ExamPageClient organizationId={organizationId} />;
}

function ExamPageClient({ organizationId }: { organizationId: string }) {
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
      `/dashboard/organization/${organizationId}/ielts-academic/exam/${examId}`
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
      `/dashboard/organization/${organizationId}/ielts-academic/exam/create`
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
    <div className="min-h-screen bg-dashboard-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              IELTS Academic Exams
            </h1>
            <p className="text-muted-foreground">
              Manage and organize IELTS Academic examinations
            </p>
          </div>

          <Button onClick={handleCreateExam} className="gap-2">
            <Plus className="h-4 w-4" />
            Create New Exam
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <ExamSearch
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              placeholder="Search exams by title, description, or ID..."
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {totalExams} exam{totalExams !== 1 ? "s" : ""} found
            </span>
          </div>
        </div>

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
                          !hasPreviousPage
                            ? "pointer-events-none opacity-50"
                            : ""
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
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <BookOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery ? "No matching exams found" : "No exams available"}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                {searchQuery
                  ? `No exams match your search for "${searchQuery}". Try adjusting your search terms.`
                  : "There are no IELTS Academic exams available at the moment."}
              </p>
              {searchQuery ? (
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              ) : (
                <Button onClick={handleCreateExam} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create First Exam
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
