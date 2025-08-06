"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { LayoutDashboard, User, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { RainbowButton } from "@/components/ui/RainbowButton";
import { User as UserType } from "@/types/user";
import { getDashboardUrl } from "@/lib/getDashboardIUrl";

interface OrganizationHeaderProps {
  user: UserType | null;
}

function ScrollAwareHeader({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full flex justify-center px-4 py-4 sm:px-6 lg:px-8 transition-all duration-300">
      <header
        className={`w-full md:max-w-4xl lg:max-w-5xl rounded-2xl border transition-all duration-300 ${
          scrolled
            ? "shadow-lg border-border/40 bg-background/60 backdrop-blur-sm"
            : "border-transparent bg-transparent"
        }`}
      >
        {children}
      </header>
    </div>
  );
}

function MobileNav({ user }: { user: UserType | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Temp states as requested - defaulted to true
  const [showOrgDashboard] = useState(true);
  const [showUserDashboard] = useState(true);

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
              href={pathname}
              className="text-lg font-bold uppercase tracking-wider text-foreground"
              onClick={() => setIsOpen(false)}
            >
              Organization
            </Link>
          </div>
          <nav className="flex flex-1 flex-col gap-3 p-6 pt-0">
            <SheetClose asChild>
              <Link
                href={pathname}
                className="relative border-l-2 border-primary pl-4 py-2 text-foreground font-medium transition-colors"
              >
                Home
              </Link>
            </SheetClose>
          </nav>
          {user && (
            <div className="mt-auto border-t p-6 space-y-3">
              {showUserDashboard && (
                <RainbowButton
                  asChild
                  className="w-full rounded-xl"
                  variant="outline"
                >
                  <Link href={getDashboardUrl("/dashboard/user")}>
                    <User className="mr-2 h-4 w-4" />
                    User Dashboard
                  </Link>
                </RainbowButton>
              )}
              {showOrgDashboard && (
                <RainbowButton asChild className="w-full rounded-xl">
                  <Link href={getDashboardUrl("/dashboard/organization/2")}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Organization Dashboard
                  </Link>
                </RainbowButton>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function OrganizationHeader({ user }: OrganizationHeaderProps) {
  const pathname = usePathname();

  // Temp states as requested - defaulted to true
  const [showOrgDashboard] = useState(true);
  const [showUserDashboard] = useState(true);

  return (
    <ScrollAwareHeader>
      <div className="relative flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left Side: Logo & Mobile Nav Trigger */}
        <div className="flex items-center gap-4">
          <MobileNav user={user} />
          <Link
            href={pathname}
            className="hidden text-base font-bold uppercase tracking-wider text-foreground transition-opacity hover:opacity-80 md:block"
          >
            Organization
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <nav className="flex items-center gap-4 px-2 py-2">
            <Link
              href={pathname}
              className="relative px-2 py-1 text-sm font-medium text-foreground after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary transition-all duration-200"
            >
              Home
            </Link>
          </nav>
        </div>

        {/* Right Side: Controls */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <RainbowButton
                  variant="outline"
                  className="h-9 w-9 rounded-full p-0 relative"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarImage
                      src={user.avatar || ""}
                      alt={user.name || ""}
                    />
                    <AvatarFallback className="text-xs font-semibold">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </RainbowButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56"
                align="end"
                sideOffset={8}
                forceMount
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {showUserDashboard && (
                  <DropdownMenuItem asChild>
                    <Link
                      href={getDashboardUrl("/dashboard/user")}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <User className="h-4 w-4" />
                      User Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}

                {showOrgDashboard && (
                  <DropdownMenuItem asChild>
                    <Link
                      href={getDashboardUrl("/dashboard/organization/2")}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Organization Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </ScrollAwareHeader>
  );
}
