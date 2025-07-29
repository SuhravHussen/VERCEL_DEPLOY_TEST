"use client";

import TestEditor from "./components/edit-test/EditTestPageClient";

interface EditTestPageClientProps {
  organizationId: number;
  testId: string;
}

export default function EditTestPageClient({
  organizationId,
  testId,
}: EditTestPageClientProps) {
  return <TestEditor organizationId={organizationId} testId={testId} />;
}
