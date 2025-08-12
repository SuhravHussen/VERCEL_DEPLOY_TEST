import React from "react";
import { BookOpen, Calendar, TrendingUp, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExamStatsData } from "@/types/exam/exam";

interface AssignedExamsStatsProps {
  stats: ExamStatsData;
  isLoading?: boolean;
  className?: string;
}

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ElementType;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
}: StatCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-emerald-600";
      case "down":
        return "text-red-600";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card/60 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-0.5">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-accent/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          {title}
        </CardTitle>
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors duration-200">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-200 mb-2">
          {value}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
        {trend && trendValue && (
          <div className={`flex items-center text-sm mt-3 ${getTrendColor()}`}>
            <TrendingUp className="mr-2 h-4 w-4" />
            <span className="font-medium">{trendValue}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function AssignedExamsStats({
  stats,
  isLoading,
  className,
}: AssignedExamsStatsProps) {
  if (isLoading) {
    return (
      <div className={`grid gap-6 md:grid-cols-3 ${className || ""}`}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Card
            key={i}
            className="border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden"
          >
            <div className="p-6 space-y-4 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-muted/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite] bg-[length:200%_100%]"></div>
              <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 p-0 pb-4">
                <div className="h-4 w-24 bg-muted/50 rounded-lg animate-pulse"></div>
                <div className="w-10 h-10 bg-primary/10 rounded-xl animate-pulse"></div>
              </CardHeader>
              <CardContent className="relative z-10 p-0">
                <div className="h-9 w-20 bg-muted/40 rounded-lg animate-pulse mb-3"></div>
                <div className="h-4 w-32 bg-muted/30 rounded animate-pulse"></div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  // Calculate exams that are past or today
  const pastAndTodayCount = stats.totalExams - stats.upcomingExams;

  return (
    <div className={`grid gap-6 md:grid-cols-3 ${className || ""}`}>
      <StatCard
        title="Total Assigned"
        value={stats.totalExams}
        description="Exams assigned to you"
        icon={BookOpen}
      />

      <StatCard
        title="Past & Today"
        value={pastAndTodayCount}
        description="Exams from today or earlier"
        icon={CheckCircle2}
      />

      <StatCard
        title="Upcoming Exams"
        value={stats.upcomingExams}
        description="Scheduled for future dates"
        icon={Calendar}
      />
    </div>
  );
}

// Loading skeleton component
export function AssignedExamsStatsSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={`grid gap-6 md:grid-cols-3 ${className || ""}`}>
      {Array.from({ length: 3 }).map((_, i) => (
        <Card
          key={i}
          className="border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden"
        >
          <div className="p-6 space-y-4 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-muted/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite] bg-[length:200%_100%]"></div>
            <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 p-0 pb-4">
              <div className="h-4 w-24 bg-muted/50 rounded-lg animate-pulse"></div>
              <div className="w-10 h-10 bg-primary/10 rounded-xl animate-pulse"></div>
            </CardHeader>
            <CardContent className="relative z-10 p-0">
              <div className="h-9 w-20 bg-muted/40 rounded-lg animate-pulse mb-3"></div>
              <div className="h-4 w-32 bg-muted/30 rounded animate-pulse"></div>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  );
}
