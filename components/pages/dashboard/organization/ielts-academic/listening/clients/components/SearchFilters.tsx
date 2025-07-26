"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  FilterX,
  GridIcon,
  Search,
  List,
} from "lucide-react";

interface SearchFiltersProps {
  search: string;
  difficulty: string;
  sortBy: "title" | "createdAt";
  sortOrder: "asc" | "desc";
  viewMode: "grid" | "detail";
  hasActiveFilters: boolean;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDifficultyChange: (value: string) => void;
  onSort: (field: "title" | "createdAt") => void;
  onClearFilters: () => void;
  onViewModeChange: (mode: "grid" | "detail") => void;
}

export function SearchFilters({
  search,
  difficulty,
  sortBy,
  sortOrder,
  viewMode,
  hasActiveFilters,
  onSearchChange,
  onDifficultyChange,
  onSort,
  onClearFilters,
  onViewModeChange,
}: SearchFiltersProps) {
  return (
    <div className="border-b pb-4 mb-6">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-auto sm:min-w-[200px] sm:max-w-[220px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search tests..."
            className="pl-9 h-10"
            value={search}
            onChange={onSearchChange}
          />
        </div>

        {/* Difficulty Filter */}
        <div className="w-full sm:w-auto">
          <Select value={difficulty} onValueChange={onDifficultyChange}>
            <SelectTrigger className="w-full sm:w-[160px] h-10">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Sort By */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onSort("title")}
            className={`h-10 ${sortBy === "title" ? "bg-accent" : ""}`}
          >
            Name
            {sortBy === "title" &&
              (sortOrder === "asc" ? (
                <ChevronUp className="ml-1 h-4 w-4" />
              ) : (
                <ChevronDown className="ml-1 h-4 w-4" />
              ))}
          </Button>
          <Button
            variant="outline"
            onClick={() => onSort("createdAt")}
            className={`h-10 ${sortBy === "createdAt" ? "bg-accent" : ""}`}
          >
            Date
            {sortBy === "createdAt" &&
              (sortOrder === "asc" ? (
                <ChevronUp className="ml-1 h-4 w-4" />
              ) : (
                <ChevronDown className="ml-1 h-4 w-4" />
              ))}
          </Button>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="ghost" onClick={onClearFilters} className="h-10">
            <FilterX className="mr-1 h-4 w-4" />
            Clear
          </Button>
        )}

        {/* View Mode Toggle */}
        <div className="flex gap-2 ml-auto">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => onViewModeChange("grid")}
            className="h-10 w-10"
          >
            <GridIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "detail" ? "default" : "outline"}
            size="icon"
            onClick={() => onViewModeChange("detail")}
            className="h-10 w-10"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
