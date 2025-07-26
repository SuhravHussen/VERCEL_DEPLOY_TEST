"use client";

import { useState } from "react";
import { useAdminUsers } from "@/hooks/super-admin/use-admin-users";
import { UsersTable } from "@/components/pages/dashboard/super-admin/users-table";
import { UsersSearch } from "@/components/pages/dashboard/super-admin/users-search";
import {
  DeleteUserDialog,
  ChangeRoleDialog,
} from "@/components/pages/dashboard/super-admin/user-dialogs";
import { User } from "@/types/user";
import { Role } from "@/types/role";
import { useToasts } from "@/components/ui/toast";
import { UserPlus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeaderSkeleton } from "@/components/skeletons/PageHeaderSkeleton";

export function UsersPageClient() {
  const {
    deleteUser,
    updateUserRole,
    isDeleting,
    isUpdatingRole,
    isLoading,
    refetch,
  } = useAdminUsers();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const toast = useToasts();

  // Handle opening delete dialog
  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  // Handle opening role change dialog
  const handleRoleClick = (user: User) => {
    setSelectedUser(user);
    setRoleDialogOpen(true);
  };

  // Handle confirming user deletion
  const handleConfirmDelete = (userId: string) => {
    deleteUser(userId, {
      onSuccess: () => {
        toast.success("The user has been successfully deleted.");
        setDeleteDialogOpen(false);
        setSelectedUser(null);
      },
      onError: () => {
        toast.error("Failed to delete user. Please try again.");
      },
    });
  };

  // Handle confirming role change
  const handleConfirmRoleChange = (userId: string, role: Role) => {
    updateUserRole(
      { userId, role },
      {
        onSuccess: () => {
          toast.success("The user's role has been successfully updated.");
          setRoleDialogOpen(false);
          setSelectedUser(null);
        },
        onError: () => {
          toast.error("Failed to update user role. Please try again.");
        },
      }
    );
  };

  // Handle manual refresh of data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
    toast.message({ text: "User data refreshed" });
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4">
      {isLoading ? (
        <PageHeaderSkeleton />
      ) : (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-primary">
              Users
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Manage users
            </p>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleRefresh}
              disabled={isRefreshing || isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button className="flex items-center gap-1" size="sm">
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline">Add</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>
      )}

      <div className="p-2 sm:p-4 md:p-6 rounded-lg shadow-sm bg-card">
        <div className="space-y-4 sm:space-y-6">
          <UsersSearch />

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                <p className="text-sm text-muted-foreground">
                  Loading users data...
                </p>
              </div>
            </div>
          ) : (
            <UsersTable
              onDeleteUser={handleDeleteClick}
              onChangeRole={handleRoleClick}
            />
          )}

          <DeleteUserDialog
            isOpen={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            user={selectedUser}
            onConfirmDelete={handleConfirmDelete}
            isDeleting={isDeleting}
          />

          <ChangeRoleDialog
            isOpen={roleDialogOpen}
            onClose={() => setRoleDialogOpen(false)}
            user={selectedUser}
            onConfirmRoleChange={handleConfirmRoleChange}
            isUpdating={isUpdatingRole}
          />
        </div>
      </div>
    </div>
  );
}
