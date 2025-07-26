import { Button } from "@/components/ui/button";

export interface QuestionTypeOption {
  value: string;
  label: string;
}

export interface QuestionFiltersProps {
  search: string;
  questionType: string;
  sortBy: "taskType" | "createdAt";
  sortOrder: "asc" | "desc";
  questionTypeOptions: QuestionTypeOption[];
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setQuestionType: (value: string) => void;
  handleSort: (field: "taskType" | "createdAt") => void;
  clearFilters: () => void;
}

export function QuestionFilters({
  search,
  questionType,
  sortBy,
  sortOrder,
  questionTypeOptions,
  handleSearchChange,
  setQuestionType,
  handleSort,
  clearFilters,
}: QuestionFiltersProps) {
  return (
    <>
      {/* Search input */}
      <div className="relative">
        <input
          type="text"
          className="w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background 
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Search questions..."
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      {/* Filters and sort options */}
      <div className="flex flex-wrap gap-2">
        <select
          value={questionType}
          onChange={(e) => setQuestionType(e.target.value)}
          className="rounded-md border border-input px-3 py-2 text-sm ring-offset-background 
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {questionTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleSort("taskType")}
        >
          Type {sortBy === "taskType" && (sortOrder === "asc" ? "↑" : "↓")}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleSort("createdAt")}
        >
          Date {sortBy === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}
        </Button>

        <Button variant="outline" size="sm" onClick={clearFilters}>
          Clear
        </Button>
      </div>
    </>
  );
}
