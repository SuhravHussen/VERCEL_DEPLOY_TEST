import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  IELTSReadingQuestionGroup,
  IELTSReadingTestSection,
} from "@/types/exam/ielts-academic/reading/question/question";
import {
  BookOpen,
  CheckCircle2,
  Edit,
  Trash2,
  FileQuestion,
} from "lucide-react";
import Link from "next/link";
import { useConfirmationDialog } from "@/components/ui/confirmation-dialog";
import useDeleteIeltsReadingQuestion from "@/hooks/organization/ielts-academic/reading/use-delete-ielts-reading-question";
import { useToasts } from "@/components/ui/toast";

interface PassageCardProps {
  item: IELTSReadingTestSection;
  organizationSlug: string;
  getQuestionTypeLabel: (type: string) => string;
  isSelected: boolean;
  onSelect: () => void;
}

export function PassageCard({
  item,
  organizationSlug,
  getQuestionTypeLabel,
  isSelected,
  onSelect,
}: PassageCardProps) {
  const deleteQuestion = useDeleteIeltsReadingQuestion();
  const { success, error } = useToasts();
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  const handleDelete = async () => {
    if (!firstGroupId) return;

    const confirmed = await showConfirmation({
      title: "Delete Reading Questions",
      description: `Are you sure you want to delete "${
        item.passage?.title || "this passage"
      }" and all its questions? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
      onConfirm: async () => {
        try {
          await deleteQuestion.mutateAsync(firstGroupId);
          success("Reading questions deleted successfully");
        } catch (err) {
          console.error("Error deleting questions:", err);
          error("Failed to delete reading questions");
          throw err;
        }
      },
    });

    return confirmed;
  };
  const questionGroups = item.questions || [];
  const totalQuestionCount = questionGroups.reduce(
    (sum: number, group: IELTSReadingQuestionGroup) =>
      sum + (group.questions?.length || 0),
    0
  );
  const questionTypes = [
    ...new Set(
      questionGroups.map(
        (group: IELTSReadingQuestionGroup) => group.questionType
      )
    ),
  ];
  const firstGroupId = questionGroups[0]?.id;

  const difficultyColors: { [key: string]: string } = {
    hard: "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300",
    medium:
      "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300",
    easy: "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/40 dark:text-green-300",
  };

  const difficultyClass = item.passage?.difficulty
    ? difficultyColors[item.passage.difficulty]
    : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300";

  return (
    <>
      <Card
        className={`flex flex-col justify-between h-full transition-all duration-300 ease-in-out cursor-pointer hover:shadow-lg hover:-translate-y-1 relative ${
          isSelected
            ? "ring-2 ring-primary ring-offset-2 ring-offset-background bg-primary/5 dark:bg-primary/10"
            : "hover:bg-muted/50"
        }`}
        onClick={onSelect}
      >
        {isSelected && (
          <div className="absolute top-2 right-2 z-10">
            <CheckCircle2 className="h-5 w-5 text-primary fill-primary/20" />
          </div>
        )}
        <div>
          <CardHeader className="flex flex-row items-start justify-between gap-2 sm:gap-4 pb-2 sm:pb-4 px-3 sm:px-6">
            <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
              <div
                className={`rounded-lg flex-shrink-0 p-1.5 sm:p-2 ${
                  isSelected ? "bg-primary/20" : "bg-primary/10"
                }`}
              >
                <BookOpen
                  className={`h-4 w-4 sm:h-6 sm:w-6 ${
                    isSelected ? "text-primary" : "text-primary/80"
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <CardTitle className="text-base sm:text-lg font-semibold tracking-tight truncate">
                        {item.passage?.title || "Untitled Passage"}
                      </CardTitle>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{item.passage?.title || "Untitled Passage"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Passage
                </p>
              </div>
            </div>
            {item.passage?.difficulty && (
              <Badge
                variant="secondary"
                className={`${difficultyClass} text-xs sm:text-sm flex-shrink-0`}
              >
                {item.passage.difficulty.charAt(0).toUpperCase() +
                  item.passage.difficulty.slice(1)}
              </Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 pt-0 px-3 sm:px-6">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {(questionTypes as string[]).map((type, idx) => (
                <Badge
                  key={type ?? idx}
                  variant="outline"
                  className="font-normal text-xs sm:text-sm whitespace-nowrap"
                >
                  {getQuestionTypeLabel(type)}
                </Badge>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground border-t pt-3 sm:pt-4">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <FileQuestion className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>
                  {totalQuestionCount} Question
                  {totalQuestionCount !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-bold text-primary text-sm sm:text-base">
                  {questionTypes.length}
                </span>
                <span>
                  Type{questionTypes.length !== 1 ? "s" : ""} of Questions
                </span>
              </div>
            </div>
          </CardContent>
        </div>

        <CardFooter
          className={`px-3 sm:px-6 py-2 sm:py-3 flex flex-wrap justify-end gap-2 mt-auto ${
            isSelected
              ? "bg-primary/10 dark:bg-primary/20"
              : "bg-muted/30 dark:bg-muted/20"
          }`}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm h-8 px-2 sm:px-3"
                  disabled={!firstGroupId}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link
                    href={
                      firstGroupId
                        ? `/dashboard/organization/${organizationSlug}/ielts/reading/questions/${firstGroupId}/edit`
                        : "#"
                    }
                    aria-disabled={!firstGroupId}
                    tabIndex={!firstGroupId ? -1 : undefined}
                    onClick={(e) => !firstGroupId && e.preventDefault()}
                  >
                    <Edit className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    <span>Edit</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {firstGroupId
                    ? "Edit Passage & Questions"
                    : "No questions to edit"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm h-8 px-2 sm:px-3 hover:bg-destructive hover:text-destructive-foreground"
                  disabled={!firstGroupId || deleteQuestion.isPending}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                >
                  <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  <span>
                    {deleteQuestion.isPending ? "Deleting..." : "Delete"}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {firstGroupId
                    ? "Delete passage and questions"
                    : "No questions to delete"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardFooter>
      </Card>
      <ConfirmationDialog />
    </>
  );
}
