import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { QUERY_KEYS } from "@/hooks/query-keys";
import mockdb from "@/mockdb";
import { Role } from "@/types/role";

export type SortField = "name" | "email" | "role" | "createdAt";
export type SortOrder = "asc" | "desc";

interface UseAdminUsersOptions {
  initialPageSize?: number;
}

export const useAdminUsers = (options: UseAdminUsersOptions = {}) => {
  const { initialPageSize = 10 } = options;
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Get users with pagination, search and sorting
  const {
    data: usersData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      QUERY_KEYS.SUPER_ADMIN.USERS_LIST,
      page,
      pageSize,
      search,
      sortField,
      sortOrder,
    ],
    queryFn: () => {
      // Get users from mock db
      const allUsers = [...mockdb.users];

      // Filter by search term
      const filteredUsers = search
        ? allUsers.filter(
            (user) =>
              user.name.toLowerCase().includes(search.toLowerCase()) ||
              user.email.toLowerCase().includes(search.toLowerCase())
          )
        : allUsers;

      // Sort users
      const sortedUsers = [...filteredUsers].sort((a, b) => {
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
      const totalUsers = sortedUsers.length;
      const totalPages = Math.ceil(totalUsers / pageSize);
      const paginatedUsers = sortedUsers.slice(
        (page - 1) * pageSize,
        page * pageSize
      );

      return {
        users: paginatedUsers,
        meta: {
          total: totalUsers,
          pages: totalPages,
          page,
          pageSize,
        },
      };
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      // In real app, this would be an API call
      // For mock, we'll update the mockdb users array
      mockdb.users = mockdb.users.filter((user) => user.id !== userId);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SUPER_ADMIN.USERS_LIST],
      });
    },
  });

  // Update user role mutation
  const updateUserRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: Role }) => {
      // In real app, this would be an API call
      const userIndex = mockdb.users.findIndex((user) => user.id === userId);
      if (userIndex !== -1) {
        mockdb.users[userIndex] = {
          ...mockdb.users[userIndex],
          role,
          updatedAt: new Date().toISOString(),
        };
        return mockdb.users[userIndex];
      }
      throw new Error("User not found");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SUPER_ADMIN.USERS_LIST],
      });
    },
  });

  return {
    users: usersData?.users || [],
    meta: usersData?.meta || { total: 0, pages: 0, page: 1, pageSize },
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
    deleteUser: deleteUserMutation.mutate,
    isDeleting: deleteUserMutation.isPending,
    updateUserRole: updateUserRoleMutation.mutate,
    isUpdatingRole: updateUserRoleMutation.isPending,
    refetch,
  };
};
