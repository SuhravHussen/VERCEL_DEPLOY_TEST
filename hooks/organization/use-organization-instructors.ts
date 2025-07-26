import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../query-keys";
import mockdb from "@/mockdb";
import { Role } from "@/types/role";

// Define types for sort and pagination
export type SortField = "name" | "email" | "createdAt";
export type SortOrder = "asc" | "desc";

interface UseOrganizationInstructorsOptions {
  initialPageSize?: number;
  organizationId?: number;
}

export const useOrganizationInstructors = (
  options: UseOrganizationInstructorsOptions = {}
) => {
  const { initialPageSize = 10, organizationId } = options;
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Get instructors with pagination, search and sorting
  const {
    data: instructorsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      QUERY_KEYS.ORGANIZATION.INSTRUCTORS_LIST,
      organizationId,
      page,
      pageSize,
      search,
      sortField,
      sortOrder,
    ],
    queryFn: () => {
      if (!organizationId) {
        return {
          instructors: [],
          meta: {
            total: 0,
            pages: 0,
            page,
            pageSize,
          },
        };
      }

      // Get users from mock db with INSTRUCTOR role
      // In a real app, this would filter by organization_id as well
      const allInstructors = mockdb.organizations.find(
        (org) => org.id === organizationId
      )?.instructors;

      if (allInstructors?.length === 0 || !allInstructors) {
        return {
          instructors: [],
          meta: { total: 0, pages: 0, page, pageSize },
        };
      }

      // Filter by search term
      const filteredInstructors = search
        ? allInstructors.filter(
            (user) =>
              user.name.toLowerCase().includes(search.toLowerCase()) ||
              user.email.toLowerCase().includes(search.toLowerCase())
          )
        : allInstructors;

      // Sort instructors
      const sortedInstructors = [...filteredInstructors].sort((a, b) => {
        const fieldA = a[sortField];
        const fieldB = b[sortField];

        if (typeof fieldA === "string" && typeof fieldB === "string") {
          return sortOrder === "asc"
            ? fieldA.localeCompare(fieldB)
            : fieldB.localeCompare(fieldA);
        }

        return sortOrder === "asc"
          ? fieldA > fieldB
            ? 1
            : -1
          : fieldA < fieldB
          ? 1
          : -1;
      });

      // Calculate pagination
      const totalInstructors = sortedInstructors.length;
      const totalPages = Math.ceil(totalInstructors / pageSize);
      const paginatedInstructors = sortedInstructors.slice(
        (page - 1) * pageSize,
        page * pageSize
      );

      return {
        instructors: paginatedInstructors,
        meta: {
          total: totalInstructors,
          pages: totalPages,
          page,
          pageSize,
        },
      };
    },
    enabled: !!organizationId,
  });

  // Delete instructor mutation
  const deleteInstructorMutation = useMutation({
    mutationFn: async (userId: string) => {
      // In real app, this would be an API call
      // For mock, we'll update the mockdb users array to remove the instructor role from this organization
      const userIndex = mockdb.users.findIndex((user) => user.id === userId);
      if (userIndex !== -1 && organizationId) {
        // Remove this organization from the user's organizations_instructor list
        const user = mockdb.users[userIndex];
        if (user.organizations_instructor) {
          user.organizations_instructor = user.organizations_instructor.filter(
            (org) => org.id !== organizationId
          );
        }
        return { success: true };
      }
      throw new Error("User not found");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANIZATION.INSTRUCTORS_LIST, organizationId],
      });
    },
  });

  // Add instructor mutation
  const addInstructorMutation = useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      // In real app, this would be an API call
      const userIndex = mockdb.users.findIndex((user) => user.id === userId);
      if (userIndex !== -1 && organizationId) {
        const user = mockdb.users[userIndex];

        // Add this organization to the user's organizations_instructor list
        if (!user.organizations_instructor) {
          user.organizations_instructor = [];
        }

        // Check if the organization already exists in the list
        const orgIndex = user.organizations_instructor.findIndex(
          (org) => org.id === organizationId
        );

        if (orgIndex === -1) {
          const organization = mockdb.organizations.find(
            (org) => org.id === organizationId
          );

          if (organization) {
            user.organizations_instructor.push({
              id: organization.id,
              name: organization.name,
              description: organization.description,
              logo: organization.logo,
            });
          }
        }

        // Update user role if not already an instructor
        if (user.role !== Role.INSTRUCTOR) {
          user.role = Role.INSTRUCTOR;
          user.updatedAt = new Date().toISOString();
        }

        return user;
      }
      throw new Error("User not found");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANIZATION.INSTRUCTORS_LIST, organizationId],
      });
    },
  });

  return {
    instructors: instructorsData?.instructors || [],
    meta: instructorsData?.meta || { total: 0, pages: 0, page: 1, pageSize },
    isLoading,
    error,
    page,
    pageSize,
    search,
    sortField,
    sortOrder,
    setPage,
    setPageSize,
    setSearch,
    setSortField,
    setSortOrder,
    deleteInstructor: deleteInstructorMutation.mutate,
    isDeleting: deleteInstructorMutation.isPending,
    addInstructor: addInstructorMutation.mutate,
    isAdding: addInstructorMutation.isPending,
    refetch,
  };
};
