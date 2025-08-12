import { Organization } from "@/types/organization";
import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";
import Image from "next/image";

interface OrganizationHeaderProps {
  organization: Organization;
}

export function OrganizationHeader({ organization }: OrganizationHeaderProps) {
  return (
    <div className="relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-transparent to-purple-50/20 dark:from-blue-950/10 dark:via-transparent dark:to-purple-950/5 rounded-xl sm:rounded-2xl -z-10"></div>

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 md:gap-8 p-4 sm:p-6">
        <div className="flex-shrink-0">
          {organization.logo ? (
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 overflow-hidden rounded-xl sm:rounded-2xl border border-gray-200 sm:border-white dark:border-gray-700 dark:sm:border-gray-800 bg-white dark:bg-gray-900 shadow-md sm:shadow-lg shadow-black/5">
              <Image
                src={organization.logo}
                alt={`${organization.name} logo`}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 items-center justify-center rounded-xl sm:rounded-2xl border border-gray-200 sm:border-white dark:border-gray-700 dark:sm:border-gray-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/30 shadow-md sm:shadow-lg shadow-black/5">
              <Building2 className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-blue-600 dark:text-blue-400" />
            </div>
          )}
        </div>

        <div className="flex-grow space-y-3 sm:space-y-4 min-w-0 text-center sm:text-left">
          <div className="space-y-2 sm:space-y-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent break-words">
              {organization.name}
            </h1>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Badge
                variant="secondary"
                className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 text-xs sm:text-sm"
              >
                <Building2 className="h-3 w-3 sm:h-4 sm:w-4" />
                Organization
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
