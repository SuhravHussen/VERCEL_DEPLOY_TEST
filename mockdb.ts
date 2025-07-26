import { User } from "@/types/user";
import { LoginDTO, RegisterDTO } from "@/types/dto/auth.dto";
import { v4 as uuidv4 } from "uuid";
import { Organization } from "@/types/organization";
import { Role } from "./types/role";
import { IELTSReadingQuestionGroup } from "./types/exam/ielts-academic/reading/question/question";
import { IELTSReadingTest } from "./types/exam/ielts-academic/reading/test/test";
import { CreateReadingTestDto } from "./types/dto/ielts/reading/test.dto";
import ieltsTestSections from "./mockdata/mockIeltsTestReadingSections";
import { ieltsReadingTest } from "./mockdata/mockieltsReadingTest";
import {
  IELTSListeningTest,
  IELTSListeningTestSection,
} from "./types/exam/ielts-academic/listening/listening";
import {
  CreateListeningTestDto,
  CreateListeningTestSectionDto,
} from "./types/dto/ielts/listening/listening.dto";
import { ieltsListeningTestSections } from "./mockdata/mockIeltsListeningQuestion";
import { ieltsListeningTest } from "./mockdata/mockIeltsListeningTest";
import {
  IELTSWritingTask,
  IELTSWritingTest,
} from "./types/exam/ielts-academic/writing/writing";
import {
  CreateIELTSWritingTestDto,
  CreateWritingTaskDto,
} from "./types/dto/ielts/writing/writing.dto";
import { mockIeltsWritingTasks } from "./mockdata/mockIeltsWritingQuestion";
import { mockIeltsWritingTests } from "./mockdata/mockIeltsWritingTests";

// Mock organizations data
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

// Mock database to simulate server-side storage
interface MockDB {
  users: User[];
  findUserByEmail: (email: string) => User | undefined;
  findUserById: (id: string) => User | undefined;
  createUser: (data: RegisterDTO) => User;
  validateCredentials: (data: LoginDTO) => User | null;
  updateUserProfile: (userId: string, data: Partial<User>) => User | null;
  updateUserPassword: (
    userId: string,
    currentPassword: string,
    newPassword: string
  ) => { success: boolean; message: string };
  organizations: Organization[];
  findOrganizationById: (id: number) => Organization | undefined;

  // ielts reading questions
  ieltsReadingQuestions: IELTSReadingQuestionGroup[];
  createIeltsReadingQuestion: (
    question: IELTSReadingQuestionGroup
  ) => IELTSReadingQuestionGroup;
  getIeltsReadingQuestions: () => IELTSReadingQuestionGroup[];

  // ielts reading tests
  ieltsReadingTests: IELTSReadingTest[];
  createIeltsReadingTest: (test: CreateReadingTestDto) => IELTSReadingTest;
  getIeltsReadingTests: () => IELTSReadingTest[];

  // ielts listening questions
  ieltsListeningQuestions: IELTSListeningTestSection[];
  createIeltsListeningQuestion: (
    question: CreateListeningTestSectionDto
  ) => IELTSListeningTestSection;
  getIeltsListeningQuestions: () => IELTSListeningTestSection[];

  // ielts listening tests
  ieltsListeningTests: IELTSListeningTest[];
  createIeltsListeningTest: (
    test: CreateListeningTestDto
  ) => IELTSListeningTest;
  getIeltsListeningTests: () => IELTSListeningTest[];

  // ielts writing questions
  ieltsWritingQuestions: IELTSWritingTask[];
  createIeltsWritingQuestion: (
    question: CreateWritingTaskDto
  ) => IELTSWritingTask;

  // ielts writing tests
  ieltsWritingTests: IELTSWritingTest[];
  createIeltsWritingTest: (test: CreateIELTSWritingTestDto) => IELTSWritingTest;
  getIeltsWritingTests: () => IELTSWritingTest[];
}

const mockdb: MockDB = {
  organizations: mockOrganizations.slice(0, 2),

  users: [
    // Super admin user
    {
      id: "user-super-admin",
      name: "Super Admin",
      email: "super@example.com",
      password: "password123",
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-01-01T00:00:00.000Z",
      role: Role.SUPER_ADMIN,
      avatar: "/placeholder-avatar.jpg",
    },
    // Admin user
    {
      id: "user-admin",
      name: "Admin User",
      email: "admin@example.com",
      password: "password123",
      createdAt: "2023-02-15T00:00:00.000Z",
      updatedAt: "2023-02-15T00:00:00.000Z",
      role: Role.ADMIN,
      organizations_admin: [
        {
          id: 1,
          name: "Acme Corporation",
          description: "Leading provider of innovative solutions",
          logo: "/images/home-laptop.png",
        },
      ],
    },
    // Regular user
    {
      id: "user-123",
      name: "Test User",
      email: "test@example.com",
      password: "password123", // In a real app, this would be hashed
      createdAt: "2023-03-10T00:00:00.000Z",
      updatedAt: "2023-03-10T00:00:00.000Z",
      role: Role.USER,
      avatar: "/placeholder-avatar.jpg",
      organizations_admin: [
        {
          id: 1,
          name: "Organization 1",
          description: "Organization 1 description",
          logo: "/images/home-laptop.png",
        },
      ],
    },
    // More test users
    {
      id: "user-456",
      name: "Jane Smith",
      email: "jane@example.com",
      password: "password123",
      createdAt: "2023-04-05T00:00:00.000Z",
      updatedAt: "2023-04-05T00:00:00.000Z",
      role: Role.USER,
      organizations_admin: [
        {
          id: 2,
          name: "Organization 2",
          description: "Organization 2 description",
          logo: "/images/home-laptop.png",
        },
      ],
    },
    {
      id: "user-789",
      name: "Mike Johnson",
      email: "mike@example.com",
      password: "password123",
      createdAt: "2023-05-12T00:00:00.000Z",
      updatedAt: "2023-05-12T00:00:00.000Z",
      role: Role.USER,
    },
    {
      id: "user-101",
      name: "Sarah Williams",
      email: "sarah@example.com",
      password: "password123",
      createdAt: "2023-06-20T00:00:00.000Z",
      updatedAt: "2023-06-20T00:00:00.000Z",
      role: Role.ADMIN,
      avatar: "/placeholder-avatar.jpg",
      organizations_admin: [
        {
          id: 2,
          name: "Organization 2",
          description: "Organization 2 description",
          logo: "/images/home-laptop.png",
        },
      ],
    },
  ],

  // Find a user by email
  findUserByEmail(email: string) {
    return this.users.find((user) => user.email === email);
  },

  // Find a user by ID
  findUserById(id: string) {
    return this.users.find((user) => user.id === id);
  },

  // Create a new user
  createUser(data: RegisterDTO) {
    const newUser: User = {
      id: `user-${uuidv4()}`,
      name: data.name,
      email: data.email,
      password: data.password, // In a real app, this would be hashed
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      role: Role.USER,
    };

    this.users.push(newUser);
    return newUser;
  },

  // Validate user credentials
  validateCredentials(data: LoginDTO) {
    const user = this.findUserByEmail(data.email);
    if (user && user.password === data.password) {
      // In a real app, you would compare hashed passwords
      return user;
    }
    return null;
  },

  // Update user profile
  updateUserProfile(userId: string, data: Partial<User>) {
    const index = this.users.findIndex((user) => user.id === userId);
    if (index === -1) return null;

    // Update the user data
    const updatedUser = {
      ...this.users[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    this.users[index] = updatedUser;
    return updatedUser;
  },

  // Update user password
  updateUserPassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ) {
    const index = this.users.findIndex((user) => user.id === userId);
    if (index === -1) {
      return { success: false, message: "User not found" };
    }

    const user = this.users[index];

    // Verify current password
    if (user.password !== currentPassword) {
      return { success: false, message: "Current password is incorrect" };
    }

    // Update password
    this.users[index] = {
      ...user,
      password: newPassword,
      updatedAt: new Date().toISOString(),
    };

    return { success: true, message: "Password updated successfully" };
  },

  // Find organization by ID
  findOrganizationById(id: number) {
    return this.organizations.find((org) => org.id === id);
  },

  // ielts reading questions
  ieltsReadingQuestions: [
    ...ieltsTestSections,
  ] as unknown as IELTSReadingQuestionGroup[],
  createIeltsReadingQuestion(question: IELTSReadingQuestionGroup) {
    this.ieltsReadingQuestions.push(question);
    return question;
  },
  getIeltsReadingQuestions() {
    return this.ieltsReadingQuestions;
  },

  // ielts reading tests
  ieltsReadingTests: [...ieltsReadingTest],
  createIeltsReadingTest(test: CreateReadingTestDto) {
    const newTest: IELTSReadingTest = {
      ...test,
      id: uuidv4(),
    };
    this.ieltsReadingTests.push(newTest);
    return newTest;
  },
  getIeltsReadingTests() {
    return this.ieltsReadingTests;
  },

  // ielts listening questions
  ieltsListeningQuestions: [
    ...ieltsListeningTestSections,
  ] as unknown as IELTSListeningTestSection[],
  createIeltsListeningQuestion(question: CreateListeningTestSectionDto) {
    this.ieltsListeningQuestions.push(question);
    return question;
  },
  getIeltsListeningQuestions() {
    return this.ieltsListeningQuestions;
  },

  // ielts listening tests
  ieltsListeningTests: [...ieltsListeningTest],
  createIeltsListeningTest(test: CreateListeningTestDto) {
    const newTest: IELTSListeningTest = {
      ...test,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.ieltsListeningTests.push(newTest);
    return newTest;
  },
  getIeltsListeningTests() {
    return this.ieltsListeningTests;
  },

  // ielts writing questions
  ieltsWritingQuestions: [...mockIeltsWritingTasks],
  createIeltsWritingQuestion(question: CreateWritingTaskDto) {
    const newQuestion: IELTSWritingTask = {
      ...question,
      id: uuidv4(),
    };
    this.ieltsWritingQuestions.push(newQuestion);
    return newQuestion;
  },

  // ielts writing tests
  ieltsWritingTests: [...mockIeltsWritingTests],
  createIeltsWritingTest(test: CreateIELTSWritingTestDto) {
    const newTest: IELTSWritingTest = {
      ...test,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "user-admin",
      status: "published",
    };
    this.ieltsWritingTests.push(newTest);
    return newTest;
  },
  getIeltsWritingTests() {
    return this.ieltsWritingTests;
  },
};

export default mockdb;
