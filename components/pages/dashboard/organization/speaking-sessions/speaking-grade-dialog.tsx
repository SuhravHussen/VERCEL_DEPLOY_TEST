"use client";

import { useState, useEffect } from "react";
import { Loader2, GraduationCap } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToasts } from "@/components/ui/toast";

import {
  useGetSpeakingGrade,
  useAddSpeakingGrade,
  useUpdateSpeakingGrade,
} from "@/hooks/organization/speaking-sessions/use-speaking-grades";

import { SectionGrade } from "@/types/exam/exam-submission";
import { SpeakingSession } from "@/types/exam/speaking-session";

interface SpeakingGradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: SpeakingSession;
}

export function SpeakingGradeDialog({
  open,
  onOpenChange,
  session,
}: SpeakingGradeDialogProps) {
  const { success, error } = useToasts();

  const {
    grade: existingGrade,
    isLoading: isLoadingGrade,
    hasGrade,
  } = useGetSpeakingGrade(session.id || "");
  const { addGrade, isAdding } = useAddSpeakingGrade();
  const { updateGrade, isUpdating } = useUpdateSpeakingGrade();

  const [formData, setFormData] = useState<SectionGrade>({
    score: undefined,
    max_score: 9,
    band_score: undefined,
    feedback: "",
    graded_by: "instructor_001", // Current instructor
    graded_at: new Date().toISOString(),
  });

  // Reset form when dialog opens/closes or when existing grade loads
  useEffect(() => {
    if (open && existingGrade) {
      setFormData(existingGrade);
    } else if (open && !existingGrade) {
      setFormData({
        score: undefined,
        max_score: 9,
        band_score: undefined,
        feedback: "",
        graded_by: "instructor_001",
        graded_at: new Date().toISOString(),
      });
    }
  }, [open, existingGrade]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session.id) {
      error("Session ID is required");
      return;
    }

    if (
      !formData.band_score ||
      formData.band_score < 1 ||
      formData.band_score > 9
    ) {
      error("Please enter a valid band score (1-9)");
      return;
    }

    try {
      const gradeData = {
        ...formData,
        graded_at: new Date().toISOString(),
      };

      if (hasGrade) {
        await updateGrade({ sessionId: session.id, grade: gradeData });
        success("Speaking grade updated successfully!");
      } else {
        await addGrade({ sessionId: session.id, grade: gradeData });
        success("Speaking grade added successfully!");
      }

      onOpenChange(false);
    } catch {
      error(hasGrade ? "Failed to update grade" : "Failed to add grade");
    }
  };

  const isSubmitting = isAdding || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            {hasGrade ? "Update" : "Add"} Speaking Grade
          </DialogTitle>
          <DialogDescription>
            {hasGrade ? "Update the" : "Enter a"} speaking grade for{" "}
            <span className="font-semibold">
              {session.student?.name || `Student ID: ${session.student_id}`}
            </span>
          </DialogDescription>
        </DialogHeader>

        {isLoadingGrade ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading existing grade...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="band_score">Band Score (1-9) *</Label>
                <Input
                  id="band_score"
                  type="number"
                  min="1"
                  max="9"
                  step="0.5"
                  value={formData.band_score || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      band_score: e.target.value
                        ? parseFloat(e.target.value)
                        : undefined,
                    }))
                  }
                  placeholder="e.g., 7.5"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="score">Raw Score</Label>
                <Input
                  id="score"
                  type="number"
                  min="0"
                  max={formData.max_score}
                  value={formData.score || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      score: e.target.value
                        ? parseFloat(e.target.value)
                        : undefined,
                    }))
                  }
                  placeholder="Optional"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback">Feedback</Label>
              <Textarea
                id="feedback"
                value={formData.feedback || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, feedback: e.target.value }))
                }
                placeholder="Enter detailed feedback for the student..."
                rows={4}
                className="resize-none"
              />
            </div>

            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {hasGrade ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  <>{hasGrade ? "Update Grade" : "Add Grade"}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
