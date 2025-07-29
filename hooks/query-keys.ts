export const QUERY_KEYS = {
  USER: {
    PROFILE: "user-profile",
    UPDATE_PROFILE: "update-user-profile",
    UPDATE_PASSWORD: "update-user-password",
  },
  ORGANIZATION: {
    BY_ID: (id: number) => ["organization", id],
    LIST: ["organizations"],
    INSTRUCTORS_LIST: "instructors-list",
  },
  SUPER_ADMIN: {
    USERS_LIST: "super-admin-users-list",
    ORGANIZATIONS_LIST: "super-admin-organizations-list",
  },
  IELTS_READING: {
    QUESTIONS: "ielts-reading-questions",
    TESTS: "ielts-reading-tests",
    QUESTION_BY_ID: (id: string) => ["ielts-reading-question", id],
    TEST_BY_ID: (id: string) => ["ielts-reading-test", id],
  },
  IELTS_LISTENING: {
    QUESTIONS: "ielts-listening-questions",
    TESTS: "ielts-listening-tests",
    QUESTION_BY_ID: (id: string) => ["ielts-listening-question", id],
    TEST_BY_ID: (id: string) => ["ielts-listening-test", id],
  },
  IELTS_WRITING: {
    QUESTIONS: "ielts-writing-questions",
    TESTS: "ielts-writing-tests",
    QUESTION_BY_ID: (id: string) => ["ielts-writing-question", id],
    TEST_BY_ID: (id: string) => ["ielts-writing-test", id],
  },
  IELTS_EXAM: {
    LIST: ["ielts-exams"],
    PAGINATED: (page: number, pageSize: number, searchQuery?: string) => [
      "ielts-exams",
      "paginated",
      { page, pageSize, searchQuery: searchQuery || "" },
    ],
    BY_ID: (id: string) => ["ielts-exam", id],
    DETAILS: (id: string) => ["ielts-exam", "details", id],
    BY_ORGANIZATION: (organizationId: string) => [
      "ielts-exams",
      "organization",
      organizationId,
    ],
  },
};
