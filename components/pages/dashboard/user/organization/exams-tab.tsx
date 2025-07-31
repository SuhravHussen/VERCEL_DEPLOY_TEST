"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  Calendar,
  FileText,
  Filter,
  SortAsc,
  SortDesc,
  Users,
} from "lucide-react";
import { useUserOrganizationExams } from "@/hooks/user/organization/use-user-organization-exams";
import { IELTSExamModel } from "@/types/exam/ielts-academic/exam";
import { CurrencySymbols } from "@/types/currency";

interface ExamsTabProps {
  organizationId: string;
}

export function ExamsTab({ organizationId }: ExamsTabProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<"date" | "price" | "title">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [priceFilter, setPriceFilter] = useState<"all" | "free" | "paid">(
    "all"
  );

  const { exams, totalCount, totalPages, isLoading, error } =
    useUserOrganizationExams({
      organizationId,
      page: currentPage,
      pageSize: 6,
      sortBy,
      sortOrder,
      priceFilter,
    });

  const handleSortToggle = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatPrice = (exam: IELTSExamModel) => {
    if (exam.is_free) return "Free";
    const symbol = CurrencySymbols[exam.currency] || exam.currency;
    return `${symbol}${exam.price}`;
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
            <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Exams</h3>
            <p className="text-sm text-muted-foreground">Error loading exams</p>
          </div>
        </div>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="text-center py-12">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
          <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-grow">
          <h3 className="text-xl font-semibold">Exams</h3>
          <p className="text-sm text-muted-foreground">
            {totalCount} available exams
          </p>
        </div>
      </div>

      {/* Filters and Sorting */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              {/* Price Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={priceFilter}
                  onValueChange={(value: "all" | "free" | "paid") =>
                    setPriceFilter(value)
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Exams</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Select
                  value={sortBy}
                  onValueChange={(value: "date" | "price" | "title") =>
                    setSortBy(value)
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSortToggle}
                  className="px-2"
                >
                  {sortOrder === "asc" ? (
                    <SortAsc className="h-4 w-4" />
                  ) : (
                    <SortDesc className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Results Count */}
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * 6 + 1} -{" "}
              {Math.min(currentPage * 6, totalCount)} of {totalCount} exams
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exams Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : exams.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent>
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h4 className="text-lg font-medium mb-2">No exams found</h4>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                {priceFilter === "free"
                  ? "No free exams are currently available."
                  : priceFilter === "paid"
                  ? "No paid exams are currently available."
                  : "No exams are currently available for this organization."}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <Card
              key={exam.id}
              className="border-0 shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg leading-tight line-clamp-2">
                    {exam.title}
                  </CardTitle>
                  <Badge
                    variant={exam.is_free ? "secondary" : "default"}
                    className="ml-2 flex-shrink-0"
                  >
                    {formatPrice(exam)}
                  </Badge>
                </div>
                {exam.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {exam.description}
                  </p>
                )}
              </CardHeader>
              <CardContent className="flex flex-col flex-grow">
                <div className="space-y-3 flex-grow">
                  {/* Exam Date */}
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {formatDate(exam.lrw_group.exam_date)}
                    </span>
                  </div>

                  {/* LRW Test Times */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Test Schedule
                    </div>

                    <div className="space-y-1 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Listening:
                        </span>
                        <span className="font-medium">
                          {formatTime(exam.lrw_group.listening_time_start)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Reading:</span>
                        <span className="font-medium">
                          {formatTime(exam.lrw_group.reading_time_start)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Writing:</span>
                        <span className="font-medium">
                          {formatTime(exam.lrw_group.writing_time_start)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Speaking Time Windows */}
                  {exam.speaking_group.time_windows &&
                    exam.speaking_group.time_windows.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Speaking Sessions
                        </div>
                        <div className="space-y-1 text-sm">
                          {exam.speaking_group.time_windows
                            .slice(0, 2)
                            .map((window, index) => (
                              <div
                                key={window.id || index}
                                className="flex items-center justify-between"
                              >
                                <span className="text-muted-foreground">
                                  {formatDate(window.date)}:
                                </span>
                                <span className="font-medium">
                                  {formatTime(window.start_time)} -{" "}
                                  {formatTime(window.end_time)}
                                </span>
                              </div>
                            ))}
                          {exam.speaking_group.time_windows.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{exam.speaking_group.time_windows.length - 2}{" "}
                              more slots
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                  {/* Registration Deadline */}
                  {exam.registration_deadline && (
                    <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Register by {formatDate(exam.registration_deadline)}
                      </span>
                    </div>
                  )}

                  {/* Max Students */}
                  {exam.max_students && (
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>Max {exam.max_students} students</span>
                    </div>
                  )}
                </div>

                {/* Register Button - Always at bottom */}
                <div className="pt-4 mt-auto">
                  <Button size="sm" className="w-full">
                    Register
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && exams.length > 0 && totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => {
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(pageNum);
                          }}
                          isActive={currentPage === pageNum}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (
                    pageNum === currentPage - 2 ||
                    pageNum === currentPage + 2
                  ) {
                    return (
                      <PaginationItem key={pageNum}>
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
                    if (currentPage < totalPages)
                      setCurrentPage(currentPage + 1);
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
