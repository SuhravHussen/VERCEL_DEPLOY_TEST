import { Metadata } from "next";
import { notFound } from "next/navigation";
import EditWritingPageClient from "@/components/pages/dashboard/organization/ielts-academic/writing/clients/EditWritingPageClient";

export const metadata: Metadata = {
  title: "Edit Writing Task - IELTS Academic",
  description: "Edit an existing writing task for the IELTS Academic exam",
};

interface EditWritingPageProps {
  params: Promise<{
    id: string;
    questionId: string;
  }>;
}

export default async function EditWritingPage({
  params,
}: EditWritingPageProps) {
  const { id, questionId } = await params;
  const organizationId = parseInt(id);

  if (isNaN(organizationId)) {
    return notFound();
  }

  if (!questionId) {
    return notFound();
  }

  return (
    <EditWritingPageClient
      organizationId={organizationId}
      questionId={questionId}
    />
  );
}
