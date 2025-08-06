"use client";

import { Button } from "@/components/ui/button";
import { Maximize, Minimize, NotebookPen } from "lucide-react";
import ReadingTestTimer from "./reading-test-timer";
import Image from "next/image";
import { useState, useEffect } from "react";

interface ReadingTestHeaderProps {
  onSubmit: () => void;
  onTimeUp?: () => void;
  onNotesClick?: () => void;
}

export default function ReadingTestHeader({
  onSubmit,
  onTimeUp,
  onNotesClick,
}: ReadingTestHeaderProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Check if we're in fullscreen mode
  useEffect(() => {
    const checkFullscreen = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", checkFullscreen);
    return () =>
      document.removeEventListener("fullscreenchange", checkFullscreen);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Error toggling fullscreen:", error);
    }
  };

  return (
    <header className="bg-background border-b border-border px-3 sm:px-6 lg:px-8 py-2 sm:py-3 flex-shrink-0 w-full">
      <div className="w-full flex items-center justify-between">
        {/* Left - IELTS Logo */}
        <div className="flex items-center">
          <Image
            src="/icons/ielts.png"
            alt="IELTS Logo"
            width={80}
            height={32}
            className="h-6 sm:h-8 w-auto"
          />
        </div>

        {/* Center - Timer */}
        <div className="flex items-center">
          <ReadingTestTimer
            totalMinutes={60} // 60 minutes for IELTS reading test
            onTimeUp={onTimeUp ?? onSubmit}
          />
        </div>

        {/* Right - Controls */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onNotesClick}
            className="text-muted-foreground hover:text-foreground p-1.5 sm:p-2"
            title="View Notes & Highlights"
          >
            <NotebookPen className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="text-muted-foreground hover:text-foreground p-1.5 sm:p-2"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize className="w-3 h-3 sm:w-4 sm:h-4" />
            ) : (
              <Maximize className="w-3 h-3 sm:w-4 sm:h-4" />
            )}
          </Button>
          <Button
            onClick={onSubmit}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 text-xs sm:text-sm lg:text-base"
          >
            Submit
          </Button>
        </div>
      </div>
    </header>
  );
}
