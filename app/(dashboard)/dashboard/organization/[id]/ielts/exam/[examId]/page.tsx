"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  AlertTriangle,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useExamDetails } from "@/hooks/organization/ielts-academic/exam/use-exam-details";
import { ExamOverview } from "@/components/pages/dashboard/organization/ielts-academic/exam/components/exam-overview";
import { ReadingTestDetails } from "@/components/pages/dashboard/organization/ielts-academic/exam/components/reading-test-details";
import { ListeningTestDetails } from "@/components/pages/dashboard/organization/ielts-academic/exam/components/listening-test-details";

export default function ExamDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.examId as string;
  const organizationId = params.id as string;

  const {
    exam,
    isLoading,
    error,
    numberedReadingSections,
    readingStats,
    numberedListeningSections,
    listeningStats,
    writingStats,
  } = useExamDetails(examId);

  const handleEditExam = () => {
    router.push(
      `/dashboard/organization/${organizationId}/ielts/exam/edit/${examId}`
    );
  };

  const handleRegisterForExam = () => {
    // TODO: Navigate to registration page
    console.log("Register for exam:", examId);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-16" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-32" />
            </div>
          </div>

          {/* Tabs Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !exam) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Exam Details</h1>
          </div>

          {/* Error Alert */}
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error ||
                "Exam not found. The exam may have been removed or you may not have permission to view it."}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Left Section */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
                className="gap-2 flex-shrink-0"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground truncate">
                  Exam Details
                </h1>
                <p className="text-sm text-muted-foreground truncate">
                  {exam.title}
                </p>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditExam}
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                <span className="hidden sm:inline">Edit Exam</span>
                <span className="sm:hidden">Edit</span>
              </Button>
              <Button size="sm" onClick={handleRegisterForExam}>
                <span className="hidden sm:inline">Register for Exam</span>
                <span className="sm:hidden">Register</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="w-full">
          {/* Tab Navigation */}
          <div className="mb-6">
            <TabsList className="">
              <TabsTrigger value="overview" className="text-xs sm:text-sm">
                <BookOpen className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="listening" className="text-xs sm:text-sm">
                <Headphones className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Listening</span>
                <Badge
                  variant="secondary"
                  className="ml-1 text-xs px-1 py-0 h-4"
                >
                  {listeningStats.summary.totalQuestions}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="reading" className="text-xs sm:text-sm">
                <BookOpen className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Reading</span>
                <Badge
                  variant="secondary"
                  className="ml-1 text-xs px-1 py-0 h-4"
                >
                  {readingStats.summary.totalQuestions}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="writing" className="text-xs sm:text-sm">
                <PenTool className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Writing</span>
                <Badge
                  variant="secondary"
                  className="ml-1 text-xs px-1 py-0 h-4"
                >
                  {writingStats.summary.totalTasks}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="speaking" className="text-xs sm:text-sm">
                <Mic className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Speaking</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <div className="w-full">
            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-0">
              <ExamOverview exam={exam} />
            </TabsContent>

            {/* Listening Tab */}
            <TabsContent value="listening" className="mt-0">
              {numberedListeningSections.length > 0 ? (
                <ListeningTestDetails
                  numberedSections={numberedListeningSections}
                  stats={listeningStats}
                />
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Headphones className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-center">
                      No listening test sections available.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Reading Tab */}
            <TabsContent value="reading" className="mt-0">
              {numberedReadingSections.length > 0 ? (
                <ReadingTestDetails
                  numberedSections={numberedReadingSections}
                  stats={readingStats}
                />
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-center">
                      No reading test sections available.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Writing Tab */}
            <TabsContent value="writing" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PenTool className="h-5 w-5" />
                    Writing Test Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Writing Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {writingStats.summary.totalTasks}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total Tasks
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {writingStats.summary.totalTask1}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Task 1
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {writingStats.summary.totalTask2}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Task 2
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">60</div>
                      <div className="text-sm text-muted-foreground">
                        Minutes
                      </div>
                    </div>
                  </div>

                  {/* Writing Tasks */}
                  {writingStats.taskStats.length === 0 ? (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        No writing tasks available.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-4">
                      {writingStats.taskStats.map((task) => (
                        <div
                          key={task.taskId}
                          className="border rounded-lg p-4 bg-muted/10"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                            <h4 className="font-semibold capitalize">
                              {task.taskType.replace("_", " ")} -{" "}
                              {task.detailType}
                            </h4>
                            <Badge variant="outline">
                              {task.minimumWords} words min
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Time limit: {task.timeLimit} minutes | Difficulty:{" "}
                            {task.difficulty}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Speaking Tab */}
            <TabsContent value="speaking" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mic className="h-5 w-5" />
                    Speaking Test Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {exam.speaking_group &&
                  exam.speaking_group.time_windows &&
                  exam.speaking_group.time_windows.length > 0 ? (
                    <div className="space-y-6">
                      {/* Speaking Stats */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">
                            {exam.speaking_group.time_windows.length}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Time Slots
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">
                            {exam.speaking_group.session_per_student}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Minutes per Student
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">
                            {exam.speaking_group.assigned_instructors.length}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Instructors
                          </div>
                        </div>
                      </div>

                      {/* Speaking Description */}
                      <div className="text-center text-muted-foreground bg-muted/20 rounded-lg p-4">
                        Speaking test includes individual sessions with
                        qualified examiners covering all parts of the IELTS
                        speaking assessment.
                      </div>
                    </div>
                  ) : (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        No speaking sessions scheduled for this exam.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
