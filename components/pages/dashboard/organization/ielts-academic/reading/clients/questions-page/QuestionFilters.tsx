import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface QuestionFiltersProps {
  search: string;
  questionType: string;
  sortBy: string;
  sortOrder: string;
  questionTypeOptions: { value: string; label: string }[];
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setQuestionType: (value: string) => void;
  handleSort: (field: "passageTitle" | "questionType" | "createdAt") => void;
  clearFilters: () => void;
  getQuestionTypeLabel: (type: string) => string;
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
  getQuestionTypeLabel,
}: QuestionFiltersProps) {
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by passage title..."
            value={search}
            onChange={handleSearchChange}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={questionType} onValueChange={setQuestionType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              {questionTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="p-2 text-center text-sm font-medium">Sort by</div>
              <DropdownMenuItem onClick={() => handleSort("createdAt")}>
                Date Created{" "}
                {sortBy === "createdAt" && (
                  <span className="ml-2">
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("questionType")}>
                Question Type{" "}
                {sortBy === "questionType" && (
                  <span className="ml-2">
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {(search ||
            questionType !== "all" ||
            sortBy !== "createdAt" ||
            sortOrder !== "desc") && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearFilters}
              title="Clear filters"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      {/* Active filters display */}
      {(search || questionType !== "all") && (
        <div className="flex flex-wrap gap-2">
          {search && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: {search}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  handleSearchChange({
                    target: { value: "" },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
              />
            </Badge>
          )}
          {questionType !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Type: {getQuestionTypeLabel(questionType)}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setQuestionType("all")}
              />
            </Badge>
          )}
        </div>
      )}
    </>
  );
}
