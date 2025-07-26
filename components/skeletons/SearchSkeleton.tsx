import { Skeleton } from "@/components/ui/skeleton";

interface SearchSkeletonProps {
  hasViewToggle?: boolean;
}

export function SearchSkeleton({ hasViewToggle = false }: SearchSkeletonProps) {
  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex gap-1 sm:gap-2 items-center">
        <div className="bg-card rounded-md flex-1">
          <div className="relative flex w-full items-center">
            <Skeleton className="h-10 sm:h-12 w-full rounded-md" />
          </div>
        </div>

        {hasViewToggle && (
          <div className="flex rounded-md overflow-hidden border border-border">
            <Skeleton className="h-9 w-9 sm:h-10 sm:w-10" />
            <Skeleton className="h-9 w-9 sm:h-10 sm:w-10" />
          </div>
        )}
      </div>
    </div>
  );
}
