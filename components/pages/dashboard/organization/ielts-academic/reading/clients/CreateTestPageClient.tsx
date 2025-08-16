"use client";

import TestCreator from "./components/create-test/CreateTestPageClient";

interface CreateTestPageClientProps {
  organizationSlug: string;
}

export default function CreateTestPageClient({
  organizationSlug,
}: CreateTestPageClientProps) {
  return <TestCreator organizationSlug={organizationSlug} />;
}
