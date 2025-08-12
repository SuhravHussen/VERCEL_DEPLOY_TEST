"use client";

import { useParams } from "next/navigation";
import { useExamDetails } from "@/hooks/organization/ielts-academic/exam/use-exam-details";
import { ExamType } from "@/types/exam/exam";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import SubmissionsListIelts from "@/components/pages/dashboard/organization/submissions/ielts-submissions-list";
import { getCurrentUser } from "@/lib/auth-client";
import { isAssigned, isAssignedToLRW } from "@/lib/exam-utils";

export default function ExamSubmissionsPage() {
  const params = useParams();
  const examId = params.examId as string;
  const organizationId = params.id as string;
  const user = getCurrentUser();

  const { exam, isLoading, error } = useExamDetails(examId);

  // Check if user has access to any sections
  const hasAnyAccess =
    exam && user
      ? isAssignedToLRW(exam, user.id) || isAssigned(exam, user.id)
      : false;

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <Link
            href={`/dashboard/organization/${organizationId}/assigned-exams`}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assigned Exams
          </Link>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-muted-foreground ml-4">
                Loading exam details...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <Link
            href={`/dashboard/organization/${organizationId}/assigned-exams`}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assigned Exams
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <AlertCircle className="h-5 w-5 mr-2" />
              Error Loading Exam
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {error ||
                "Exam not found. Please check the exam ID and try again."}
            </p>
            <div className="mt-4">
              <Button asChild>
                <Link
                  href={`/dashboard/organization/${organizationId}/assigned-exams`}
                >
                  Return to Assigned Exams
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <Link
          href={`/dashboard/organization/${organizationId}/assigned-exams`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Assigned Exams
        </Link>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {!hasAnyAccess ? (
          <NoAccessMessage examTitle={exam.title} />
        ) : exam.type_of_exam === ExamType.IELTS ? (
          <SubmissionsListIelts
            examId={examId}
            examTitle={exam.title}
            exam={exam}
          />
        ) : (
          <NotImplementedYet
            examType={exam.type_of_exam}
            examTitle={exam.title}
          />
        )}
      </div>
    </div>
  );
}

interface NoAccessMessageProps {
  examTitle: string;
}

function NoAccessMessage({ examTitle }: NoAccessMessageProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Exam Submissions</h1>
        <p className="text-muted-foreground">Submissions for: {examTitle}</p>
      </div>

      {/* No Access Card */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center text-orange-800">
            <AlertCircle className="h-5 w-5 mr-2" />
            No Grading Access
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-orange-700">
              You are not assigned to grade any sections of this exam. Only
              instructors assigned to specific exam sections can view and grade
              submissions.
            </p>
            <div className="p-4 bg-white rounded-md border border-orange-200">
              <h4 className="font-medium text-orange-800 mb-2">
                To access submissions, you need to be assigned to:
              </h4>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>
                  • <strong>LRW Group:</strong> To view Listening, Reading, and
                  Writing submissions
                </li>
                <li>
                  • <strong>Speaking Group:</strong> To view Speaking session
                  submissions
                </li>
              </ul>
            </div>
            <p className="text-sm text-orange-600">
              Please contact your exam administrator to request assignment to
              the appropriate grading groups if you believe this is an error.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface NotImplementedYetProps {
  examType: ExamType;
  examTitle: string;
}

function NotImplementedYet({ examType, examTitle }: NotImplementedYetProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Exam Submissions</h1>
        <p className="text-muted-foreground">Submissions for: {examTitle}</p>
      </div>

      {/* Not Implemented Card */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center text-yellow-800">
            <AlertCircle className="h-5 w-5 mr-2" />
            Feature Not Yet Available
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-yellow-700">
              Submission management for{" "}
              <strong>{examType.toUpperCase()}</strong> exams is not yet
              implemented. Currently, only IELTS exam submissions are supported.
            </p>
            <div className="p-4 bg-white rounded-md border border-yellow-200">
              <h4 className="font-medium text-yellow-800 mb-2">Coming Soon:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>
                  • View student submissions for {examType.toUpperCase()} exams
                </li>
                <li>• Grade and provide feedback on submissions</li>
                <li>• Export submission data and reports</li>
                <li>• Track student progress and performance</li>
              </ul>
            </div>
            <p className="text-sm text-yellow-600">
              This feature is currently under development. Please check back
              later or contact support for updates.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Available Actions Card */}
      <Card>
        <CardHeader>
          <CardTitle>Available Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              While submission management is not available for this exam type,
              you can still:
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-medium">Exam Management</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Edit exam details and content</li>
                  <li>• View exam statistics</li>
                  <li>• Manage student assignments</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Student Management</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• View assigned students</li>
                  <li>• Send notifications to students</li>
                  <li>• Track registration status</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
