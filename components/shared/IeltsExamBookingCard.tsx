"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExamModel } from "@/types/exam/exam";
import { format, parseISO } from "date-fns";

interface IeltsExamBookingCardProps {
  exam: ExamModel;
  onBookExam?: (examId: string) => void;
  isLoading?: boolean;
}

export function IeltsExamBookingCard({
  exam,
  onBookExam,
  isLoading = false,
}: IeltsExamBookingCardProps) {
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
    <Card className="group h-full flex flex-col hover:shadow-lg transition-all duration-200 border border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-3">
          <Badge variant="secondary" className="text-xs font-medium">
            IELTS
          </Badge>
          {exam.is_free && (
            <Badge
              variant="outline"
              className="text-xs font-medium text-green-600 border-green-200"
            >
              FREE
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground line-clamp-2 leading-tight">
            {exam.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {exam.description}
          </p>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        {/* Exam Date */}
        {examDate && (
          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Exam Date</p>
            <p className="text-sm font-medium">
              {format(parseISO(examDate), "EEEE, MMMM do, yyyy")}
            </p>
          </div>
        )}

        {/* Test Components */}
        {exam.lrw_group && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">
              Test Schedule
            </h4>
            <div className="space-y-1">
              {exam.lrw_group.listening_time_start && (
                <div className="flex justify-between items-center py-2 px-3 bg-muted/20 rounded">
                  <span className="text-sm text-muted-foreground">
                    Listening
                  </span>
                  <span className="text-sm font-mono font-medium">
                    {exam.lrw_group.listening_time_start}
                  </span>
                </div>
              )}
              {exam.lrw_group.reading_time_start && (
                <div className="flex justify-between items-center py-2 px-3 bg-muted/20 rounded">
                  <span className="text-sm text-muted-foreground">Reading</span>
                  <span className="text-sm font-mono font-medium">
                    {exam.lrw_group.reading_time_start}
                  </span>
                </div>
              )}
              {exam.lrw_group.writing_time_start && (
                <div className="flex justify-between items-center py-2 px-3 bg-muted/20 rounded">
                  <span className="text-sm text-muted-foreground">Writing</span>
                  <span className="text-sm font-mono font-medium">
                    {exam.lrw_group.writing_time_start}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Speaking Sessions */}
        {exam.speaking_group && exam.speaking_group.time_windows.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">
              Speaking Sessions
            </h4>
            <div className="space-y-1">
              {exam.speaking_group.time_windows
                .slice(0, 2)
                .map((timeWindow, index) => (
                  <div
                    key={timeWindow.id || index}
                    className="flex justify-between items-center py-2 px-3 bg-muted/20 rounded"
                  >
                    <span className="text-sm text-muted-foreground">
                      {format(parseISO(timeWindow.date), "MMM do")}
                    </span>
                    <span className="text-sm font-mono font-medium">
                      {timeWindow.start_time} - {timeWindow.end_time}
                    </span>
                  </div>
                ))}
              {exam.speaking_group.time_windows.length > 2 && (
                <p className="text-xs text-muted-foreground text-center mt-1">
                  +{exam.speaking_group.time_windows.length - 2} more sessions
                </p>
              )}
            </div>
          </div>
        )}

        {/* Price and Capacity */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div>
            <p className="text-xs text-muted-foreground">Price</p>
            <p className="text-lg font-semibold">
              {exam.is_free ? (
                <span className="text-green-600">Free</span>
              ) : (
                <span>
                  {exam.price} {exam.currency}
                </span>
              )}
            </p>
          </div>
          {exam.max_students && (
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Capacity</p>
              <p className="text-sm font-medium">{exam.max_students} spots</p>
            </div>
          )}
        </div>

        {/* Registration Deadline */}
        {registrationDeadline && (
          <div
            className={`p-3 rounded-lg border ${
              isRegistrationOpen
                ? "bg-orange-50/50 dark:bg-orange-950/20 border-orange-200/50 dark:border-orange-800/30"
                : "bg-red-50/50 dark:bg-red-950/20 border-red-200/50 dark:border-red-800/30"
            }`}
          >
            <p
              className={`text-xs font-medium mb-1 ${
                isRegistrationOpen
                  ? "text-orange-700 dark:text-orange-300"
                  : "text-red-700 dark:text-red-300"
              }`}
            >
              Registration {isRegistrationOpen ? "closes" : "closed"}
            </p>
            <p
              className={`text-sm ${
                isRegistrationOpen
                  ? "text-orange-800 dark:text-orange-200"
                  : "text-red-800 dark:text-red-200"
              }`}
            >
              {format(
                parseISO(registrationDeadline),
                "MMM do, yyyy 'at' h:mm a"
              )}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-4">
        <Button
          onClick={handleBooking}
          disabled={!isRegistrationOpen || isLoading}
          className="w-full h-11"
          variant={!isRegistrationOpen ? "secondary" : "default"}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
              Booking...
            </div>
          ) : !isRegistrationOpen ? (
            "Registration Closed"
          ) : exam.is_free ? (
            "Register for Free"
          ) : (
            `Book for ${exam.price} ${exam.currency}`
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
