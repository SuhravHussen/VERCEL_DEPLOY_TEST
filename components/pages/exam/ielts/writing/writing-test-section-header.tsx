interface WritingTestSectionHeaderProps {
  currentTask: "task1" | "task2";
}

export default function WritingTestSectionHeader({
  currentTask,
}: WritingTestSectionHeaderProps) {
  return (
    <div className="bg-muted/30 border-b border-border px-4 sm:px-6 py-2">
      <div className="text-left">
        <h2 className="text-base font-medium text-foreground">
          {currentTask === "task1" ? "Part 1" : "Part 2"}
        </h2>
        <p className="text-sm text-muted-foreground">
          Read the following text and answer the question{" "}
          {currentTask === "task1" ? "1" : "2"}
        </p>
      </div>
    </div>
  );
}
