import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Role } from "@/types/role";
import { User } from "@/types/user";
import { useEffect, useState } from "react";
import { AlertTriangle, Shield, UserCog, User as UserIcon } from "lucide-react";
import Image from "next/image";

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onConfirmDelete: (userId: string) => void;
  isDeleting: boolean;
}

export function DeleteUserDialog({
  isOpen,
  onClose,
  user,
  onConfirmDelete,
  isDeleting,
}: DeleteDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-col items-center gap-2">
          <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <DialogTitle className="text-xl">Delete User</DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to delete this user?
            <span className="font-medium text-foreground">
              {user?.name}
            </span>{" "}
            <span className="font-medium text-foreground">{user?.email}</span>?
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted/50 border border-border rounded-md p-4 my-2">
          <p className="text-sm text-destructive">
            This action will remove the user from the system. This cannot be
            undone.
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
            onClick={() => user && onConfirmDelete(user.id)}
            disabled={isDeleting}
            className="w-full sm:w-auto"
          >
            {isDeleting ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full mr-2"></div>
                Deleting...
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

interface ChangeRoleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onConfirmRoleChange: (userId: string, role: Role) => void;
  isUpdating: boolean;
}

export function ChangeRoleDialog({
  isOpen,
  onClose,
  user,
  onConfirmRoleChange,
  isUpdating,
}: ChangeRoleDialogProps) {
  const [selectedRole, setSelectedRole] = useState<Role | null>(
    user ? user.role : null
  );

  // Update selected role when user changes
  useEffect(() => {
    if (user) {
      setSelectedRole(user.role);
    }
  }, [user]);

  const handleSubmit = () => {
    if (user && selectedRole) {
      onConfirmRoleChange(user.id, selectedRole);
    }
  };

  const getRoleInfo = (role: Role) => {
    switch (role) {
      case Role.SUPER_ADMIN:
        return {
          label: "Super Admin",
          icon: <Shield className="h-5 w-5" />,
          description:
            "Full access to all resources and administrative features.",
          className: "bg-primary/20 text-primary border border-primary/30",
        };
      case Role.ADMIN:
        return {
          label: "Admin",
          icon: <UserCog className="h-5 w-5" />,
          description:
            "Can manage content and users, but has limited administrative access.",
          className: "bg-chart-3/20 text-chart-3 border border-chart-3/30",
        };
      case Role.USER:
        return {
          label: "User",
          icon: <UserIcon className="h-5 w-5" />,
          description: "Standard user with basic access permissions.",
          className:
            "bg-secondary/50 text-secondary-foreground border border-secondary/30",
        };
      default:
        return {
          label: role,
          icon: <UserIcon className="h-5 w-5" />,
          description: "Custom role with specific permissions.",
          className:
            "bg-secondary/50 text-secondary-foreground border border-secondary/30",
        };
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Change Role</DialogTitle>
          <DialogDescription>
            Change the role of this user
            <span className="font-medium">{user?.name}</span>. This action will
            update the user&apos;s role.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="flex items-center justify-between gap-4 bg-muted/30 p-3 rounded-lg border border-border">
            <div className="flex gap-3 items-center">
              {user?.avatar ? (
                <div className="h-10 w-10 rounded-full overflow-hidden border border-border relative">
                  <Image
                    src={user.avatar}
                    alt={user?.name || "User"}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
              ) : (
                <div className="h-10 w-10 rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center text-primary font-medium">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
              <div>
                <div className="font-medium">{user?.name}</div>
                <div className="text-sm text-muted-foreground">
                  {user?.email}
                </div>
              </div>
            </div>
            {user?.role && (
              <div
                className={`px-3 py-1.5 rounded-md text-xs font-medium ${
                  getRoleInfo(user.role).className
                }`}
              >
                {getRoleInfo(user.role).label}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Select New Role</h3>
            <div className="grid grid-cols-1 gap-3">
              {Object.values(Role).map((role) => {
                const roleInfo = getRoleInfo(role);
                const isSelected = selectedRole === role;

                return (
                  <div
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-all ${
                      isSelected
                        ? `${roleInfo.className} border-primary`
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div
                      className={`rounded-full p-2 ${
                        isSelected ? roleInfo.className : "bg-muted"
                      }`}
                    >
                      {roleInfo.icon}
                    </div>
                    <div>
                      <div className="font-medium">{roleInfo.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {roleInfo.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isUpdating}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleSubmit}
            disabled={isUpdating || selectedRole === user?.role}
            className="w-full sm:w-auto"
          >
            {isUpdating ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full mr-2"></div>
                Updating...
              </>
            ) : (
              "Change Role"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
