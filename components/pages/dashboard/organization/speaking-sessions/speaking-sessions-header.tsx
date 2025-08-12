import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface SpeakingSessionsHeaderProps {
  examTitle: string;
}

export function SpeakingSessionsHeader({
  examTitle,
}: SpeakingSessionsHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="hover:bg-muted/50 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      <div className="space-y-1 sm:space-y-2">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
          Speaking Sessions
        </h1>
        <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">
          Manage your speaking sessions for{" "}
          <span className="font-semibold text-foreground">{examTitle}</span>
        </p>
      </div>
    </div>
  );
}
