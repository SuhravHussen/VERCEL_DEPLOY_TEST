import React from "react";
import { HeaderSkeleton } from "./HeaderSkeleton";
import { SidebarSkeleton } from "./SidebarSkeleton";

export function DashboardLayoutSkeleton() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="hidden sm:block h-full">
        <SidebarSkeleton />
      </div>
      <div className="flex flex-1 flex-col w-full">
        <HeaderSkeleton />
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          {/* Content skeleton */}
          <div className="space-y-4">
            <div className="h-8 w-full md:w-64 rounded-md bg-muted" />
            <div className="h-32 w-full rounded-md bg-muted" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-24 rounded-md bg-muted" />
              <div className="h-24 rounded-md bg-muted" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
