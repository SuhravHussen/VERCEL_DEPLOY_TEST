"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function NavigationGuard({
  message = "Are you sure you want to leave?",
  children,
  exitPath = "/",
  onBeforeLeave,
}: {
  message?: string;
  children: React.ReactNode;
  exitPath?: string;
  onBeforeLeave?: () => void;
}) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Push a dummy state to the history stack (preserve query params)
    window.history.pushState(
      null,
      "",
      window.location.pathname + window.location.search
    );

    const handlePopState = () => {
      console.log(
        "🚨 NavigationGuard: Back button pressed (popstate) - showing modal"
      );
      // Don't call onBeforeLeave here - only when user confirms
      setShowModal(true);
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      console.log(
        "🚨 NavigationGuard: Page unload (beforeunload) - not stopping audio"
      );
      // Don't call onBeforeLeave here - if user cancels, audio should continue
      // If user proceeds with reload, page will refresh and audio stops naturally
      event.preventDefault();
      event.returnValue = message;
      return message;
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [message, onBeforeLeave]);

  const handleCancel = () => {
    console.log(
      "🚨 NavigationGuard: User cancelled leaving - keeping audio playing"
    );
    setShowModal(false);
    // Push a dummy state to the history stack to prevent going back (preserve query params)
    window.history.pushState(
      null,
      "",
      window.location.pathname + window.location.search
    );
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // If dialog is closing, treat it as cancel
      handleCancel();
    } else {
      setShowModal(open);
    }
  };

  const handleConfirm = () => {
    console.log(
      "🚨 NavigationGuard: User confirmed leaving - stopping audio and navigating"
    );
    setShowModal(false);
    onBeforeLeave?.();
    router.push(exitPath);
  };

  return (
    <>
      {children}

      <Dialog open={showModal} onOpenChange={handleOpenChange}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
              <DialogTitle>Confirm Navigation</DialogTitle>
            </div>
            <DialogDescription className="text-left mt-2">
              {message}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirm}>
              Leave Page
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
