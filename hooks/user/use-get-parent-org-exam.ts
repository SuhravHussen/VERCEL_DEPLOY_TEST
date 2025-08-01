import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/hooks/query-keys";
import { mockAllExams } from "@/mockdata/mockIeltsExam";
import { ExamModel, ExamFilters } from "@/types/exam/exam";

interface UseGetParentOrgExamsProps {
  enabled?: boolean;
  page?: number;
  pageSize?: number;
  filters?: ExamFilters;
}

interface PaginatedExams {
  exams: ExamModel[];
  totalExams: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export function useGetParentOrgExams({
  enabled = true,
  page = 1,
  pageSize = 9,
  filters,
}: UseGetParentOrgExamsProps) {
  return useQuery({
    queryKey: [
      ...QUERY_KEYS.ALL_EXAMS.LIST,
      "available",
      page,
      pageSize,
      filters,
    ],
    queryFn: async (): Promise<PaginatedExams> => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      let filteredExams = [...mockAllExams];

      // Apply filters if provided
      if (filters) {
        // Filter by exam type
        if (filters.examType && filters.examType !== "all") {
          filteredExams = filteredExams.filter(
            (exam) => exam.type_of_exam === filters.examType
          );
        }

        // Filter by price
        if (filters.priceFilter && filters.priceFilter !== "all") {
          if (filters.priceFilter === "free") {
            filteredExams = filteredExams.filter((exam) => exam.is_free);
          } else if (filters.priceFilter === "paid") {
            filteredExams = filteredExams.filter((exam) => !exam.is_free);
          }
        }

        // Filter by search query
        if (filters.searchQuery && filters.searchQuery.trim()) {
          const query = filters.searchQuery.toLowerCase().trim();
          filteredExams = filteredExams.filter(
            (exam) =>
              exam.title.toLowerCase().includes(query) ||
              exam.description?.toLowerCase().includes(query) ||
              exam.type_of_exam.toLowerCase().includes(query)
          );
        }

        // Sort exams
        const sortBy = filters.sortBy || "created_at";
        const sortOrder = filters.sortOrder || "desc";

        filteredExams.sort((a, b) => {
          let comparison = 0;

          switch (sortBy) {
            case "date":
              const dateA = new Date(
                a?.lrw_group?.exam_date || a.created_at || ""
              );
              const dateB = new Date(
                b?.lrw_group?.exam_date || b.created_at || ""
              );
              comparison = dateA.getTime() - dateB.getTime();
              break;
            case "price":
              comparison = a.price - b.price;
              break;
            case "title":
              comparison = a.title.localeCompare(b.title);
              break;
            case "created_at":
              const createdA = new Date(a.created_at || "");
              const createdB = new Date(b.created_at || "");
              comparison = createdA.getTime() - createdB.getTime();
              break;
            default:
              comparison = 0;
          }

          return sortOrder === "desc" ? -comparison : comparison;
        });
      }

      // Only show published exams
      filteredExams = filteredExams.filter((exam) => exam.is_published);

      const totalExams = filteredExams.length;
      const totalPages = Math.ceil(totalExams / pageSize);

      // Calculate pagination
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const exams = filteredExams.slice(startIndex, endIndex);

      return {
        exams,
        totalExams,
        totalPages,
        currentPage: page,
        pageSize,
      };
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useGetExamById(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.ALL_EXAMS.BY_ORGANIZATION("public").concat([
      "by-id",
      id,
    ]),
    queryFn: async (): Promise<ExamModel | undefined> => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      const exam = mockAllExams.find((exam) => exam.id === id);
      return exam;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
