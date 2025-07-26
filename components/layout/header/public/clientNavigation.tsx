"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLink {
  href: string;
  label: string;
}

interface ClientNavigationProps {
  navLinks: NavLink[];
}

export function ClientNavigation({ navLinks }: ClientNavigationProps) {
  const pathname = usePathname();

  const isActiveRoute = (href: string) => {
    // For homepage, require exact match
    if (href === "/") {
      return pathname === `/` || pathname === `/`;
    }

    // For other routes, check if pathname includes the href
    return pathname.includes(href);
  };

  return (
    <nav className="flex items-center gap-4 px-2 py-2">
      {navLinks.map((link) => {
        const isActive = isActiveRoute(link.href);
        const linkPath = link.href;

        return (
          <Link
            key={link.label}
            href={linkPath}
            className={`relative px-2 py-1 text-sm font-medium transition-all duration-200 ${
              isActive
                ? "text-foreground after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
