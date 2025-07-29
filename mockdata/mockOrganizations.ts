import { Organization } from "@/types/organization";
import { Role } from "@/types/role";

export const mockOrganizations: Organization[] = [
  {
    id: 1,
    name: "Acme Corporation",
    description: "Leading provider of innovative solutions",
    logo: "/images/home-laptop.png",
    users: [
      {
        id: "user-123",
        name: "Test User",
        email: "test@example.com",
        createdAt: "2023-03-10T00:00:00.000Z",
        updatedAt: "2023-03-10T00:00:00.000Z",
        role: Role.USER,
      },
      {
        id: "user-admin",
        name: "Admin User",
        email: "admin@example.com",
        createdAt: "2023-02-15T00:00:00.000Z",
        updatedAt: "2023-02-15T00:00:00.000Z",
        role: Role.ADMIN,
      },
    ],
  },
  {
    id: 2,
    name: "TechSolutions Inc",
    description: "Enterprise technology solutions provider",
    logo: "/images/home-laptop.png",
    users: [
      {
        id: "user-456",
        name: "Jane Smith",
        email: "jane@example.com",
        createdAt: "2023-04-05T00:00:00.000Z",
        updatedAt: "2023-04-05T00:00:00.000Z",
        role: Role.USER,
      },
      {
        id: "user-101",
        name: "Sarah Williams",
        email: "sarah@example.com",
        createdAt: "2023-06-20T00:00:00.000Z",
        updatedAt: "2023-06-20T00:00:00.000Z",
        role: Role.ADMIN,
      },
    ],
  },
  {
    id: 3,
    name: "Global Innovations",
    description: "Cutting-edge research and development",
    logo: "",
  },
  {
    id: 4,
    name: "EduTech Academy",
    description: "Educational technology and learning solutions",
    logo: "/images/home-laptop.png",
  },
  {
    id: 5,
    name: "HealthCare Partners",
    description: "Healthcare management and services",
    logo: "",
  },
  {
    id: 6,
    name: "Green Solutions",
    description: "Sustainable and eco-friendly technologies",
    logo: "/images/home-laptop.png",
  },
  {
    id: 7,
    name: "Financial Strategies",
    description: "Financial planning and investment services",
    logo: "",
  },
  {
    id: 8,
    name: "Creative Studios",
    description: "Digital design and creative solutions",
    logo: "/images/home-laptop.png",
  },
  {
    id: 9,
    name: "Global Logistics",
    description: "Supply chain and logistics management",
    logo: "",
  },
];