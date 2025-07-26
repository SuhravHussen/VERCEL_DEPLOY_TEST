"use client";

import { IELTSReadingTest } from "@/types/exam/ielts-academic/reading/test/test";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TestCard } from "./TestCard";

interface TestGridProps {
  tests?: IELTSReadingTest[];
  selectedTestId?: string;
  onSelectTest?: (test: IELTSReadingTest) => void;
  viewMode: "grid" | "detail";
  isLoading: boolean;
}

export function TestGrid({
  tests = [],
  selectedTestId,
  onSelectTest,
  viewMode,
  isLoading,
}: TestGridProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div
          className={`grid grid-cols-1 ${
            viewMode === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : ""
          } gap-4 md:gap-6`}
        >
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-5">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-4 w-1/4 mt-4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6`}
    >
      {tests.map((test) => (
        <TestCard
          key={test.id}
          test={test}
          isSelected={test.id === selectedTestId}
          onSelect={onSelectTest || (() => {})}
          layout="grid"
        />
      ))}
    </div>
  );
}
