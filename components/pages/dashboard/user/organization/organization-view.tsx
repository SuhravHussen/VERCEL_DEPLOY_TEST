"use client";

import { useUserOrganization } from "@/hooks/user/use-user-organization";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";

interface OrganizationViewProps {
  organizationId: string;
}

export function OrganizationView({ organizationId }: OrganizationViewProps) {
  const {
    data: organization,
    isLoading,
    error,
  } = useUserOrganization(organizationId);

  if (isLoading) {
    return (
      <div className="space-y-6 md:space-y-8">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <Skeleton className="h-20 w-20 sm:h-24 sm:w-24 rounded-xl" />
          <div className="space-y-2 sm:space-y-3 text-center sm:text-left">
            <Skeleton className="h-8 sm:h-10 w-64 sm:w-80 mx-auto sm:mx-0" />
            <Skeleton className="h-5 sm:h-6 w-24 sm:w-32 mx-auto sm:mx-0" />
          </div>
        </div>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <Skeleton className="h-6 sm:h-7 w-48 sm:w-56" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted/20 p-4 sm:p-6">
              <Skeleton className="h-4 sm:h-5 w-full mb-2 sm:mb-3" />
              <Skeleton className="h-4 sm:h-5 w-4/5 mb-2 sm:mb-3" />
              <Skeleton className="h-4 sm:h-5 w-3/5" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load organization information. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (!organization) {
    return (
      <Alert>
        <AlertDescription>
          Organization not found or you don&apos;t have access to view this
          organization.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header Section */}
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-transparent to-purple-50/20 dark:from-blue-950/10 dark:via-transparent dark:to-purple-950/5 rounded-xl sm:rounded-2xl -z-10"></div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 md:gap-8 p-4 sm:p-6">
          <div className="flex-shrink-0">
            {organization.logo ? (
              <div className="relative h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 overflow-hidden rounded-xl sm:rounded-2xl border border-gray-200 sm:border-2 sm:border-white dark:border-gray-700 dark:sm:border-gray-800 bg-white dark:bg-gray-900 shadow-md sm:shadow-lg shadow-black/5">
                <Image
                  src={organization.logo}
                  alt={`${organization.name} logo`}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 items-center justify-center rounded-xl sm:rounded-2xl border border-gray-200 sm:border-2 sm:border-white dark:border-gray-700 dark:sm:border-gray-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/30 shadow-md sm:shadow-lg shadow-black/5">
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

      {/* Organization Details */}
      <div className="grid gap-6 md:gap-8">
        {/* About Section */}
        <Card className="border-0 shadow-md sm:shadow-lg shadow-black/5 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <CardHeader className="pb-4 sm:pb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Building2 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold">
                About Organization
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Background pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white/30 to-indigo-50/50 dark:from-blue-950/20 dark:via-gray-900/30 dark:to-indigo-950/20 rounded-lg sm:rounded-xl"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)] rounded-lg sm:rounded-xl"></div>

              <div className="relative p-4 sm:p-6 md:p-8 border border-blue-100/50 dark:border-blue-900/20 rounded-lg sm:rounded-xl">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex-shrink-0 mt-0.5 sm:mt-1">
                    <div className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                  </div>
                  <div className="flex-grow">
                    {organization.description ? (
                      <p className="text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300 font-medium">
                        {organization.description}
                      </p>
                    ) : (
                      <div className="text-center py-6 sm:py-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-3 sm:mb-4">
                          <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg mb-2">
                          No description available for this organization.
                        </p>
                        <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500">
                          Contact your administrator to add organization
                          details.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Organization Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-gradient-to-r from-blue-50/50 to-indigo-50/30 dark:from-blue-950/20 dark:to-indigo-950/10 p-6 border border-blue-100/50 dark:border-blue-900/20">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-foreground">
                    Welcome to {organization.name}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    This is the public view of{" "}
                    <strong>{organization.name}</strong>. You can see basic
                    information about this organization. For more detailed
                    information or administrative access, please contact your
                    organization administrator.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
