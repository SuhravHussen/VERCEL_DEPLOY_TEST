"use client";

import { useState } from "react";
import { Organization } from "@/types/organization";
import { Card, CardContent } from "@/components/ui/card";
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
import { UserPlus, UserMinus } from "lucide-react";

interface MembershipSectionProps {
  organization: Organization;
  isMember: boolean;
  userId: string;
}

export function MembershipSection({
  organization,
  isMember,
  userId,
}: MembershipSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleMembershipAction = async () => {
    setIsLoading(true);
    try {
      if (isMember) {
        // Handle leave organization logic here
        console.log(
          "Leave organization:",
          organization.id,
          "for user:",
          userId
        );
      } else {
        // Handle join organization logic here
        console.log("Join organization:", organization.id, "for user:", userId);
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error handling membership action:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const cardClassName = isMember
    ? "border-0 shadow-md sm:shadow-lg shadow-black/5 bg-gradient-to-r from-orange-50/50 to-red-50/30 dark:from-orange-950/20 dark:to-red-950/10 border border-orange-200/50 dark:border-orange-800/30"
    : "border-0 shadow-md sm:shadow-lg shadow-black/5 bg-gradient-to-r from-green-50/50 to-emerald-50/30 dark:from-green-950/20 dark:to-emerald-950/10 border border-green-200/50 dark:border-green-800/30";

  const iconBgClassName = isMember
    ? "p-3 sm:p-4 rounded-xl bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800"
    : "p-3 sm:p-4 rounded-xl bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800";

  const iconClassName = isMember
    ? "h-6 w-6 sm:h-8 sm:w-8 text-orange-600 dark:text-orange-400"
    : "h-6 w-6 sm:h-8 sm:w-8 text-green-600 dark:text-green-400";

  const titleClassName = isMember
    ? "text-xl sm:text-2xl font-bold text-orange-800 dark:text-orange-200"
    : "text-xl sm:text-2xl font-bold text-green-800 dark:text-green-200";

  const descriptionClassName = isMember
    ? "text-sm sm:text-base text-orange-700 dark:text-orange-300 leading-relaxed"
    : "text-sm sm:text-base text-green-700 dark:text-green-300 leading-relaxed";

  const buttonClassName = isMember
    ? "bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600 text-white border-0 shadow-md"
    : "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white border-0 shadow-md";

  const learnMoreClassName = isMember
    ? "border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950/30"
    : "border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-950/30";

  return (
    <Card className={cardClassName}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          <div className="flex-shrink-0">
            <div className={iconBgClassName}>
              {isMember ? (
                <UserMinus className={iconClassName} />
              ) : (
                <UserPlus className={iconClassName} />
              )}
            </div>
          </div>
          <div className="flex-grow space-y-3 sm:space-y-4 text-center sm:text-left">
            <div className="space-y-2">
              <h2 className={titleClassName}>
                {isMember
                  ? `Leave ${organization.name}`
                  : `Join ${organization.name}`}
              </h2>
              <p className={descriptionClassName}>
                {isMember
                  ? "You are currently a member of this organization. If you leave, you will lose access to exclusive exams, announcements, and learning resources."
                  : "Become a member of our organization and get access to exclusive exams, announcements, and learning resources. Join our community today!"}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className={buttonClassName}
                    disabled={isLoading}
                  >
                    {isMember ? (
                      <UserMinus className="h-4 w-4 mr-2" />
                    ) : (
                      <UserPlus className="h-4 w-4 mr-2" />
                    )}
                    {isLoading
                      ? "Processing..."
                      : isMember
                      ? "Leave Organization"
                      : "Join Organization"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                      {isMember ? "Leave" : "Join"} {organization.name}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground mt-2">
                      {isMember
                        ? `Are you sure you want to leave ${organization.name}? You will lose access to all organization resources and will need to request to join again if you change your mind.`
                        : `Are you sure you want to join ${organization.name}? You will gain immediate access to organization resources and content.`}
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      className="w-full sm:w-auto"
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleMembershipAction}
                      className={`w-full sm:w-auto ${buttonClassName}`}
                      disabled={isLoading}
                    >
                      {isMember ? (
                        <UserMinus className="h-4 w-4 mr-2" />
                      ) : (
                        <UserPlus className="h-4 w-4 mr-2" />
                      )}
                      {isLoading
                        ? "Processing..."
                        : isMember
                        ? "Confirm Leave"
                        : "Confirm Join"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button
                variant="outline"
                size="lg"
                className={learnMoreClassName}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
