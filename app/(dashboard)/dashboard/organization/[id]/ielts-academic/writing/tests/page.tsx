import { Metadata } from "next";
import { notFound } from "next/navigation";
import TestsPageClient from "@/components/pages/dashboard/organization/ielts-academic/writing/clients/TestsPageClient";

export const metadata: Metadata = {
  title: "IELTS Academic Writing Tests",
  description: "Manage your IELTS Academic Writing Tests",
};

export default async function TestsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // Check if id is valid
  if (!id || isNaN(parseInt(id))) {
    notFound();
  }

  const organizationId = parseInt(id);

  return (
    <div>
      <TestsPageClient organizationId={organizationId} />
    </div>
  );
}
