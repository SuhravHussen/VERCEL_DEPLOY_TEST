"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimePickerProps {
  value?: string;
  onChange?: (time: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  format?: "12h" | "24h";
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  placeholder = "Select time",
  disabled = false,
  className,
  format = "24h",
}) => {
  const [open, setOpen] = React.useState(false);
  const [tempHour, setTempHour] = React.useState("");
  const [tempMinute, setTempMinute] = React.useState("");
  const [tempPeriod, setTempPeriod] = React.useState("AM");

  React.useEffect(() => {
    if (value) {
      const [hourStr, minuteStr] = value.split(":");
      let hour = parseInt(hourStr);
      const minute = parseInt(minuteStr);

      if (format === "12h") {
        const period = hour >= 12 ? "PM" : "AM";
        if (hour > 12) hour -= 12;
        if (hour === 0) hour = 12;
        setTempHour(hour.toString());
        setTempPeriod(period);
      } else {
        setTempHour(hour.toString().padStart(2, "0"));
      }
      setTempMinute(minute.toString().padStart(2, "0"));
    } else {
      // Reset temp values when no value
      setTempHour("");
      setTempMinute("");
      setTempPeriod("AM");
    }
  }, [value, format]);

  const formatTime = (time: string) => {
    if (!time) return placeholder;
    const [hour, minute] = time.split(":");
    if (format === "12h") {
      const h = parseInt(hour);
      const period = h >= 12 ? "PM" : "AM";
      const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
      return `${displayHour}:${minute} ${period}`;
    }
    return time;
  };

  const handleTimeChange = () => {
    if (tempHour && tempMinute) {
      let hour = parseInt(tempHour);

      if (format === "12h") {
        if (tempPeriod === "PM" && hour !== 12) hour += 12;
        if (tempPeriod === "AM" && hour === 12) hour = 0;
      }

      const timeString = `${hour
        .toString()
        .padStart(2, "0")}:${tempMinute.padStart(2, "0")}`;
      onChange?.(timeString);
      setOpen(false);
    }
  };

  const handleCancel = () => {
    // Reset to current value or empty
    if (value) {
      const [hourStr, minuteStr] = value.split(":");
      let hour = parseInt(hourStr);
      const minute = parseInt(minuteStr);

      if (format === "12h") {
        const period = hour >= 12 ? "PM" : "AM";
        if (hour > 12) hour -= 12;
        if (hour === 0) hour = 12;
        setTempHour(hour.toString());
        setTempPeriod(period);
      } else {
        setTempHour(hour.toString().padStart(2, "0"));
      }
      setTempMinute(minute.toString().padStart(2, "0"));
    } else {
      setTempHour("");
      setTempMinute("");
      setTempPeriod("AM");
    }
    setOpen(false);
  };

  const hours =
    format === "12h"
      ? Array.from({ length: 12 }, (_, i) => (i + 1).toString())
      : Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));

  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  const isTimeSelected = tempHour && tempMinute;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            "bg-background border-border text-foreground",
            "hover:bg-accent hover:text-accent-foreground",
            "focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "transition-all duration-200 ease-in-out",
            !value && "text-muted-foreground",
            disabled && "opacity-50 cursor-not-allowed hover:bg-background",
            className
          )}
          disabled={disabled}
        >
          <Clock
            className={cn(
              "mr-2 h-4 w-4 transition-colors duration-200",
              value ? "text-foreground" : "text-muted-foreground"
            )}
          />
          <span className="flex-1">{formatTime(value || "")}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "w-auto p-0 bg-background border-border shadow-lg",
          "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
        )}
        align="start"
        sideOffset={4}
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center space-y-1">
            <h4 className="text-sm font-semibold text-foreground">
              Select Time
            </h4>
            <p className="text-xs text-muted-foreground">
              Choose your preferred time
            </p>
          </div>

          {/* Time Selection */}
          <div className="flex items-center justify-center gap-3">
            {/* Hour Selection */}
            <div className="flex flex-col items-center gap-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {format === "12h" ? "Hour" : "Hours"}
              </label>
              <Select value={tempHour} onValueChange={setTempHour}>
                <SelectTrigger
                  className={cn(
                    "w-16 h-12 bg-background border-border text-foreground",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus:ring-2 focus:ring-ring transition-all duration-200",
                    "text-center font-medium"
                  )}
                >
                  <SelectValue placeholder="--" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {hours.map((hour) => (
                    <SelectItem
                      key={hour}
                      value={hour}
                      className="text-center justify-center"
                    >
                      {hour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Separator */}
            <div className="flex flex-col items-center gap-2">
              <div className="h-4" /> {/* Spacer for label */}
              <span className="text-2xl font-bold text-muted-foreground/60 mt-2">
                :
              </span>
            </div>

            {/* Minute Selection */}
            <div className="flex flex-col items-center gap-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Minutes
              </label>
              <Select value={tempMinute} onValueChange={setTempMinute}>
                <SelectTrigger
                  className={cn(
                    "w-16 h-12 bg-background border-border text-foreground",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus:ring-2 focus:ring-ring transition-all duration-200",
                    "text-center font-medium"
                  )}
                >
                  <SelectValue placeholder="--" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {minutes.map((minute) => (
                    <SelectItem
                      key={minute}
                      value={minute}
                      className="text-center justify-center"
                    >
                      {minute}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* AM/PM Selection for 12h format */}
            {format === "12h" && (
              <>
                <div className="flex flex-col items-center gap-2">
                  <div className="h-4" /> {/* Spacer for label */}
                  <div className="w-px h-8 bg-border mx-2" />{" "}
                  {/* Visual separator */}
                </div>
                <div className="flex flex-col items-center gap-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Period
                  </label>
                  <Select value={tempPeriod} onValueChange={setTempPeriod}>
                    <SelectTrigger
                      className={cn(
                        "w-16 h-12 bg-background border-border text-foreground",
                        "hover:bg-accent hover:text-accent-foreground",
                        "focus:ring-2 focus:ring-ring transition-all duration-200",
                        "text-center font-medium"
                      )}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        value="AM"
                        className="text-center justify-center"
                      >
                        AM
                      </SelectItem>
                      <SelectItem
                        value="PM"
                        className="text-center justify-center"
                      >
                        PM
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className={cn(
                "flex-1 border-border text-foreground",
                "hover:bg-accent hover:text-accent-foreground",
                "transition-all duration-200"
              )}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleTimeChange}
              disabled={!isTimeSelected}
              className={cn(
                "flex-1 bg-primary text-primary-foreground",
                "hover:bg-primary/90 disabled:opacity-50",
                "transition-all duration-200",
                "disabled:cursor-not-allowed"
              )}
            >
              {isTimeSelected ? "Set Time" : "Select Time"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
