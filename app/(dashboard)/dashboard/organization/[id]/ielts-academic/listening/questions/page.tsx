import { Metadata } from "next";
import QuestionsPageClient from "@/components/pages/dashboard/organization/ielts-academic/listening/clients/QuestionsPageClient";

export const metadata: Metadata = {
  title: "IELTS Listening Questions",
  description: "Manage your IELTS Listening questions",
};

interface ListeningQuestionsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ListeningQuestionsPage({
  params,
}: ListeningQuestionsPageProps) {
  const { id } = await params;
  const organizationId = parseInt(id, 10);

  return <QuestionsPageClient organizationId={organizationId} />;
}
