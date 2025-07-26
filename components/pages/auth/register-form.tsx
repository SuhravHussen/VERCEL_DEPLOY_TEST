"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegister } from "@/hooks/public/auth/useAuth";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { RegisterDTO } from "@/types/dto/auth.dto";
import { Eye, EyeOff, Mail } from "lucide-react";
import { SuccessMessage } from "@/components/shared/SuccessMessage";

const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

type FormData = z.infer<typeof formSchema>;

export function RegisterForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [registeredEmail, setRegisteredEmail] = React.useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const registerMutation = useRegister();

  const onSubmit = (data: FormData) => {
    const registerData: RegisterDTO = {
      name: data.name,
      email: data.email,
      password: data.password,
    };

    registerMutation.mutate(registerData, {
      onSuccess: (data) => {
        console.log("Registration successful:", data);
        setRegisteredEmail(data.user.email);
        setShowSuccess(true);
      },
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (showSuccess) {
    return (
      <div className="space-y-6">
        <SuccessMessage
          message="Registration successful!"
          description="Your account has been created."
        />

        <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-900/20">
          <div className="mb-3 flex items-center">
            <Mail className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-medium text-blue-700 dark:text-blue-300">
              Verify your email address
            </h3>
          </div>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            We&apos;ve sent a verification email to{" "}
            <strong>{registeredEmail}</strong>. Please check your inbox and
            click the verification link to activate your account.
          </p>
          <div className="mt-4 text-xs text-blue-500 dark:text-blue-400">
            <p>
              If you don&apos;t see the email, please check your spam folder or{" "}
              <button
                type="button"
                className="font-medium underline hover:text-blue-700 dark:hover:text-blue-300"
                onClick={() =>
                  console.log("Resend verification email to:", registeredEmail)
                }
              >
                click here to resend
              </button>
              .
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {registerMutation.error && (
        <ErrorMessage message={registerMutation.error.message} />
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="John Doe"
          className="w-full"
          disabled={registerMutation.isPending}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          className="w-full"
          disabled={registerMutation.isPending}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            className="w-full pr-10"
            disabled={registerMutation.isPending}
            {...register("password")}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={togglePasswordVisibility}
            tabIndex={-1}
            disabled={registerMutation.isPending}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            <span className="sr-only">
              {showPassword ? "Hide password" : "Show password"}
            </span>
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Must be at least 8 characters.
        </p>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={registerMutation.isPending}
      >
        {registerMutation.isPending ? (
          <div className="flex items-center gap-2">
            <LoadingSpinner size="sm" />
            <span>Creating account...</span>
          </div>
        ) : (
          "Register"
        )}
      </Button>
    </form>
  );
}
