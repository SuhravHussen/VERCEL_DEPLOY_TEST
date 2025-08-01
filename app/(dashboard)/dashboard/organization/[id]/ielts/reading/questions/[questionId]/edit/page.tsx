import EditQuestionPageClient from "@/components/pages/dashboard/organization/ielts-academic/reading/clients/EditQuestionPageClient";

export default async function EditQuestionPage({
  params,
}: {
  params: Promise<{ id: string; questionId: string }>;
}) {
  const { id, questionId } = await params;
  const organizationId = Number(id);

  return (
    <EditQuestionPageClient
      organizationId={organizationId}
      questionId={questionId}
    />
  );
}
