"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ReadingTestOverlayProps {
  isOpen: boolean;
  onStartTest: () => void;
}

export default function ReadingTestOverlay({
  isOpen,
  onStartTest,
}: ReadingTestOverlayProps) {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[90vh] sm:max-h-[85vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="space-y-1.5 sm:space-y-3">
          <DialogTitle className="text-sm sm:text-lg font-bold text-center leading-tight">
            IELTS Reading Test Instructions
          </DialogTitle>
          <DialogDescription className="space-y-2.5 sm:space-y-4 text-xs sm:text-sm">
            <div>
              <h3 className="font-semibold mb-1 sm:mb-2 text-xs sm:text-sm text-foreground">
                Test Format:
              </h3>
              <ul className="list-disc pl-3 sm:pl-4 space-y-0.5 text-xs sm:text-sm">
                <li>3 sections with 40 questions total</li>
                <li>60 minutes total time</li>
                <li>Each section contains one reading passage</li>
                <li>Questions range from easy to difficult</li>
              </ul>
            </div>

            {/* Hide keyboard navigation on mobile, show on desktop */}
            <div className="hidden sm:block">
              <h3 className="font-semibold mb-1.5 text-sm text-foreground">
                Keyboard Shortcuts:
              </h3>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">
                    Ctrl + ←/→
                  </kbd>
                  <span>Switch sections</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">
                    Ctrl + N
                  </kbd>
                  <span>Toggle notes</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">
                    Ctrl + Enter
                  </kbd>
                  <span>Submit test</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-1 sm:mb-2 text-xs sm:text-sm text-foreground">
                Navigation:
              </h3>
              <ul className="list-disc pl-3 sm:pl-4 space-y-0.5 text-xs sm:text-sm">
                <li>
                  Use resizable panels to adjust passage and question views
                </li>
                <li>Navigate between sections using bottom navigation</li>
                <li>Jump to specific questions by clicking question numbers</li>
                <li>Your progress is saved automatically</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-1 sm:mb-2 text-xs sm:text-sm text-foreground">
                Important Notes:
              </h3>
              <ul className="list-disc pl-3 sm:pl-4 space-y-0.5 text-xs sm:text-sm text-destructive">
                <li>Read all passages carefully before answering</li>
                <li>
                  Check spelling - incorrect spelling will be marked wrong
                </li>
                <li>Manage your time effectively across all sections</li>
                <li>Once submitted, answers cannot be changed</li>
              </ul>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center pt-2 sm:pt-4">
          <Button
            onClick={onStartTest}
            className="w-full sm:w-auto px-8 py-2 sm:py-3"
          >
            Start Reading Test
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
