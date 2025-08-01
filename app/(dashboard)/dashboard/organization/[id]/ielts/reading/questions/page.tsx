import QuestionsPageClient from "@/components/pages/dashboard/organization/ielts-academic/reading/clients/QuestionsPageClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "IELTS Reading Questions",
  description: "Manage your IELTS Reading questions",
};

interface ReadingQuestionsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ReadingQuestionsPage({
  params,
}: ReadingQuestionsPageProps) {
  const { id } = await params;
  const organizationId = parseInt(id, 10);

  return <QuestionsPageClient organizationId={organizationId} />;
}
