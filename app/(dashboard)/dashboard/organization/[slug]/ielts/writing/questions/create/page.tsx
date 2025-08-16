import { Metadata } from "next";
import CreateWritingPageClient from "@/components/pages/dashboard/organization/ielts-academic/writing/clients/CreateWritingPageClient";

export const metadata: Metadata = {
  title: "Create Writing Task - IELTS Academic",
  description: "Create a new writing task for the IELTS Academic exam",
};

interface CreateWritingPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CreateWritingPage({
  params,
}: CreateWritingPageProps) {
  const { slug } = await params;

  return <CreateWritingPageClient organizationSlug={slug} />;
}
