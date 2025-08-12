import { Suspense } from "react";
import { redirect } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";
import ListeningTestContent from "./LsiteningTestContent";

function ListeningTestSkeleton() {
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
        <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
          <Skeleton className="h-6 w-32 mb-4" />
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full mb-2" />
          ))}
        </div>

        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-10 w-80" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function ListeningPage({
  searchParams,
}: {
  searchParams: Promise<{ regId?: string }>;
}) {
  const { regId } = (await searchParams) || {};

  if (!regId) {
    redirect("/exam");
  }

  return (
    <Suspense fallback={<ListeningTestSkeleton />}>
      <ListeningTestContent regId={regId} />
    </Suspense>
  );
}
