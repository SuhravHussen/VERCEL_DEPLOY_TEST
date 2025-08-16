import CreateTestPageClient from "@/components/pages/dashboard/organization/ielts-academic/reading/clients/CreateTestPageClient";

export default async function CreateTestPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <CreateTestPageClient organizationSlug={slug} />;
}
