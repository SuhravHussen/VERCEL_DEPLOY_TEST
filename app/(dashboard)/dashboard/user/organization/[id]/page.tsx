"use client";

import { OrganizationView } from "@/components/pages/dashboard/user/organization/organization-view";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense, use } from "react";

interface OrganizationPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function OrganizationPage({ params }: OrganizationPageProps) {
  const { id } = use(params);
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <Suspense
        fallback={
          <div className="space-y-4 sm:space-y-6">
            <Skeleton className="h-6 sm:h-8 w-48 sm:w-64 mx-auto sm:mx-0" />
            <Skeleton className="h-48 sm:h-64 w-full" />
          </div>
        }
      >
        <OrganizationView organizationId={id} />
      </Suspense>
    </div>
  );
}
