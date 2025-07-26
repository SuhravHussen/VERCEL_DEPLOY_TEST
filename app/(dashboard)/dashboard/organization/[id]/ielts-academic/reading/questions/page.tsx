import QuestionsPageClient from "@/components/pages/dashboard/organization/ielts-academic/reading/clients/QuestionsPageClient";

export default async function QuestionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Get the dictionary based on the language
  const { id } = await params;

  const organizationId = Number(id);

  return <QuestionsPageClient organizationId={organizationId} />;
}
