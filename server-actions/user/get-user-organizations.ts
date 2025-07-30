"use server";

import { UserOrganization } from "@/types/user-organization";
import { Role } from "@/types/role";

export async function getUserOrganizations(): Promise<UserOrganization[]> {
  // Mock data with three organizations and different roles
  const mockUserOrganizations: UserOrganization[] = [
    {
      role: Role.USER,
      organization: {
        id: 1,
        name: "Acme Corporation",
        description: "Leading provider of innovative solutions",
        logo: "/images/home-laptop.png",
      },
    },
    {
      role: Role.ADMIN,
      organization: {
        id: 2,
        name: "TechSolutions Inc",
        description: "Enterprise technology solutions provider",
        logo: "/images/home-laptop.png",
      },
    },
    {
      role: Role.INSTRUCTOR,
      organization: {
        id: 4,
        name: "EduTech Academy",
        description: "Educational technology and learning solutions",
        logo: "/images/home-laptop.png",
      },
    },
  ];

  return mockUserOrganizations;
}

export async function getUserOrganizationRole(
  orgId: number
): Promise<Role | null> {
  const userOrganizations = await getUserOrganizations();

  const userOrganization = userOrganizations.find(
    (userOrg) => userOrg.organization.id === orgId
  );

  return userOrganization ? userOrganization.role : null;
}
