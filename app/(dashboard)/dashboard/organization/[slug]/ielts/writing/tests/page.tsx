import { Metadata } from "next";
import TestsPageClient from "@/components/pages/dashboard/organization/ielts-academic/writing/clients/TestsPageClient";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "IELTS Academic Writing Tests",
  description: "Manage your IELTS Academic Writing Tests",
};

export default async function TestsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // Check if id is valid
  if (!slug) {
    return notFound();
  }

  return (
    <div>
      <TestsPageClient organizationSlug={slug} />
    </div>
  );
}
