import { Button } from "@/components/ui/button";

interface DashboardText {
  title: string;
  subtitle: string;
}

export interface QuestionsPageHeaderProps {
  organizationId: number;
  dashboardText?: DashboardText;
}

export function QuestionsPageHeader({
  organizationId,
  dashboardText = {
    title: "IELTS Writing Questions",
    subtitle:
      "Manage writing tasks for IELTS Academic and General Training tests.",
  },
}: QuestionsPageHeaderProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{dashboardText.title}</h1>
          <p className="text-muted-foreground">{dashboardText.subtitle}</p>
        </div>
        <Button
          onClick={() =>
            (window.location.href = `/dashboard/organization/${organizationId}/ielts-academic/writing/questions/create`)
          }
        >
          Create Question
        </Button>
      </div>
    </div>
  );
}
