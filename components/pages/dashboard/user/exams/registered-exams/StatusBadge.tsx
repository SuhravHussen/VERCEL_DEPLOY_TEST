"use client";

import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { getStatusColor } from "./utils";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const icon = (() => {
    switch (status) {
      case "registered":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  })();

  return (
    <Badge className={getStatusColor(status)}>
      <div className="flex items-center gap-1">
        {icon}
        <span className="capitalize">{status}</span>
      </div>
    </Badge>
  );
}
