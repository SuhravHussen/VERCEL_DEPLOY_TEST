import { Metadata } from "next";
import { notFound } from "next/navigation";
import CreateTestPageClient from "@/components/pages/dashboard/organization/ielts-academic/writing/clients/CreateTestPageClient";

export const metadata: Metadata = {
  title: "Create IELTS Writing Test",
  description: "Create a new IELTS Academic Writing Test",
};

export default async function CreateTestPage({
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
      <CreateTestPageClient organizationSlug={slug} />
    </div>
  );
}
