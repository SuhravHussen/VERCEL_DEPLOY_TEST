"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, Search } from "lucide-react";

interface EmptyStateProps {
  hasFilters: boolean;
  organizationSlug: string;
  onClearFilters: () => void;
}

export function EmptyState({
  hasFilters,
  organizationSlug,
  onClearFilters,
}: EmptyStateProps) {
  return (
    <Card className="border-2 border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Search className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No tests found</h3>
        <p className="text-muted-foreground text-lg mb-6 max-w-md">
          {hasFilters
            ? "Try adjusting your filters or create a new test to get started"
            : "Get started by creating your first IELTS Reading test"}
        </p>
        {!hasFilters ? (
          <Link
            href={`/dashboard/organization/${organizationSlug}/ielts/reading/tests/create`}
          >
            <Button size="lg" className="shadow-sm">
              <PlusCircle className="mr-2 h-5 w-5" />
              Create New Test
            </Button>
          </Link>
        ) : (
          <Button variant="outline" size="lg" onClick={onClearFilters}>
            Clear Filters
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
