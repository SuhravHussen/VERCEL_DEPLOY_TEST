"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Sparkles } from "lucide-react";

import { getCurrentUser } from "@/lib/auth-client";
import { RainbowButton } from "@/components/ui/RainbowButton";

interface NavLink {
  href: string;
  label: string;
}

interface MobileNavProps {
  navLinks: NavLink[];
  signupLabel: string;
}

export function MobileNav({ navLinks, signupLabel }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const user = getCurrentUser();

  const isActiveRoute = (href: string) => {
    // For homepage, require exact match
    if (href === "/") {
      return pathname === `/` || pathname === `/`;
    }

    // For other routes, check if pathname includes the href
    return pathname.includes(href);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden rounded-lg">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-full max-w-xs pr-0 border-r-0 rounded-r-2xl"
      >
        <div className="flex h-full flex-col">
          <div className="p-6">
            <Link
              href={`/`}
              className="text-lg font-bold uppercase tracking-wider text-foreground"
              onClick={() => setIsOpen(false)}
            >
              Fluency Checker
            </Link>
          </div>
          <nav className="flex flex-1 flex-col gap-3 p-6 pt-0">
            {navLinks.map((link) => {
              const isActive = isActiveRoute(link.href);
              return (
                <SheetClose asChild key={link.label}>
                  <Link
                    href={link.href}
                    className={`relative border-l-2 pl-4 py-2 transition-colors ${
                      isActive
                        ? "border-primary text-foreground font-medium"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                </SheetClose>
              );
            })}
          </nav>
          <div className="mt-auto border-t p-6">
            {user ? (
              <RainbowButton asChild className="w-full rounded-xl">
                <Link href={`/dashboard/user`}>
                  Dashboard
                  <Sparkles className="ml-2 h-4 w-4" />
                </Link>
              </RainbowButton>
            ) : (
              <RainbowButton asChild className="w-full rounded-xl">
                <Link href="/signup">
                  {signupLabel}
                  <Sparkles className="ml-2 h-4 w-4" />
                </Link>
              </RainbowButton>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
