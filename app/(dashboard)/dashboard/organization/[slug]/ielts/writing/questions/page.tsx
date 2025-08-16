import QuestionsPageClient from "@/components/pages/dashboard/organization/ielts-academic/writing/clients/QuestionsPageClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "IELTS Academic Writing Questions",
  description: "Manage your IELTS Academic Writing Questions",
};

interface WritingQuestionsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function WritingQuestionsPage({
  params,
}: WritingQuestionsPageProps) {
  const { slug } = await params;

  return <QuestionsPageClient organizationSlug={slug} />;
}
