"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, DollarSign, Users, Timer, Clock } from "lucide-react";
import { ExamModel } from "@/types/exam/exam";
import { format, parseISO } from "date-fns";

interface GenericExamBookingCardProps {
  exam: ExamModel;
  onBookExam?: (examId: string) => void;
  isLoading?: boolean;
}

const getExamTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "toefl":
      return "📚";
    case "gre":
      return "🎓";
    case "sat":
      return "📝";
    case "gmat":
      return "💼";
    default:
      return "📋";
  }
};

const getExamTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case "toefl":
      return "bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800";
    case "gre":
      return "bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-800";
    case "sat":
      return "bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-800";
    case "gmat":
      return "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

const getExamTypeName = (type: string) => {
  switch (type.toLowerCase()) {
    case "toefl":
      return "Test of English as a Foreign Language";
    case "gre":
      return "Graduate Record Examination";
    case "sat":
      return "Scholastic Assessment Test";
    case "gmat":
      return "Graduate Management Admission Test";
    default:
      return `${type.toUpperCase()} Examination`;
  }
};

export function GenericExamBookingCard({
  exam,
  onBookExam,
  isLoading = false,
}: GenericExamBookingCardProps) {
  const examDate = exam.lrw_group?.exam_date;
  const registrationDeadline = exam.registration_deadline;
  const isRegistrationOpen = registrationDeadline
    ? new Date() < new Date(registrationDeadline)
    : true;

  const handleBooking = () => {
    if (onBookExam && isRegistrationOpen) {
      onBookExam(exam.id);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow h-full flex flex-col">
      <CardHeader className="pb-2 sm:pb-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0">
          <div className="space-y-1 sm:space-y-2 flex-1">
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
              <Badge
                className={`${getExamTypeColor(exam.type_of_exam)} text-xs`}
              >
                <span className="mr-1">
                  {getExamTypeIcon(exam.type_of_exam)}
                </span>
                {exam.type_of_exam.toUpperCase()}
              </Badge>
              {exam.is_free && (
                <Badge className="bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800 text-xs">
                  FREE
                </Badge>
              )}
            </div>
            <CardTitle className="text-base sm:text-lg leading-tight">
              {exam.title}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm line-clamp-2">
              {exam.description || getExamTypeName(exam.type_of_exam)}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4 flex-1 p-3 sm:p-6">
        {/* Exam Date */}
        {examDate && (
          <div className="flex items-center gap-2">
            <CalendarDays className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium truncate">
              {format(parseISO(examDate), "PPP")}
            </span>
          </div>
        )}

        {/* Exam Schedule (if available) */}
        {exam.lrw_group && (
          <div className="space-y-1 sm:space-y-2">
            <div className="text-xs sm:text-sm font-medium text-foreground">
              Exam Schedule
            </div>
            <div className="grid gap-1 text-xs">
              <div className="flex items-center justify-between py-1 px-2 bg-muted/50 rounded">
                <span className="text-muted-foreground truncate">
                  Start Time
                </span>
                <span className="font-mono ml-2 flex-shrink-0">
                  {exam.lrw_group.listening_time_start ||
                    exam.lrw_group.reading_time_start ||
                    "TBA"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Speaking Sessions (for applicable exams) */}
        {exam.speaking_group && exam.speaking_group.time_windows.length > 0 && (
          <div className="space-y-1 sm:space-y-2">
            <div className="text-xs sm:text-sm font-medium text-foreground">
              Speaking Component
            </div>
            <div className="text-xs text-muted-foreground">
              Sessions available on:
            </div>
            <div className="grid gap-1">
              {exam.speaking_group.time_windows.map((timeWindow, index) => (
                <div
                  key={timeWindow.id || index}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 py-1 px-2 bg-muted/50 dark:bg-muted/20 border border-border rounded"
                >
                  <span className="text-xs text-foreground truncate">
                    {format(parseISO(timeWindow.date), "PPP")}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground flex-shrink-0">
                    {timeWindow.start_time} - {timeWindow.end_time}
                  </span>
                </div>
              ))}
              {exam.speaking_group.session_per_student > 0 && (
                <div className="text-xs text-muted-foreground mt-1">
                  Each session: {exam.speaking_group.session_per_student}{" "}
                  minutes
                </div>
              )}
            </div>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
          <span className="text-xs sm:text-sm font-medium truncate">
            {exam.is_free ? (
              <span className="text-green-600 dark:text-green-400">Free</span>
            ) : (
              <span>
                {exam.price} {exam.currency}
              </span>
            )}
          </span>
        </div>

        {/* Capacity */}
        {exam.max_students && (
          <div className="flex items-center gap-2">
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-xs sm:text-sm text-muted-foreground">
              Max {exam.max_students} students
            </span>
          </div>
        )}

        {/* Duration (if available) */}
        {exam.lrw_group && (
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-xs sm:text-sm text-muted-foreground">
              {exam.type_of_exam === "gre"
                ? "3-4 hours"
                : exam.type_of_exam === "toefl"
                ? "3 hours"
                : exam.type_of_exam === "sat"
                ? "3 hours"
                : exam.type_of_exam === "gmat"
                ? "2.5 hours"
                : "Duration varies"}
            </span>
          </div>
        )}

        {/* Registration Deadline */}
        {registrationDeadline && (
          <div className="flex items-start gap-2">
            <Timer
              className={`h-3 w-3 sm:h-4 sm:w-4 mt-0.5 flex-shrink-0 ${
                isRegistrationOpen
                  ? "text-orange-500 dark:text-orange-400"
                  : "text-red-500 dark:text-red-400"
              }`}
            />
            <span
              className={`text-xs sm:text-sm leading-relaxed ${
                isRegistrationOpen
                  ? "text-orange-600 dark:text-orange-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              Registration closes:{" "}
              {format(parseISO(registrationDeadline), "PPp")}
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3 sm:pt-4 p-3 sm:p-6">
        <Button
          onClick={handleBooking}
          disabled={!isRegistrationOpen || isLoading}
          className="w-full text-xs sm:text-sm h-8 sm:h-10"
          variant={exam.is_free ? "outline" : "default"}
        >
          {isLoading
            ? "Booking..."
            : !isRegistrationOpen
            ? "Registration Closed"
            : exam.is_free
            ? "Register for Free"
            : `Book for ${exam.price} ${exam.currency}`}
        </Button>
      </CardFooter>
    </Card>
  );
}
