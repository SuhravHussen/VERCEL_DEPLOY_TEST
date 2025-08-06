import React, { use } from "react";
import { AssignedExams } from "@/components/pages/dashboard/organization/assigned-exams";

interface AssignedExamsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function AssignedExamsPage({ params }: AssignedExamsPageProps) {
  const { id } = use(params);

  return (
    <div className="container mx-auto px-1 md:px-4 py-6">
      <AssignedExams organizationId={id} />
    </div>
  );
}
