import { Metadata } from "next";
import QuestionsPageClient from "@/components/pages/dashboard/organization/ielts-academic/listening/clients/QuestionsPageClient";

export const metadata: Metadata = {
  title: "IELTS Listening Questions",
  description: "Manage your IELTS Listening questions",
};

interface ListeningQuestionsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ListeningQuestionsPage({
  params,
}: ListeningQuestionsPageProps) {
  const { slug } = await params;

  return <QuestionsPageClient organizationSlug={slug} />;
}
