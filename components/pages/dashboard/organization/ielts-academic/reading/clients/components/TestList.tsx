"use client";

import { IELTSReadingTest } from "@/types/exam/ielts-academic/reading/test/test";
import { TestCard } from "./TestCard";
import { FileQuestion, Search } from "lucide-react";
import { Card } from "@/components/ui/card";

interface TestListProps {
  tests: IELTSReadingTest[];
  selectedTestId?: string;
  onSelectTest: (test: IELTSReadingTest) => void;
  isLoading?: boolean;
  searchQuery?: string;
  organizationId: number;
}

export function TestList({
  tests,
  selectedTestId,
  onSelectTest,
  isLoading = false,
  searchQuery = "",
  organizationId,
}: TestListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-6 bg-muted rounded-md w-3/4 mb-2"></div>
            <div className="h-4 bg-muted rounded-md w-full mb-4"></div>
            <div className="flex gap-2">
              <div className="h-5 bg-muted rounded-full w-16"></div>
              <div className="h-5 bg-muted rounded-full w-20"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  // Handle empty state
  if (!tests.length) {
    return (
      <Card className="p-8 text-center flex flex-col items-center justify-center text-muted-foreground">
        {searchQuery ? (
          <>
            <Search className="h-12 w-12 mb-4 opacity-20" />
            <h3 className="font-medium text-lg">No matching tests found</h3>
            <p className="max-w-md mt-1">
              We couldn&apos;t find any tests matching &quot;{searchQuery}
              &quot;. Try adjusting your search.
            </p>
          </>
        ) : (
          <>
            <FileQuestion className="h-12 w-12 mb-4 opacity-20" />
            <h3 className="font-medium text-lg">No tests available</h3>
            <p className="max-w-md mt-1">
              Create your first IELTS reading test to get started.
            </p>
          </>
        )}
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {tests.map((test) => (
        <TestCard
          key={test.id}
          test={test}
          isSelected={test.id === selectedTestId}
          onSelect={onSelectTest}
          layout="list"
          organizationId={organizationId}
        />
      ))}
    </div>
  );
}
