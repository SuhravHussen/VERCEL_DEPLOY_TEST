/**
 * Image Upload Utilities
 *
 * This file contains functions for handling image uploads across the application.
 * Currently it returns placeholder data, but it's designed to be replaced with
 * actual upload logic to a storage service like S3, Cloudinary, etc.
 */

/**
 * Default maximum file size for uploads (5MB)
 */
export const MAX_UPLOAD_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Function to handle image uploads
 * @param file - The file to upload
 * @param options - Optional configuration for the upload
 * @returns Promise resolving to the URL of the uploaded image
 */
export const uploadImage = async (
  file: File,
  options?: {
    onProgress?: (progress: number) => void;
    maxSize?: number;
    path?: string; // Optional path/folder for the upload
    generateFileName?: (originalName: string) => string; // Optional function to generate file name
    abortSignal?: AbortSignal; // Optional abort signal for cancelling the upload
  }
): Promise<string> => {
  // Validate the file
  if (!file) {
    throw new Error("No file provided");
  }

  const maxSize = options?.maxSize || MAX_UPLOAD_FILE_SIZE;

  if (file.size > maxSize) {
    throw new Error(
      `File size exceeds maximum allowed (${maxSize / (1024 * 1024)}MB)`
    );
  }

  // Log the file information
  console.log("Image upload requested:", {
    fileName: file.name,
    fileSize: `${(file.size / 1024).toFixed(2)} KB`,
    fileType: file.type,
    uploadPath: options?.path || "default",
  });

  // For development: Simulate upload progress
  if (options?.onProgress) {
    for (let progress = 0; progress <= 100; progress += 20) {
      if (options.abortSignal?.aborted) {
        throw new Error("Upload cancelled");
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
      options.onProgress(progress);
    }
  } else {
    // Just add a small delay to simulate network
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  // Create a temporary URL using FileReader
  // In production, this would be replaced with the URL from the storage service
  const tempUrl = await fileToDataUrl(file);

  // Return the URL (in production, this would be the URL of the uploaded image)
  return tempUrl;
};

/**
 * Convert a file to a data URL
 * @param file - The file to convert
 * @returns Promise resolving to the data URL of the file
 */
export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to convert file to data URL"));
      }
    };

    reader.onerror = () => {
      reject(new Error("Error reading file"));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Adapter function that matches the signature expected by Tiptap ImageUploadNode
 * This allows us to use our uploadImage function with Tiptap
 */
export const tiptapImageUploadAdapter = async (
  file: File,
  onProgress?: (event: { progress: number }) => void,
  abortSignal?: AbortSignal
): Promise<string> => {
  try {
    return await uploadImage(file, {
      onProgress: (progress) => onProgress?.({ progress }),
      abortSignal,
    });
  } catch (error) {
    console.error("Error in tiptapImageUploadAdapter:", error);
    throw error;
  }
};
