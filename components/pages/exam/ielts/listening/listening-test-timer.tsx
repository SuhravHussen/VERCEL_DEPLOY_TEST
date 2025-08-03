"use client";

import { useEffect, useState, useCallback, memo } from "react";
import { Clock } from "lucide-react";

interface ListeningTestTimerProps {
  totalMinutes: number;
  onTimeUp: () => void;
}

const ListeningTestTimer = memo(function ListeningTestTimer({
  totalMinutes,
  onTimeUp,
}: ListeningTestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(totalMinutes * 60); // Convert to seconds

  const handleTimeUp = useCallback(() => {
    onTimeUp();
  }, [onTimeUp]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, handleTimeUp]);

  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }, []);

  const isLowTime = timeLeft < 300; // Less than 5 minutes

  return (
    <div className="flex items-center space-x-1 sm:space-x-2">
      <span className="text-muted-foreground font-medium text-xs sm:text-sm lg:text-base hidden sm:inline">
        Time left:
      </span>
      <span className="text-muted-foreground font-medium text-xs sm:hidden">
        Time:
      </span>
      <div className="flex items-center space-x-1">
        <Clock
          className={`w-3 h-3 sm:w-4 sm:h-4 ${
            isLowTime ? "text-destructive" : "text-muted-foreground"
          }`}
        />
        <span
          className={`font-bold text-sm sm:text-base lg:text-lg font-mono ${
            isLowTime ? "text-destructive" : "text-foreground"
          }`}
        >
          {formatTime(timeLeft)}
        </span>
      </div>
    </div>
  );
});

export default ListeningTestTimer;
