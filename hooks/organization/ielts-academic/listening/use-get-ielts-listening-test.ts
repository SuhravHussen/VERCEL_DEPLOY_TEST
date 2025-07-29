import { useQuery } from "@tanstack/react-query";
import { IELTSListeningTest } from "@/types/exam/ielts-academic/listening/listening";
import { QUERY_KEYS } from "@/hooks/query-keys";
import mockdb from "@/mockdb";

interface GetIeltsListeningTestsResponse {
  tests: IELTSListeningTest[];
  totalPages: number;
  totalCount: number;
}

// Mock API call - replace with actual API when available
const fetchIeltsListeningTests = async (
  organizationId: number,
  page: number,
  pageSize: number,
  search?: string,
  sortBy?: string,
  sortOrder?: string
): Promise<GetIeltsListeningTestsResponse> => {
  // For now, return mock data
  // In production, this would be a fetch to your API
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay

  // Mock filtering by search term
  let filteredTests = [...mockdb.getIeltsListeningTests()];

  if (search) {
    const searchLower = search.toLowerCase();
    filteredTests = filteredTests.filter(
      (test) =>
        test.title.toLowerCase().includes(searchLower) ||
        test.description?.toLowerCase().includes(searchLower)
    );
  }

  // Mock sorting
  if (sortBy) {
    filteredTests.sort((a, b) => {
      let valueA: string | number | undefined;
      let valueB: string | number | undefined;

      if (sortBy === "title") {
        valueA = a.title;
        valueB = b.title;
      } else if (sortBy === "createdAt") {
        valueA = new Date(a.createdAt).getTime();
        valueB = new Date(b.createdAt).getTime();
      } else {
        valueA = a[sortBy as keyof IELTSListeningTest] as
          | string
          | number
          | undefined;
        valueB = b[sortBy as keyof IELTSListeningTest] as
          | string
          | number
          | undefined;
      }

      // Handle undefined values
      if (valueA === undefined) valueA = "";
      if (valueB === undefined) valueB = "";

      if (sortOrder === "desc") {
        return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
      } else {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      }
    });
  }

  // Mock pagination
  const totalCount = filteredTests.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedTests = filteredTests.slice(startIndex, startIndex + pageSize);

  return {
    tests: paginatedTests,
    totalPages,
    totalCount,
  };
};

export const useGetIeltsListeningTests = (
  organizationId: number,
  page: number = 1,
  pageSize: number = 10,
  search?: string,
  sortBy?: string,
  sortOrder?: string
) => {
  return useQuery({
    queryKey: [
      QUERY_KEYS.IELTS_LISTENING.TESTS,
      organizationId,
      page,
      pageSize,
      search,
      sortBy,
      sortOrder,
    ],
    queryFn: () =>
      fetchIeltsListeningTests(
        organizationId,
        page,
        pageSize,
        search,
        sortBy,
        sortOrder
      ),
    enabled: !!organizationId,
  });
};
