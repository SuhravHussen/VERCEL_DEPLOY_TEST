"use client";

import React from "react";
import { CheckCircle } from "lucide-react";

interface SuccessMessageProps {
  message: string;
  description?: string;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  message,
  description,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-md bg-green-50 p-4 text-green-700 dark:bg-green-900/20 dark:text-green-400">
      <div className="mb-2 flex items-center">
        <CheckCircle className="mr-2 h-5 w-5" />
        <h3 className="font-medium">{message}</h3>
      </div>
      {description && (
        <p className="text-center text-sm text-green-600 dark:text-green-500">
          {description}
        </p>
      )}
    </div>
  );
};
