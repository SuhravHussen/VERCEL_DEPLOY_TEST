import { Metadata } from "next";
import { notFound } from "next/navigation";
import EditTestPageClient from "@/components/pages/dashboard/organization/ielts-academic/writing/clients/EditTestPageClient";

export const metadata: Metadata = {
  title: "Edit Writing Test - IELTS Academic",
  description: "Edit an existing writing test for the IELTS Academic exam",
};

interface EditTestPageProps {
  params: Promise<{
    id: string;
    testId: string;
  }>;
}

export default async function EditTestPage({ params }: EditTestPageProps) {
  const { id, testId } = await params;
  const organizationId = parseInt(id);

  if (isNaN(organizationId)) {
    return notFound();
  }

  if (!testId) {
    return notFound();
  }

  return <EditTestPageClient organizationId={organizationId} testId={testId} />;
}
