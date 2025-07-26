/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon, X } from "lucide-react";

interface ImageUploadProps {
  onUpload: (file: File) => void;
  onRemove?: () => void;
  currentImage?: string;
  label?: string;
  description?: string;
  className?: string;
  buttonText?: string;
  isLoading?: boolean;
  size?: "small" | "medium" | "large";
}

export function ImageUpload({
  onUpload,
  onRemove,
  currentImage,
  label = "Upload Image",
  description = "Upload an image",
  className = "",
  buttonText = "Upload",
  isLoading = false,
  size = "medium",
}: ImageUploadProps) {
  const [localImage, setLocalImage] = useState<string | undefined>(
    currentImage
  );
  const inputId = React.useId();

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onUpload(file);
      // Create a preview URL
      setLocalImage(URL.createObjectURL(file));
    }
  };

  // Handle remove
  const handleRemove = () => {
    setLocalImage(undefined);
    if (onRemove) onRemove();
  };

  // Determine max height based on size
  const getMaxHeight = () => {
    switch (size) {
      case "small":
        return "max-h-32";
      case "large":
        return "max-h-80";
      default:
        return "max-h-64";
    }
  };

  return (
    <div className={`image-upload-container ${className}`}>
      {localImage || currentImage ? (
        <div className="relative">
          <img
            src={localImage || currentImage}
            alt={label}
            className={`rounded-md mb-2 ${getMaxHeight()}`}
          />
          <Button
            variant="outline"
            size="sm"
            className="absolute top-2 right-2 bg-background"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-6 border border-dashed rounded-md">
          <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-2">{description}</p>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id={inputId}
            onChange={handleFileChange}
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById(inputId)?.click()}
            disabled={isLoading}
          >
            {isLoading ? "Uploading..." : buttonText}
          </Button>
        </div>
      )}
    </div>
  );
}
