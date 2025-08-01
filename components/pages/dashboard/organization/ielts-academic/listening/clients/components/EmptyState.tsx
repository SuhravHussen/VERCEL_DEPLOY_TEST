"use client";

import Link from "next/link";
import { FileAudio, PlusCircle, FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  hasFilters: boolean;
  organizationId: number;
  onClearFilters: () => void;
}

export function EmptyState({
  hasFilters,
  organizationId,
  onClearFilters,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-6 mb-6">
        <FileAudio className="h-12 w-12 text-muted-foreground" />
      </div>

      {hasFilters ? (
        <>
          <h3 className="text-2xl font-semibold tracking-tight mb-3">
            No matching tests found
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            We couldn&apos;t find any listening tests that match your current
            filters. Try adjusting your search criteria or clear all filters.
          </p>
          <Button onClick={onClearFilters} variant="outline" size="lg">
            <FilterX className="mr-2 h-5 w-5" />
            Clear Filters
          </Button>
        </>
      ) : (
        <>
          <h3 className="text-2xl font-semibold tracking-tight mb-3">
            No listening tests yet
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Get started by creating your first IELTS Academic Listening test.
            You can add audio files and create various question types across the
            four listening sections.
          </p>
          <Link
            href={`/dashboard/organization/${organizationId}/ielts/listening/tests/create`}
          >
            <Button size="lg">
              <PlusCircle className="mr-2 h-5 w-5" />
              Create New Test
            </Button>
          </Link>
        </>
      )}
    </div>
  );
}
