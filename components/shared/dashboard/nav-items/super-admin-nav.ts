import { NavItem } from "@/types/nav-item";

const getSuperAdminNavItems = () => {
  const superAdminNavItems: NavItem[] = [
    {
      title: "Users",
      url: "/dashboard/super-admin/users",
      icon: "users",
      isActive: false,
    },
    {
      title: "Organizations",
      url: "/dashboard/super-admin/organizations",
      icon: "organization",
      isActive: true,
    },
  ];
  return superAdminNavItems;
};

export default getSuperAdminNavItems;
