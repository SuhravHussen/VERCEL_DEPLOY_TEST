"use client";

import React, { useState } from "react";
import { ExamType } from "@/types/exam/exam";
import {
  useGetPracticeExams,
  usePracticeExamStats,
} from "@/hooks/user/practice/use-get-practice-exams";
import { ExamCard } from "./exam-cards";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BookOpen, Award } from "lucide-react";

interface PracticeSectionProps {
  examType: ExamType;
  title: string;
  description: string;
  onStartPractice?: (examId: string) => void;
}

const PracticeSection: React.FC<PracticeSectionProps> = ({
  examType,
  title,
  description,
  onStartPractice,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data: exams,
    totalPages,
    currentPage,
    totalItems,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = useGetPracticeExams({
    examType,
    itemsPerPage: 6,
    searchQuery,
  });

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <Pagination className="mt-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={goToPreviousPage}
              className={
                !hasPreviousPage
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>

          {startPage > 1 && (
            <>
              <PaginationItem>
                <PaginationLink
                  onClick={() => goToPage(1)}
                  className="cursor-pointer"
                >
                  1
                </PaginationLink>
              </PaginationItem>
              {startPage > 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
            </>
          )}

          {pages.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => goToPage(page)}
                isActive={page === currentPage}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink
                  onClick={() => goToPage(totalPages)}
                  className="cursor-pointer"
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <PaginationNext
              onClick={goToNextPage}
              className={
                !hasNextPage
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Section Header */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex-1">
              <CardTitle className="text-lg sm:text-xl lg:text-2xl">
                {title}
              </CardTitle>
              <CardDescription className="text-sm sm:text-base mt-1 sm:mt-2">
                {description}
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className="text-xs sm:text-sm self-start sm:self-center"
            >
              {totalItems} exams available
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={`Search ${examType.toUpperCase()} practice exams...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-sm sm:text-base"
            />
          </div>
        </CardContent>
      </Card>

      {/* Exams Grid */}
      {exams.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {exams.map((exam) => (
              <ExamCard
                key={exam.id}
                exam={exam}
                onStartPractice={onStartPractice}
              />
            ))}
          </div>
          {renderPagination()}
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No practice exams found
            </h3>
            <p className="text-muted-foreground text-center">
              {searchQuery
                ? `No ${examType.toUpperCase()} exams match your search "${searchQuery}"`
                : `No ${examType.toUpperCase()} practice exams are currently available.`}
            </p>
            {searchQuery && (
              <Button
                variant="outline"
                onClick={() => setSearchQuery("")}
                className="mt-4"
              >
                Clear search
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export const PracticeSections: React.FC<{
  onStartPractice?: (examId: string) => void;
}> = ({ onStartPractice }) => {
  const stats = usePracticeExamStats();

  const examSections = [
    {
      type: ExamType.IELTS,
      title: "IELTS Practice Tests",
      description:
        "Practice for the International English Language Testing System. Improve your listening, reading, writing, and speaking skills with comprehensive practice tests.",
    },
    {
      type: ExamType.TOEFL,
      title: "TOEFL Practice Tests",
      description:
        "Prepare for the Test of English as a Foreign Language with iBT format practice tests covering all four skills.",
    },
    {
      type: ExamType.GRE,
      title: "GRE Practice Tests",
      description:
        "Graduate Record Examination practice tests for verbal reasoning, quantitative reasoning, and analytical writing skills.",
    },
    {
      type: ExamType.SAT,
      title: "SAT Practice Tests",
      description:
        "Standardized test practice for college admissions, covering evidence-based reading, writing, and mathematics.",
    },
    {
      type: ExamType.GMAT,
      title: "GMAT Practice Tests",
      description:
        "Graduate Management Admission Test practice for business school applications with focus on quantitative, verbal, and data insights.",
    },
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Overall Stats */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Award className="h-4 w-4 sm:h-5 sm:w-5" />
            Practice Exam Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="text-center p-3 rounded-lg bg-primary/5">
              <div className="text-xl sm:text-2xl font-bold text-primary">
                {stats.totalPracticeExams}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Total Exams
              </div>
            </div>
            <div className="text-center p-3 rounded-lg bg-secondary/20">
              <div className="text-xl sm:text-2xl font-bold text-foreground">
                {stats.freeExams}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Free Exams
              </div>
            </div>
            <div className="text-center p-3 rounded-lg bg-primary/5">
              <div className="text-xl sm:text-2xl font-bold text-primary">
                {stats.statsByType[ExamType.IELTS] || 0}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                IELTS Tests
              </div>
            </div>
            <div className="text-center p-3 rounded-lg bg-secondary/20">
              <div className="text-xl sm:text-2xl font-bold text-foreground">
                {stats.statsByType[ExamType.TOEFL] || 0}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                TOEFL Tests
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exam Sections Tabs */}
      <Tabs defaultValue={ExamType.IELTS} className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-5 h-auto p-1">
          {examSections.map((section) => (
            <TabsTrigger
              key={section.type}
              value={section.type}
              className="text-xs sm:text-sm px-2 py-2 sm:px-3 sm:py-2.5"
            >
              {section.type.toUpperCase()}
            </TabsTrigger>
          ))}
        </TabsList>

        {examSections.map((section) => (
          <TabsContent
            key={section.type}
            value={section.type}
            className="space-y-6"
          >
            <PracticeSection
              examType={section.type}
              title={section.title}
              description={section.description}
              onStartPractice={onStartPractice}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
