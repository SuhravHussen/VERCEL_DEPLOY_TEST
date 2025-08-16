import TestsPageClient from "@/components/pages/dashboard/organization/ielts-academic/reading/clients/TestsPageClient";

export default async function TestsPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  // Get the dictionary based on the language
  const { slug } = await params;

  return <TestsPageClient organizationSlug={slug} />;
}
