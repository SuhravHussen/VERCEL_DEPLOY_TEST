import { Metadata } from "next";
import CreateListeningTestPageClient from "@/components/pages/dashboard/organization/ielts-academic/listening/clients/components/create-test/CreateListeningTestPageClient";

export const metadata: Metadata = {
  title: "Create IELTS Listening Test",
  description: "Create a new IELTS Academic Listening test",
};

export default async function CreateListeningTestPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <CreateListeningTestPageClient organizationSlug={slug} />;
}
