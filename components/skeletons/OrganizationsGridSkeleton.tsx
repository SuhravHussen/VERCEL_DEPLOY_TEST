import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface OrganizationsGridSkeletonProps {
  count?: number;
  viewMode?: "grid" | "list";
}

export function OrganizationsGridSkeleton({
  count = 6,
  viewMode = "grid",
}: OrganizationsGridSkeletonProps) {
  return (
    <div className="w-full">
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {Array.from({ length: count }).map((_, index) => (
            <Card
              key={index}
              className="flex flex-col overflow-hidden border-border/40 bg-card/50 backdrop-blur-sm"
            >
              <CardHeader className="relative pb-0 pt-3 px-3 sm:pt-6 sm:px-6">
                <div className="h-32 sm:h-40 -mx-3 -mt-3 sm:-mx-6 sm:-mt-6 mb-4 sm:mb-5 relative overflow-hidden">
                  <Skeleton className="h-full w-full" />
                </div>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3" />
              </CardHeader>
              <CardContent className="flex-grow py-3 sm:py-4 px-3 sm:px-6">
                <Skeleton className="h-5 w-1/3 rounded-full" />
              </CardContent>
              <CardFooter className="border-t border-border/30 pt-3 sm:pt-4 px-3 sm:px-6 flex justify-end">
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2 sm:gap-3">
          {Array.from({ length: count }).map((_, index) => (
            <div
              key={index}
              className="border border-border/40 rounded-lg flex items-center p-2 sm:p-4 gap-2 sm:gap-4"
            >
              <Skeleton className="h-12 w-12 sm:h-16 sm:w-16 rounded-md flex-shrink-0" />
              <div className="flex-grow min-w-0">
                <Skeleton className="h-5 w-1/2 mb-2" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/4 rounded-full" />
              </div>
              <div className="ml-auto flex-shrink-0">
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 py-3 sm:py-4 px-1 sm:px-2 mt-4 sm:mt-6">
        <Skeleton className="h-7 w-40 rounded-full" />
        <div className="flex items-center gap-1">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
}
