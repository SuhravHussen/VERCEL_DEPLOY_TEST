"use client";

import { IELTSListeningTest } from "@/types/exam/ielts-academic/listening/listening";
import { Headphones, FileAudio, Calendar, Users, Edit } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface TestGridProps {
  tests?: IELTSListeningTest[];
  selectedTestId?: string;
  onSelectTest?: (test: IELTSListeningTest) => void;
  isLoading: boolean;
  organizationId?: number;
}

export function TestGrid({
  tests = [],
  selectedTestId,
  onSelectTest,
  isLoading,
  organizationId,
}: TestGridProps) {
  if (isLoading) {
    // Display skeleton UI while loading
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        {Array(6)
          .fill(0)
          .map((_, index) => (
            <Card
              key={`skeleton-${index}`}
              className="cursor-pointer border shadow-sm hover:shadow-md transition-all"
            >
              <CardHeader className="p-5 pb-0 flex flex-row justify-between">
                <div>
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </CardHeader>
              <CardContent className="p-5">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardFooter className="p-5 pt-0 flex justify-between items-center border-t">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </CardFooter>
            </Card>
          ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
      {tests.map((test) => {
        // Format date
        const createdDate = new Date(test.createdAt);
        const formattedDate = createdDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });

        // Determine difficulty badge color
        const difficultyColor = {
          easy: "bg-green-100 text-green-800 hover:bg-green-100",
          medium: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
          hard: "bg-red-100 text-red-800 hover:bg-red-100",
        }[test.difficulty];

        // Count question sections with content
        const sectionsWithQuestions =
          (test.section_one.questions.length > 0 ? 1 : 0) +
          (test.section_two.questions.length > 0 ? 1 : 0) +
          (test.section_three.questions.length > 0 ? 1 : 0) +
          (test.section_four.questions.length > 0 ? 1 : 0);

        return (
          <Card
            key={test.id}
            className={`cursor-pointer border hover:shadow-md transition-all ${
              selectedTestId === test.id
                ? "ring-2 ring-primary shadow-md"
                : "shadow-sm"
            }`}
            onClick={() => onSelectTest && onSelectTest(test)}
          >
            <CardHeader className="p-5 pb-2 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg line-clamp-2">
                  {test.title}
                </h3>
                <Badge
                  variant="secondary"
                  className={`${difficultyColor} ml-2 whitespace-nowrap`}
                >
                  {test.difficulty.charAt(0).toUpperCase() +
                    test.difficulty.slice(1)}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm line-clamp-2">
                {test.description || "No description"}
              </p>
            </CardHeader>

            <CardContent className="p-5 pt-2">
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileAudio className="h-4 w-4" />
                  <span>4 Sections</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Headphones className="h-4 w-4" />
                  <span>{sectionsWithQuestions}/4 Complete</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{test.totalQuestionCount || 0} Questions</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-5 pt-3 border-t flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium
                  ${
                    test.status === "published"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                </span>
                <span className="text-sm text-muted-foreground">
                  {test.timeLimit} min
                </span>
              </div>

              {organizationId && (
                <Link
                  href={`/dashboard/organization/${organizationId}/ielts-academic/listening/tests/edit/${test.id}`}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </Link>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
