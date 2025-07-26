import React from "react";

export function SidebarSkeleton() {
  return (
    <div className="hidden md:flex h-screen w-64 flex-col border-r bg-background animate-pulse md:w-64 sm:w-16">
      {/* Header */}
      <div className="flex h-16 shrink-0 items-center border-b px-4">
        <div className="h-8 w-40 rounded-md bg-muted sm:w-8" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {/* Group label */}
        <div className="mb-2 h-4 w-20 rounded-md bg-muted sm:hidden" />

        {/* Menu items */}
        <div className="mt-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-5 w-5 rounded-md bg-muted flex-shrink-0" />
              <div className="h-4 w-32 rounded-md bg-muted sm:hidden" />
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto border-t p-4">
        <div className="h-9 w-full rounded-md bg-muted" />
      </div>
    </div>
  );
}
