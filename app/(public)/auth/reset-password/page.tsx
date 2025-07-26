
import Link from "next/link";
import { ResetPasswordForm } from "@/components/pages/auth/reset-password-form";
import Image from "next/image";

export const metadata = {
  title: "Reset Password | Fluency Checker",
  description: "Reset your password for Fluency Checker",
};

export default async function ResetPasswordPage({

  searchParams,
}: {

  searchParams: Promise<{ token: string }>;
}) {

  const { token } = await searchParams;

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
          Enter your email and we&apos;ll send you a link to reset your
          password.
        </p>
      </div>

      {/* Right side - Form */}
      {token && (
        <div className="flex w-full md:w-1/2 flex-col items-center justify-center bg-background p-6 md:p-12">
          <div className="w-full max-w-md">
            <h2 className="mb-6 text-center text-2xl font-bold">
              Reset Password
            </h2>
            <p className="mb-8 text-center text-muted-foreground">
              Enter your email and we&apos;ll send you a link to reset your
              password.
            </p>

            <ResetPasswordForm token={token} />

            <div className="mt-6 text-center text-sm">
              <Link
                href={`/auth/login`}
                className="font-medium text-primary underline underline-offset-4"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      )}
      {!token && (
        <div className="flex w-full md:w-1/2 flex-col items-center justify-center bg-background p-6 md:p-12">
          <div className="w-full max-w-md">
            <h2 className="mb-6 text-center text-2xl font-bold">
              Invalid Token
            </h2>
            <p className="mb-8 text-center text-muted-foreground">
              &quot;Invalid token&quot;
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
