import { User } from "@/types/user";
import { LoginDTO, RegisterDTO } from "@/types/dto/auth.dto";
import { v4 as uuidv4 } from "uuid";
import { Organization } from "@/types/organization";
import { Role } from "./types/role";
import {
  IELTSReadingQuestionGroup,
  IELTSReadingTestSection,
} from "./types/exam/ielts-academic/reading/question/question";
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
import { mockOrganizations } from "./mockdata/mockOrganizations";
import { mockUsers } from "./mockdata/mockUsers";
import { ExamModel, ExamFilters } from "./types/exam/exam";
import { mockIELTSExams, mockAllExams } from "./mockdata/mockIeltsExam";
import { RegisteredExam } from "./types/registered-exam";
import { registeredExams } from "./mockdata/mockRegisteredExam";

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
  findOrganizationBySlug: (slug: string) => Organization | undefined;

  // ielts reading questions
  ieltsReadingQuestions: IELTSReadingQuestionGroup[];
  createIeltsReadingQuestion: (
    question: IELTSReadingQuestionGroup
  ) => IELTSReadingQuestionGroup;
  getIeltsReadingQuestions: () => IELTSReadingQuestionGroup[];
  getIeltsReadingQuestionById: (
    questionId: string
  ) => IELTSReadingQuestionGroup | undefined;
  updateIeltsReadingQuestion: (
    questionId: string,
    questionData: Partial<IELTSReadingQuestionGroup>
  ) => IELTSReadingQuestionGroup | null;
  deleteIeltsReadingQuestion: (questionId: string) => boolean;

  // ielts reading tests
  ieltsReadingTests: IELTSReadingTest[];
  createIeltsReadingTest: (test: CreateReadingTestDto) => IELTSReadingTest;
  getIeltsReadingTests: () => IELTSReadingTest[];
  getIeltsReadingTestById: (testId: string) => IELTSReadingTest | undefined;
  updateIeltsReadingTest: (
    testId: string,
    testData: Partial<IELTSReadingTest>
  ) => IELTSReadingTest | null;
  deleteIeltsReadingTest: (testId: string) => boolean;

  // ielts listening questions
  ieltsListeningQuestions: IELTSListeningTestSection[];
  createIeltsListeningQuestion: (
    question: CreateListeningTestSectionDto
  ) => IELTSListeningTestSection;
  getIeltsListeningQuestions: () => IELTSListeningTestSection[];
  getIeltsListeningQuestionById: (
    questionId: string
  ) => IELTSListeningTestSection | undefined;
  deleteIeltsListeningQuestion: (questionId: string) => boolean;

  // ielts listening tests
  ieltsListeningTests: IELTSListeningTest[];
  createIeltsListeningTest: (
    test: CreateListeningTestDto
  ) => IELTSListeningTest;
  getIeltsListeningTests: () => IELTSListeningTest[];
  getIeltsListeningTestById: (id: string) => IELTSListeningTest | undefined;
  updateIeltsListeningTest: (
    id: string,
    test: Partial<IELTSListeningTest>
  ) => IELTSListeningTest | null;
  deleteIeltsListeningTest: (id: string) => boolean;

  // ielts writing questions
  ieltsWritingQuestions: IELTSWritingTask[];
  createIeltsWritingQuestion: (
    question: CreateWritingTaskDto
  ) => IELTSWritingTask;
  getIeltsWritingQuestionById: (
    questionId: string
  ) => IELTSWritingTask | undefined;
  updateIeltsWritingQuestion: (
    questionId: string,
    questionData: Partial<IELTSWritingTask>
  ) => IELTSWritingTask | null;
  deleteIeltsWritingQuestion: (questionId: string) => boolean;

  // ielts writing tests
  ieltsWritingTests: IELTSWritingTest[];
  createIeltsWritingTest: (test: CreateIELTSWritingTestDto) => IELTSWritingTest;
  getIeltsWritingTests: () => IELTSWritingTest[];
  getIeltsWritingTestById: (testId: string) => IELTSWritingTest | undefined;
  updateIeltsWritingTest: (
    testId: string,
    testData: Partial<IELTSWritingTest>
  ) => IELTSWritingTest | null;
  deleteIeltsWritingTest: (testId: string) => boolean;

  // ielts exams
  ieltsExams: ExamModel[];
  createIeltsExam: (exam: Partial<ExamModel>) => ExamModel;
  getIeltsExams: () => ExamModel[];
  getIeltsExamById: (id: string) => ExamModel | undefined;

  // all exams (multi-type)
  allExams: ExamModel[];
  getAllExams: () => ExamModel[];
  getAllExamsByOrganization: (
    organizationId: string,
    filters?: ExamFilters
  ) => ExamModel[];
  getAllExamById: (id: string) => ExamModel | undefined;
  createAllExam: (exam: Partial<ExamModel>) => ExamModel;
  updateAllExam: (id: string, examData: Partial<ExamModel>) => ExamModel | null;
  deleteAllExam: (id: string) => boolean;

  // registered exams
  registeredExams: RegisteredExam[];
  getRegisteredExamsByUser: (userId: string) => RegisteredExam[];
  getRegisteredExamById: (id: string) => RegisteredExam | undefined;
  createRegisteredExam: (exam: Partial<RegisteredExam>) => RegisteredExam;
}

const mockdb: MockDB = {
  organizations: mockOrganizations.slice(0, 2),

  users: mockUsers,

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

  // Find organization by slug
  findOrganizationBySlug(slug: string) {
    return this.organizations.find((org) => org.slug === slug);
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
  getIeltsReadingQuestionById(questionId: string) {
    // The mock data is actually test sections with passage and questions
    const testSections = this
      .ieltsReadingQuestions as unknown as IELTSReadingTestSection[];

    // Search through test sections and their question groups
    for (const section of testSections) {
      // Check if any question group in this section matches the ID
      if (section.questions) {
        const foundQuestion = section.questions.find(
          (q) => q.id === questionId
        );
        if (foundQuestion) {
          // Return the entire section with all question groups, not just one
          return {
            passage: section.passage,
            questions: section.questions, // Return all question groups in the section
            // Include metadata for tracking which question was requested
            selectedQuestionId: questionId,
          } as unknown as IELTSReadingQuestionGroup;
        }
      }
    }
    return undefined;
  },
  updateIeltsReadingQuestion(
    questionId: string,
    questionData: Partial<IELTSReadingQuestionGroup>
  ) {
    const testSections = this
      .ieltsReadingQuestions as unknown as IELTSReadingTestSection[];

    // Find the section containing the question
    for (
      let sectionIndex = 0;
      sectionIndex < testSections.length;
      sectionIndex++
    ) {
      const section = testSections[sectionIndex];
      if (section.questions) {
        const questionIndex = section.questions.findIndex(
          (q) => q.id === questionId
        );
        if (questionIndex !== -1) {
          // Update the question in the section
          if (questionData.questions && questionData.questions.length > 0) {
            // Update the specific question group
            testSections[sectionIndex].questions[questionIndex] = {
              ...section.questions[questionIndex],
              ...questionData.questions[0],
              id: questionId,
            };
          }

          // Update passage if provided
          const updateData = questionData as unknown as {
            passage?: {
              title: string;
              content: string;
              difficulty: "easy" | "medium" | "hard";
            };
          };

          if (updateData.passage && section.passage) {
            testSections[sectionIndex].passage = {
              ...section.passage,
              ...updateData.passage,
            };
          }

          // Return the updated question in the expected format
          return {
            id: questionId,
            questionType:
              testSections[sectionIndex].questions[questionIndex].questionType,
            instruction:
              testSections[sectionIndex].questions[questionIndex].instruction,
            questions:
              testSections[sectionIndex].questions[questionIndex].questions,
            passage: testSections[sectionIndex].passage,
          } as unknown as IELTSReadingQuestionGroup;
        }
      }
    }

    return null;
  },
  deleteIeltsReadingQuestion(questionId: string) {
    const testSections = this
      .ieltsReadingQuestions as unknown as IELTSReadingTestSection[];

    // Find the section containing the question
    for (
      let sectionIndex = 0;
      sectionIndex < testSections.length;
      sectionIndex++
    ) {
      const section = testSections[sectionIndex];
      if (section.questions) {
        const questionIndex = section.questions.findIndex(
          (q) => q.id === questionId
        );
        if (questionIndex !== -1) {
          // If this is the only question in the section, remove the entire section
          if (section.questions.length === 1) {
            testSections.splice(sectionIndex, 1);
          } else {
            // Otherwise just remove the specific question group
            section.questions.splice(questionIndex, 1);
          }
          return true;
        }
      }
    }

    return false; // Question not found
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
  getIeltsReadingTestById(testId: string) {
    return this.ieltsReadingTests.find((test) => test.id === testId);
  },
  updateIeltsReadingTest(testId: string, testData: Partial<IELTSReadingTest>) {
    const testIndex = this.ieltsReadingTests.findIndex(
      (test) => test.id === testId
    );

    if (testIndex === -1) {
      return null;
    }

    const updatedTest = {
      ...this.ieltsReadingTests[testIndex],
      ...testData,
      id: testId, // Ensure ID remains the same
      updatedAt: new Date().toISOString(),
    };

    this.ieltsReadingTests[testIndex] = updatedTest;

    return updatedTest;
  },
  deleteIeltsReadingTest(testId: string) {
    const testIndex = this.ieltsReadingTests.findIndex(
      (test) => test.id === testId
    );

    if (testIndex === -1) {
      return false; // Test not found
    }

    // Remove the test from the array
    this.ieltsReadingTests.splice(testIndex, 1);
    return true; // Successfully deleted
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
  getIeltsListeningQuestionById(questionId: string) {
    return this.ieltsListeningQuestions.find((q) =>
      q.questions.some((questionGroup) => questionGroup.id === questionId)
    );
  },
  deleteIeltsListeningQuestion(questionId: string) {
    const questionIndex = this.ieltsListeningQuestions.findIndex((q) =>
      q.questions.some((questionGroup) => questionGroup.id === questionId)
    );

    if (questionIndex === -1) {
      return false; // Question not found
    }

    // Remove the question from the array
    this.ieltsListeningQuestions.splice(questionIndex, 1);
    return true; // Successfully deleted
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
  getIeltsListeningTestById(id: string) {
    return this.ieltsListeningTests.find((test) => test.id === id);
  },
  updateIeltsListeningTest(id: string, testData: Partial<IELTSListeningTest>) {
    const testIndex = this.ieltsListeningTests.findIndex(
      (test) => test.id === id
    );

    if (testIndex === -1) {
      return null;
    }

    const updatedTest = {
      ...this.ieltsListeningTests[testIndex],
      ...testData,
      updatedAt: new Date().toISOString(),
    };

    this.ieltsListeningTests[testIndex] = updatedTest;

    return updatedTest;
  },
  deleteIeltsListeningTest(id: string) {
    const testIndex = this.ieltsListeningTests.findIndex(
      (test) => test.id === id
    );

    if (testIndex === -1) {
      return false;
    }

    this.ieltsListeningTests.splice(testIndex, 1);
    return true;
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
  getIeltsWritingQuestionById(questionId: string) {
    return this.ieltsWritingQuestions.find((q) => q.id === questionId);
  },
  updateIeltsWritingQuestion(
    questionId: string,
    questionData: Partial<IELTSWritingTask>
  ) {
    const questionIndex = this.ieltsWritingQuestions.findIndex(
      (q) => q.id === questionId
    );

    if (questionIndex === -1) {
      return null;
    }

    const updatedQuestion = {
      ...this.ieltsWritingQuestions[questionIndex],
      ...questionData,
      id: questionId, // Ensure ID remains the same
    };

    this.ieltsWritingQuestions[questionIndex] = updatedQuestion;
    return updatedQuestion;
  },
  deleteIeltsWritingQuestion(questionId: string) {
    const questionIndex = this.ieltsWritingQuestions.findIndex(
      (q) => q.id === questionId
    );

    if (questionIndex === -1) {
      return false; // Question not found
    }

    // Remove the question from the array
    this.ieltsWritingQuestions.splice(questionIndex, 1);
    return true; // Successfully deleted
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
  getIeltsWritingTestById(testId: string) {
    return this.ieltsWritingTests.find((test) => test.id === testId);
  },
  updateIeltsWritingTest(testId: string, testData: Partial<IELTSWritingTest>) {
    const testIndex = this.ieltsWritingTests.findIndex(
      (test) => test.id === testId
    );

    if (testIndex === -1) {
      return null;
    }

    const updatedTest = {
      ...this.ieltsWritingTests[testIndex],
      ...testData,
      id: testId, // Ensure ID remains the same
      updatedAt: new Date().toISOString(),
    };

    this.ieltsWritingTests[testIndex] = updatedTest;
    return updatedTest;
  },
  deleteIeltsWritingTest(testId: string) {
    const testIndex = this.ieltsWritingTests.findIndex(
      (test) => test.id === testId
    );

    if (testIndex === -1) {
      return false;
    }

    this.ieltsWritingTests.splice(testIndex, 1);
    return true;
  },

  // ielts exams
  ieltsExams: [...mockIELTSExams],
  createIeltsExam(exam: Partial<ExamModel>) {
    const newExam: ExamModel = {
      ...exam,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as ExamModel;
    this.ieltsExams.push(newExam);
    return newExam;
  },
  getIeltsExams() {
    return this.ieltsExams;
  },
  getIeltsExamById(id: string) {
    return this.ieltsExams.find((exam) => exam.id === id);
  },

  // all exams (multi-type)
  allExams: [...mockAllExams],
  getAllExams() {
    return this.allExams;
  },
  getAllExamsByOrganization(organizationId: string, filters?: ExamFilters) {
    let exams = [...this.allExams];

    // Filter by organization (for now, return all since we don't have org-specific exams in mock)
    // In real implementation, you would filter by organizationId

    // Apply filters
    if (filters) {
      // Filter by exam type
      if (filters.examType && filters.examType !== "all") {
        exams = exams.filter((exam) => exam.type_of_exam === filters.examType);
      }

      // Filter by price
      if (filters.priceFilter && filters.priceFilter !== "all") {
        if (filters.priceFilter === "free") {
          exams = exams.filter((exam) => exam.is_free);
        } else if (filters.priceFilter === "paid") {
          exams = exams.filter((exam) => !exam.is_free);
        }
      }

      // Filter by search query
      if (filters.searchQuery && filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        exams = exams.filter(
          (exam) =>
            exam.title.toLowerCase().includes(query) ||
            exam.description?.toLowerCase().includes(query) ||
            exam.type_of_exam.toLowerCase().includes(query)
        );
      }

      // Sort exams
      const sortBy = filters.sortBy || "created_at";
      const sortOrder = filters.sortOrder || "desc";

      exams.sort((a, b) => {
        let comparison = 0;

        switch (sortBy) {
          case "date":
            const dateA = new Date(
              a?.lrw_group?.exam_date || a.created_at || ""
            );
            const dateB = new Date(
              b?.lrw_group?.exam_date || b.created_at || ""
            );
            comparison = dateA.getTime() - dateB.getTime();
            break;
          case "price":
            comparison = a.price - b.price;
            break;
          case "title":
            comparison = a.title.localeCompare(b.title);
            break;
          case "created_at":
            const createdA = new Date(a.created_at || "");
            const createdB = new Date(b.created_at || "");
            comparison = createdA.getTime() - createdB.getTime();
            break;
          default:
            comparison = 0;
        }

        return sortOrder === "desc" ? -comparison : comparison;
      });
    }

    return exams;
  },
  getAllExamById(id: string) {
    return this.allExams.find((exam) => exam.id === id);
  },
  createAllExam(exam: Partial<ExamModel>) {
    const newExam: ExamModel = {
      ...exam,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as ExamModel;
    this.allExams.push(newExam);
    return newExam;
  },
  updateAllExam(id: string, examData: Partial<ExamModel>) {
    const examIndex = this.allExams.findIndex((exam) => exam.id === id);

    if (examIndex === -1) {
      return null;
    }

    const updatedExam = {
      ...this.allExams[examIndex],
      ...examData,
      id, // Ensure ID remains the same
      updated_at: new Date().toISOString(),
    };

    this.allExams[examIndex] = updatedExam;
    return updatedExam;
  },
  deleteAllExam(id: string) {
    const examIndex = this.allExams.findIndex((exam) => exam.id === id);

    if (examIndex === -1) {
      return false;
    }

    this.allExams.splice(examIndex, 1);
    return true;
  },

  // registered exams
  registeredExams: [...registeredExams],
  getRegisteredExamsByUser(userId: string) {
    return this.registeredExams.filter((exam) => exam.user.id === userId);
  },
  getRegisteredExamById(id: string) {
    return this.registeredExams.find((exam) => exam.id === id);
  },
  createRegisteredExam(exam: Partial<RegisteredExam>) {
    const newExam: RegisteredExam = {
      ...exam,
      id: uuidv4(),
      registered_at: new Date().toISOString(),
    } as RegisteredExam;
    this.registeredExams.push(newExam);
    return newExam;
  },
};

export default mockdb;
