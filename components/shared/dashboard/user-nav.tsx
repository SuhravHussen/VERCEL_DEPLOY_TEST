"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatarProfile } from "@/components/shared/dashboard/use-avatar-profile";

import { useRouter, usePathname } from "next/navigation";
import { User } from "@/types/user";
import { signOut } from "@/lib/auth";
import { Role } from "@/types/role";
interface UserNavProps {
  user: User | null;
}
export function UserNav({ user }: UserNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isSuperAdminPath = pathname.includes("/dashboard/super-admin/");

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <UserAvatarProfile user={user} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56"
          align="end"
          sideOffset={10}
          forceMount
        >
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm leading-none font-medium"> {user.name}</p>
              <p className="text-muted-foreground text-xs leading-none">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => router.push(`/dashboard/user/profile`)}
            >
              Profile
            </DropdownMenuItem>
            {user.role === Role.SUPER_ADMIN &&
              (isSuperAdminPath ? (
                <DropdownMenuItem
                  onClick={() => router.push(`/dashboard/user/`)}
                >
                  User Dashboard
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => router.push(`/dashboard/super-admin/`)}
                >
                  Super Admin Dashboard
                </DropdownMenuItem>
              ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
}
