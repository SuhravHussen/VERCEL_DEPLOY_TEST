import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { QUERY_KEYS } from "../query-keys";
import { Organization } from "@/types/organization";
import { mockOrganizations } from "@/mockdb";

// Define types for sort and pagination
export type SortField = "name" | "description";
export type SortOrder = "asc" | "desc";

// Main hook for organization management
export function useAdminOrganizations() {
  const queryClient = useQueryClient();
  // State for pagination, sorting, and filtering
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [search, setSearch] = useState("");

  // Fetch organizations with filtering and pagination
  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      QUERY_KEYS.SUPER_ADMIN.ORGANIZATIONS_LIST,
      page,
      pageSize,
      sortField,
      sortOrder,
      search,
    ],
    queryFn: async () => {
      // Simulate API call with mock data and filtering
      let filteredOrganizations = [...mockOrganizations];

      // Apply search filter
      if (search) {
        const searchLower = search.toLowerCase();
        filteredOrganizations = filteredOrganizations.filter(
          (org) =>
            org.name.toLowerCase().includes(searchLower) ||
            (org.description &&
              org.description.toLowerCase().includes(searchLower))
        );
      }

      // Apply sorting
      filteredOrganizations.sort((a, b) => {
        const aValue = a[sortField] || "";
        const bValue = b[sortField] || "";

        if (sortOrder === "asc") {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      });

      // Calculate pagination
      const total = filteredOrganizations.length;
      const pages = Math.ceil(total / pageSize);
      const startIndex = (page - 1) * pageSize;
      const paginatedOrganizations = filteredOrganizations.slice(
        startIndex,
        startIndex + pageSize
      );

      // Return paginated data with meta information
      return {
        organizations: paginatedOrganizations,
        meta: {
          page,
          pageSize,
          total,
          pages,
        },
      };
    },
  });

  // Create organization mutation
  const { mutate: createOrganization, isPending: isCreating } = useMutation({
    mutationFn: async (data: Omit<Organization, "id">) => {
      // Simulate API call
      console.log(`Creating organization`, data);
      // In a real app, this would be an API call
      // Here we simulate creating a new organization with a generated ID
      const newId = Math.max(...mockOrganizations.map((org) => org.id)) + 1;
      const newOrganization: Organization = {
        id: newId,
        ...data,
      };

      // In a real app, you would return the newly created organization
      return { success: true, organization: newOrganization };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SUPER_ADMIN.ORGANIZATIONS_LIST],
      });
    },
  });

  // Delete organization mutation
  const { mutate: deleteOrganization, isPending: isDeleting } = useMutation({
    mutationFn: async (organizationId: number) => {
      // Simulate API call
      console.log(`Deleting organization ${organizationId}`);
      // In a real app, this would be an API call
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SUPER_ADMIN.ORGANIZATIONS_LIST],
      });
    },
  });

  // Update organization mutation
  const { mutate: updateOrganization, isPending: isUpdating } = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<Organization>;
    }) => {
      // Simulate API call
      console.log(`Updating organization ${id}`, data);
      // In a real app, this would be an API call
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SUPER_ADMIN.ORGANIZATIONS_LIST],
      });
    },
  });

  return {
    organizations: data?.organizations || [],
    meta: data?.meta || {
      page,
      pageSize,
      total: 0,
      pages: 0,
    },
    isLoading,
    refetch,
    isCreating,
    isDeleting,
    isUpdating,
    createOrganization,
    deleteOrganization,
    updateOrganization,
    page,
    setPage,
    pageSize,
    setPageSize,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    search,
    setSearch,
  };
}
