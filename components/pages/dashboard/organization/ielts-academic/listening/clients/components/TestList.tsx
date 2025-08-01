"use client";

import { IELTSListeningTest } from "@/types/exam/ielts-academic/listening/listening";
import { FileAudio, Calendar, Users, ChevronRight, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface TestListProps {
  tests: IELTSListeningTest[];
  selectedTestId?: string;
  onSelectTest: (test: IELTSListeningTest) => void;
  organizationId?: number;
}

export function TestList({
  tests,
  selectedTestId,
  onSelectTest,
  organizationId,
}: TestListProps) {
  return (
    <div className="flex flex-col gap-3 mb-8">
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
          <div
            key={test.id}
            className={`cursor-pointer border rounded-lg p-4 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${
              selectedTestId === test.id
                ? "ring-2 ring-primary shadow-md"
                : "shadow-sm"
            }`}
            onClick={() => onSelectTest(test)}
          >
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-3">
                <h3 className="font-semibold text-lg">{test.title}</h3>
                <Badge
                  variant="secondary"
                  className={`${difficultyColor} md:ml-2 whitespace-nowrap w-fit`}
                >
                  {test.difficulty.charAt(0).toUpperCase() +
                    test.difficulty.slice(1)}
                </Badge>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium w-fit
                  ${
                    test.status === "published"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                </span>
              </div>
              <p className="text-muted-foreground text-sm mb-3">
                {test.description || "No description"}
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileAudio className="h-4 w-4" />
                  <span>4 Sections ({sectionsWithQuestions} Complete)</span>
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
            </div>
            <div className="self-end md:self-center flex items-center gap-2">
              {organizationId && (
                <Link
                  href={`/dashboard/organization/${organizationId}/ielts/listening/tests/edit/${test.id}`}
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
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
