import CreateTestPageClient from "@/components/pages/dashboard/organization/ielts-academic/reading/clients/CreateTestPageClient";

export default async function CreateTestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const organizationId = Number(id);

  return <CreateTestPageClient organizationId={organizationId} />;
}
