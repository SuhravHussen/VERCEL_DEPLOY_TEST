"use client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";

import { NavItem } from "@/types/nav-item";

import { IconChevronRight, IconLogout2, IconHome } from "@tabler/icons-react";

import Link from "next/link";
import Image from "next/image";
import { notFound, useParams, usePathname } from "next/navigation";
import * as React from "react";
import { Icons } from "@/resources/icons";

import { DashboardTypeShowing } from "@/components/shared/dashboard/dashboard-header";
import { RainbowButton } from "@/components/ui/RainbowButton";

import { getCurrentUser } from "@/lib/auth-client";
import { signOut } from "@/lib/auth";
import { useOrganization } from "@/hooks/organization/use-organization";

interface AppSidebarProps {
  navItems: NavItem[];
  type: "user" | "organization" | "super-admin";
}

export default function AppSidebar({
  navItems,
  type = "user",
}: AppSidebarProps) {
  const pathname = usePathname();
  const params = useParams();
  const user = getCurrentUser();
  const { setOpenMobile, isMobile } = useSidebar();

  const orgId = params.id;

  // Fetch organization data if we have a valid ID
  const { data: organization, isLoading: isLoadingOrg } = useOrganization(
    parseInt(orgId as string, 10)
  );

  // Handle case when organization is not found - ensure it's always a boolean
  const orgNotFound = !!(
    type === "organization" &&
    orgId &&
    !isLoadingOrg &&
    !organization
  );

  React.useEffect(() => {
    // Log error when organization is not found
    if (orgNotFound) {
      notFound();
    }
  }, [orgId, orgNotFound]);

  // Close mobile sidebar when route changes
  React.useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [pathname, isMobile, setOpenMobile]);

  // Helper function to render either an icon or an image
  const renderIcon = (item: NavItem) => {
    if (item.iconImage) {
      return (
        <Image
          src={item.iconImage}
          alt={item.title}
          width={20}
          height={20}
          className="mr-2"
        />
      );
    } else if (item.icon) {
      const iconKey = item.icon as keyof typeof Icons;
      const Icon = Icons[iconKey] || Icons.logo;
      return <Icon />;
    }
    return <Icons.logo />;
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <DashboardTypeShowing
          type={type}
          user={user || undefined}
          organization={organization}
          isLoadingOrg={isLoadingOrg}
          orgNotFound={orgNotFound}
          orgId={parseInt(orgId as string, 10)}
        />
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent className="overflow-x-hidden">
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={"Home"}>
                <Link href={`/`}>
                  <IconHome />
                  <span>Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup className="-mt-8">
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => {
              // Skip disabled items
              if (item.disabled) {
                return null;
              }

              return item?.items && item?.items?.length > 0 ? (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={pathname === item.url}
                      >
                        {renderIcon(item)}
                        <span>{item.title}</span>
                        <IconChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => {
                          // Skip disabled sub-items
                          if (subItem.disabled) {
                            return null;
                          }

                          // Check if this sub-item has its own nested items
                          return subItem?.items &&
                            subItem?.items?.length > 0 ? (
                            <Collapsible
                              key={subItem.title}
                              asChild
                              defaultOpen={subItem.isActive}
                              className="group/nested-collapsible"
                            >
                              <SidebarMenuSubItem>
                                <CollapsibleTrigger asChild>
                                  <SidebarMenuSubButton
                                    isActive={
                                      pathname.replace(
                                        /^\/[a-z]{2}(-[A-Z]{2})?\//,
                                        "/"
                                      ) === subItem.url
                                    }
                                  >
                                    <span>{subItem.title}</span>
                                    <IconChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/nested-collapsible:rotate-90" />
                                  </SidebarMenuSubButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                  <div className="ml-4 border-l pl-2">
                                    {subItem.items?.map((nestedItem) => {
                                      // Skip disabled nested items
                                      if (nestedItem.disabled) {
                                        return null;
                                      }

                                      return (
                                        <SidebarMenuSubItem
                                          key={nestedItem.title}
                                        >
                                          <SidebarMenuSubButton
                                            asChild
                                            isActive={
                                              pathname === nestedItem.url
                                            }
                                          >
                                            <Link href={nestedItem.url}>
                                              <span>{nestedItem.title}</span>
                                            </Link>
                                          </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                      );
                                    })}
                                  </div>
                                </CollapsibleContent>
                              </SidebarMenuSubItem>
                            </Collapsible>
                          ) : (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={
                                  pathname.replace(
                                    /^\/[a-z]{2}(-[A-Z]{2})?\//,
                                    "/"
                                  ) === subItem.url
                                }
                              >
                                <Link href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname === item.url}
                  >
                    <Link href={item.url}>
                      {renderIcon(item)}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <RainbowButton className="w-full truncate" onClick={() => signOut()}>
          <IconLogout2 />
          <span className="truncate">Logout</span>
        </RainbowButton>
      </SidebarFooter>
    </Sidebar>
  );
}
