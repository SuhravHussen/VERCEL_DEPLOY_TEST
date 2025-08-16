import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { User } from "@/types/user";
import { useState } from "react";
import { AlertTriangle, Search, GraduationCap } from "lucide-react";
import Image from "next/image";
import mockdb from "@/mockdb";
import { Organization } from "@/types/organization";

interface DeleteInstructorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  instructor: User | null;
  onConfirmDelete: (instructorId: string) => void;
  isDeleting: boolean;
}

export function DeleteInstructorDialog({
  isOpen,
  onClose,
  instructor,
  onConfirmDelete,
  isDeleting,
}: DeleteInstructorDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-col items-center gap-2">
          <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <DialogTitle className="text-xl">Delete Instructor</DialogTitle>
          <DialogDescription className="text-center">
            This action will remove the instructor role from this user for your
            organization. The user account will still exist in the system.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted/50 border border-border rounded-md p-4 my-2">
          <p className="text-sm text-muted-foreground">
            This action will remove the instructor role from this user for your
            organization. The user account will still exist in the system.
          </p>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => instructor && onConfirmDelete(instructor.id)}
            disabled={isDeleting}
            className="w-full sm:w-auto"
          >
            {isDeleting ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full mr-2"></div>
                Removing...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface AddInstructorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmAdd: (userId: string) => void;
  isAdding: boolean;
  organizationSlug?: string;
}

export function AddInstructorDialog({
  isOpen,
  onClose,
  onConfirmAdd,
  isAdding,
  organizationSlug,
}: AddInstructorDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Reset the state when the dialog closes
  const handleClose = () => {
    setSearchTerm("");
    setSelectedUserId(null);
    onClose();
  };

  // Get users that match the search term and are not already instructors in this org
  const getFilteredUsers = () => {
    if (!searchTerm.trim() || !organizationSlug) return [];

    return mockdb.users
      .filter(
        (user: User) =>
          // Search by name or email
          (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
          // Exclude users already as instructors in this organization
          !user.organizations_instructor?.some(
            (org: Organization) => org.slug === organizationSlug
          )
      )
      .slice(0, 5); // Limit results
  };

  const filteredUsers = getFilteredUsers();

  const handleConfirmAdd = () => {
    if (selectedUserId) {
      onConfirmAdd(selectedUserId);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Add Instructor</DialogTitle>
          <DialogDescription>
            Add a new instructor to your organization
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={"Search for instructors"}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSelectedUserId(null); // Clear selection when search changes
                }}
                className="pl-10"
              />
            </div>

            <div className="space-y-2 max-h-[240px] overflow-y-auto">
              {filteredUsers.length === 0 && searchTerm.trim() !== "" && (
                <div className="text-center py-4 text-muted-foreground">
                  No instructors matching &quot;{searchTerm}&quot;
                </div>
              )}

              {filteredUsers.map((user: User) => (
                <div
                  key={user.id}
                  onClick={() => setSelectedUserId(user.id)}
                  className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-all ${
                    selectedUserId === user.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {user.avatar ? (
                    <div className="h-10 w-10 rounded-full overflow-hidden border border-border relative">
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {user.email}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {selectedUserId && (
          <div className="bg-muted/50 border border-border rounded-md p-3 my-2 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <p className="text-sm">
              This user will be added as an instructor for your organization.
            </p>
          </div>
        )}

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isAdding}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmAdd}
            disabled={isAdding || !selectedUserId}
            className="w-full sm:w-auto"
          >
            {isAdding ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full mr-2"></div>
                Adding...
              </>
            ) : (
              "Add"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
