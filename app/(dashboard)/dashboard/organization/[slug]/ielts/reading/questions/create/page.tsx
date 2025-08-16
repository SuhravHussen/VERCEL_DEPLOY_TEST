import CreateQuestionPageClient from "@/components/pages/dashboard/organization/ielts-academic/reading/clients/CreateQuestionPageClient";

export default async function CreateQuestionPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { slug } = await params;

  return <CreateQuestionPageClient organizationSlug={slug} />;
}
