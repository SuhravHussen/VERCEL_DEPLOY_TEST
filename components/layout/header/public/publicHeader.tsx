import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";
import { Sparkles, LayoutDashboard } from "lucide-react";
import { ClientNavigation } from "./clientNavigation";
import { MobileNav } from "./MobileNav";
import { getCurrentUser } from "@/lib/auth";
import { ScrollAwareHeader } from "./ScrollAwareHeader";
import { RainbowButton } from "@/components/ui/RainbowButton";
export async function PublicHeader() {
  const currentUser = await getCurrentUser();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/exams", label: "Exams" },
  ];

  return (
    <ScrollAwareHeader>
      <div className="relative flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left Side: Logo & Mobile Nav Trigger */}
        <div className="flex items-center gap-4">
          <MobileNav navLinks={navLinks} signupLabel="Signup" />
          <Link
            href={`/`}
            className="hidden text-base font-bold uppercase tracking-wider text-foreground transition-opacity hover:opacity-80 md:block"
          >
            Fluency Checker
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <ClientNavigation navLinks={navLinks} />
        </div>

        {/* Right Side: Controls */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {currentUser ? (
            <RainbowButton
              asChild
              className="h-9 rounded-full px-4 text-sm font-semibold"
              variant="outline"
            >
              <Link href={`/dashboard/user`}>
                <LayoutDashboard className="mr-1.5 h-4 w-4" />
                Dashboard
              </Link>
            </RainbowButton>
          ) : (
            <RainbowButton
              asChild
              className="h-9 rounded-full px-4 text-sm font-semibold"
            >
              <Link href={`/auth?type=register`}>
                Signup
                <Sparkles className="ml-1.5 h-4 w-4 opacity-90" />
              </Link>
            </RainbowButton>
          )}
        </div>
      </div>
    </ScrollAwareHeader>
  );
}
