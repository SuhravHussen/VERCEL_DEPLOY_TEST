import { NavItem } from "@/types/nav-item";

const getNavItems = () => {
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
      items: [],
    },
  ];
  return userNavItems;
};

export default getNavItems;
