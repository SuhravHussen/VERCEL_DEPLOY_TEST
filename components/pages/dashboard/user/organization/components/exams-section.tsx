import { Card, CardContent } from "@/components/ui/card";
import { ExamsTab } from "../exams-tab";

interface ExamsSectionProps {
  organizationId: string;
}

export function ExamsSection({ organizationId }: ExamsSectionProps) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <ExamsTab organizationId={organizationId} />
      </CardContent>
    </Card>
  );
}
