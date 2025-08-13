import { Suspense } from "react";
import { redirect } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";
import WritingTestContent from "./WritingTestContent";
import NavigationGuard from "@/components/NavigationGuard";

function WritingTestSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <div className="flex space-x-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Navigation sidebar */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
          <Skeleton className="h-6 w-32 mb-4" />
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-16 w-full mb-2" />
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 p-6">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>

          {/* Text area skeleton */}
          <div className="mt-8">
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function WritingPage({
  searchParams,
}: {
  searchParams: Promise<{ regId?: string; practiceId?: string }>;
}) {
  const { regId, practiceId } = (await searchParams) || {};

  if (!regId && !practiceId) {
    redirect("/exam");
  }

  return (
    <Suspense fallback={<WritingTestSkeleton />}>
      <NavigationGuard
        message="Are you sure you want to leave the exam? Your progress will be lost."
        exitPath="/dashboard"
      >
        <WritingTestContent regId={regId} practiceId={practiceId} />
      </NavigationGuard>
    </Suspense>
  );
}
