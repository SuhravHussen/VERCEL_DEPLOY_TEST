import { Metadata } from "next";
import { notFound } from "next/navigation";
import EditTestPageClient from "@/components/pages/dashboard/organization/ielts-academic/writing/clients/EditTestPageClient";

export const metadata: Metadata = {
  title: "Edit Writing Test - IELTS Academic",
  description: "Edit an existing writing test for the IELTS Academic exam",
};

interface EditTestPageProps {
  params: Promise<{
    slug: string;
    testId: string;
  }>;
}

export default async function EditTestPage({ params }: EditTestPageProps) {
  const { slug, testId } = await params;

  if (!testId) {
    return notFound();
  }

  return <EditTestPageClient organizationSlug={slug} testId={testId} />;
}
