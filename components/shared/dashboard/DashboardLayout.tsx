import React, { Suspense } from "react";
import Header from "@/components/shared/dashboard/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { NavItem } from "@/types/nav-item";
import AppSidebar from "./AppSidebar";

import { HeaderSkeleton } from "@/components/skeletons/HeaderSkeleton";

interface DashboardLayoutProps {
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navItems: NavItem[] | any;
  defaultOpen: boolean;
  type: "user" | "organization" | "super-admin";
}

export default async function DashboardLayout({
  children,
  navItems,
  defaultOpen,
  type,
}: DashboardLayoutProps) {
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar navItems={navItems} type={type} />
      <SidebarInset>
        <Suspense fallback={<HeaderSkeleton />}>
          <Header />
          {/* page main content */}
          <main className="bg-dashboard-background m-2 md:m-4 rounded-2xl">
            {children}
          </main>
          {/* page main content ends */}
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  );
}
