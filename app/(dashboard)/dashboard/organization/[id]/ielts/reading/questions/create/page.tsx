import CreateQuestionPageClient from "@/components/pages/dashboard/organization/ielts-academic/reading/clients/CreateQuestionPageClient";

export default async function CreateQuestionPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { id } = await params;
  const organizationId = Number(id);

  return <CreateQuestionPageClient organizationId={organizationId} />;
}
