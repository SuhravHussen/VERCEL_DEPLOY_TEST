"use client";

import * as React from "react";
import {
  CredentialResponse,
  useGoogleLogin,
  useGoogleOneTapLogin,
  CodeResponse,
} from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { setAuthCookies } from "@/lib/auth";
import { Role } from "@/types/role";

interface GoogleLoginButtonProps {
  isLogin: boolean;
  enableOneTap?: boolean; // New prop to control One Tap
}

export function GoogleLoginButton({
  isLogin,
  enableOneTap = true,
}: GoogleLoginButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  // Handle successful authentication for One Tap flow
  const handleOneTapSuccess = async (response: CredentialResponse) => {
    try {
      setIsLoading(true);
      console.log("Google OAuth success:", response);
      setAuthCookies(
        {
          id: "sdsdsd",
          email: "test@test.com",
          name: "Test User",
          avatar: "https://example.com/image.png",
          role: Role.USER,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        "sdsdsdsdd"
      );
      // In a real app, you would send this token/credential to your backend
      // For One Tap, you'll receive a JWT credential instead of an access token

      // Simulate a successful login
      setTimeout(() => {
        setIsLoading(false);
        router.push(`/dashboard`);
      }, 1000);
    } catch (error) {
      console.error("Google login error:", error);
      setIsLoading(false);
    }
  };

  // Handle successful authentication for regular OAuth flow
  const handleAuthSuccess = async (
    codeResponse: Omit<
      CodeResponse,
      "error" | "error_description" | "error_uri"
    >
  ) => {
    try {
      setIsLoading(true);
      console.log("Google OAuth success:", codeResponse);
      setAuthCookies(
        {
          id: "sdsdsd",
          email: "test@test.com",
          name: "Test User",
          avatar: "https://example.com/image.png",
          role: Role.USER,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        "sdsdsdsdd"
      );
      // Simulate a successful login
      setTimeout(() => {
        setIsLoading(false);
        router.push(`/dashboard`);
      }, 1000);
    } catch (error) {
      console.error("Google login error:", error);
      setIsLoading(false);
    }
  };

  // Handle authentication errors for regular OAuth flow
  const handleAuthError = (
    errorResponse: Pick<
      CodeResponse,
      "error" | "error_description" | "error_uri"
    >
  ) => {
    console.error("Google OAuth Error:", errorResponse);
    setIsLoading(false);
  };

  // Regular OAuth flow (popup/redirect)
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: handleAuthSuccess,
    onError: handleAuthError,
  });

  // One Tap flow - automatically shows when component mounts
  useGoogleOneTapLogin({
    onSuccess: handleOneTapSuccess,
    onError: () => {
      console.error("Google One Tap Error occurred");
      setIsLoading(false);
    },
    // Optional configuration
    auto_select: false, // Don't auto-select if user has only one Google account
    cancel_on_tap_outside: false, // Don't cancel when user clicks outside
    use_fedcm_for_prompt: false, // Disable FedCM to avoid the network error
    // You can also disable One Tap conditionally
    disabled: !enableOneTap,
  });

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full flex items-center justify-center gap-2"
      onClick={() => handleGoogleLogin()}
      disabled={isLoading}
      style={{ colorScheme: "light" }}
    >
      {isLoading ? (
        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
        >
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
          <path fill="none" d="M1 1h22v22H1z" />
        </svg>
      )}
      <span>{isLogin ? "Sign in with Google" : "Sign up with Google"}</span>
    </Button>
  );
}
