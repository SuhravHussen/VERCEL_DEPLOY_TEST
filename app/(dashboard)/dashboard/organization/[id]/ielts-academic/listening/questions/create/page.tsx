import React from "react";
import CreateListeningQuestionPageClient from "@/components/pages/dashboard/organization/ielts-academic/listening/clients/CreateListeningQuestionPageClient";

interface CreateListeningQuestionPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CreateListeningQuestionPage({
  params,
}: CreateListeningQuestionPageProps) {
  const { id } = await params;

  return (
    <CreateListeningQuestionPageClient organizationId={parseInt(id, 10)} />
  );
}
