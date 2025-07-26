import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowUpDown,
  Search,
  X,
  FilterX,
  Calendar,
  BookOpen,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface TestFiltersProps {
  search: string;
  status: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setStatus: (value: string) => void;
  handleSort: (field: string) => void;
  clearFilters: () => void;
}

export function TestFilters({
  search,
  status,
  sortBy,
  sortOrder,
  handleSearchChange,
  setStatus,
  handleSort,
  clearFilters,
}: TestFiltersProps) {
  const hasActiveFilters = search || status !== "all";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-4">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tests by title or description..."
            className="pl-8"
            value={search}
            onChange={handleSearchChange}
          />
          {search && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-9 px-2"
              onClick={() =>
                handleSearchChange({
                  target: { value: "" },
                } as React.ChangeEvent<HTMLInputElement>)
              }
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
        </div>

        {/* Status filter */}
        <div className="w-full md:w-[150px]">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort options */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "flex items-center gap-1",
              sortBy === "title" && "bg-muted"
            )}
            onClick={() => handleSort("title")}
          >
            <BookOpen className="h-3 w-3" />
            Title
            {sortBy === "title" && (
              <ArrowUpDown
                className={`h-3 w-3 ${sortOrder === "asc" ? "rotate-180" : ""}`}
              />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "flex items-center gap-1",
              sortBy === "createdAt" && "bg-muted"
            )}
            onClick={() => handleSort("createdAt")}
          >
            <Calendar className="h-3 w-3" />
            Date
            {sortBy === "createdAt" && (
              <ArrowUpDown
                className={`h-3 w-3 ${sortOrder === "asc" ? "rotate-180" : ""}`}
              />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "flex items-center gap-1",
              sortBy === "difficulty" && "bg-muted"
            )}
            onClick={() => handleSort("difficulty")}
          >
            <AlertTriangle className="h-3 w-3" />
            Difficulty
            {sortBy === "difficulty" && (
              <ArrowUpDown
                className={`h-3 w-3 ${sortOrder === "asc" ? "rotate-180" : ""}`}
              />
            )}
          </Button>
        </div>
      </div>

      {/* Active filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Filters:</span>

          {search && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search:{" "}
              {search.length > 20 ? `${search.substring(0, 20)}...` : search}
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

          {status !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Status: {status}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setStatus("all")}
              />
            </Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 text-xs"
            onClick={clearFilters}
          >
            <FilterX className="h-3 w-3" />
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
