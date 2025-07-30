import { useState, useEffect, useMemo } from "react";
import { IELTSExamModel } from "@/types/exam/ielts-academic/exam";
import mockdb from "@/mockdb";

interface UseUserOrganizationExamsParams {
  organizationId: string;
  page?: number;
  pageSize?: number;
  sortBy?: "date" | "price" | "title";
  sortOrder?: "asc" | "desc";
  priceFilter?: "all" | "free" | "paid";
}

interface UseUserOrganizationExamsResult {
  exams: IELTSExamModel[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
}

export function useUserOrganizationExams({
  organizationId,
  page = 1,
  pageSize = 6,
  sortBy = "date",
  sortOrder = "asc",
  priceFilter = "all",
}: UseUserOrganizationExamsParams): UseUserOrganizationExamsResult {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate loading delay
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [organizationId, page, sortBy, sortOrder, priceFilter]);

  const { filteredAndSortedExams, totalCount } = useMemo(() => {
    try {
      // Get all exams from mockdb
      const allExams = mockdb.getIeltsExams();

      // Filter exams by registration deadline (only show future exams)
      const now = new Date();
      const activeExams = allExams.filter((exam) => {
        if (!exam.registration_deadline) return true; // If no deadline, show it
        return new Date(exam.registration_deadline) > now;
      });

      // Filter by price
      let filteredExams = activeExams;
      if (priceFilter === "free") {
        filteredExams = activeExams.filter((exam) => exam.is_free);
      } else if (priceFilter === "paid") {
        filteredExams = activeExams.filter((exam) => !exam.is_free);
      }

      // Sort exams
      const sortedExams = [...filteredExams].sort((a, b) => {
        let comparison = 0;

        switch (sortBy) {
          case "date":
            const dateA = new Date(a.lrw_group.exam_date);
            const dateB = new Date(b.lrw_group.exam_date);
            comparison = dateA.getTime() - dateB.getTime();
            break;
          case "price":
            comparison = a.price - b.price;
            break;
          case "title":
            comparison = a.title.localeCompare(b.title);
            break;
          default:
            comparison = 0;
        }

        return sortOrder === "desc" ? -comparison : comparison;
      });

      return {
        filteredAndSortedExams: sortedExams,
        totalCount: sortedExams.length,
      };
    } catch (err) {
      console.error("Error fetching organization exams:", err);
      setError("Failed to load exams");
      return {
        filteredAndSortedExams: [],
        totalCount: 0,
      };
    }
  }, [organizationId, sortBy, sortOrder, priceFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedExams = filteredAndSortedExams.slice(startIndex, endIndex);

  return {
    exams: paginatedExams,
    totalCount,
    totalPages,
    currentPage: page,
    isLoading,
    error,
  };
}
