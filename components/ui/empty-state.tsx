import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  searchQuery?: string;
  onClearSearch?: () => void;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon,
  title,
  description,
  searchQuery,
  onClearSearch,
  primaryAction,
  secondaryAction,
}: EmptyStateProps) {
  const isSearchResult = searchQuery && searchQuery.length > 0;

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">{icon}</div>
        <h3 className="text-lg font-semibold mb-2">
          {isSearchResult ? `No matching ${title.toLowerCase()} found` : title}
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          {isSearchResult
            ? `No items match your search for "${searchQuery}". Try adjusting your search terms.`
            : description}
        </p>
        <div className="flex gap-2">
          {isSearchResult && onClearSearch ? (
            <Button variant="outline" onClick={onClearSearch}>
              Clear Search
            </Button>
          ) : primaryAction ? (
            <Button onClick={primaryAction.onClick} className="gap-2">
              {primaryAction.icon || <Plus className="h-4 w-4" />}
              {primaryAction.label}
            </Button>
          ) : null}

          {secondaryAction && (
            <Button variant="outline" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
