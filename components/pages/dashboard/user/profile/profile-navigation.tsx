"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
interface ProfileNavigationProps {
  activeTab: string;
}

export default function ProfileNavigation({
  activeTab,
}: ProfileNavigationProps) {
  const navItems = [
    {
      id: "information",
      label: "Information",
    },
    {
      id: "password",
      label: "Password",
    },
  ];

  return (
    <nav className="space-y-1 bg-background/70 p-4 rounded-lg">
      {navItems.map((item) => (
        <Link
          key={item.id}
          href={`?tab=${item.id}`}
          className={cn(
            "block px-4 py-2 rounded-md text-sm font-medium transition-colors",
            activeTab === item.id
              ? "bg-primary text-primary-foreground"
              : "hover:bg-secondary"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
