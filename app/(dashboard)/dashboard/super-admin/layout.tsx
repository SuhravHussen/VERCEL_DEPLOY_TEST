import DashboardLayout from "@/components/shared/dashboard/DashboardLayout";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import getSuperAdminNavItems from "@/components/shared/dashboard/nav-items/super-admin-nav";

export const metadata: Metadata = {
  title: "Super Admin Dashboard",
  description: "Super Admin dashboard with multilingual support",
};

export default async function SuperAdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Persisting the sidebar state in the cookie.
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <DashboardLayout
      navItems={getSuperAdminNavItems()}
      defaultOpen={defaultOpen}
      type="super-admin"
    >
      {children}
    </DashboardLayout>
  );
}
