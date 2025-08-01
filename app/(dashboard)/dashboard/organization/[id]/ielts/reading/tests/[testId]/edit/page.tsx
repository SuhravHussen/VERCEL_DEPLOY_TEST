import EditTestPageClient from "@/components/pages/dashboard/organization/ielts-academic/reading/clients/EditTestPageClient";

export default async function EditTestPage({
  params,
}: {
  params: Promise<{ id: string; testId: string }>;
}) {
  const { id, testId } = await params;
  const organizationId = Number(id);

  return <EditTestPageClient organizationId={organizationId} testId={testId} />;
}
