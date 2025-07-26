import React from "react";
import { OrganizationsListSkeleton } from "@/components/skeletons/OrganizationsListSkeleton";

export default function loading() {
  return (
    <div className="w-full py-6">
      <OrganizationsListSkeleton />
    </div>
  );
}
