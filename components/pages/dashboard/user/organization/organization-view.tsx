"use client";

import { useState } from "react";
import { useUserOrganization } from "@/hooks/user/use-user-organization";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Building2,
  FileText,
  Bell,
  UserPlus,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { ExamsTab } from "./exams-tab";
import { AnnouncementsTab } from "./announcements-tab";
import { ExamsTab } from "./exams-tab";

interface OrganizationViewProps {
  organizationSlug: string;
}

export function OrganizationView({ organizationSlug }: OrganizationViewProps) {
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const {
    data: organization,
    isLoading,
    error,
  } = useUserOrganization(organizationSlug);

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

      {/* Join Organization Section */}
      <Card className="border-0 shadow-md sm:shadow-lg shadow-black/5 bg-gradient-to-r from-green-50/50 to-emerald-50/30 dark:from-green-950/20 dark:to-emerald-950/10 border border-green-200/50 dark:border-green-800/30">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            <div className="flex-shrink-0">
              <div className="p-3 sm:p-4 rounded-xl bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
                <UserPlus className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="flex-grow space-y-3 sm:space-y-4 text-center sm:text-left">
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-bold text-green-800 dark:text-green-200">
                  Join {organization.name}
                </h2>
                <p className="text-sm sm:text-base text-green-700 dark:text-green-300 leading-relaxed">
                  Become a member of our organization and get access to
                  exclusive exams, announcements, and learning resources. Join
                  our community today!
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Dialog
                  open={isJoinDialogOpen}
                  onOpenChange={setIsJoinDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      size="lg"
                      className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white border-0 shadow-md"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Request to Join
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-semibold">
                        Join {organization.name}
                      </DialogTitle>
                      <DialogDescription className="text-sm text-muted-foreground mt-2">
                        Are you sure you want to request to join{" "}
                        {organization.name}? Your request will be sent to the
                        organization administrators for approval.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsJoinDialogOpen(false)}
                        className="w-full sm:w-auto"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          // Handle join request logic here
                          console.log("Join request submitted");
                          setIsJoinDialogOpen(false);
                        }}
                        className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Confirm Request
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-950/30"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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

        {/* Tabs Section */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <Tabs defaultValue="exams" className="w-full">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b overflow-x-auto overflow-y-hidden">
                <TabsList className="!w-max !min-w-0 h-8 sm:h-9 flex-nowrap">
                  <TabsTrigger
                    value="exams"
                    className="px-2 sm:px-3 py-1 text-xs sm:text-sm gap-1 sm:gap-1.5 flex-shrink-0 whitespace-nowrap"
                  >
                    <FileText className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="hidden sm:inline">Exams</span>
                    <span className="sm:hidden">Exams</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="announcements"
                    className="px-2 sm:px-3 py-1 text-xs sm:text-sm gap-1 sm:gap-1.5 flex-shrink-0 whitespace-nowrap"
                  >
                    <Bell className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="hidden sm:inline">Announcements</span>
                    <span className="sm:hidden">News</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="exams" className="mt-0">
                <div className="p-6">
                  <ExamsTab organizationId={organization.id.toString()} />
                </div>
              </TabsContent>

              <TabsContent value="announcements" className="mt-0">
                <div className="p-6">
                  <AnnouncementsTab
                    organizationId={organization.id.toString()}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Contact Us Section */}
        <Card className="border-0 shadow-md sm:shadow-lg shadow-black/5 bg-gradient-to-r from-blue-50/50 to-cyan-50/30 dark:from-blue-950/20 dark:to-cyan-950/10 border border-blue-200/50 dark:border-blue-800/30">
          <CardHeader className="pb-4 sm:pb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold text-blue-800 dark:text-blue-200">
                Contact Us
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 sm:space-y-6">
              <p className="text-sm sm:text-base text-blue-700 dark:text-blue-300 leading-relaxed">
                Have questions about {organization.name}? Need help with
                registration or want to learn more about our programs?
                We&apos;re here to help!
              </p>

              <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                {/* Email Contact */}
                <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-lg bg-white/60 dark:bg-gray-900/60 border border-blue-100 dark:border-blue-900/50">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                      <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200 text-sm sm:text-base">
                      Email Support
                    </h3>
                    <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400">
                      contact@
                      {organization.name.toLowerCase().replace(/\s+/g, "")}.org
                    </p>
                    <p className="text-xs text-blue-500 dark:text-blue-500">
                      Response within 24 hours
                    </p>
                  </div>
                </div>

                {/* Phone Contact */}
                <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-lg bg-white/60 dark:bg-gray-900/60 border border-blue-100 dark:border-blue-900/50">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                      <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200 text-sm sm:text-base">
                      Phone Support
                    </h3>
                    <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400">
                      +1 (555) 123-4567
                    </p>
                    <p className="text-xs text-blue-500 dark:text-blue-500">
                      Mon-Fri, 9 AM - 6 PM
                    </p>
                  </div>
                </div>

                {/* Office Address */}
                <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-lg bg-white/60 dark:bg-gray-900/60 border border-blue-100 dark:border-blue-900/50 md:col-span-2">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                      <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200 text-sm sm:text-base">
                      Office Address
                    </h3>
                    <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400">
                      123 Education Street, Learning District
                      <br />
                      Knowledge City, KC 12345
                    </p>
                    <p className="text-xs text-blue-500 dark:text-blue-500">
                      Visit us during business hours
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
