import { NavItem } from "@/types/nav-item";
import { Organization } from "@/types/organization";

const getNavItems = (organizations: Organization[]) => {
  const userNavItems: NavItem[] = [
    {
      title: "Dashboard",
      url: "/dashboard/user",
      icon: "dashboard",
      isActive: true,
      items: [],
    },

    {
      title: "Profile",
      url: "/dashboard/user/profile",
      icon: "user",

      isActive: false,
      items: [],
    },
    {
      title: "Organizations",
      url: "/dashboard/user/organizations",
      icon: "organization",
      isActive: true,
      items: organizations.map((organization) => ({
        title: organization?.name,
        url: `/dashboard/organization/${organization.id}`,
        icon: "hash",
      })),
    },
  ];
  return userNavItems;
};

export default getNavItems;
