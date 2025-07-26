import { Metadata } from "next";
import { notFound } from "next/navigation";
import CreateWritingPageClient from "@/components/pages/dashboard/organization/ielts-academic/writing/clients/CreateWritingPageClient";

export const metadata: Metadata = {
  title: "Create Writing Task - IELTS Academic",
  description: "Create a new writing task for the IELTS Academic exam",
};

interface CreateWritingPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CreateWritingPage({
  params,
}: CreateWritingPageProps) {
  const { id } = await params;
  const organizationId = parseInt(id);

  if (isNaN(organizationId)) {
    return notFound();
  }

  return <CreateWritingPageClient organizationId={organizationId} />;
}
