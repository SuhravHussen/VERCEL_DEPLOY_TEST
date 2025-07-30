import DashboardLayout from "@/components/shared/dashboard/DashboardLayout";
import getOrganizationNavItems from "@/components/shared/dashboard/nav-items/organization-nav";
import { getUserOrganizationRole } from "@/server-actions/user/get-user-organizations";
import type { Metadata } from "next";
import { cookies } from "next/headers";
export const metadata: Metadata = {
  title: "Organization Dashboard",
  description: "Organization dashboard with multilingual support",
};

export default async function OrganizationDashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Persisting the sidebar state in the cookie.
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  const role = await getUserOrganizationRole(parseInt(id, 10));

  return (
    <DashboardLayout
      navItems={getOrganizationNavItems(id, role)}
      defaultOpen={defaultOpen}
      type="organization"
    >
      {children}
    </DashboardLayout>
  );
}
