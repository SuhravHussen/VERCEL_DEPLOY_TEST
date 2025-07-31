import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  actionButton?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  className?: string;
}

export function PageLayout({
  children,
  title,
  description,
  actionButton,
  className = "",
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-dashboard-background">
      <div className={`container mx-auto px-4 py-8 max-w-7xl ${className}`}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>

          {actionButton && (
            <Button onClick={actionButton.onClick} className="gap-2">
              {actionButton.icon || <Plus className="h-4 w-4" />}
              {actionButton.label}
            </Button>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}
