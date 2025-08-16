import React from "react";
import CreateListeningQuestionPageClient from "@/components/pages/dashboard/organization/ielts-academic/listening/clients/CreateListeningQuestionPageClient";

interface CreateListeningQuestionPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CreateListeningQuestionPage({
  params,
}: CreateListeningQuestionPageProps) {
  const { slug } = await params;

  return <CreateListeningQuestionPageClient organizationSlug={slug} />;
}
