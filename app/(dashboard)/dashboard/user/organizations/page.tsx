import React from "react";
import { getCurrentUser } from "@/lib/auth";
import { OrganizationsList } from "@/components/pages/dashboard/user/OrganizationsList";

export default async function OrganizationsPage() {
  const user = await getCurrentUser();

  // The user object should have an organizations property according to the requirements
  const userOrganizations = [
    ...(user?.organizations_admin || []),
    ...(user?.organizations_instructor || []),
  ];

  const organizations =
    userOrganizations.length > 0
      ? userOrganizations
      : [
          {
            id: 1,
            name: "Organization 1",
            logo: "/images/home-laptop.png",
            description:
              "This is a sample organization focused on technology and innovation. We work on cutting-edge projects and solutions.",
          },
          {
            id: 2,
            name: "Organization 2",
            logo: "/images/home-laptop.png",
            description:
              "A forward-thinking organization dedicated to sustainable development and environmental conservation initiatives.",
          },
          {
            id: 3,
            name: "Organization 3",
            logo: "/images/home-laptop.png",
            description:
              "We specialize in digital transformation and helping businesses adapt to the modern technological landscape.",
          },
          {
            id: 4,
            name: "Organization 4",
            logo: "/images/home-laptop.png",
            description:
              "An organization committed to educational innovation and developing next-generation learning solutions.",
          },
          {
            id: 5,
            name: "Organization 5",
            logo: "/images/home-laptop.png",
            description:
              "Leading the way in healthcare technology and improving patient care through innovative solutions.",
          },
          {
            id: 6,
            name: "Organization 6",
            logo: "/images/home-laptop.png",
            description:
              "Focused on creating sustainable urban solutions and smart city development projects worldwide.",
          },
          {
            id: 7,
            name: "Organization 7",
            logo: "/images/home-laptop.png",
            description:
              "Pioneering research and development in artificial intelligence and machine learning applications.",
          },
          {
            id: 8,
            name: "Organization 8",
            logo: "/images/home-laptop.png",
            description:
              "Dedicated to cybersecurity and protecting digital assets in an increasingly connected world.",
          },
          {
            id: 9,
            name: "Organization 9",
            logo: "/images/home-laptop.png",
            description:
              "Working on renewable energy solutions and sustainable power generation technologies.",
          },
          {
            id: 10,
            name: "Organization 10",
            logo: "/images/home-laptop.png",
            description:
              "Advancing biotechnology research and developing innovative medical treatments.",
          },
          {
            id: 11,
            name: "Organization 11",
            logo: "/images/home-laptop.png",
            description:
              "Creating innovative solutions for global supply chain and logistics management.",
          },
        ];

  return (
    <div className="w-full py-6 min-h-[calc(100vh-8.5rem)]">
      <OrganizationsList organizations={organizations} />
    </div>
  );
}
