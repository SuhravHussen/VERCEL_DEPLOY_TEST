"use client";

import React from "react";
import { PracticeSections } from "@/components/pages/dashboard/user/practice/practice-sections";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Target, TrendingUp, Users } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PracticePage() {
  const router = useRouter();

  const handleStartPractice = (examId: string) => {
    // Navigate to the practice exam
    router.push(`/dashboard/user/practice/${examId}`);
  };

  const features = [
    {
      icon: BookOpen,
      title: "Comprehensive Practice",
      description:
        "Access practice tests for IELTS, TOEFL, GRE, SAT, and GMAT with real exam formats.",
    },
    {
      icon: Target,
      title: "Targeted Preparation",
      description:
        "Focus on specific skills and sections to improve your weak areas.",
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description:
        "Monitor your improvement over time with detailed performance analytics.",
    },
    {
      icon: Users,
      title: "Expert Content",
      description:
        "All practice materials are created by certified instructors and exam experts.",
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-6 lg:space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-3 sm:space-y-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
          Practice Exams
        </h1>
        <p className="text-sm sm:text-base lg:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
          Master your English proficiency and standardized tests with our
          comprehensive practice exams. Choose from IELTS, TOEFL, GRE, SAT, and
          GMAT practice tests designed to help you succeed.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card
              key={index}
              className="text-center hover:shadow-md transition-shadow p-4 sm:p-6"
            >
              <CardHeader className="pb-3 sm:pb-4">
                <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <CardTitle className="text-base sm:text-lg">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-xs sm:text-sm">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Practice Sections */}
      <div id="practice-sections">
        <PracticeSections onStartPractice={handleStartPractice} />
      </div>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Need Help Getting Started?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">
                First Time Taking Practice Tests?
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Start with our free practice tests to familiarize yourself with
                the format. Each test includes detailed explanations and tips
                for improvement.
              </p>
              <Button variant="outline" size="sm">
                View Study Guide
              </Button>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Technical Requirements</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Ensure you have a stable internet connection and allow
                microphone access for speaking tests. Tests are optimized for
                Chrome, Firefox, and Safari.
              </p>
              <Button variant="outline" size="sm">
                System Check
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
