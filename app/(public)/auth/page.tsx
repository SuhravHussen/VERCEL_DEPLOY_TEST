import { LoginForm } from "@/components/pages/auth/login-form";
import { RegisterForm } from "@/components/pages/auth/register-form";
import Link from "next/link";
import Image from "next/image";
import { GoogleLoginButton } from "@/components/pages/auth/google-login-button";

export const metadata = {
  title: "Auth | Fluency Checker",
  description: "Authentication page for Fluency Checker",
};

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ type: string }>;
}) {
  const { type } = await searchParams;

  const isLogin = type !== "register";

  return (
    <div className="flex min-h-screen w-full">
      {/* Left side - Gradient Background with Logo and Text */}
      <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center bg-gradient-to-b from-purple-300 to-purple-900 p-12 text-white">
        <div className="mb-8 flex items-center justify-center">
          <div className="rounded-full bg-white/10 p-3">
            <Image
              src="/logo.svg"
              alt="Fluency Checker Logo"
              width={48}
              height={48}
              className="h-12 w-12"
            />
          </div>
        </div>
        <h1 className="mb-6 text-center text-4xl font-bold">
          Login or Register
        </h1>
        <p className="mb-8 max-w-md text-center text-lg opacity-90">
          {isLogin
            ? "Complete these easy steps to access your account."
            : "Complete these easy steps to register your account."}
        </p>

        <div className="w-full max-w-xs space-y-4">
          <div className="flex items-center rounded-md bg-white/10 p-3">
            <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-white text-purple-900">
              1
            </div>
            <span>
              {isLogin ? "Sign in to your account" : "Sign up your account"}
            </span>
          </div>
          <div className="flex items-center rounded-md bg-white/10 p-3">
            <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/30 text-white">
              2
            </div>
            <span>Set up your workspace</span>
          </div>
          <div className="flex items-center rounded-md bg-white/10 p-3">
            <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/30 text-white">
              3
            </div>
            <span>Set up your profile</span>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex w-full md:w-1/2 flex-col items-center justify-center bg-background p-6 md:p-12">
        <div className="w-full max-w-md">
          <h2 className="mb-6 text-center text-2xl font-bold">
            {isLogin ? "Login" : "Register"}
          </h2>
          <p className="mb-8 text-center text-muted-foreground">
            {isLogin ? "Login to your account" : "Register your account"}
          </p>

          {/* Social Login Button */}
          <div className="mb-6">
            <GoogleLoginButton isLogin={isLogin} />
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {isLogin ? (
            <>
              <LoginForm />
              <div className="mt-2 text-center">
                <Link
                  href={`/auth/forgot-password`}
                  className="text-sm text-primary hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
            </>
          ) : (
            <RegisterForm />
          )}

          <div className="mt-6 text-center text-sm">
            {isLogin ? (
              <>
                No account?{" "}
                <Link
                  href={`/auth?type=register`}
                  className="font-medium text-primary underline underline-offset-4"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                Have an account?{" "}
                <Link
                  href={`/auth?type=login`}
                  className="font-medium text-primary underline underline-offset-4"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
