"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Video,
  VideoOff,
  Users,
  GraduationCap,
  Clock,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

interface SpeakingTestHeaderProps {
  studentName: string;
  speakingSession?: {
    date: string;
    start_time: string;
    end_time: string;
    status: string;
  };
  isAssignedTeacher: boolean;
  isRecording: boolean;
  recordingStatus: string;
  onToggleRecording: () => void;
  onOpenGrading?: () => void;
}

export function SpeakingTestHeader({
  studentName,
  speakingSession,
  isAssignedTeacher,
  isRecording,
  recordingStatus,
  onToggleRecording,
  onOpenGrading,
}: SpeakingTestHeaderProps) {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <>
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex justify-center px-2 sm:px-4 py-2">
          <div className="w-full max-w-5xl rounded-xl bg-black/20 backdrop-blur-lg border border-white/10 shadow-2xl">
            <div className="relative flex h-12 items-center justify-between px-3 sm:px-4">
              {/* Left Side: Title & Icon */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-white/10 rounded-lg">
                  <GraduationCap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-sm font-bold text-white">
                    IELTS Speaking
                  </h1>
                </div>
              </div>

              {/* Center: Student Info */}
              <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-white/80" />
                    <span className="font-medium text-white">
                      {studentName}
                    </span>
                  </div>

                  <Badge
                    className={`text-xs px-2 py-0.5 border ${
                      isAssignedTeacher
                        ? "bg-emerald-500/20 text-emerald-200 border-emerald-400/30"
                        : "bg-blue-500/20 text-blue-200 border-blue-400/30"
                    }`}
                  >
                    {isAssignedTeacher ? "Instructor" : "Student"}
                  </Badge>

                  {speakingSession && (
                    <>
                      <div className="w-1 h-1 bg-white/40 rounded-full" />
                      <div className="flex items-center gap-1 text-white/70">
                        <Clock className="h-3 w-3" />
                        <span className="text-xs">
                          {new Date(speakingSession.date).toLocaleDateString()}{" "}
                          {new Date(
                            speakingSession.start_time
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Mobile Center: Simplified */}
              <div className="lg:hidden flex items-center gap-2">
                <span className="text-sm font-medium text-white truncate max-w-32 sm:max-w-none">
                  {studentName}
                </span>
                <Badge
                  className={`text-xs px-1.5 py-0.5 border ${
                    isAssignedTeacher
                      ? "bg-emerald-500/20 text-emerald-200 border-emerald-400/30"
                      : "bg-blue-500/20 text-blue-200 border-blue-400/30"
                  }`}
                >
                  {isAssignedTeacher ? "Instructor" : "Student"}
                </Badge>
              </div>

              {/* Right Side: Action Buttons */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Button
                  onClick={onToggleRecording}
                  size="sm"
                  className={`h-8 sm:h-9 px-2.5 sm:px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                    isRecording
                      ? "bg-red-500/80 hover:bg-red-500 text-white animate-pulse"
                      : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  }`}
                  disabled={recordingStatus === "acquiring_media"}
                >
                  {isRecording ? (
                    <>
                      <VideoOff className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-1" />
                      <span className="hidden sm:inline">Stop</span>
                    </>
                  ) : (
                    <>
                      <Video className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-1" />
                      <span className="hidden sm:inline">
                        {recordingStatus === "acquiring_media"
                          ? "Starting..."
                          : "Record"}
                      </span>
                    </>
                  )}
                </Button>

                {isAssignedTeacher && onOpenGrading && (
                  <Button
                    onClick={onOpenGrading}
                    size="sm"
                    className="h-8 sm:h-9 px-2.5 sm:px-3 text-xs sm:text-sm font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
                  >
                    <GraduationCap className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-1" />
                    <span className="hidden sm:inline">Grade</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Toggle Button */}
      <Button
        onClick={() => setIsVisible(!isVisible)}
        size="sm"
        className={`fixed top-2 right-2 z-50 h-8 w-8 p-0 rounded-full bg-black/40 hover:bg-black/60 text-white border border-white/20 transition-all duration-300 ${
          isVisible ? "translate-y-0" : "translate-y-0"
        }`}
      >
        {isVisible ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>
    </>
  );
}
