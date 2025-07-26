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
};
