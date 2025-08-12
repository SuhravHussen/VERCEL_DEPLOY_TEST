import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function OrganizationViewSkeleton() {
  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        <Skeleton className="h-20 w-20 sm:h-24 sm:w-24 rounded-xl" />
        <div className="space-y-2 sm:space-y-3 text-center sm:text-left">
          <Skeleton className="h-8 sm:h-10 w-64 sm:w-80 mx-auto sm:mx-0" />
          <Skeleton className="h-5 sm:h-6 w-24 sm:w-32 mx-auto sm:mx-0" />
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 sm:h-7 w-48 sm:w-56" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted/20 p-4 sm:p-6">
            <Skeleton className="h-4 sm:h-5 w-full mb-2 sm:mb-3" />
            <Skeleton className="h-4 sm:h-5 w-4/5 mb-2 sm:mb-3" />
            <Skeleton className="h-4 sm:h-5 w-3/5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
