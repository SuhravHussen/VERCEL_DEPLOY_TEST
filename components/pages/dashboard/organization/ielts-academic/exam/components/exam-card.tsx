import React, { useState } from "react";
import {
  CalendarDays,
  Clock,
  Users,
  MapPin,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IELTSExamModel } from "@/types/exam/ielts-academic/exam";
import {
  formatCurrency,
  formatDate,
  formatTime,
} from "../utils/format-helpers";

interface ExamCardProps {
  exam: IELTSExamModel;
  onViewDetails?: (examId: string) => void;
  onRegister?: (examId: string) => void;
  onDelete?: (examId: string) => void;
  isDeleting?: boolean;
}

export function ExamCard({
  exam,
  onViewDetails,
  onRegister,
  onDelete,
  isDeleting = false,
}: ExamCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const isRegistrationOpen =
    new Date() < new Date(exam.registration_deadline || "");
  const isFree = exam.is_free;

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    onDelete?.(exam.id);
    setShowDeleteDialog(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card className="h-full flex flex-col transition-all duration-200 hover:shadow-lg hover:shadow-primary/10 group relative">
        {/* Delete Button - positioned at top right */}
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeleteClick}
            className="absolute top-2 right-2 z-10 h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}

        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-lg font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {exam.title}
            </CardTitle>
            <div className="flex flex-col gap-2 flex-shrink-0">
              {isFree ? (
                <Badge
                  variant="secondary"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  Free
                </Badge>
              ) : (
                <Badge variant="outline" className="flex items-center gap-1">
                  {formatCurrency(exam.price, exam.currency)}
                </Badge>
              )}
              {exam.is_active && (
                <Badge
                  variant="default"
                  className=" text-blue-700 border-blue-200"
                >
                  Active
                </Badge>
              )}
            </div>
          </div>

          {exam.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
              {exam.description}
            </p>
          )}
        </CardHeader>

        <CardContent className="flex-1 space-y-4">
          {/* Exam Date and Time */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <CalendarDays className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="font-medium">Exam Date:</span>
              <span className="text-muted-foreground">
                {formatDate(exam.lrw_group.exam_date)}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="font-medium">Start Time:</span>
              <span className="text-muted-foreground">
                {formatTime(exam.lrw_group.listening_time_start)}
              </span>
            </div>
          </div>

          {/* Speaking Sessions */}
          {exam.speaking_group.time_windows.length > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="font-medium">Speaking Sessions:</span>
              <span className="text-muted-foreground">
                {exam.speaking_group.time_windows.length} available
              </span>
            </div>
          )}

          {/* Student Capacity */}
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="font-medium">Max Students:</span>
            <span className="text-muted-foreground">
              {exam.max_students || "Unlimited"}
            </span>
          </div>

          {/* Registration Deadline */}
          {exam.registration_deadline && (
            <div className="p-3 rounded-lg bg-muted/50 border">
              <div className="text-xs font-medium text-muted-foreground mb-1">
                Registration Deadline
              </div>
              <div className="text-sm font-medium">
                {formatDate(exam.registration_deadline)}
              </div>
              {!isRegistrationOpen && (
                <Badge variant="destructive" className="mt-2 text-xs">
                  Registration Closed
                </Badge>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-4 border-t bg-muted/20">
          <div className="flex gap-2 w-full flex-col sm:flex-row">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails?.(exam.id)}
              className="flex-1 py-2"
              disabled={isDeleting}
            >
              View Details
            </Button>

            <Button
              size="sm"
              onClick={() => onRegister?.(exam.id)}
              disabled={!isRegistrationOpen || isDeleting}
              className="flex-1 py-2"
            >
              {isRegistrationOpen ? "Register Now" : "Registration Closed"}
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <DialogTitle className="text-left">Delete Exam</DialogTitle>
                <DialogDescription className="text-left mt-1">
                  This action cannot be undone.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {exam.title}
              </span>
              ? This will permanently remove the exam and all associated data.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={handleDeleteCancel}
              disabled={isDeleting}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="flex-1 sm:flex-none"
            >
              {isDeleting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Exam
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
