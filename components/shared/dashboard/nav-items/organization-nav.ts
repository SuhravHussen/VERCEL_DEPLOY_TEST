import { NavItem } from "@/types/nav-item";
import { Role } from "@/types/role";

const getOrganizationNavItems = (id: string, role: Role | null): NavItem[] => [
  {
    title: "Home",
    url: "/",
    icon: "home",
    isActive: false,
    items: [],
  },
  {
    title: "Dashboard",
    url: `/dashboard/organization/${id}/overview`,
    icon: "dashboard",
    isActive: false,
  },
  {
    title: "Instructors",
    url: `/dashboard/organization/${id}/instructors`,
    icon: "instructor",
    isActive: false,
    disabled: role !== Role.ADMIN,
  },
  {
    title: "Ielts",
    url: "#",
    iconImage: "/icons/ielts.png", // Using PNG image instead of icon
    isActive: false,
    items: [
      {
        title: "Exams",
        url: `/dashboard/organization/${id}/ielts-academic/exam`,
        icon: "book",
        isActive: false,
      },
      {
        title: "Reading",
        url: `#`,
        icon: "book",
        isActive: false,
        items: [
          {
            title: "Questions",
            url: `/dashboard/organization/${id}/ielts-academic/reading/questions`,
            icon: "list",
            isActive: false,
          },
          {
            title: "Tests",
            url: `/dashboard/organization/${id}/ielts-academic/reading/tests`,
            icon: "list",
            isActive: false,
          },
        ],
      },
      {
        title: "Listening",
        url: `#`,
        icon: "listening",
        isActive: false,
        items: [
          {
            title: "Questions",
            url: `/dashboard/organization/${id}/ielts-academic/listening/questions`,
            icon: "list",
            isActive: false,
          },
          {
            title: "Tests",
            url: `/dashboard/organization/${id}/ielts-academic/listening/tests`,
            icon: "list",
            isActive: false,
          },
        ],
      },
      {
        title: "Writing",
        url: `#`,
        icon: "writing",
        isActive: false,
        items: [
          {
            title: "Questions",
            url: `/dashboard/organization/${id}/ielts-academic/writing/questions`,
            icon: "list",
            isActive: false,
          },
          {
            title: "Tests",
            url: `/dashboard/organization/${id}/ielts-academic/writing/tests`,
            icon: "list",
            isActive: false,
          },
        ],
      },
    ],
  },
];
export default getOrganizationNavItems;
