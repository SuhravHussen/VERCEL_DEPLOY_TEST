import { Users, Clock, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SpeakingSessionsStatsProps {
  totalSessions: number;
  scheduledSessions: number;
  completedSessions: number;
  cancelledSessions: number;
}

export function SpeakingSessionsStats({
  totalSessions,
  scheduledSessions,
  completedSessions,
  cancelledSessions,
}: SpeakingSessionsStatsProps) {
  const stats = [
    {
      title: "Total Sessions",
      value: totalSessions,
      icon: Users,
      description: "All sessions",
      bgColor: "bg-primary/10",
      hoverBgColor: "group-hover:bg-primary/20",
      iconColor: "text-primary",
    },
    {
      title: "Scheduled",
      value: scheduledSessions,
      icon: Clock,
      description: "Upcoming sessions",
      bgColor: "bg-blue-500/10",
      hoverBgColor: "group-hover:bg-blue-500/20",
      iconColor: "text-blue-500",
      valueColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Completed",
      value: completedSessions,
      icon: CheckCircle,
      description: "Finished sessions",
      bgColor: "bg-green-500/10",
      hoverBgColor: "group-hover:bg-green-500/20",
      iconColor: "text-green-500",
      valueColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "Cancelled",
      value: cancelledSessions,
      icon: XCircle,
      description: "Cancelled sessions",
      bgColor: "bg-red-500/10",
      hoverBgColor: "group-hover:bg-red-500/20",
      iconColor: "text-red-500",
      valueColor: "text-red-600 dark:text-red-400",
    },
  ];

  return (
    <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <Card
            key={stat.title}
            className="group hover:shadow-lg transition-all duration-200 bg-card/50 backdrop-blur-sm border-border/50 hover:border-border"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div
                className={`p-1.5 sm:p-2 ${stat.bgColor} rounded-lg ${stat.hoverBgColor} transition-colors`}
              >
                <IconComponent
                  className={`h-3 w-3 sm:h-4 sm:w-4 ${stat.iconColor}`}
                />
              </div>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div
                className={`text-xl sm:text-2xl lg:text-3xl font-bold ${
                  stat.valueColor || ""
                }`}
              >
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
