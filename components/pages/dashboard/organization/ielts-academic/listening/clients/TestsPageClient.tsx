"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { PageLayout } from "@/components/ui/page-layout";

import { useGetIeltsListeningTests } from "@/hooks/organization/ielts-academic/listening/use-get-ielts-listening-test";
import { IELTSListeningTest } from "@/types/exam/ielts-academic/listening/listening";
import { SearchFilters } from "./components/SearchFilters";
import { TestGrid } from "./components/TestGrid";
import { TestList } from "./components/TestList";
import { PaginationControls } from "./components/PaginationControls";
import { EmptyState } from "./components/EmptyState";
import { TestDetailDrawer } from "./components/TestDetailDrawer";

export interface TestsPageClientProps {
  organizationSlug: string;
}

export default function TestsPageClient({
  organizationSlug,
}: TestsPageClientProps) {
  // State for filters and pagination
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState<"title" | "createdAt">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [selectedTest, setSelectedTest] = useState<IELTSListeningTest | null>(
    null
  );
  const [isTestDetailOpen, setIsTestDetailOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "detail">("grid");

  // Fetch tests using the hook
  const { data, isLoading } = useGetIeltsListeningTests(
    organizationSlug,
    page,
    10,
    search,
    sortBy,
    sortOrder
  );

  const tests = data?.tests || [];
  const totalPages = data?.totalPages || 0;

  // Filter by difficulty if needed
  const filteredTests =
    difficulty === "all"
      ? tests
      : tests.filter((test) => test.difficulty === difficulty);

  // Event handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setDifficulty("all");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };

  const handleSort = (field: "title" | "createdAt") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setPage(1);
  };

  const handleSelectTest = (test: IELTSListeningTest) => {
    setSelectedTest(test);
    setIsTestDetailOpen(true);
  };

  const handleCloseTestDetail = () => {
    setIsTestDetailOpen(false);
  };

  // Determine if there are active filters
  const hasActiveFilters = search !== "" || difficulty !== "all";

  const handleCreateTest = () => {
    window.location.href = `/dashboard/organization/${organizationSlug}/ielts/listening/tests/create`;
  };

  return (
    <PageLayout
      title="IELTS Listening Tests"
      description="Create and manage your IELTS Academic Listening assessments"
      actionButton={{
        label: "Create New Test",
        onClick: handleCreateTest,
        icon: <PlusCircle className="h-4 w-4" />,
      }}
    >
      {/* Search and Filters */}
      <SearchFilters
        search={search}
        difficulty={difficulty}
        sortBy={sortBy}
        sortOrder={sortOrder}
        viewMode={viewMode}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={handleSearchChange}
        onDifficultyChange={setDifficulty}
        onSort={handleSort}
        onClearFilters={clearFilters}
        onViewModeChange={setViewMode}
      />

      {isLoading ? (
        <TestGrid isLoading={true} />
      ) : filteredTests.length > 0 ? (
        <>
          {/* Tests Display */}
          {viewMode === "grid" ? (
            <TestGrid
              tests={filteredTests}
              selectedTestId={selectedTest?.id}
              onSelectTest={handleSelectTest}
              isLoading={false}
              organizationSlug={organizationSlug}
            />
          ) : (
            <TestList
              tests={filteredTests}
              selectedTestId={selectedTest?.id}
              onSelectTest={handleSelectTest}
              organizationSlug={organizationSlug}
            />
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <PaginationControls
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      ) : (
        <EmptyState
          hasFilters={hasActiveFilters}
          organizationSlug={organizationSlug}
          onClearFilters={clearFilters}
        />
      )}

      {/* Test Detail Drawer */}
      <TestDetailDrawer
        test={selectedTest}
        open={isTestDetailOpen}
        organizationSlug={organizationSlug}
        onClose={handleCloseTestDetail}
      />
    </PageLayout>
  );
}
