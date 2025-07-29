"use client";

import React, { useState } from "react";
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

  const [activeTab, setActiveTab] = useState("overview");

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-dashboard-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-8 w-64" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !exam) {
    return (
      <div className="min-h-screen bg-dashboard-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex items-center gap-4 mb-6">
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

  const handleEditExam = () => {
    router.push(
      `/dashboard/organization/${organizationId}/ielts-academic/exam/edit/${examId}`
    );
  };

  const handleRegisterForExam = () => {
    // TODO: Navigate to registration page
    console.log("Register for exam:", examId);
  };

  return (
    <div className="min-h-screen bg-dashboard-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Exam Details
              </h1>
              <p className="text-muted-foreground">
                Comprehensive view of {exam.title}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleEditExam}
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Exam
            </Button>
            <Button onClick={handleRegisterForExam}>Register for Exam</Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="listening" className="gap-2">
              <Headphones className="h-4 w-4" />
              Listening
              <Badge variant="secondary" className="ml-1 text-xs">
                {listeningStats.summary.totalQuestions}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="reading" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Reading
              <Badge variant="secondary" className="ml-1 text-xs">
                {readingStats.summary.totalQuestions}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="writing" className="gap-2">
              <PenTool className="h-4 w-4" />
              Writing
              <Badge variant="secondary" className="ml-1 text-xs">
                {writingStats.summary.totalTasks}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="speaking" className="gap-2">
              <Mic className="h-4 w-4" />
              Speaking
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <ExamOverview exam={exam} />
          </TabsContent>

          {/* Listening Tab */}
          <TabsContent value="listening" className="space-y-6">
            {numberedListeningSections.length > 0 ? (
              <ListeningTestDetails
                numberedSections={numberedListeningSections}
                stats={listeningStats}
              />
            ) : (
              <Card className="p-8 text-center">
                <div className="text-muted-foreground">
                  <Headphones className="mx-auto h-12 w-12 mb-4" />
                  <p>No listening test sections available.</p>
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Reading Tab */}
          <TabsContent value="reading" className="space-y-6">
            {numberedReadingSections.length > 0 ? (
              <ReadingTestDetails
                numberedSections={numberedReadingSections}
                stats={readingStats}
              />
            ) : (
              <Card className="p-8 text-center">
                <div className="text-muted-foreground">
                  <BookOpen className="mx-auto h-12 w-12 mb-4" />
                  <p>No reading test sections available.</p>
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Writing Tab */}
          <TabsContent value="writing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PenTool className="h-5 w-5" />
                  Writing Test Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
                    <div className="text-sm text-muted-foreground">Task 1</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {writingStats.summary.totalTask2}
                    </div>
                    <div className="text-sm text-muted-foreground">Task 2</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">60</div>
                    <div className="text-sm text-muted-foreground">Minutes</div>
                  </div>
                </div>

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
                        <div className="flex justify-between items-start mb-2">
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
          <TabsContent value="speaking" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  Speaking Test Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                {exam.speaking_group.time_windows.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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

                    <div className="text-center text-muted-foreground">
                      Speaking test includes individual sessions with qualified
                      examiners covering all parts of the IELTS speaking
                      assessment.
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
        </Tabs>
      </div>
    </div>
  );
}
