"use client";

import React from "react";
import {
  BookOpen,
  GraduationCap,
  Target,
  Award,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExamStatsData, ExamType } from "@/types/exam/exam";
import { cn } from "@/lib/utils";

interface AllExamsStatsProps {
  stats: ExamStatsData;
  isLoading?: boolean;
  className?: string;
}

const EXAM_TYPE_CONFIG = {
  [ExamType.IELTS]: {
    icon: BookOpen,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  [ExamType.TOEFL]: {
    icon: GraduationCap,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
  [ExamType.GRE]: {
    icon: Target,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  [ExamType.SAT]: {
    icon: Award,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
  [ExamType.GMAT]: {
    icon: GraduationCap,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  className,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  description?: string;
  className?: string;
}) => (
  <Card className={cn("", className)}>
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
    </CardContent>
  </Card>
);

export function AllExamsStats({
  stats,
  isLoading = false,
  className,
}: AllExamsStatsProps) {
  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-20"></div>
                    <div className="h-8 bg-muted rounded w-12"></div>
                  </div>
                  <div className="h-8 w-8 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const examTypesWithData = Object.entries(stats.totalByType).filter(
    ([, count]) => count > 0
  );

  return (
    <div className={cn("space-y-6", className)}>
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Exams"
          value={stats.totalExams}
          icon={TrendingUp}
          description="All exam types"
        />
        <StatCard
          title="Free Exams"
          value={stats.freeExams}
          icon={DollarSign}
          description="No registration fee"
        />
        <StatCard
          title="Upcoming Exams"
          value={stats.upcomingExams}
          icon={Calendar}
          description="Future scheduled"
        />
        <StatCard
          title="Published"
          value={stats.publishedExams}
          icon={Users}
          description="Available for registration"
        />
      </div>

      {/* Exam Types Breakdown */}
      {examTypesWithData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Exam Types Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {examTypesWithData.map(([type, count]) => {
                const config = EXAM_TYPE_CONFIG[type as ExamType];
                const IconComponent = config.icon;

                return (
                  <div
                    key={type}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border",
                      config.bgColor,
                      config.borderColor
                    )}
                  >
                    <div className={cn("p-2 rounded-md bg-white/80")}>
                      <IconComponent className={cn("h-5 w-5", config.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-black">
                        {type.toUpperCase()}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className={cn("text-xs", config.color, "bg-white/80")}
                        >
                          {count} exam{count !== 1 ? "s" : ""}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Distribution:</span>
                <div className="flex items-center gap-4">
                  <span>
                    {Math.round((stats.freeExams / stats.totalExams) * 100) ||
                      0}
                    % Free
                  </span>
                  <span>
                    {Math.round(
                      (stats.publishedExams / stats.totalExams) * 100
                    ) || 0}
                    % Published
                  </span>
                  <span>
                    {Math.round(
                      (stats.upcomingExams / stats.totalExams) * 100
                    ) || 0}
                    % Upcoming
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
