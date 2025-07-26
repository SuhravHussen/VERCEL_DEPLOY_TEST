import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FilterX, ChevronDown, ChevronUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface QuestionFiltersProps {
  search: string;
  questionType: string;
  sortBy: "audioTitle" | "questionType" | "createdAt";
  sortOrder: "asc" | "desc";
  questionTypeOptions: { value: string; label: string }[];
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setQuestionType: (value: string) => void;
  handleSort: (field: "audioTitle" | "questionType" | "createdAt") => void;
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
  const renderSortIcon = (
    field: "audioTitle" | "questionType" | "createdAt"
  ) => {
    if (sortBy !== field) return null;
    return sortOrder === "asc" ? (
      <ChevronUp className="h-3 w-3" />
    ) : (
      <ChevronDown className="h-3 w-3" />
    );
  };

  const showClearButton =
    search !== "" ||
    questionType !== "all" ||
    sortBy !== "createdAt" ||
    sortOrder !== "desc";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search audio or questions..."
            value={search}
            onChange={handleSearchChange}
            className="pl-8"
          />
        </div>

        {showClearButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearFilters}
            title="Clear filters"
          >
            <FilterX className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 text-sm">
        <div className="flex-grow">
          <Select value={questionType} onValueChange={setQuestionType}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              {questionTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs font-normal"
          onClick={() => handleSort("audioTitle")}
        >
          <span>Title</span>
          {renderSortIcon("audioTitle")}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs font-normal"
          onClick={() => handleSort("questionType")}
        >
          <span>Type</span>
          {renderSortIcon("questionType")}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs font-normal"
          onClick={() => handleSort("createdAt")}
        >
          <span>Date</span>
          {renderSortIcon("createdAt")}
        </Button>
      </div>
    </div>
  );
}
