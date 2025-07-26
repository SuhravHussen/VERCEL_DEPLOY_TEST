import { Button } from "@/components/ui/button";
import { SelectedPassageDisplayProps, IELTSReadingTestSection } from "./types";

export function SelectedPassageDisplay({
  section,
  formData,
  clearSelection,
}: SelectedPassageDisplayProps) {
  const sectionKey = `section_${section}` as keyof typeof formData;
  const sectionData = formData[sectionKey] as IELTSReadingTestSection | null;

  if (!sectionData) {
    return (
      <div className="text-center text-muted-foreground mb-4">
        No passage selected for this section
      </div>
    );
  }

  // Count questions
  const questionCount = sectionData.questions.reduce((total: number, q) => {
    const nestedQuestions = Array.isArray(q.questions) ? q.questions : [];
    return total + nestedQuestions.length;
  }, 0);

  return (
    <div className="mb-4">
      <div className="bg-primary/5 border border-primary/20 rounded-md p-4">
        <div className="flex justify-between">
          <div>
            <h4 className="font-medium">
              {sectionData.passage?.title || "Selected Passage"}
            </h4>
            <p className="text-sm text-muted-foreground">
              {questionCount} questions
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => clearSelection(section)}
          >
            Change
          </Button>
        </div>
      </div>
    </div>
  );
}
