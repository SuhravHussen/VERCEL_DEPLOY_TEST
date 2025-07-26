"use client";

import { useState } from "react";
import { useAdminOrganizations } from "@/hooks/super-admin/use-admin-organizations";
import { OrganizationsGrid } from "@/components/pages/dashboard/super-admin/organizations-grid";
import {
  OrganizationsSearch,
  ViewMode,
} from "@/components/pages/dashboard/super-admin/organizations-search";
import {
  DeleteOrganizationDialog,
  EditOrganizationDialog,
  CreateOrganizationDialog,
} from "@/components/pages/dashboard/super-admin/organization-dialogs";
import { Organization } from "@/types/organization";
import { useToasts } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { OrganizationsGridSkeleton } from "@/components/skeletons/OrganizationsGridSkeleton";
import { SearchSkeleton } from "@/components/skeletons/SearchSkeleton";
import { PageHeaderSkeleton } from "@/components/skeletons/PageHeaderSkeleton";

export function OrganizationsPageClient() {
  const {
    deleteOrganization,
    updateOrganization,
    createOrganization,
    isDeleting,
    isUpdating,
    isCreating,
    isLoading,
    refetch,
  } = useAdminOrganizations();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] =
    useState<Organization | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const toast = useToasts();

  // Handle opening delete dialog
  const handleDeleteClick = (organization: Organization) => {
    setSelectedOrganization(organization);
    setDeleteDialogOpen(true);
  };

  // Handle opening edit dialog
  const handleEditClick = (organization: Organization) => {
    setSelectedOrganization(organization);
    setEditDialogOpen(true);
  };

  // Handle opening create dialog
  const handleCreateClick = () => {
    setCreateDialogOpen(true);
  };

  // Handle confirming organization deletion
  const handleConfirmDelete = (organizationId: number) => {
    deleteOrganization(organizationId, {
      onSuccess: () => {
        toast.success("The organization has been successfully deleted.");
        setDeleteDialogOpen(false);
        setSelectedOrganization(null);
      },
      onError: () => {
        toast.error("Failed to delete organization. Please try again.");
      },
    });
  };

  // Handle confirming organization edit
  const handleSaveEdit = (
    organizationId: number,
    data: Partial<Organization>
  ) => {
    updateOrganization(
      { id: organizationId, data },
      {
        onSuccess: () => {
          toast.success("The organization has been successfully updated.");
          setEditDialogOpen(false);
          setSelectedOrganization(null);
        },
        onError: () => {
          toast.error("Failed to update organization. Please try again.");
        },
      }
    );
  };

  // Handle creating organization
  const handleCreateOrganization = (data: Omit<Organization, "id">) => {
    createOrganization(data, {
      onSuccess: () => {
        toast.success("The organization has been successfully created.");
        setCreateDialogOpen(false);
      },
      onError: () => {
        toast.error("Failed to create organization. Please try again.");
      },
    });
  };

  // Handle manual refresh of data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
    toast.message({ text: "Organization data refreshed" });
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4">
      {isLoading ? (
        <PageHeaderSkeleton />
      ) : (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-primary">
              Organizations
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Manage organizations
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
            <Button
              className="flex items-center gap-1"
              size="sm"
              onClick={handleCreateClick}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>
      )}

      <div className="p-2 sm:p-4 md:p-6 rounded-lg shadow-sm bg-card">
        <div className="space-y-4 sm:space-y-6">
          {isLoading ? (
            <SearchSkeleton hasViewToggle={true} />
          ) : (
            <OrganizationsSearch
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
          )}

          {isLoading ? (
            <OrganizationsGridSkeleton
              viewMode={viewMode}
              count={viewMode === "grid" ? 6 : 8}
            />
          ) : (
            <OrganizationsGrid
              viewMode={viewMode}
              onDeleteOrganization={handleDeleteClick}
              onEditOrganization={handleEditClick}
            />
          )}

          <DeleteOrganizationDialog
            isOpen={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            organization={selectedOrganization}
            onConfirmDelete={handleConfirmDelete}
            isDeleting={isDeleting}
          />

          <EditOrganizationDialog
            isOpen={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            organization={selectedOrganization}
            onSave={handleSaveEdit}
            isUpdating={isUpdating}
          />

          <CreateOrganizationDialog
            isOpen={createDialogOpen}
            onClose={() => setCreateDialogOpen(false)}
            onSave={handleCreateOrganization}
            isCreating={isCreating}
          />
        </div>
      </div>
    </div>
  );
}
