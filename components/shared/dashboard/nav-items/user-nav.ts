import { NavItem } from "@/types/nav-item";

const getNavItems = () => {
  const userNavItems: NavItem[] = [
    {
      title: "Dashboard",
      url: "/dashboard/user",
      icon: "dashboard",
      isActive: false,
      items: [],
    },
    {
      title: "Practice Exams",
      url: "/dashboard/user/practice",
      icon: "book",
      isActive: false,
      items: [],
    },
    {
      title: "Exams",
      url: "/dashboard/user/exams",
      icon: "exam",
      isActive: false,
      items: [],
    },
    {
      title: "Calendar",
      url: "/dashboard/user/calendar",
      icon: "calendar",
      isActive: false,
      items: [],
    },
    {
      title: "Organizations",
      url: "/dashboard/user/organizations",
      icon: "organization",
      isActive: false,
      items: [],
    },
    {
      title: "Profile",
      url: "/dashboard/user/profile",
      icon: "user",

      isActive: false,
      items: [],
    },
  ];
  return userNavItems;
};

export default getNavItems;
