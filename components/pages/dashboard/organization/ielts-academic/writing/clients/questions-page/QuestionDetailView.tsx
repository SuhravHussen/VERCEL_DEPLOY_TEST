/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import {
  IELTSAcademicTask1,
  IELTSTask2,
  IELTSGeneralTask1,
  IELTSWritingTask,
} from "@/types/exam/ielts-academic/writing/writing";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Clock,
  BookOpen,
  FileText,
  Image as ImageIcon,
  List,
  Tag,
  MessageCircle,
  PenTool,
  Info,
  Edit,
  Trash2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToasts } from "@/components/ui/toast";
import { useDeleteIeltsWritingQuestion } from "@/hooks/organization/ielts-academic/writing/use-delete-ielts-writing-question";
import { useConfirmationDialog } from "@/components/ui/confirmation-dialog";
import Link from "next/link";

export interface QuestionDetailViewProps {
  selectedQuestion: IELTSWritingTask | null;
  getQuestionTypeLabel: (type: string) => string;
  getQuestionTypeFromQuestion: (question: IELTSWritingTask) => string;
  organizationSlug: string;
}

export function QuestionDetailView({
  selectedQuestion,
  getQuestionTypeLabel,
  getQuestionTypeFromQuestion,
  organizationSlug,
}: QuestionDetailViewProps) {
  const { success, error: showError } = useToasts();
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  const deleteMutation = useDeleteIeltsWritingQuestion({
    onSuccess: () => {
      success("Writing question deleted successfully");
    },
    onError: (error) => {
      showError(error.message || "Failed to delete writing question");
    },
  });

  const handleDelete = async () => {
    if (!selectedQuestion) return;

    await showConfirmation({
      title: "Delete Writing Question",
      description:
        "Are you sure you want to delete this writing question? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
      isLoading: deleteMutation.isPending,
      onConfirm: async () => {
        deleteMutation.mutate({
          organizationSlug,
          questionId: selectedQuestion.id,
        });
      },
    });
  };
  if (!selectedQuestion) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-6">
          <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground">
            Select a question to view details
          </p>
        </div>
      </div>
    );
  }

  // Helper functions to check the task type
  const isAcademicTask1 = (
    task: IELTSWritingTask
  ): task is IELTSAcademicTask1 => {
    const academicTaskTypes = [
      "line_graph",
      "bar_chart",
      "pie_chart",
      "table",
      "diagram_process",
      "diagram_map",
      "mixed_charts",
    ];
    return (
      task.taskType === "task_1" && academicTaskTypes.includes(task.detailType)
    );
  };

  const isGeneralTask1 = (
    task: IELTSWritingTask
  ): task is IELTSGeneralTask1 => {
    const generalTaskTypes = [
      "formal_letter",
      "semi_formal_letter",
      "informal_letter",
    ];
    return (
      task.taskType === "task_1" && generalTaskTypes.includes(task.detailType)
    );
  };

  const isTask2 = (task: IELTSWritingTask): task is IELTSTask2 => {
    return task.taskType === "task_2";
  };

  // Determine if it's Academic or General Training
  const isAcademic = isAcademicTask1(selectedQuestion);
  const isGeneral = isGeneralTask1(selectedQuestion);

  // Update the examType determination for consistency with QuestionCard
  const examType =
    selectedQuestion.taskType === "task_2"
      ? "Academic & General"
      : isAcademic
      ? "Academic"
      : isGeneral
      ? "General Training"
      : "Unknown";

  // Get the specific task type label
  const taskTypeLabel = getQuestionTypeLabel(
    getQuestionTypeFromQuestion(selectedQuestion)
  );

  // Format the detail type for display
  const formatDetailType = (detailType: string) => {
    if (!detailType) return "";
    return detailType.replace(/_/g, " ");
  };

  return (
    <div className="p-6">
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Badge
                className={cn(
                  "px-2 py-0.5 text-white",
                  selectedQuestion.taskType === "task_1"
                    ? "bg-blue-500"
                    : "bg-amber-500"
                )}
              >
                {selectedQuestion.taskType === "task_1" ? "Task 1" : "Task 2"}
              </Badge>

              {selectedQuestion.taskType === "task_2" ? (
                <Badge variant="outline" className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  {examType}
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className={cn(
                    isAcademic ? "text-blue-600" : "text-green-600"
                  )}
                >
                  {examType}
                </Badge>
              )}

              <Badge variant="secondary">{taskTypeLabel}</Badge>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              href={`/dashboard/organization/${organizationSlug}/ielts/writing/questions/${selectedQuestion.id}/edit`}
            >
              <Button variant="outline" size="sm" className="flex gap-1">
                <Edit className="h-3 w-3" />
                Edit
              </Button>
            </Link>
            <Button
              variant="destructive"
              size="sm"
              className="flex gap-1"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="h-3 w-3" />
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>

        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{selectedQuestion.timeLimit} minutes</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span>Min. {selectedQuestion.minimumWords} words</span>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="grid grid-cols-1 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <PenTool className="h-4 w-4" /> Task Instructions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Instruction</h4>
              <div className="p-3 rounded-md bg-muted/50">
                {selectedQuestion.instruction}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Prompt</h4>
              <div className="p-3 rounded-md bg-muted/50 whitespace-pre-wrap">
                {selectedQuestion.prompt}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Task-specific details */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Info className="h-4 w-4" /> Task Details
            </CardTitle>
            <CardDescription>
              Specific details for{" "}
              {selectedQuestion.taskType === "task_1" ? "Task 1" : "Task 2"} -{" "}
              {taskTypeLabel}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Academic Task 1 Details */}
            {isAcademic && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                      <Tag className="h-4 w-4" /> Task Type
                    </h4>
                    <p className="text-sm capitalize">
                      {formatDetailType(selectedQuestion.detailType)}
                    </p>
                  </div>
                </div>

                {/* Visual Data */}
                {isAcademicTask1(selectedQuestion) &&
                  selectedQuestion.visualData?.chartImage && (
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                        <ImageIcon className="h-4 w-4" /> Visual Data
                      </h4>
                      <div className="mt-2 rounded-md border overflow-hidden">
                        <img
                          src={selectedQuestion.visualData.chartImage}
                          alt="Chart"
                          className="max-w-full h-auto object-contain"
                        />
                      </div>
                    </div>
                  )}

                {/* Chart Description */}
                {isAcademicTask1(selectedQuestion) &&
                  selectedQuestion.visualData?.chartDescription && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        Chart Description
                      </h4>
                      <div className="p-3 rounded-md bg-muted/50">
                        {selectedQuestion.visualData.chartDescription}
                      </div>
                    </div>
                  )}

                {/* Key Features */}
                {isAcademicTask1(selectedQuestion) &&
                  selectedQuestion.keyFeatures &&
                  selectedQuestion.keyFeatures.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                        <List className="h-4 w-4" /> Key Features
                      </h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {selectedQuestion.keyFeatures.map((feature, index) => (
                          <li key={index} className="text-sm">
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            )}

            {/* General Training Task 1 Details */}
            {isGeneral && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                      <Tag className="h-4 w-4" /> Letter Type
                    </h4>
                    <p className="text-sm capitalize">
                      {formatDetailType(selectedQuestion.detailType)}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Tone</h4>
                    <p className="text-sm capitalize">
                      {isGeneralTask1(selectedQuestion) &&
                        selectedQuestion.tone}
                    </p>
                  </div>
                </div>

                {/* Scenario */}
                {isGeneralTask1(selectedQuestion) && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Scenario</h4>
                    <div className="p-3 rounded-md bg-muted/50">
                      {selectedQuestion.scenario || "Not specified"}
                    </div>
                  </div>
                )}

                {/* Recipient */}
                {isGeneralTask1(selectedQuestion) &&
                  selectedQuestion.recipient && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Recipient</h4>
                      <p className="text-sm">{selectedQuestion.recipient}</p>
                    </div>
                  )}

                {/* Bullet Points */}
                {isGeneralTask1(selectedQuestion) &&
                  selectedQuestion.bulletPoints && (
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                        <List className="h-4 w-4" /> Key points to include
                      </h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {selectedQuestion.bulletPoints.map((point, i) => (
                          <li key={i} className="text-sm">
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            )}

            {/* Task 2 Details */}
            {isTask2(selectedQuestion) && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                      <Tag className="h-4 w-4" /> Essay Type
                    </h4>
                    <p className="text-sm capitalize">
                      {formatDetailType(selectedQuestion.detailType)}
                    </p>
                  </div>
                </div>

                {/* Topic */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Topic</h4>
                  <div className="p-3 rounded-md bg-muted/50">
                    {selectedQuestion.topic}
                  </div>
                </div>

                {/* Background Image if available */}
                {selectedQuestion.backgroundImage && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                      <ImageIcon className="h-4 w-4" /> Background Image
                    </h4>
                    <div className="mt-2 rounded-md border overflow-hidden">
                      <img
                        src={selectedQuestion.backgroundImage}
                        alt="Background material"
                        className="max-w-full h-auto object-contain"
                      />
                    </div>
                  </div>
                )}

                {/* Background Info */}
                {selectedQuestion.backgroundInfo && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Background Information
                    </h4>
                    <div className="p-3 rounded-md bg-muted/50">
                      {selectedQuestion.backgroundInfo}
                    </div>
                  </div>
                )}

                {/* Specific Question */}
                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Specific Question
                  </h4>
                  <div className="p-3 rounded-md bg-muted/50">
                    {selectedQuestion.specificQuestion}
                  </div>
                </div>

                {/* Keywords */}
                {selectedQuestion.keyWords &&
                  selectedQuestion.keyWords.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                        <Tag className="h-4 w-4" /> Key Words
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedQuestion.keyWords.map((keyword, index) => (
                          <Badge key={index} variant="outline">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sample Answer */}
        {selectedQuestion.sampleAnswer && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageCircle className="h-4 w-4" /> Sample Answer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-md bg-muted/50 whitespace-pre-wrap">
                {selectedQuestion.sampleAnswer}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <ConfirmationDialog />
    </div>
  );
}
