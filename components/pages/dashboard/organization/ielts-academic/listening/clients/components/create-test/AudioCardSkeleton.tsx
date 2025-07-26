"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AudioCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-5 w-16" />
        </div>

        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-1/3" />
        </div>

        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-1/4" />
        </div>

        <div className="mt-3 pt-3 border-t border-dashed">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            <Skeleton className="h-5 w-14" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-12" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );
}
