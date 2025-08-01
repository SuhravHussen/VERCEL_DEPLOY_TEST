import TestsPageClient from "@/components/pages/dashboard/organization/ielts-academic/reading/clients/TestsPageClient";

export default async function TestsPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  // Get the dictionary based on the language
  const { id } = await params;

  const organizationId = Number(id);

  return <TestsPageClient organizationId={organizationId} />;
}
