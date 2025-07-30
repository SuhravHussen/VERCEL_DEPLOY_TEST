import DashboardLayout from "@/components/shared/dashboard/DashboardLayout";

import type { Metadata } from "next";
import { cookies } from "next/headers";
import getNavItems from "@/components/shared/dashboard/nav-items/user-nav";

export const metadata: Metadata = {
  title: "User Dashboard",
  description: "User dashboard with multilingual support",
};
export default async function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Persisting the sidebar state in the cookie.
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <DashboardLayout
      navItems={getNavItems()}
      defaultOpen={defaultOpen}
      type="user"
    >
      <main className="p-4 md:p-8">{children}</main>
    </DashboardLayout>
  );
}
