"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useProfile } from "@/hooks/user/use-profile";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { SuccessMessage } from "@/components/shared/SuccessMessage";
import { User } from "@/types/user";

interface ProfilePasswordProps {
  user: User | null;
}

export default function ProfilePassword({ user }: ProfilePasswordProps) {
  const {
    updateUserPassword,
    isUpdatingPassword,
    error,
    success,
    clearMessages,
  } = useProfile(user);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation errors when typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Clear messages when typing
    clearMessages();
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    updateUserPassword({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && <ErrorMessage message={error} />}
          {success && <SuccessMessage message={success} />}

          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleChange}
              className={
                validationErrors.currentPassword ? "border-destructive" : ""
              }
            />
            {validationErrors.currentPassword && (
              <p className="text-sm text-destructive">
                {validationErrors.currentPassword}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              className={
                validationErrors.newPassword ? "border-destructive" : ""
              }
            />
            {validationErrors.newPassword && (
              <p className="text-sm text-destructive">
                {validationErrors.newPassword}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={
                validationErrors.confirmPassword ? "border-destructive" : ""
              }
            />
            {validationErrors.confirmPassword && (
              <p className="text-sm text-destructive">
                {validationErrors.confirmPassword}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isUpdatingPassword}>
            {isUpdatingPassword ? "Updating..." : "Update Password"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
