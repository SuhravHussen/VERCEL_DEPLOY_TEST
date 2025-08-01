import React from "react";
import EditListeningTestPageClient from "@/components/pages/dashboard/organization/ielts-academic/listening/clients/components/edit-test/EditListeningTestPageClient";

interface EditListeningTestPageProps {
  params: Promise<{
    id: string;
    testId: string;
  }>;
}

export default async function EditListeningTestPage({
  params,
}: EditListeningTestPageProps) {
  const { id, testId } = await params;

  return (
    <EditListeningTestPageClient
      organizationId={parseInt(id, 10)}
      testId={testId}
    />
  );
}
