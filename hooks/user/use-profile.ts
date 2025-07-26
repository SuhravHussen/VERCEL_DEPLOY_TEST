"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { User } from "@/types/user";
import { QUERY_KEYS } from "@/hooks/query-keys";
import mockdb from "@/mockdb";
import { useState } from "react";
import { setAuthCookies, getAuthToken } from "@/lib/auth";

// In a real app, these would be API calls

// Mock function to get user profile
async function fetchUserProfile(userId: string): Promise<User | null> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  const user = mockdb.findUserById(userId);
  return user || null;
}

// Mock function to update user profile
async function updateProfile(
  userId: string,
  data: Partial<User>
): Promise<User | null> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  return mockdb.updateUserProfile(userId, data);
}

// Mock function to update user password
async function updatePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string; user?: User }> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  const result = mockdb.updateUserPassword(
    userId,
    currentPassword,
    newPassword
  );

  // If successful, also return the updated user for cookie update
  if (result.success) {
    const user = mockdb.findUserById(userId);
    return { ...result, user: user || undefined };
  }

  return result;
}

// Hook for profile data and operations
export function useProfile(user: User | null) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Query to fetch user profile data
  const { data: profileData, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.USER.PROFILE, user?.id],
    queryFn: () => {
      if (!user?.id) return null;
      return fetchUserProfile(user.id);
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Mutation to update profile
  const { mutate: updateUserProfile, isPending: isUpdating } = useMutation({
    mutationKey: [QUERY_KEYS.USER.UPDATE_PROFILE],
    mutationFn: async (data: Partial<User>) => {
      if (!user?.id) throw new Error("User ID not found");
      return updateProfile(user.id, data);
    },
    onSuccess: async (updatedUser) => {
      setSuccess("Profile updated successfully");
      setError(null);

      // Update the cookie with new user info
      if (updatedUser) {
        try {
          const token = await getAuthToken();
          if (token) {
            await setAuthCookies(updatedUser, token);
          }
        } catch (error) {
          console.error("Failed to update auth cookie:", error);
        }
      }
    },
    onError: (error) => {
      setError(
        error instanceof Error ? error.message : "Failed to update profile"
      );
      setSuccess(null);
    },
  });

  // Mutation to update password
  const { mutate: updateUserPassword, isPending: isUpdatingPassword } =
    useMutation({
      mutationKey: [QUERY_KEYS.USER.UPDATE_PASSWORD],
      mutationFn: async ({
        currentPassword,
        newPassword,
      }: {
        currentPassword: string;
        newPassword: string;
      }) => {
        if (!user?.id) throw new Error("User ID not found");
        return updatePassword(user.id, currentPassword, newPassword);
      },
      onSuccess: async (data) => {
        if (data.success) {
          setSuccess(data.message);
          setError(null);

          // Update the cookie with new user info (password excluded from cookie)
          if (data.user) {
            try {
              const token = await getAuthToken();
              if (token) {
                await setAuthCookies(data.user, token);
              }
            } catch (error) {
              console.error("Failed to update auth cookie:", error);
            }
          }
        } else {
          setError(data.message);
          setSuccess(null);
        }
      },
      onError: (error) => {
        setError(
          error instanceof Error ? error.message : "Failed to update password"
        );
        setSuccess(null);
      },
    });

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return {
    profileData: profileData || user,
    isLoading,
    isUpdating,
    isUpdatingPassword,
    updateUserProfile,
    updateUserPassword,
    error,
    success,
    clearMessages,
  };
}
