"use client";

import { useState, useEffect, memo } from "react";
import { Badge } from "@/components/ui/badge";

interface WritingTestTimerProps {
  totalMinutes: number;
  onTimeUp: () => void;
}

const WritingTestTimer = memo(function WritingTestTimer({
  totalMinutes,
  onTimeUp,
}: WritingTestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(totalMinutes * 60);
  const [isWarning, setIsWarning] = useState(false);
  const [isCritical, setIsCritical] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;

        // Set warning states
        const warningTime = totalMinutes * 60 * 0.25; // 25% time left
        const criticalTime = totalMinutes * 60 * 0.1; // 10% time left

        setIsWarning(newTime <= warningTime && newTime > criticalTime);
        setIsCritical(newTime <= criticalTime && newTime > 0);

        if (newTime <= 0) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [totalMinutes, onTimeUp]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
    }

    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getTimerVariant = () => {
    if (isCritical) return "destructive";
    if (isWarning) return "secondary";
    return "outline";
  };

  return (
    <Badge
      variant={getTimerVariant()}
      className={`font-mono text-sm px-3 py-1 ${
        isCritical ? "animate-pulse" : ""
      }`}
    >
      {formatTime(timeLeft)}
    </Badge>
  );
});

export default WritingTestTimer;
