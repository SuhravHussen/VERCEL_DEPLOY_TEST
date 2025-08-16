import EditQuestionPageClient from "@/components/pages/dashboard/organization/ielts-academic/reading/clients/EditQuestionPageClient";

export default async function EditQuestionPage({
  params,
}: {
  params: Promise<{ slug: string; questionId: string }>;
}) {
  const { slug, questionId } = await params;

  return (
    <EditQuestionPageClient organizationSlug={slug} questionId={questionId} />
  );
}
