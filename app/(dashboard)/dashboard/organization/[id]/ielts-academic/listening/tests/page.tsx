import { notFound } from "next/navigation";
import { Suspense } from "react";
import TestsPageClient from "@/components/pages/dashboard/organization/ielts-academic/listening/clients/TestsPageClient";

interface PageParams {
  params: Promise<{
    id: string;
  }>;
}

export default async function ListeningTestsPage({ params }: PageParams) {
  const { id } = await params;
  const organizationId = parseInt(id);

  if (isNaN(organizationId)) {
    return notFound();
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TestsPageClient organizationId={organizationId} />
    </Suspense>
  );
}
