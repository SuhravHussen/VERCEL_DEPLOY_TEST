import { Metadata } from "next";
import { notFound } from "next/navigation";
import EditWritingPageClient from "@/components/pages/dashboard/organization/ielts-academic/writing/clients/EditWritingPageClient";

export const metadata: Metadata = {
  title: "Edit Writing Task - IELTS Academic",
  description: "Edit an existing writing task for the IELTS Academic exam",
};

interface EditWritingPageProps {
  params: Promise<{
    slug: string;
    questionId: string;
  }>;
}

export default async function EditWritingPage({
  params,
}: EditWritingPageProps) {
  const { slug, questionId } = await params;

  if (!questionId) {
    return notFound();
  }

  return (
    <EditWritingPageClient organizationSlug={slug} questionId={questionId} />
  );
}
