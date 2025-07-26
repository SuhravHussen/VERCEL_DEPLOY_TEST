"use client";

import TestCreator from "./components/create-test/CreateTestPageClient";

interface CreateTestPageClientProps {
  organizationId: number;
}

export default function CreateTestPageClient({
  organizationId,
}: CreateTestPageClientProps) {
  return <TestCreator organizationId={organizationId} />;
}
