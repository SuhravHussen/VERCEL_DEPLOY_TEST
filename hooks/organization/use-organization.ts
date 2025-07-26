import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../query-keys";
import mockdb from "@/mockdb";
import { Organization } from "@/types/organization";

/**
 * Hook to fetch organization information by ID
 * @param id The organization ID
 * @returns Query result with organization data
 */
export function useOrganization(id: number) {
  return useQuery<Organization | undefined>({
    queryKey: QUERY_KEYS.ORGANIZATION.BY_ID(id),
    queryFn: () => mockdb.findOrganizationById(id),
    enabled: !!id,
  });
}

/**
 * Hook to fetch all organizations
 * @returns Query result with organizations data
 */
export function useOrganizations() {
  return useQuery<Organization[]>({
    queryKey: QUERY_KEYS.ORGANIZATION.LIST,
    queryFn: () => mockdb.organizations,
  });
}
