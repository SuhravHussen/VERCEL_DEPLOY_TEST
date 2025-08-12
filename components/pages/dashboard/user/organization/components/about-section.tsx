import { Organization } from "@/types/organization";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";

interface AboutSectionProps {
  organization: Organization;
}

export function AboutSection({ organization }: AboutSectionProps) {
  return (
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
                        Contact your administrator to add organization details.
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
  );
}
