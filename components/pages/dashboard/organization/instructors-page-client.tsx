"use client";

import { useState } from "react";
import { useOrganizationInstructors } from "@/hooks/organization/use-organization-instructors";
import { InstructorsSearch } from "@/components/pages/dashboard/organization/instructors-search";
import {
  DeleteInstructorDialog,
  AddInstructorDialog,
} from "@/components/pages/dashboard/organization/instructor-dialogs";
import { User } from "@/types/user";
import { useToasts } from "@/components/ui/toast";
import { UserPlus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { InstructorsTable } from "@/components/pages/dashboard/organization/instructors-table";

export function InstructorsPageClient() {
  const params = useParams();
  const organizationId = params.id
    ? parseInt(params.id as string, 10)
    : undefined;

  const {
    deleteInstructor,
    addInstructor,
    isDeleting,
    isAdding,
    isLoading,
    refetch,
  } = useOrganizationInstructors({ organizationId });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<User | null>(
    null
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const toast = useToasts();

  // Handle opening delete dialog
  const handleDeleteClick = (instructor: User) => {
    setSelectedInstructor(instructor);
    setDeleteDialogOpen(true);
  };

  // Handle opening add instructor dialog
  const handleAddClick = () => {
    setAddDialogOpen(true);
  };

  // Handle confirming instructor deletion
  const handleConfirmDelete = (instructorId: string) => {
    deleteInstructor(instructorId, {
      onSuccess: () => {
        toast.success("The instructor has been successfully removed.");
        setDeleteDialogOpen(false);
        setSelectedInstructor(null);
      },
      onError: () => {
        toast.error("Failed to remove instructor. Please try again.");
      },
    });
  };

  // Handle confirming instructor addition
  const handleConfirmAdd = (userId: string) => {
    addInstructor(
      { userId },
      {
        onSuccess: () => {
          toast.success("The instructor has been successfully added.");
          setAddDialogOpen(false);
        },
        onError: () => {
          toast.error("Failed to add instructor. Please try again.");
        },
      }
    );
  };

  // Handle refreshing the data
  const handleRefresh = () => {
    setIsRefreshing(true);
    refetch().finally(() => setIsRefreshing(false));
  };

  if (!organizationId) {
    return (
      <div className="p-2 sm:p-4 md:p-6">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          <p>No organization ID provided. Please select an organization.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 md:p-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 sm:gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-primary">
            Instructors
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Manage instructors for your organization
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
            onClick={handleAddClick}
          >
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Add</span>
            <span className="sm:hidden">Add Instructor</span>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="p-2 sm:p-4 md:p-6 rounded-lg shadow-sm bg-card">
        <div className="space-y-4 sm:space-y-6">
          <InstructorsSearch />

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 rounded-full  border-primary border-t-transparent animate-spin"></div>
                <p className="text-sm text-muted-foreground">
                  Loading instructors data...
                </p>
              </div>
            </div>
          ) : (
            <InstructorsTable onDeleteInstructor={handleDeleteClick} />
          )}

          <DeleteInstructorDialog
            isOpen={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            instructor={selectedInstructor}
            onConfirmDelete={handleConfirmDelete}
            isDeleting={isDeleting}
          />

          <AddInstructorDialog
            isOpen={addDialogOpen}
            onClose={() => setAddDialogOpen(false)}
            onConfirmAdd={handleConfirmAdd}
            isAdding={isAdding}
            organizationId={organizationId}
          />
        </div>
      </div>
    </div>
  );
}
