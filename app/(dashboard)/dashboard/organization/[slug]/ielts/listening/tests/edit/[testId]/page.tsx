import React from "react";
import EditListeningTestPageClient from "@/components/pages/dashboard/organization/ielts-academic/listening/clients/components/edit-test/EditListeningTestPageClient";

interface EditListeningTestPageProps {
  params: Promise<{
    slug: string;
    testId: string;
  }>;
}

export default async function EditListeningTestPage({
  params,
}: EditListeningTestPageProps) {
  const { slug, testId } = await params;

  return (
    <EditListeningTestPageClient organizationSlug={slug} testId={testId} />
  );
}
