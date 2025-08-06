interface ReadingTestSectionHeaderProps {
  currentSection: number;
  sectionTitle: string;
}

export default function ReadingTestSectionHeader({
  currentSection,
  sectionTitle,
}: ReadingTestSectionHeaderProps) {
  return (
    <div className="bg-background border-b border-border px-3 sm:px-6 lg:px-8 py-2 sm:py-3 flex-shrink-0 w-full">
      <div className="w-full max-w-none">
        <div className="flex items-center justify-between mb-0.5 sm:mb-1">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
            Reading Passage {currentSection}
          </h1>
        </div>
        <p className="text-muted-foreground text-sm sm:text-base">
          {sectionTitle}
        </p>
      </div>
    </div>
  );
}
