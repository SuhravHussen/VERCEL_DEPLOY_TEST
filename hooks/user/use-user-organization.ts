"use client";

import { useQuery } from "@tanstack/react-query";
import { Organization } from "@/types/organization";
import { QUERY_KEYS } from "@/hooks/query-keys";
import mockdb from "@/mockdb";

// Mock function to get organization public information
async function fetchOrganizationPublicInfo(
  organizationId: number
): Promise<Organization | null> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const organization = mockdb.findOrganizationById(organizationId);

  if (!organization) {
    return null;
  }

  // Return only public information (excluding sensitive data like users array)
  return {
    id: organization.id,
    name: organization.name,
    logo: organization.logo,
    description: organization.description,
    // Excluding users and instructors arrays for public view
  };
}

/**
 * Hook to fetch organization public information for user view
 * @param organizationId The organization ID
 * @returns Query result with organization public data
 */
export function useUserOrganization(organizationId: number | string) {
  const numericId =
    typeof organizationId === "string"
      ? parseInt(organizationId, 10)
      : organizationId;

  return useQuery<Organization | null>({
    queryKey: QUERY_KEYS.ORGANIZATION.BY_ID(numericId),
    queryFn: () => fetchOrganizationPublicInfo(numericId),
    enabled: !!numericId && !isNaN(numericId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
