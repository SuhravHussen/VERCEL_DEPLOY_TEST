"use client";

import React, { useState } from "react";
import {
  CalendarDays,
  Clock,
  Users,
  Trash2,
  AlertTriangle,
  Eye,
  EyeOff,
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
import { cn } from "@/lib/utils";
import {
  ExamCardProps,
  formatCurrency,
  formatDate,
  formatTime,
  getExamTypeConfig,
} from "./shared/exam-card-utils";

export function GmatAllExamCard({
  exam,
  onViewDetails,
  onDelete,
  isDeleting = false,
  showActions = true,
}: ExamCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const isRegistrationOpen = exam.registration_deadline
    ? new Date() < new Date(exam.registration_deadline)
    : true;
  const isFree = exam.is_free;
  const examTypeConfig = getExamTypeConfig(exam.type_of_exam);
  const IconComponent = examTypeConfig.icon;

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
      <Card
        className={cn(
          "h-full flex flex-col transition-all duration-200 hover:shadow-lg group relative",
          examTypeConfig.accent
        )}
      >
        {/* Delete Button - positioned at top right */}
        {onDelete && showActions && (
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
            <div className="flex items-center gap-2 flex-shrink-0">
              <IconComponent className="h-5 w-5 text-muted-foreground" />
              <Badge
                className={cn("text-xs font-medium", examTypeConfig.color)}
              >
                {examTypeConfig.name}
              </Badge>
            </div>
            <div className="flex flex-col gap-2 items-end">
              {/* Published Status */}
              <Badge
                variant={exam.is_published ? "default" : "secondary"}
                className={cn(
                  "text-xs",
                  exam.is_published
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {exam.is_published ? (
                  <>
                    <Eye className="h-3 w-3 mr-1" />
                    Published
                  </>
                ) : (
                  <>
                    <EyeOff className="h-3 w-3 mr-1" />
                    Draft
                  </>
                )}
              </Badge>

              {isFree ? (
                <Badge
                  variant="secondary"
                  className="bg-accent/10 text-accent-foreground border-accent/20"
                >
                  Free
                </Badge>
              ) : (
                <Badge variant="outline" className="flex items-center gap-1">
                  {formatCurrency(exam.price, exam.currency)}
                </Badge>
              )}
            </div>
          </div>

          <CardTitle className="text-lg font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors mt-2">
            {exam.title}
          </CardTitle>

          {exam.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
              {exam.description}
            </p>
          )}
        </CardHeader>

        <CardContent className="flex-grow space-y-3">
          {/* Exam Date */}
          {exam.lrw_group?.exam_date && (
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <CalendarDays className="h-4 w-4" />
              <span>{formatDate(exam.lrw_group.exam_date)}</span>
            </div>
          )}

          {/* Start Time */}
          {exam.lrw_group?.listening_time_start && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                Starts at {formatTime(exam.lrw_group.listening_time_start)}
              </span>
            </div>
          )}

          {/* Max Students */}
          {exam.max_students && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Max {exam.max_students} students</span>
            </div>
          )}

          {/* Registration Status */}
          {exam.registration_deadline && (
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle
                className={cn(
                  "h-4 w-4",
                  isRegistrationOpen ? "text-orange-500" : "text-destructive"
                )}
              />
              <span
                className={cn(
                  "font-medium",
                  isRegistrationOpen
                    ? "text-orange-600 dark:text-orange-400"
                    : "text-destructive"
                )}
              >
                {isRegistrationOpen
                  ? `Register by ${formatDate(exam.registration_deadline)}`
                  : "Registration closed"}
              </span>
            </div>
          )}
        </CardContent>

        {/* View Details Button */}
        {showActions && (
          <CardFooter className="pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails?.(exam.id)}
              className="w-full"
            >
              View Details
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete GMAT Exam</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{exam.title}&rdquo;? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleDeleteCancel}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
