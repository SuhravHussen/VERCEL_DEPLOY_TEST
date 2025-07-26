import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface DashboardTextProps {
  title: string;
  subtitle: string;
}

interface QuestionsPageHeaderProps {
  organizationId: number;
  dashboardText: DashboardTextProps;
}

export function QuestionsPageHeader({
  organizationId,
  dashboardText,
}: QuestionsPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-semibold">{dashboardText.title}</h1>
        <p className="text-muted-foreground max-w-2xl">
          {dashboardText.subtitle}
        </p>
      </div>
      <Button asChild className="gap-2">
        <Link
          href={`/dashboard/organization/${organizationId}/ielts-academic/listening/questions/create`}
        >
          <Plus className="h-4 w-4" />
          <span>Create new question</span>
        </Link>
      </Button>
    </div>
  );
}
