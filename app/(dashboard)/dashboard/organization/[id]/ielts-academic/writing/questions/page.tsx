import QuestionsPageClient from "@/components/pages/dashboard/organization/ielts-academic/writing/clients/QuestionsPageClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "IELTS Academic Writing Questions",
  description: "Manage your IELTS Academic Writing Questions",
};

interface WritingQuestionsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function WritingQuestionsPage({
  params,
}: WritingQuestionsPageProps) {
  const { id } = await params;
  const organizationId = parseInt(id, 10);

  return <QuestionsPageClient organizationId={organizationId} />;
}
