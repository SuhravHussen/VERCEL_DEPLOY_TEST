"use client";

import { useMemo } from "react";
import { IELTSListeningTest } from "@/types/exam/ielts-academic/listening/listening";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FileAudio,
  Calendar,
  Clock,
  Users,
  FileEdit,
  Trash2,
  BarChart,
} from "lucide-react";
import Link from "next/link";
import { addListeningQuestionNumbering } from "@/lib/addListeningQuestionNumbering";
import { useDeleteIeltsListeningTest } from "@/hooks/organization/ielts-academic/listening/use-delete-ielts-listening-test";
import { useToasts } from "@/components/ui/toast";
import { useConfirmationDialog } from "@/components/ui/confirmation-dialog";

interface TestDetailDrawerProps {
  test: IELTSListeningTest | null;
  open: boolean;
  organizationId: number;
  onClose: () => void;
}

export function TestDetailDrawer({
  test,
  open,
  organizationId,
  onClose,
}: TestDetailDrawerProps) {
  const toast = useToasts();
  const deleteTestMutation = useDeleteIeltsListeningTest();
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  // Handle delete test
  const handleDeleteTest = async (testId: string) => {
    await showConfirmation({
      title: "Delete Listening Test",
      description:
        "Are you sure you want to delete this listening test? This action cannot be undone and will permanently remove the test and all its sections.",
      confirmText: "Delete Test",
      cancelText: "Cancel",
      variant: "destructive",
      onConfirm: async () => {
        try {
          await deleteTestMutation.mutateAsync(testId);
          toast.success("Test deleted successfully!");
          onClose(); // Close the drawer after successful deletion
        } catch (error) {
          console.error("Error deleting test:", error);
          toast.error("Failed to delete test. Please try again.");
          throw error;
        }
      },
    });
  };

  // Calculate stats using the addListeningQuestionNumbering function
  const stats = useMemo(() => {
    if (!test) return null;
    const sections = [
      test.section_one,
      test.section_two,
      test.section_three,
      test.section_four,
    ];
    return addListeningQuestionNumbering(sections);
  }, [test]);

  if (!test) return null;

  // Format date
  const createdDate = new Date(test.createdAt);
  const formattedDate = createdDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Determine difficulty color
  const difficultyColor = {
    easy: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    hard: "bg-red-100 text-red-800",
  }[test.difficulty];

  // Format question type name
  const formatQuestionType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <>
      <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DrawerContent>
          <DrawerHeader className="mb-6">
            <DrawerTitle className="text-2xl">{test.title}</DrawerTitle>
            <DrawerDescription>
              {test.description || "No description"}
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 space-y-6 overflow-y-auto">
            {/* Status and Difficulty */}
            <div className="flex flex-wrap gap-3">
              <Badge
                variant="secondary"
                className={`${difficultyColor} whitespace-nowrap`}
              >
                {test.difficulty.charAt(0).toUpperCase() +
                  test.difficulty.slice(1)}
              </Badge>
              <Badge
                variant="outline"
                className={
                  test.status === "published"
                    ? "bg-green-100 text-green-800 border-green-200"
                    : "bg-gray-100 text-gray-800 border-gray-200"
                }
              >
                {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
              </Badge>
            </div>

            {/* Test Summary Stats */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileAudio className="h-4 w-4 text-muted-foreground" />
                <span>{stats?.summary.totalAudios || 4} Audio Sections</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Created on {formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{test.timeLimit} minutes time limit</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>
                  {stats?.summary.totalQuestions || 0} Questions total
                </span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart className="h-4 w-4 text-muted-foreground" />
                <span>
                  ~{stats?.summary.averageQuestionsPerAudio || 0} Questions per
                  section
                </span>
              </div>
            </div>

            <Separator />

            {/* Audio sections */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Audio Sections</h4>

              <div className="space-y-3">
                {stats?.audioStats.map((sectionStat, index) => (
                  <div
                    key={index}
                    className="border rounded-md p-3 bg-muted/50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-medium text-muted-foreground">
                          Section {sectionStat.audioNumber} •{" "}
                          {sectionStat.difficulty}
                        </span>
                        <h5 className="font-medium text-sm">
                          {sectionStat.audioTitle}
                        </h5>
                        <div className="mt-1 text-xs text-muted-foreground">
                          Questions: {sectionStat.questionRange}
                        </div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {Object.entries(sectionStat.questionTypes).map(
                            ([type, count]) => (
                              <div
                                key={type}
                                className="text-xs px-1.5 py-0.5 bg-muted rounded"
                              >
                                {formatQuestionType(type)}: {count}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={`${
                          sectionStat.questionCount > 0
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-amber-100 text-amber-800 border-amber-200"
                        }`}
                      >
                        {sectionStat.questionCount > 0
                          ? `${sectionStat.questionCount} Questions`
                          : "No Questions"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Difficulty Breakdown */}
            {stats?.summary.difficultyBreakdown && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Difficulty Breakdown</h4>
                  <div className="flex gap-2">
                    {Object.entries(stats.summary.difficultyBreakdown).map(
                      ([difficulty, count]) => (
                        <Badge
                          key={difficulty}
                          className={`
                        ${
                          difficulty === "easy"
                            ? "bg-green-100 text-green-800"
                            : ""
                        }
                        ${
                          difficulty === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : ""
                        }
                        ${
                          difficulty === "hard" ? "bg-red-100 text-red-800" : ""
                        }
                      `}
                        >
                          {difficulty.charAt(0).toUpperCase() +
                            difficulty.slice(1)}
                          : {count}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Actions */}
            <div className="space-y-4">
              <Link
                href={`/dashboard/organization/${organizationId}/ielts/listening/tests/edit/${test.id}`}
                className="w-full"
              >
                <Button variant="outline" className="w-full" size="sm">
                  <FileEdit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </Link>

              <Button
                variant="destructive"
                className="w-full"
                size="sm"
                onClick={() => test && handleDeleteTest(test.id)}
                disabled={deleteTestMutation.isPending}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {deleteTestMutation.isPending ? "Deleting..." : "Delete Test"}
              </Button>
            </div>
          </div>

          <DrawerFooter className="mt-6">
            <DrawerClose asChild>
              <Button variant="secondary" className="w-full">
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <ConfirmationDialog />
    </>
  );
}
