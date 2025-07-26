import QuestionsPageClient from "@/components/pages/dashboard/organization/ielts-academic/writing/clients/QuestionsPageClient";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "IELTS Academic Writing Questions",
  description: "Manage your IELTS Academic Writing Questions",
};

export default async function QuestionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // Check if id is valid
  if (!id || isNaN(parseInt(id))) {
    notFound();
  }

  const organizationId = parseInt(id);

  return (
    <div>
      <QuestionsPageClient organizationId={organizationId} />
    </div>
  );
}
