import React from "react";

import { UserNav } from "./user-nav";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

import { ThemeToggle } from "@/components/theme-toggle";
import { getCurrentUser } from "@/lib/auth";
import { Breadcrumbs } from "./breadcrumbs";

export default async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumbs />
      </div>

      <div className="flex items-center gap-2 px-4">
        <UserNav user={user} />
        <ThemeToggle />
      </div>
    </header>
  );
}
