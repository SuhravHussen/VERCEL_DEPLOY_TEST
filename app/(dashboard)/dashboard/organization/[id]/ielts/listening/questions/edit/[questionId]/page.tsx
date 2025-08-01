import React from "react";
import EditListeningQuestionPageClient from "@/components/pages/dashboard/organization/ielts-academic/listening/clients/EditListeningQuestionPageClient";

interface EditListeningQuestionPageProps {
  params: Promise<{
    id: string;
    questionId: string;
  }>;
}

export default async function EditListeningQuestionPage({
  params,
}: EditListeningQuestionPageProps) {
  const { id, questionId } = await params;

  return (
    <EditListeningQuestionPageClient
      organizationId={parseInt(id, 10)}
      questionId={questionId}
    />
  );
}
