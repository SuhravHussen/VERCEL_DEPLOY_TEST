import { AlertCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface SpeakingSessionsErrorProps {
  error: string;
  type?: "error" | "not-found";
}

export function SpeakingSessionsError({
  error,
  type = "error",
}: SpeakingSessionsErrorProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="hover:bg-muted/50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <Alert
          variant={type === "error" ? "destructive" : "default"}
          className={
            type === "error"
              ? "bg-destructive/10 border-destructive/20"
              : "bg-muted/10 border-muted/20"
          }
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="font-medium">{error}</AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
