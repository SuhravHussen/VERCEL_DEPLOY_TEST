"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDebounce } from "@/hooks/use-debounce";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { AlertCircle, CalendarDays, Search } from "lucide-react";
import { ExamBookingCard } from "@/components/shared/ExamBookingCard";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { SuccessMessage } from "@/components/shared/SuccessMessage";
import { useGetParentOrgExams } from "@/hooks/user/use-get-parent-org-exam";
import { ExamFilters, ExamType } from "@/types/exam/exam";

interface BookExamsProps {
  className?: string;
}

export function BookExams({ className }: BookExamsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [examTypeFilter, setExamTypeFilter] = useState<string>("all");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [bookingExamId, setBookingExamId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Debounce search query to reduce API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const pageSize = 9;

  const filters: ExamFilters = {
    searchQuery: debouncedSearchQuery || undefined,
    examType:
      examTypeFilter === "all" ? undefined : (examTypeFilter as ExamType),
    priceFilter:
      priceFilter === "all" ? undefined : (priceFilter as "free" | "paid"),
    sortBy: sortBy as "date" | "price" | "title" | "created_at",
    sortOrder: "asc",
  };

  const {
    data: paginatedData,
    isLoading,
    error: loadingError,
  } = useGetParentOrgExams({
    page: currentPage,
    pageSize,
    filters,
  });

  const exams = paginatedData?.exams || [];
  const totalPages = paginatedData?.totalPages || 0;
  const totalExams = paginatedData?.totalExams || 0;

  const handleBookExam = async (examId: string) => {
    setBookingExamId(examId);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate success/failure
      if (Math.random() > 0.1) {
        // 90% success rate
        setSuccessMessage(
          "Exam booked successfully! Check your registered exams."
        );
      } else {
        setErrorMessage("Failed to book exam. Please try again.");
      }
    } catch {
      setErrorMessage("An error occurred while booking the exam.");
    } finally {
      setBookingExamId(null);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleFilterChange = () => {
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <Card className="h-full">
      <CardHeader>
        <div className="space-y-2">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-12" />
          </div>
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            Book New Exam
          </h2>
          <p className="text-muted-foreground">
            Discover and register for available examinations
          </p>
        </div>

        {/* Success/Error Messages */}
        {successMessage && <SuccessMessage message={successMessage} />}
        {errorMessage && <ErrorMessage message={errorMessage} />}

        {/* Filters and Search */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search exams..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select
            value={examTypeFilter}
            onValueChange={(value) => {
              setExamTypeFilter(value);
              handleFilterChange();
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Exam Type" />
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

          <Select
            value={priceFilter}
            onValueChange={(value) => {
              setPriceFilter(value);
              handleFilterChange();
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortBy}
            onValueChange={(value) => {
              setSortBy(value);
              handleFilterChange();
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Latest</SelectItem>
              <SelectItem value="date">Exam Date</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Summary */}
        {!isLoading && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>
              Showing {exams.length} of {totalExams} available exams
            </p>
            {totalPages > 1 && (
              <p>
                Page {currentPage} of {totalPages}
              </p>
            )}
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="grid gap-3 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(pageSize)].map((_, i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        ) : loadingError ? (
          <Card className="border-dashed border-red-200 dark:border-red-800">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/20">
                <AlertCircle className="h-8 w-8 text-red-500 dark:text-red-400" />
              </div>
              <CardTitle className="text-xl text-red-700 dark:text-red-300">
                Error Loading Exams
              </CardTitle>
              <CardDescription className="max-w-sm mx-auto text-red-600 dark:text-red-400">
                Unable to load available exams. Please try again later.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : exams.length === 0 ? (
          <Card className="border-dashed">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <CalendarDays className="h-8 w-8 text-muted-foreground" />
              </div>
              <CardTitle className="text-xl">No Exams Found</CardTitle>
              <CardDescription className="max-w-sm mx-auto">
                No exams match your current filters. Try adjusting your search
                criteria.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Exam Grid */}
            <div className="grid gap-3 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {exams.map((exam) => (
                <ExamBookingCard
                  key={exam.id}
                  exam={exam}
                  onBookExam={handleBookExam}
                  isLoading={bookingExamId === exam.id}
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
