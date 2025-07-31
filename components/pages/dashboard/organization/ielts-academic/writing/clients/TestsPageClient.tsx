"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageLayout } from "@/components/ui/page-layout";
import { EmptyState } from "@/components/ui/empty-state";
import { useRouter } from "next/navigation";
import { PlusCircle, FileText, Plus } from "lucide-react";
import { useGetIeltsWritingTests } from "@/hooks/organization/ielts-academic/writing/use-get-ielts-writing-tests";
import { TestFilters } from "./test-page/TestFilters";
import { TestCard } from "./test-page/TestCard";
import { TestsPagination } from "./test-page/TestsPagination";

export interface TestsPageClientProps {
  organizationId: number;
}

export default function TestsPageClient({
  organizationId,
}: TestsPageClientProps) {
  const router = useRouter();

  // State for search, filters, pagination
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"title" | "createdAt" | "difficulty">(
    "createdAt"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  // Fetch tests data
  const { data, isLoading, isFetching, error } = useGetIeltsWritingTests(
    organizationId,
    page,
    10,
    search,
    sortBy,
    sortOrder,
    status !== "all" ? status : undefined
  );

  const tests = data?.tests || [];
  const totalPages = data?.totalPages || 0;

  // Reset pagination when search/filters change
  useEffect(() => {
    setPage(1);
  }, [search, status, sortBy, sortOrder]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setSortBy("createdAt");
    setSortOrder("desc");
  };

  const handleSort = (field: string) => {
    if (field === "title" || field === "createdAt" || field === "difficulty") {
      if (sortBy === field) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
        setSortBy(field as "title" | "createdAt" | "difficulty");
        setSortOrder("asc");
      }
    }
  };

  const isDataLoading = isLoading || isFetching;

  const handleCreateTest = () => {
    router.push(
      `/dashboard/organization/${organizationId}/ielts-academic/writing/tests/create`
    );
  };

  return (
    <PageLayout
      title="IELTS Academic Writing Tests"
      description="Manage and create standardized IELTS Academic Writing tests for your organization."
      actionButton={{
        label: "Create New Test",
        onClick: handleCreateTest,
        icon: <PlusCircle className="h-4 w-4" />,
      }}
    >
      <div className="grid grid-cols-1 gap-6">
        <Card className="overflow-hidden border-none shadow-lg">
          <div className="bg-muted/30 backdrop-blur-sm p-4">
            {/* Search and filters */}
            <TestFilters
              search={search}
              status={status}
              sortBy={sortBy}
              sortOrder={sortOrder}
              handleSearchChange={handleSearchChange}
              setStatus={setStatus}
              handleSort={handleSort}
              clearFilters={clearFilters}
            />
          </div>

          {/* Tests list */}
          <div className="p-4 space-y-3 min-h-[400px]">
            {isDataLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 rounded-lg border border-border/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex justify-between mt-3">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))
            ) : error ? (
              <div className="text-center py-8 text-destructive">
                <p>Error loading tests.</p>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="mt-2"
                >
                  Retry
                </Button>
              </div>
            ) : tests.length === 0 ? (
              <EmptyState
                icon={<FileText className="h-8 w-8 text-muted-foreground" />}
                title="No tests found"
                description="Create your first IELTS Academic Writing Test to get started"
                searchQuery={search}
                onClearSearch={() => clearFilters()}
                primaryAction={{
                  label: "Create New Test",
                  onClick: handleCreateTest,
                  icon: <Plus className="h-4 w-4" />,
                }}
              />
            ) : (
              tests.map((test, index) => (
                <TestCard
                  key={index}
                  test={test}
                  organizationId={organizationId}
                />
              ))
            )}
          </div>

          {/* Pagination */}
          {!isDataLoading && tests.length > 0 && totalPages > 1 && (
            <div className="border-t p-4 bg-background flex justify-center">
              <TestsPagination
                totalPages={totalPages}
                page={page}
                setPage={setPage}
              />
            </div>
          )}
        </Card>
      </div>
    </PageLayout>
  );
}
