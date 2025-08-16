import { Suspense } from "react";
import TestsPageClient from "@/components/pages/dashboard/organization/ielts-academic/listening/clients/TestsPageClient";

interface PageParams {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ListeningTestsPage({ params }: PageParams) {
  const { slug } = await params;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TestsPageClient organizationSlug={slug} />
    </Suspense>
  );
}
