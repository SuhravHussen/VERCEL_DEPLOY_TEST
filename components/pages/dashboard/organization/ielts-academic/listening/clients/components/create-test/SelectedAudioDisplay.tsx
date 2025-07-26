"use client";

import { SelectedAudioDisplayProps } from "./types";
import { Button } from "@/components/ui/button";
import { X, Headphones } from "lucide-react";

export function SelectedAudioDisplay({
  audio,
  onRemove,
}: SelectedAudioDisplayProps) {
  if (!audio) return null;

  return (
    <div className="p-4 border rounded-lg bg-muted/30 relative">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
          <Headphones className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium">{audio.title}</h4>
          <p className="text-sm text-muted-foreground">
            {audio.difficulty.charAt(0).toUpperCase() +
              audio.difficulty.slice(1)}{" "}
            difficulty
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Remove</span>
        </Button>
      </div>
    </div>
  );
}
