import React from "react";
import { Separator } from "@/components/ui/separator";

export function HeaderSkeleton() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 animate-pulse w-full">
      <div className="flex items-center gap-2 px-4">
        {/* Sidebar trigger skeleton */}
        <div className="h-8 w-8 rounded-md bg-muted" />
        <Separator
          orientation="vertical"
          className="mr-2 h-4 hidden sm:block"
        />
        {/* Breadcrumbs skeleton */}
        <div className="h-4 w-24 rounded-md bg-muted hidden sm:block" />
      </div>

      <div className="flex items-center gap-2 px-4">
        {/* User nav skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-muted flex-shrink-0" />
          <div className="h-4 w-20 rounded-md bg-muted hidden sm:block" />
        </div>
        {/* Theme toggle skeleton */}
        <div className="h-8 w-8 rounded-md bg-muted flex-shrink-0" />
        {/* Language switcher skeleton */}
        <div className="h-8 w-8 rounded-md bg-muted flex-shrink-0" />
      </div>
    </header>
  );
}
