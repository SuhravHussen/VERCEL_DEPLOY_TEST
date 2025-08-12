"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Clock,
  DollarSign,
  Timer,
  Play,
  BookOpen,
  PenTool,
  Mic,
  Zap,
} from "lucide-react";
import { useCountdown } from "@/hooks/utils/use-countdown";
import { RegisteredExam } from "@/types/registered-exam";
import { format, parseISO } from "date-fns";
import {
  getExamTypeColor,
  getExamTypeIcon,
  getPaymentStatusColor,
} from "./utils";
import { StatusBadge } from "./StatusBadge";

interface ExamCardProps {
  registeredExam: RegisteredExam;
}

function IeltsExamCard({ registeredExam }: ExamCardProps) {
  const examDate = registeredExam.exam?.lrw_group?.exam_date || "";
  const { formattedTime, isExpired } = useCountdown(examDate || new Date());

  const organization = registeredExam.exam?.organization;
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getExamTypeColor("ielts")}>
                <span className="mr-1">{getExamTypeIcon("ielts")}</span>
                IELTS
              </Badge>
            </div>
            <CardTitle className="text-lg">
              {registeredExam?.exam?.title}
            </CardTitle>
            <CardDescription className="text-sm">
              International English Language Testing System
              {organization && (
                <span className="block text-xs text-muted-foreground mt-1">
                  by {organization.name}
                </span>
              )}
            </CardDescription>
          </div>
          <StatusBadge status={registeredExam.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {examDate && (
          <div
            className={`relative overflow-hidden rounded-lg border-2 transition-all duration-300 ${
              isExpired
                ? "border-red-200 dark:border-red-800 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20"
                : "border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-900/20"
            }`}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CalendarDays
                    className={`h-4 w-4 ${
                      isExpired
                        ? "text-red-600 dark:text-red-400"
                        : "text-blue-600 dark:text-blue-400"
                    }`}
                  />
                  <span className="text-sm font-medium">
                    {format(parseISO(examDate), "MMM dd, yyyy")}
                  </span>
                </div>
                <Badge
                  className={`${
                    isExpired
                      ? "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200"
                      : "bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200"
                  }`}
                >
                  {isExpired ? "Expired" : "Upcoming"}
                </Badge>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold font-mono ${
                      isExpired
                        ? "text-red-700 dark:text-red-300"
                        : "text-blue-700 dark:text-blue-300"
                    }`}
                  >
                    {formattedTime}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {isExpired ? "Time elapsed" : "Time remaining"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {registeredExam?.exam?.lrw_group && (
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
            <div className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Daily Schedule
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {registeredExam.exam.lrw_group.listening_time_start && (
                <div className="text-center">
                  <div className="text-blue-600 dark:text-blue-400 font-medium">
                    L
                  </div>
                  <div className="text-muted-foreground">
                    {format(
                      parseISO(
                        `2000-01-01T${registeredExam.exam.lrw_group.listening_time_start}:00`
                      ),
                      "h:mm a"
                    )}
                  </div>
                </div>
              )}
              {registeredExam.exam.lrw_group.reading_time_start && (
                <div className="text-center">
                  <div className="text-green-600 dark:text-green-400 font-medium">
                    R
                  </div>
                  <div className="text-muted-foreground">
                    {format(
                      parseISO(
                        `2000-01-01T${registeredExam.exam.lrw_group.reading_time_start}:00`
                      ),
                      "h:mm a"
                    )}
                  </div>
                </div>
              )}
              {registeredExam.exam.lrw_group.writing_time_start && (
                <div className="text-center">
                  <div className="text-purple-600 dark:text-purple-400 font-medium">
                    W
                  </div>
                  <div className="text-muted-foreground">
                    {format(
                      parseISO(
                        `2000-01-01T${registeredExam.exam.lrw_group.writing_time_start}:00`
                      ),
                      "h:mm a"
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {registeredExam.speaking_session && (
          <div className="p-3 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                <div className="text-sm font-medium text-orange-900 dark:text-orange-200">
                  Speaking Session
                </div>
              </div>
              <Badge className="bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-200">
                {registeredExam.speaking_session.status}
              </Badge>
            </div>
            <div className="text-sm text-orange-700 dark:text-orange-300 mt-2">
              {format(parseISO(registeredExam.speaking_session.date), "MMM dd")}{" "}
              •{" "}
              {format(
                parseISO(registeredExam.speaking_session.start_time),
                "h:mm a"
              )}{" "}
              -{" "}
              {format(
                parseISO(registeredExam.speaking_session.end_time),
                "h:mm a"
              )}
            </div>
          </div>
        )}

        {/* Smart Quick Access */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-900/50 dark:to-blue-950/30 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <div className="text-sm font-medium text-foreground">
              Quick Access
            </div>
            <Badge variant="secondary" className="text-xs px-2 py-0">
              {registeredExam.status === "registered"
                ? "Ready"
                : registeredExam.status}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs hover:bg-blue-50 dark:hover:bg-blue-950/30 border-blue-200 dark:border-blue-800"
              onClick={() =>
                window.open(
                  `/exam/ielts/listening?regId=${registeredExam.id}`,
                  "_blank"
                )
              }
              disabled={registeredExam.status !== "registered"}
            >
              <Play className="h-3 w-3 mr-1" />
              Listening
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs hover:bg-green-50 dark:hover:bg-green-950/30 border-green-200 dark:border-green-800"
              onClick={() =>
                window.open(
                  `/exam/ielts/reading?regId=${registeredExam.id}`,
                  "_blank"
                )
              }
              disabled={registeredExam.status !== "registered"}
            >
              <BookOpen className="h-3 w-3 mr-1" />
              Reading
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs hover:bg-purple-50 dark:hover:bg-purple-950/30 border-purple-200 dark:border-purple-800"
              onClick={() =>
                window.open(
                  `/exam/ielts/writing?regId=${registeredExam.id}`,
                  "_blank"
                )
              }
              disabled={registeredExam.status !== "registered"}
            >
              <PenTool className="h-3 w-3 mr-1" />
              Writing
            </Button>
            {registeredExam.speaking_session && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs hover:bg-orange-50 dark:hover:bg-orange-950/30 border-orange-200 dark:border-orange-800"
                onClick={() =>
                  window.open(
                    `/exam/ielts/speaking?regId=${registeredExam.id}`,
                    "_blank"
                  )
                }
                disabled={
                  registeredExam.speaking_session.status === "cancelled"
                }
              >
                <Mic className="h-3 w-3 mr-1" />
                Speaking
              </Button>
            )}
          </div>
        </div>

        {/* Compact Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              <span>
                {registeredExam?.exam?.is_free
                  ? "Free"
                  : `${registeredExam?.paid_amount} ${registeredExam?.currency}`}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>
                {format(parseISO(registeredExam.registered_at), "MMM dd")}
              </span>
            </div>
          </div>
          <Badge
            className={`text-xs px-2 py-0 ${getPaymentStatusColor(
              registeredExam?.payment_status
            )}`}
          >
            {registeredExam?.payment_status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

function ToeflExamCard({ registeredExam }: ExamCardProps) {
  const examDate = registeredExam.exam?.lrw_group?.exam_date || "";
  const { formattedTime, isExpired } = useCountdown(examDate || new Date());
  const organization = registeredExam.exam?.organization;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getExamTypeColor("toefl")}>
                <span className="mr-1">{getExamTypeIcon("toefl")}</span>
                TOEFL
              </Badge>
            </div>
            <CardTitle className="text-lg">
              {registeredExam?.exam?.title}
            </CardTitle>
            <CardDescription className="text-sm">
              Test of English as a Foreign Language
              {organization && (
                <span className="block text-xs text-muted-foreground mt-1">
                  by {organization.name}
                </span>
              )}
            </CardDescription>
          </div>
          <StatusBadge status={registeredExam.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {examDate && (
          <div className="flex items-center justify-between p-3 bg-green-50/50 dark:bg-green-950/20 rounded-lg">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {format(parseISO(examDate), "PPP")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Timer
                className={`h-4 w-4 ${
                  isExpired
                    ? "text-red-500 dark:text-red-400"
                    : "text-green-500 dark:text-green-400"
                }`}
              />
              <span
                className={`text-sm font-mono ${
                  isExpired
                    ? "text-red-600 dark:text-red-400"
                    : "text-green-600 dark:text-green-400"
                }`}
              >
                {formattedTime}
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {registeredExam?.exam?.is_free
                ? "Free"
                : `${registeredExam?.paid_amount} ${registeredExam?.currency}`}
            </span>
          </div>
          <Badge
            className={getPaymentStatusColor(registeredExam?.payment_status)}
          >
            <span className="capitalize">{registeredExam?.payment_status}</span>
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Registered on{" "}
            {format(parseISO(registeredExam.registered_at), "PPP")}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function GenericExamCard({ registeredExam }: ExamCardProps) {
  const examDate = registeredExam.exam?.lrw_group?.exam_date || "";
  const { formattedTime, isExpired } = useCountdown(examDate || new Date());
  const examType = registeredExam.exam?.type_of_exam || "other";
  const organization = registeredExam.exam?.organization;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getExamTypeColor(examType)}>
                <span className="mr-1">{getExamTypeIcon(examType)}</span>
                {examType.toUpperCase()}
              </Badge>
            </div>
            <CardTitle className="text-lg">
              {registeredExam?.exam?.title}
            </CardTitle>
            <CardDescription className="text-sm">
              {examType.charAt(0).toUpperCase() + examType.slice(1)} Examination
              {organization && (
                <span className="block text-xs text-muted-foreground mt-1">
                  by {organization.name}
                </span>
              )}
            </CardDescription>
          </div>
          <StatusBadge status={registeredExam.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {examDate && (
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {format(parseISO(examDate), "PPP")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Timer
                className={`h-4 w-4 ${
                  isExpired
                    ? "text-red-500 dark:text-red-400"
                    : "text-blue-500 dark:text-blue-400"
                }`}
              />
              <span
                className={`text-sm font-mono ${
                  isExpired
                    ? "text-red-600 dark:text-red-400"
                    : "text-blue-600 dark:text-blue-400"
                }`}
              >
                {formattedTime}
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {registeredExam?.exam?.is_free
                ? "Free"
                : `${registeredExam?.paid_amount} ${registeredExam?.currency}`}
            </span>
          </div>
          <Badge
            className={getPaymentStatusColor(registeredExam?.payment_status)}
          >
            <span className="capitalize">{registeredExam?.payment_status}</span>
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Registered on{" "}
            {format(parseISO(registeredExam.registered_at), "PPP")}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function ExamCard({ registeredExam }: ExamCardProps) {
  const examType = registeredExam.exam?.type_of_exam?.toLowerCase();

  switch (examType) {
    case "ielts":
      return <IeltsExamCard registeredExam={registeredExam} />;
    case "toefl":
      return <ToeflExamCard registeredExam={registeredExam} />;
    case "gre":
    case "sat":
    case "gmat":
    default:
      return <GenericExamCard registeredExam={registeredExam} />;
  }
}
