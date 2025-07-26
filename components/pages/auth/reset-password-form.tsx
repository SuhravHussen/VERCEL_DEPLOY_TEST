"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { SuccessMessage } from "@/components/shared/SuccessMessage";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useResetPassword } from "@/hooks/public/auth/usePasswordReset";
import { useRouter } from "next/navigation";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null
  );
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const { mutate, isPending } = useResetPassword();

  const onSubmit = (data: ResetPasswordFormValues) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    mutate(
      {
        token,
        password: data.password,
      },
      {
        onSuccess: () => {
          setSuccessMessage("Password reset successful");

          // Redirect to login page after successful password reset
          setTimeout(() => {
            router.push(`/auth/login`);
          }, 2000);
        },
        onError: (error: Error) => {
          setErrorMessage(
            error.message || "An error occurred. Please try again."
          );
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {successMessage && <SuccessMessage message={successMessage} />}
      {errorMessage && <ErrorMessage message={errorMessage} />}
      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? <LoadingSpinner size="sm" /> : "Reset Password"}
      </Button>
    </form>
  );
}
