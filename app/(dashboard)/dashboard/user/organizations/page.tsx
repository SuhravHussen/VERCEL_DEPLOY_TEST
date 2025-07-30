import React from "react";
import { OrganizationsList } from "@/components/pages/dashboard/user/OrganizationsList";
import { getUserOrganizations } from "@/server-actions/user/get-user-organizations";

export default async function OrganizationsPage() {
  const userOrganizations = await getUserOrganizations();

  return (
    <div className="w-full py-6 min-h-[calc(100vh-8.5rem)]">
      <OrganizationsList userOrganizations={userOrganizations} />
    </div>
  );
}
