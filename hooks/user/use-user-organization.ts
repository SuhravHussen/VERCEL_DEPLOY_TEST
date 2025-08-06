"use client";

import { useQuery } from "@tanstack/react-query";
import { Organization } from "@/types/organization";
import { QUERY_KEYS } from "@/hooks/query-keys";
import mockdb from "@/mockdb";

// Mock function to get organization public information
async function fetchOrganizationPublicInfo(
  organizationSlug: string
): Promise<Organization | null> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const organization = mockdb.findOrganizationBySlug(organizationSlug);

  if (!organization) {
    return null;
  }

  // Return only public information (excluding sensitive data like users array)
  return {
    id: organization.id,
    name: organization.name,
    logo: organization.logo,
    description: organization.description,
    slug: organization.slug,
    // Excluding users and instructors arrays for public view
  };
}

/**
 * Hook to fetch organization public information for user view
 * @param organizationId The organization ID
 * @returns Query result with organization public data
 */
export function useUserOrganization(organizationSlug: string) {
  return useQuery<Organization | null>({
    queryKey: QUERY_KEYS.ORGANIZATION.BY_SLUG(organizationSlug),
    queryFn: () => fetchOrganizationPublicInfo(organizationSlug),
    enabled: !!organizationSlug,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
