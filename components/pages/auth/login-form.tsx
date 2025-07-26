"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/hooks/public/auth/useAuth";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { LoginDTO } from "@/types/dto/auth.dto";
import { Eye, EyeOff } from "lucide-react";
import { SuccessMessage } from "@/components/shared/SuccessMessage";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormData = z.infer<typeof formSchema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: process.env.NODE_ENV === "development" ? "test@example.com" : "",
      password: process.env.NODE_ENV === "development" ? "password123" : "",
    },
  });

  const loginMutation = useLogin();

  const onSubmit = (data: FormData) => {
    const loginData: LoginDTO = {
      email: data.email,
      password: data.password,
    };

    loginMutation.mutate(loginData, {
      onSuccess: (data) => {
        console.log("Login successful:", data);
        setShowSuccess(true);

        // Redirect after a short delay to show the success message
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      },
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {loginMutation.error && (
        <ErrorMessage message={loginMutation.error.message} />
      )}

      {showSuccess && (
        <SuccessMessage
          message="Login successful!"
          description="Redirecting you to the dashboard..."
        />
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          className="w-full"
          disabled={loginMutation.isPending || showSuccess}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <a href="#" className="text-xs text-primary hover:underline">
            Forgot password?
          </a>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            className="w-full pr-10"
            disabled={loginMutation.isPending || showSuccess}
            {...register("password")}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={togglePasswordVisibility}
            tabIndex={-1}
            disabled={loginMutation.isPending || showSuccess}
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
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loginMutation.isPending || showSuccess}
      >
        {loginMutation.isPending ? (
          <div className="flex items-center gap-2">
            <LoadingSpinner size="sm" />
            <span>Logging in...</span>
          </div>
        ) : (
          "Login"
        )}
      </Button>
    </form>
  );
}
