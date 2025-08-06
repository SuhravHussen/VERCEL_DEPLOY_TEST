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

// Helper function to split IELTS exams into individual test exams
const splitIELTSExam = (exam: ExamModel): ExamModel[] => {
  if (exam.type_of_exam !== ExamType.IELTS) {
    return [exam];
  }

  const splitExams: ExamModel[] = [];

  // Create listening exam if listening_test exists
  if (exam.listening_test) {
    splitExams.push({
      ...exam,
      title: `${exam.title} - Listening`,
      reading_test: undefined,
      writing_test: undefined,
    });
  }

  // Create reading exam if reading_test exists
  if (exam.reading_test) {
    splitExams.push({
      ...exam,
      title: `${exam.title} - Reading`,
      listening_test: undefined,
      writing_test: undefined,
    });
  }

  // Create writing exam if writing_test exists
  if (exam.writing_test) {
    splitExams.push({
      ...exam,
      title: `${exam.title} - Writing`,
      listening_test: undefined,
      reading_test: undefined,
    });
  }

  // If no tests are present, return the original exam
  return splitExams.length > 0 ? splitExams : [exam];
};

export const useGetPracticeExams = ({
  examType = "all",
  itemsPerPage = 6,
  searchQuery = "",
}: UseGetPracticeExamsProps = {}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const filteredExams = useMemo(() => {
    // Start with all exams from mock data
    const exams = mockAllExams;

    // Split IELTS exams into individual test exams
    const processedExams: ExamModel[] = [];
    exams.forEach((exam) => {
      const splitResults = splitIELTSExam(exam);
      processedExams.push(...splitResults);
    });

    // Filter by exam type
    let filteredResults = processedExams;
    if (examType !== "all") {
      filteredResults = processedExams.filter(
        (exam) => exam.type_of_exam === examType
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredResults = filteredResults.filter(
        (exam) =>
          exam.title.toLowerCase().includes(query) ||
          exam.description?.toLowerCase().includes(query)
      );
    }

    return filteredResults;
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

    // Split IELTS exams into individual test exams for accurate statistics
    const processedExams: ExamModel[] = [];
    allExams.forEach((exam) => {
      const splitResults = splitIELTSExam(exam);
      processedExams.push(...splitResults);
    });

    const statsByType = processedExams.reduce((acc, exam) => {
      acc[exam.type_of_exam] = (acc[exam.type_of_exam] || 0) + 1;
      return acc;
    }, {} as Record<ExamType, number>);

    return {
      totalPracticeExams: processedExams.length,
      statsByType,
      freeExams: processedExams.filter((exam) => exam.is_free).length,
    };
  }, []);

  return stats;
};
