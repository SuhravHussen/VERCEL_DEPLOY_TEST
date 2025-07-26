"use client";

import { useMutation } from "@tanstack/react-query";
import {
  ForgotPasswordDTO,
  ResetPasswordDTO,
  ResetResponse,
} from "@/types/auth";

// Hook for requesting a password reset email
export const useForgotPassword = () => {
  return useMutation<ResetResponse, Error, ForgotPasswordDTO>({
    mutationFn: async (data) => {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send reset email");
      }

      return response.json();
    },
  });
};

// Hook for submitting a new password with reset token
export const useResetPassword = () => {
  return useMutation<ResetResponse, Error, ResetPasswordDTO>({
    mutationFn: async (data) => {
      const response = await fetch("/api/auth/reset-password/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: data.token,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to reset password");
      }

      return response.json();
    },
  });
};
