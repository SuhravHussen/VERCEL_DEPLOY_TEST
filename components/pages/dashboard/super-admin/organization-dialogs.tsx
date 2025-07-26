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
import { Textarea } from "@/components/ui/textarea";
import { Organization } from "@/types/organization";
import { useEffect, useState } from "react";
import { AlertTriangle, Building } from "lucide-react";
import Image from "next/image";

interface DeleteOrganizationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  organization: Organization | null;
  onConfirmDelete: (organizationId: number) => void;
  isDeleting: boolean;
}

export function DeleteOrganizationDialog({
  isOpen,
  onClose,
  organization,
  onConfirmDelete,
  isDeleting,
}: DeleteOrganizationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-col items-center gap-2">
          <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <DialogTitle className="text-xl">Delete Organization</DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to delete this organization?
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted/50 border border-border rounded-md p-4 my-2">
          <p className="text-sm text-destructive">
            This action will remove all data associated with this organization,
            including users, courses, and settings. This cannot be undone.
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
            onClick={() => organization && onConfirmDelete(organization.id)}
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

interface EditOrganizationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  organization: Organization | null;
  onSave: (organizationId: number, data: Partial<Organization>) => void;
  isUpdating: boolean;
}

export function EditOrganizationDialog({
  isOpen,
  onClose,
  organization,
  onSave,
  isUpdating,
}: EditOrganizationDialogProps) {
  const [formData, setFormData] = useState<Partial<Organization>>({
    name: "",
    description: "",
    logo: "",
  });

  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name,
        description: organization.description || "",
        logo: organization.logo || "",
      });
    }
  }, [organization]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (organization) {
      onSave(organization.id, formData);
    }
  };

  // Check if logo URL is valid and non-empty
  const isValidLogoUrl =
    formData.logo &&
    typeof formData.logo === "string" &&
    formData.logo.trim() !== "";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Organization</DialogTitle>
          <DialogDescription>
            Update the details of your organization
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="h-24 w-24 rounded-md border border-border bg-muted/50 overflow-hidden flex items-center justify-center flex-shrink-0 relative">
              {isValidLogoUrl ? (
                <Image
                  src={formData.logo || ""}
                  alt={formData.name || "Organization logo"}
                  width={96}
                  height={96}
                  className="object-cover h-full w-full"
                  priority
                />
              ) : (
                <Building className="h-10 w-10 text-muted-foreground" />
              )}
            </div>
            <div className="w-full">
              <label className="text-sm font-medium mb-1 block">Logo URL</label>
              <Input
                name="logo"
                value={formData.logo || ""}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter a URL for the organization&apos;s logo image
              </p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">
              Organization Name
              <span className="text-destructive">*</span>
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Organization name"
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">
              Description
            </label>
            <Textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              placeholder="Brief description of the organization"
              className="w-full resize-none"
              rows={3}
            />
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
            disabled={isUpdating || !formData.name}
            className="w-full sm:w-auto"
          >
            {isUpdating ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full mr-2"></div>
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface CreateOrganizationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Organization, "id">) => void;
  isCreating: boolean;
}

export function CreateOrganizationDialog({
  isOpen,
  onClose,
  onSave,
  isCreating,
}: CreateOrganizationDialogProps) {
  const [formData, setFormData] = useState<Omit<Organization, "id">>({
    name: "",
    description: "",
    logo: "",
  });

  useEffect(() => {
    if (isOpen) {
      // Reset form when dialog opens
      setFormData({
        name: "",
        description: "",
        logo: "",
      });
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  // Check if logo URL is valid and non-empty
  const isValidLogoUrl =
    formData.logo &&
    typeof formData.logo === "string" &&
    formData.logo.trim() !== "";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Create Organization</DialogTitle>
          <DialogDescription>Create a new organization</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="h-24 w-24 rounded-md border border-border bg-muted/50 overflow-hidden flex items-center justify-center flex-shrink-0 relative">
              {isValidLogoUrl ? (
                <Image
                  src={formData.logo || ""}
                  alt="Organization Logo Preview"
                  width={96}
                  height={96}
                  className="object-cover h-full w-full"
                  priority
                />
              ) : (
                <Building className="h-10 w-10 text-muted-foreground" />
              )}
            </div>
            <div className="w-full">
              <label className="text-sm font-medium mb-1 block">Logo URL</label>
              <Input
                name="logo"
                value={formData.logo || ""}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter a URL for the organization&apos;s logo image
              </p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">
              Organization Name
              <span className="text-destructive">*</span>
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Organization name"
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">
              Description
            </label>
            <Textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              placeholder="Brief description of the organization"
              className="w-full resize-none"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isCreating}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleSubmit}
            disabled={isCreating || !formData.name}
            className="w-full sm:w-auto"
          >
            {isCreating ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full mr-2"></div>
                Creating...
              </>
            ) : (
              "Create"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
