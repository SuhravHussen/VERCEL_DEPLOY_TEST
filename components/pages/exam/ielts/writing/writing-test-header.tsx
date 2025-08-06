"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Maximize, Minimize, Clock } from "lucide-react";
import Image from "next/image";
import WritingTestTimer from "./writing-test-timer";

interface WritingTestHeaderProps {
  onSubmit: () => void;
  onTimeUp?: () => void;
  testType: "academic" | "general_training";
}

export default function WritingTestHeader({
  onSubmit,
  onTimeUp,
  testType,
}: WritingTestHeaderProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

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
      console.error("Fullscreen toggle failed:", error);
    }
  };

  return (
    <div className="bg-card border-b border-border px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Image
            src="/icons/ielts.png"
            alt="IELTS"
            width={60}
            height={24}
            className="h-6 w-auto"
          />
          <Badge variant="outline" className="hidden sm:inline-flex">
            {testType === "academic" ? "Academic" : "General Training"}
          </Badge>
        </div>

        {/* Timer - Centered */}
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-muted-foreground hidden sm:block" />
          <WritingTestTimer
            totalMinutes={60}
            onTimeUp={onTimeUp || (() => {})}
          />
        </div>

        <div className="flex items-center space-x-3">
          {/* Fullscreen Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            className="hidden sm:inline-flex"
          >
            {isFullscreen ? (
              <Minimize className="w-4 h-4" />
            ) : (
              <Maximize className="w-4 h-4" />
            )}
          </Button>

          {/* Submit Button */}
          <Button
            onClick={onSubmit}
            size="sm"
            className="bg-primary hover:bg-primary/90"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
