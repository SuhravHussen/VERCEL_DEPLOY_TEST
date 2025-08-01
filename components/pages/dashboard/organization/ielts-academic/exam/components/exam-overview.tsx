import React from "react";
import {
  CalendarDays,
  Clock,
  Users,
  MapPin,
  Tag,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExamModel } from "@/types/exam/exam";
import {
  formatDate,
  formatTime,
  formatCurrency,
} from "../utils/format-helpers";
import {
  getDaysUntilExam,
  isRegistrationOpen,
  getExamStatus,
} from "../utils/exam-helpers";

interface ExamOverviewProps {
  exam: ExamModel;
}

export function ExamOverview({ exam }: ExamOverviewProps) {
  const daysUntilExam = getDaysUntilExam(exam);
  const registrationOpen = isRegistrationOpen(exam);
  const { label: statusLabel, variant: statusVariant } = getExamStatus(exam);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex-1">
              <CardTitle className="text-2xl font-bold mb-2">
                {exam.title}
              </CardTitle>
              {exam.description && (
                <p className="text-muted-foreground">{exam.description}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Badge variant={statusVariant} className="text-center">
                {statusLabel}
              </Badge>
              {exam.is_free ? (
                <Badge
                  variant="secondary"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  Free
                </Badge>
              ) : (
                <Badge variant="outline" className="text-center">
                  {formatCurrency(exam.price, exam.currency)}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Exam Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Exam Date Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <CalendarDays className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Exam Date</h3>
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium">
                {formatDate(exam?.lrw_group?.exam_date || "")}
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  Starts at{" "}
                  {formatTime(exam?.lrw_group?.listening_time_start || "")}
                </span>
              </div>
              {daysUntilExam > 0 && (
                <Badge variant="outline" className="text-xs">
                  {daysUntilExam} days remaining
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Registration Info Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Tag className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Registration</h3>
            </div>
            <div className="space-y-2">
              {exam.registration_deadline ? (
                <>
                  <p className="text-sm text-muted-foreground">Deadline</p>
                  <p className="font-medium">
                    {formatDate(exam.registration_deadline)}
                  </p>
                  <Badge
                    variant={registrationOpen ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {registrationOpen ? "Open" : "Closed"}
                  </Badge>
                </>
              ) : (
                <p className="text-muted-foreground">No deadline specified</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Capacity Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Capacity</h3>
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium">
                {exam.max_students
                  ? `${exam.max_students} students`
                  : "Unlimited"}
              </p>
              <p className="text-sm text-muted-foreground">Maximum capacity</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Test Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* LRW Schedule */}
          <div className="border rounded-lg p-4 bg-muted/20">
            <h4 className="font-semibold mb-3">Listening, Reading & Writing</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">
                  Listening:
                </span>
                <p>{formatTime(exam?.lrw_group?.listening_time_start || "")}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">
                  Reading:
                </span>
                <p>{formatTime(exam?.lrw_group?.reading_time_start || "")}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">
                  Writing:
                </span>
                <p>{formatTime(exam?.lrw_group?.writing_time_start || "")}</p>
              </div>
            </div>
            {Array.isArray(exam?.lrw_group?.assigned_instructors) &&
              exam.lrw_group.assigned_instructors.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <span className="font-medium text-muted-foreground text-sm">
                    Instructors:{" "}
                  </span>
                  <span className="text-sm">
                    {exam.lrw_group.assigned_instructors
                      .map((inst) => inst.name)
                      .join(", ")}
                  </span>
                </div>
              )}
          </div>

          {/* Speaking Schedule */}
          {exam.speaking_group &&
            exam.speaking_group.time_windows &&
            exam.speaking_group.time_windows.length > 0 && (
              <div className="border rounded-lg p-4 bg-muted/20">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Speaking Sessions
                </h4>
                <div className="space-y-2">
                  {exam.speaking_group.time_windows.map((window, index) => (
                    <div
                      key={window.id || index}
                      className="flex justify-between items-center text-sm"
                    >
                      <span>{formatDate(window.date)}</span>
                      <span className="text-muted-foreground">
                        {formatTime(window.start_time)} -{" "}
                        {formatTime(window.end_time)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t text-sm">
                  <p>
                    <span className="font-medium text-muted-foreground">
                      Duration per student:{" "}
                    </span>
                    {exam.speaking_group.session_per_student} minutes
                  </p>
                  {exam.speaking_group.assigned_instructors.length > 0 && (
                    <p className="mt-1">
                      <span className="font-medium text-muted-foreground">
                        Instructors:{" "}
                      </span>
                      {exam.speaking_group.assigned_instructors
                        .map((inst) => inst.name)
                        .join(", ")}
                    </p>
                  )}
                </div>
              </div>
            )}

          {exam.speaking_group &&
            exam.speaking_group.time_windows &&
            exam.speaking_group.time_windows.length === 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No speaking sessions scheduled for this exam.
                </AlertDescription>
              </Alert>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
