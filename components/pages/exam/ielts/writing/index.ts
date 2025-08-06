// Main components
export { default as IELTSWritingTestPage } from "./ielts-writing-test-page";

// Supporting components
export { default as WritingTestOverlay } from "./writing-test-overlay";
export { default as WritingTestHeader } from "./writing-test-header";
export { default as WritingTestSectionHeader } from "./writing-test-section-header";
export { default as WritingTestBottomNav } from "./writing-test-bottom-nav";
export { default as WritingTaskRenderer } from "./writing-task-renderer";
export { default as WritingTestTimer } from "./writing-test-timer";

// New refactored components
export * from "./components";
export { useWritingTestState } from "./hooks/use-writing-test-state";
