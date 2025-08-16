import React from "react";
import EditListeningQuestionPageClient from "@/components/pages/dashboard/organization/ielts-academic/listening/clients/EditListeningQuestionPageClient";

interface EditListeningQuestionPageProps {
  params: Promise<{
    slug: string;
    questionId: string;
  }>;
}

export default async function EditListeningQuestionPage({
  params,
}: EditListeningQuestionPageProps) {
  const { slug, questionId } = await params;

  return (
    <EditListeningQuestionPageClient
      organizationSlug={slug}
      questionId={questionId}
    />
  );
}
