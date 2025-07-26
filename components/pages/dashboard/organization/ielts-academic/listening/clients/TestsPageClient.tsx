"use client";

import { useState } from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useGetIeltsListeningTests } from "@/hooks/organization/ielts-academic/listening/use-get-ielts-listening-test";
import { IELTSListeningTest } from "@/types/exam/ielts-academic/listening/listening";
import { SearchFilters } from "./components/SearchFilters";
import { TestGrid } from "./components/TestGrid";
import { TestList } from "./components/TestList";
import { PaginationControls } from "./components/PaginationControls";
import { EmptyState } from "./components/EmptyState";
import { TestDetailDrawer } from "./components/TestDetailDrawer";

export interface TestsPageClientProps {
  organizationId: number;
}

export default function TestsPageClient({
  organizationId,
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
    organizationId,
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

  return (
    <div className="container mx-auto py-6 md:py-10 animate-in fade-in duration-300 p-2 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pb-6 border-b">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            IELTS Listening Tests
          </h1>
          <p className="text-muted-foreground text-lg">
            Create and manage your IELTS Academic Listening assessments
          </p>
        </div>
        <Link
          href={`/dashboard/organization/${organizationId}/ielts-academic/listening/tests/create`}
          className="shrink-0"
        >
          <Button className="w-full md:w-auto shadow-sm" size="lg">
            <PlusCircle className="mr-2 h-5 w-5" />
            Create New Test
          </Button>
        </Link>
      </div>

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
            />
          ) : (
            <TestList
              tests={filteredTests}
              selectedTestId={selectedTest?.id}
              onSelectTest={handleSelectTest}
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
          organizationId={organizationId}
          onClearFilters={clearFilters}
        />
      )}

      {/* Test Detail Drawer */}
      <TestDetailDrawer
        test={selectedTest}
        open={isTestDetailOpen}
        organizationId={organizationId}
        onClose={handleCloseTestDetail}
      />
    </div>
  );
}
