"use client";

import TestEditor from "./components/edit-test/EditTestPageClient";

interface EditTestPageClientProps {
  organizationSlug: string;
  testId: string;
}

export default function EditTestPageClient({
  organizationSlug,
  testId,
}: EditTestPageClientProps) {
  return <TestEditor organizationSlug={organizationSlug} testId={testId} />;
}
