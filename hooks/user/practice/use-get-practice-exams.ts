import { useState, useMemo } from "react";
import { ExamModel, ExamType } from "@/types/exam/exam";
import { mockAllExams } from "@/mockdata/mockIeltsExam";

interface PaginationResult {
  data: ExamModel[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface UseGetPracticeExamsProps {
  examType?: ExamType | "all";
  itemsPerPage?: number;
  searchQuery?: string;
}

export const useGetPracticeExams = ({
  examType = "all",
  itemsPerPage = 6,
  searchQuery = "",
}: UseGetPracticeExamsProps = {}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const filteredExams = useMemo(() => {
    // Return all exams from mock data
    let exams = mockAllExams;

    // Filter by exam type
    if (examType !== "all") {
      exams = exams.filter((exam) => exam.type_of_exam === examType);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      exams = exams.filter(
        (exam) =>
          exam.title.toLowerCase().includes(query) ||
          exam.description?.toLowerCase().includes(query)
      );
    }

    return exams;
  }, [examType, searchQuery]);

  const paginationResult: PaginationResult = useMemo(() => {
    const totalItems = filteredExams.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const data = filteredExams.slice(startIndex, endIndex);

    return {
      data,
      totalPages,
      currentPage,
      totalItems,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    };
  }, [filteredExams, currentPage, itemsPerPage]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= paginationResult.totalPages) {
      setCurrentPage(page);
    }
  };

  const goToNextPage = () => {
    if (paginationResult.hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (paginationResult.hasPreviousPage) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const resetPage = () => {
    setCurrentPage(1);
  };

  return {
    ...paginationResult,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    resetPage,
    isLoading: false, // Since we're using mock data
    error: null,
  };
};

// Hook for getting exam statistics
export const usePracticeExamStats = () => {
  const stats = useMemo(() => {
    const allExams = mockAllExams;

    const statsByType = allExams.reduce((acc, exam) => {
      acc[exam.type_of_exam] = (acc[exam.type_of_exam] || 0) + 1;
      return acc;
    }, {} as Record<ExamType, number>);

    return {
      totalPracticeExams: allExams.length,
      statsByType,
      freeExams: allExams.filter((exam) => exam.is_free).length,
    };
  }, []);

  return stats;
};
