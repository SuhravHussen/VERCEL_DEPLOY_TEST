"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ListeningTestOverlayProps {
  isOpen: boolean;
  onStartTest: () => void;
  isLoading?: boolean;
}

export default function ListeningTestOverlay({
  isOpen,
  onStartTest,
  isLoading = false,
}: ListeningTestOverlayProps) {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[90vh] sm:max-h-[85vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="space-y-1.5 sm:space-y-3">
          <DialogTitle className="text-sm sm:text-lg font-bold text-center leading-tight">
            IELTS Listening Test Instructions
          </DialogTitle>
          <DialogDescription className="space-y-2.5 sm:space-y-4 text-xs sm:text-sm">
            <div>
              <h3 className="font-semibold mb-1 sm:mb-2 text-xs sm:text-sm text-foreground">
                Test Format:
              </h3>
              <ul className="list-disc pl-3 sm:pl-4 space-y-0.5 text-xs sm:text-sm">
                <li>4 parts with 40 questions total</li>
                <li>30 minutes + 10 minutes transfer time</li>
                <li>You will hear each part only once</li>
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
                  <span>Switch parts</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">
                    Alt + N/P
                  </kbd>
                  <span>Next/Previous section</span>
                </div>
              </div>
            </div>

            {/* Mobile-specific instructions */}
            <div className="sm:hidden">
              <h3 className="font-semibold mb-1 text-xs text-foreground">
                Navigation:
              </h3>
              <ul className="list-disc pl-3 space-y-0.5 text-xs">
                <li>Tap Part buttons to switch sections</li>
                <li>Tap question numbers to jump to questions</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-1 sm:mb-2 text-xs sm:text-sm text-foreground">
                Important:
              </h3>
              <ul className="list-disc pl-3 sm:pl-4 space-y-0.5 text-xs sm:text-sm">
                <li>Answer all questions - no penalty for wrong answers</li>
                <li>Check spelling and word limits carefully</li>
              </ul>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center pt-2 sm:pt-4">
          <Button
            onClick={onStartTest}
            size="sm"
            disabled={isLoading}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 text-xs sm:text-base font-semibold"
          >
            {isLoading ? "Loading..." : "Start Test"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
