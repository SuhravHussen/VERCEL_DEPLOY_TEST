import { Button } from "@/components/ui/button";
import { FilePlus } from "lucide-react";
import Link from "next/link";

interface QuestionsPageHeaderProps {
  organizationId: number;
  dashboardText: {
    title: string;
    subtitle: string;
  };
}

export function QuestionsPageHeader({
  organizationId,
  dashboardText,
}: QuestionsPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {dashboardText.title}
        </h1>
        <p className="text-muted-foreground">{dashboardText.subtitle}</p>
      </div>
      <Link
        href={`/dashboard/organization/${organizationId}/ielts/reading/questions/create`}
      >
        <Button>
          <FilePlus className="mr-2 h-4 w-4" />
          Create Question
        </Button>
      </Link>
    </div>
  );
}
