import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  FileText,
  MoreHorizontal,
  PenLine,
  ScrollText,
  FileImage,
  User,
  Hourglass,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useToasts } from "@/components/ui/toast";
import { useDeleteIeltsWritingTest } from "@/hooks/organization/ielts-academic/writing/use-delete-ielts-writing-test";
import { useConfirmationDialog } from "@/components/ui/confirmation-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IELTSWritingTest,
  IELTSAcademicTask1,
  IELTSGeneralTask1,
} from "@/types/exam/ielts-academic/writing/writing";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

export interface TestCardProps {
  test: IELTSWritingTest;
  organizationSlug: string;
}

export function TestCard({ test, organizationSlug }: TestCardProps) {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { error, success } = useToasts();
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  const { mutate: deleteTest, isPending: isDeleting } =
    useDeleteIeltsWritingTest({
      onSuccess: () => {
        success("Test deleted successfully");
        setDrawerOpen(false);
      },
      onError: (err) => {
        error(err.message || "Failed to delete test");
      },
    });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "medium":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const editTest = () => {
    router.push(
      `/dashboard/organization/${organizationSlug}/ielts/writing/tests/${test.id}/edit`
    );
  };

  const handleDelete = () => {
    showConfirmation({
      title: "Delete Test",
      description: `Are you sure you want to delete "${test.title}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
      onConfirm: () => {
        deleteTest({
          organizationSlug,
          testId: test.id.toString(),
        });
      },
    });
  };

  // Format the detail type for display
  const formatDetailType = (detailType: string | undefined) => {
    if (!detailType) return "";

    return detailType
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Check if task1 is an Academic Task
  const isAcademicTask1 = (
    task: IELTSAcademicTask1 | IELTSGeneralTask1
  ): task is IELTSAcademicTask1 => {
    return task.taskType === "task_1" && "visualData" in task;
  };

  // Check if task1 is a General Task
  const isGeneralTask1 = (
    task: IELTSAcademicTask1 | IELTSGeneralTask1
  ): task is IELTSGeneralTask1 => {
    return task.taskType === "task_1" && "scenario" in task;
  };

  return (
    <>
      <Card
        className="p-4 transition-all hover:shadow-md cursor-pointer"
        onClick={() => setDrawerOpen(true)}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{test.title}</h3>
              <Badge
                variant="outline"
                className={cn(
                  "text-xs",
                  test.status === "published"
                    ? "border-green-300 text-green-600"
                    : "border-gray-300 text-gray-600"
                )}
              >
                {test.status === "published" ? "Published" : "Archived"}
              </Badge>
              <Badge
                className={cn("text-xs", getDifficultyColor(test.difficulty))}
              >
                {test.difficulty.charAt(0).toUpperCase() +
                  test.difficulty.slice(1)}
              </Badge>
            </div>

            {test.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {test.description}
              </p>
            )}
          </div>

          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    editTest();
                  }}
                >
                  <PenLine className="mr-2 h-4 w-4" />
                  Edit Test
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                  className="text-destructive"
                  disabled={isDeleting}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Test
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-3">
          <div className="flex items-center text-xs text-muted-foreground gap-1">
            <FileText className="h-3 w-3" />
            <span>2 Tasks</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground gap-1">
            <Clock className="h-3 w-3" />
            <span>{test.totalTimeLimit} minutes</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground gap-1">
            <Calendar className="h-3 w-3" />
            <span>Created {new Date(test.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </Card>

      {/* Test Details Drawer */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="">
          <div className="container mx-auto w-full overflow-y-auto">
            <DrawerHeader>
              <DrawerTitle className="text-xl flex items-center justify-between">
                <span>{test.title}</span>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      test.status === "published"
                        ? "border-green-300 text-green-600"
                        : "border-gray-300 text-gray-600"
                    )}
                  >
                    {test.status === "published" ? "Published" : "Archived"}
                  </Badge>
                  <Badge
                    className={cn(
                      "text-xs",
                      getDifficultyColor(test.difficulty)
                    )}
                  >
                    {test.difficulty.charAt(0).toUpperCase() +
                      test.difficulty.slice(1)}
                  </Badge>
                </div>
              </DrawerTitle>
              <DrawerDescription className="mt-2">
                {test.description || "No description provided."}
              </DrawerDescription>
            </DrawerHeader>

            <div className="px-4 py-2">
              <div className="bg-muted/40 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 rounded-full p-2">
                    <ScrollText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Test Type</p>
                    <p className="font-medium">
                      {test.testType === "academic"
                        ? "Academic"
                        : "General Training"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 rounded-full p-2">
                    <Hourglass className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time Limit</p>
                    <p className="font-medium">{test.totalTimeLimit} minutes</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 rounded-full p-2">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Created On</p>
                    <p className="font-medium">
                      {new Date(test.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 rounded-full p-2">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Created By</p>
                    <p className="font-medium">{test.createdBy}</p>
                  </div>
                </div>
              </div>

              {test.instructions && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Instructions</h3>
                  <div className="bg-muted/20 p-4 rounded-md">
                    <p className="text-sm">{test.instructions}</p>
                  </div>
                </div>
              )}

              {test.generalInstructions && (
                <div className="my-4">
                  <h3 className="text-lg font-medium mb-2">
                    General Instructions
                  </h3>
                  <div className="bg-muted/20 p-4 rounded-md">
                    <p className="text-sm">{test.generalInstructions}</p>
                  </div>
                </div>
              )}

              {/* Task 1 Section */}
              <div className="my-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="bg-primary/10 text-primary text-sm font-medium rounded-full w-6 h-6 flex items-center justify-center">
                      1
                    </span>
                    <span>
                      Task 1 ({formatDetailType(test.task1.detailType)})
                    </span>
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {test.task1.timeLimit} minutes
                  </Badge>
                </div>

                <div className="space-y-3 bg-muted/10 p-4 rounded-md">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Instruction
                    </h4>
                    <p className="mt-1">{test.task1.instruction}</p>
                  </div>

                  {isAcademicTask1(test.task1) &&
                    test.task1.visualData?.chartImage && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Visual Data
                        </h4>
                        <div className="bg-muted/20 p-4 rounded-md mt-1 flex items-center justify-center">
                          <div className="border border-dashed border-muted-foreground/50 rounded-md p-3 w-full flex flex-col items-center text-center">
                            <FileImage className="h-10 w-10 text-muted-foreground/70 mb-2" />
                            <p className="text-sm text-muted-foreground">
                              {test.task1.visualData.chartDescription ||
                                "Chart image available"}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                  {isAcademicTask1(test.task1) &&
                    test.task1.keyFeatures &&
                    test.task1.keyFeatures.length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Key Features
                        </h4>
                        <ul className="mt-1 space-y-1 list-disc list-inside pl-2">
                          {test.task1.keyFeatures.map(
                            (feature: string, idx: number) => (
                              <li key={idx} className="text-sm">
                                {feature}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                  {isGeneralTask1(test.task1) && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Scenario
                      </h4>
                      <p className="mt-1 text-sm">{test.task1.scenario}</p>
                    </div>
                  )}

                  {isGeneralTask1(test.task1) &&
                    test.task1.bulletPoints &&
                    test.task1.bulletPoints.length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Points to Include
                        </h4>
                        <ul className="mt-1 space-y-1 list-disc list-inside pl-2">
                          {test.task1.bulletPoints.map(
                            (point: string, idx: number) => (
                              <li key={idx} className="text-sm">
                                {point}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                  <div className="mt-3">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Prompt
                    </h4>
                    <p className="mt-1 text-sm">{test.task1.prompt}</p>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Minimum words: {test.task1.minimumWords}
                    </span>
                  </div>
                </div>
              </div>

              {/* Task 2 Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="bg-primary/10 text-primary text-sm font-medium rounded-full w-6 h-6 flex items-center justify-center">
                      2
                    </span>
                    <span>
                      Task 2 ({formatDetailType(test.task2.detailType)})
                    </span>
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {test.task2.timeLimit} minutes
                  </Badge>
                </div>

                <div className="space-y-3 bg-muted/10 p-4 rounded-md">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Instruction
                    </h4>
                    <p className="mt-1">{test.task2.instruction}</p>
                  </div>

                  <div className="mt-3">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Topic
                    </h4>
                    <p className="mt-1 font-medium">{test.task2.topic}</p>
                  </div>

                  {test.task2.backgroundInfo && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Background Information
                      </h4>
                      <p className="mt-1 text-sm">
                        {test.task2.backgroundInfo}
                      </p>
                    </div>
                  )}

                  <div className="mt-3">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Question
                    </h4>
                    <p className="mt-1">{test.task2.specificQuestion}</p>
                  </div>

                  <div className="mt-3">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Prompt
                    </h4>
                    <p className="mt-1 text-sm">{test.task2.prompt}</p>
                  </div>

                  {test.task2.keyWords && test.task2.keyWords.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Key Words
                      </h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {test.task2.keyWords.map(
                          (keyword: string, idx: number) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="text-xs"
                            >
                              {keyword}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-3 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Minimum words: {test.task2.minimumWords}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <DrawerFooter>
              <div className="flex justify-between w-full">
                <Button variant="outline" onClick={() => setDrawerOpen(false)}>
                  Close
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                  <Button onClick={editTest}>
                    <PenLine className="mr-2 h-4 w-4" />
                    Edit Test
                  </Button>
                </div>
              </div>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Confirmation Dialog */}
      <ConfirmationDialog />
    </>
  );
}
