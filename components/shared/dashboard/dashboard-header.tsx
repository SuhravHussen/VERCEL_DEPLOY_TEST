"use client";

import * as React from "react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types/user";
import { Organization } from "@/types/organization";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

interface Props {
  type: "user" | "organization" | "super-admin";
  user?: User;
  organization?: Organization;
  isLoadingOrg?: boolean;
  orgNotFound?: boolean;
  orgId?: number;
}

export function DashboardTypeShowing({
  type = "user",
  user,
  organization,
  isLoadingOrg = false,
  orgNotFound = false,
  orgId,
}: Props) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          {(type === "user" || type === "super-admin") && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Minimal Avatar */}
                <div className="w-8 h-8 rounded-full flex items-center justify-center">
                  <Avatar>
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* User Info */}
                <div className="flex flex-col">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                    {type} Dashboard
                  </p>
                  <p className="text-sm font-medium mt-0.5">{user?.name}</p>
                </div>
              </div>
            </div>
          )}
          {type === "organization" && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Minimal Avatar */}
                <div className="w-8 h-8 rounded-full flex items-center justify-center">
                  {isLoadingOrg ? (
                    <Skeleton className="w-8 h-8 rounded-full" />
                  ) : orgNotFound ? (
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                      <AlertCircle size={16} className="text-red-500" />
                    </div>
                  ) : (
                    <Avatar>
                      <AvatarImage src={organization?.logo} />
                      <AvatarFallback>
                        {organization?.name?.charAt(0) || "O"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>

                {/* User Info */}
                <div className="flex flex-col">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                    Org Dashboard
                  </p>
                  {isLoadingOrg ? (
                    <Skeleton className="h-4 w-24 mt-0.5" />
                  ) : orgNotFound ? (
                    <p className="text-sm font-medium mt-0.5 text-red-500">
                      Organization #{orgId} not found
                    </p>
                  ) : (
                    <p className="text-sm font-medium mt-0.5">
                      {organization?.name || "Unknown Organization"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
