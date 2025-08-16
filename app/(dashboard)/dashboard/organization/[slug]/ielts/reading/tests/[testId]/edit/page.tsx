import EditTestPageClient from "@/components/pages/dashboard/organization/ielts-academic/reading/clients/EditTestPageClient";

export default async function EditTestPage({
  params,
}: {
  params: Promise<{ slug: string; testId: string }>;
}) {
  const { slug, testId } = await params;

  return <EditTestPageClient organizationSlug={slug} testId={testId} />;
}
