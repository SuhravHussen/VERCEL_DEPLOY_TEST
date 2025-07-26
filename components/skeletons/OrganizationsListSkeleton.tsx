import React from "react";

export function OrganizationsListSkeleton() {
  // Create an array of different skeleton background colors
  const skeletonColors = [
    "bg-rose-50/50 dark:bg-rose-950/30",
    "bg-green-50/50 dark:bg-green-950/30",
    "bg-blue-50/50 dark:bg-blue-950/30",
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md w-48" />
        <div className="h-10 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full w-44" />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main content skeleton */}
        <div className="w-full lg:w-2/3">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 animate-pulse rounded w-3/4 max-w-lg mb-6" />

          <div className="grid grid-cols-1 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className={`${
                  skeletonColors[index % skeletonColors.length]
                } rounded-2xl p-6 border border-gray-100 dark:border-gray-800 animate-pulse overflow-hidden`}
              >
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                  {/* Logo placeholder */}
                  <div className="flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-lg w-24 h-24" />

                  {/* Content placeholders */}
                  <div className="flex-1 py-1 w-full">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
                    <div className="space-y-2 w-full">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
                    </div>
                  </div>

                  {/* Button placeholder */}
                  <div className="flex-shrink-0 self-center mt-3 sm:mt-0">
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-full w-36" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits sidebar skeleton */}
        <div className="w-full lg:w-1/3 lg:pt-12">
          <div className="rounded-xl bg-white dark:bg-card p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="h-7 bg-gray-200 dark:bg-gray-700 animate-pulse rounded w-2/3 mb-6" />

            <div className="space-y-5">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse w-8 h-8 mt-0.5" />
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 animate-pulse rounded w-1/2 mb-2" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded w-full" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
