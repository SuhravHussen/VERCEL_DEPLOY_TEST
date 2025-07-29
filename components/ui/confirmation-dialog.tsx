"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2, Info, CheckCircle } from "lucide-react";

export interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive" | "warning" | "info";
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

const variantConfig = {
  default: {
    icon: CheckCircle,
    iconColor: "text-primary",
    confirmVariant: "default" as const,
  },
  destructive: {
    icon: Trash2,
    iconColor: "text-destructive",
    confirmVariant: "destructive" as const,
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-yellow-500",
    confirmVariant: "destructive" as const,
  },
  info: {
    icon: Info,
    iconColor: "text-blue-500",
    confirmVariant: "default" as const,
  },
};

export function ConfirmationDialog({
  open,
  onOpenChange,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      console.error("Error in confirmation action:", error);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`rounded-full p-2 bg-muted ${config.iconColor}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-left">{title}</DialogTitle>
            </div>
          </div>
          {description && (
            <DialogDescription className="text-left mt-3">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <DialogFooter className="flex-row justify-end gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1 sm:flex-none"
          >
            {cancelText}
          </Button>
          <Button
            variant={config.confirmVariant}
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 sm:flex-none"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Loading...
              </div>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Hook for easier usage
export function useConfirmationDialog() {
  const [dialogState, setDialogState] = React.useState<{
    open: boolean;
    props: Partial<ConfirmationDialogProps>;
  }>({
    open: false,
    props: {},
  });

  const showConfirmation = React.useCallback(
    (props: Omit<ConfirmationDialogProps, "open" | "onOpenChange">) => {
      return new Promise<boolean>((resolve) => {
        setDialogState({
          open: true,
          props: {
            ...props,
            onConfirm: async () => {
              try {
                await props.onConfirm();
                resolve(true);
                setDialogState((prev) => ({ ...prev, open: false }));
              } catch (error) {
                resolve(false);
                throw error;
              }
            },
            onCancel: () => {
              props.onCancel?.();
              resolve(false);
              setDialogState((prev) => ({ ...prev, open: false }));
            },
          },
        });
      });
    },
    []
  );

  const hideConfirmation = React.useCallback(() => {
    setDialogState((prev) => ({ ...prev, open: false }));
  }, []);

  const ConfirmationDialogComponent = React.useCallback(() => {
    if (!dialogState.open) return null;

    return (
      <ConfirmationDialog
        {...(dialogState.props as ConfirmationDialogProps)}
        open={dialogState.open}
        onOpenChange={(open) => {
          if (!open) {
            setDialogState((prev) => ({ ...prev, open: false }));
          }
        }}
      />
    );
  }, [dialogState]);

  return {
    showConfirmation,
    hideConfirmation,
    ConfirmationDialog: ConfirmationDialogComponent,
    isOpen: dialogState.open,
  };
}
