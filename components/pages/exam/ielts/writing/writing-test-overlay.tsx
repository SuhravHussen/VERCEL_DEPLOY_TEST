"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, PenTool } from "lucide-react";
import { IELTSWritingTest } from "@/types/exam/ielts-academic/writing/writing";

interface WritingTestOverlayProps {
  isOpen: boolean;
  onStartTest: () => void;
  writingTest: IELTSWritingTest;
  isLoading?: boolean;
}

export default function WritingTestOverlay({
  isOpen,
  onStartTest,
  writingTest,
  isLoading = false,
}: WritingTestOverlayProps) {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {writingTest.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Simple Test Info */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{writingTest.totalTimeLimit} minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <PenTool className="w-4 h-4" />
                <span>
                  {writingTest.testType === "academic"
                    ? "Academic"
                    : "General Training"}
                </span>
              </div>
            </div>
          </div>

          {/* General Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                Writing Test Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                      Task 1
                    </span>
                    20 minutes
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Minimum 150 words. Describe visual information or write a
                    letter.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                      Task 2
                    </span>
                    40 minutes
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Minimum 250 words. Write an essay responding to a question.
                  </p>
                </div>
              </div>

              <div className="border-t pt-4 mt-6">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Plan your time: spend more time on Task 2 as it carries more
                    weight
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Write clearly and organize your ideas with proper paragraphs
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Check word count regularly and review your work before
                    submitting
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Start Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={onStartTest}
              size="lg"
              className="px-8"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Start Writing Test"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
