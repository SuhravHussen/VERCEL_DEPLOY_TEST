"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Filter, SortAsc, SortDesc } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { ExamFilters, ExamType } from "@/types/exam/exam";

interface AllExamsFiltersProps {
  filters: ExamFilters;
  onFiltersChange: (filters: ExamFilters) => void;
  totalCount?: number;
  isLoading?: boolean;
}

const EXAM_TYPE_LABELS: Record<ExamType, string> = {
  [ExamType.IELTS]: "IELTS",
  [ExamType.TOEFL]: "TOEFL",
  [ExamType.GRE]: "GRE",
  [ExamType.SAT]: "SAT",
  [ExamType.GMAT]: "GMAT",
};

const SORT_OPTIONS = [
  { value: "created_at", label: "Created Date" },
  { value: "date", label: "Exam Date" },
  { value: "title", label: "Title" },
  { value: "price", label: "Price" },
];

const PRICE_FILTER_OPTIONS = [
  { value: "all", label: "All Prices" },
  { value: "free", label: "Free Only" },
  { value: "paid", label: "Paid Only" },
];

export function AllExamsFilters({
  filters,
  onFiltersChange,
  totalCount = 0,
  isLoading = false,
}: AllExamsFiltersProps) {
  // Local search state for immediate UI updates
  const [searchInput, setSearchInput] = useState(filters.searchQuery || "");

  // Track when we're manually clearing to prevent debounce override
  const isManuallyClearing = useRef(false);

  // Debounce the search input to avoid excessive API calls
  const debouncedSearch = useDebounce(searchInput, 500);

  const updateFilter = (key: keyof ExamFilters, value: string | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  // Update filters when debounced search value changes
  useEffect(() => {
    // Don't update if we're manually clearing
    if (
      !isManuallyClearing.current &&
      debouncedSearch !== filters.searchQuery
    ) {
      onFiltersChange({
        ...filters,
        searchQuery: debouncedSearch,
      });
    }
    // Reset the manual clearing flag
    isManuallyClearing.current = false;
  }, [debouncedSearch, filters.searchQuery, onFiltersChange, filters]);

  // Sync local search state with filters when they change externally
  useEffect(() => {
    if (!isManuallyClearing.current) {
      setSearchInput(filters.searchQuery || "");
    }
  }, [filters.searchQuery]);

  const clearFilters = () => {
    // Set manual clearing flag if clearing search
    if (filters.searchQuery) {
      isManuallyClearing.current = true;
    }
    onFiltersChange({
      examType: "all",
      priceFilter: "all",
      sortBy: "created_at",
      sortOrder: "desc",
      searchQuery: "",
    });
  };

  const hasActiveFilters =
    filters.examType !== "all" ||
    filters.priceFilter !== "all" ||
    filters.searchQuery ||
    filters.sortBy !== "created_at" ||
    filters.sortOrder !== "desc";

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.examType !== "all") count++;
    if (filters.priceFilter !== "all") count++;
    if (filters.searchQuery) count++;
    if (filters.sortBy !== "created_at" || filters.sortOrder !== "desc")
      count++;
    return count;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground transform -translate-y-1/2" />
          <Input
            placeholder="Search exams..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
            disabled={isLoading}
          />
        </div>

        {/* Quick Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Exam Type Filter */}
          <Select
            value={filters.examType || "all"}
            onValueChange={(value) => updateFilter("examType", value)}
            disabled={isLoading}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Exam Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {Object.values(ExamType).map((type) => (
                <SelectItem key={type} value={type}>
                  {EXAM_TYPE_LABELS[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Price Filter */}
          <Select
            value={filters.priceFilter || "all"}
            onValueChange={(value) => updateFilter("priceFilter", value)}
            disabled={isLoading}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent>
              {PRICE_FILTER_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* More Filters */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-10">
                <Filter className="h-4 w-4 mr-2" />
                Sort & More
                {hasActiveFilters && (
                  <Badge
                    variant="secondary"
                    className="ml-2 h-5 px-1.5 text-xs"
                  >
                    {getActiveFiltersCount()}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Sort & Filter Options</h4>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="h-auto p-1 text-xs"
                    >
                      Clear all
                    </Button>
                  )}
                </div>

                <Separator />

                {/* Sort Options */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort by</label>
                  <div className="flex gap-2">
                    <Select
                      value={filters.sortBy || "created_at"}
                      onValueChange={(value) => updateFilter("sortBy", value)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SORT_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateFilter(
                          "sortOrder",
                          filters.sortOrder === "asc" ? "desc" : "asc"
                        )
                      }
                      className="px-3"
                    >
                      {filters.sortOrder === "asc" ? (
                        <SortAsc className="h-4 w-4" />
                      ) : (
                        <SortDesc className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Filters:</span>

          {filters.examType && filters.examType !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Type: {EXAM_TYPE_LABELS[filters.examType as ExamType]}
              <button
                onClick={() => {
                  onFiltersChange({
                    ...filters,
                    examType: "all",
                  });
                }}
                className="ml-1 hover:bg-muted-foreground/20 rounded-sm p-0.5"
              >
                ×
              </button>
            </Badge>
          )}

          {filters.priceFilter && filters.priceFilter !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Price:{" "}
              {
                PRICE_FILTER_OPTIONS.find(
                  (o) => o.value === filters.priceFilter
                )?.label
              }
              <button
                onClick={() => {
                  onFiltersChange({
                    ...filters,
                    priceFilter: "all",
                  });
                }}
                className="ml-1 hover:bg-muted-foreground/20 rounded-sm p-0.5"
              >
                ×
              </button>
            </Badge>
          )}

          {filters.searchQuery && (
            <Badge variant="secondary" className="gap-1">
              Search: {filters.searchQuery}
              <button
                onClick={() => {
                  // Set manual clearing flag to prevent debounce override
                  isManuallyClearing.current = true;
                  // Clear both local input state and filter
                  setSearchInput("");
                  onFiltersChange({
                    ...filters,
                    searchQuery: "",
                  });
                }}
                className="ml-1 hover:bg-muted-foreground/20 rounded-sm p-0.5"
              >
                ×
              </button>
            </Badge>
          )}

          {(filters.sortBy !== "created_at" ||
            filters.sortOrder !== "desc") && (
            <Badge variant="secondary" className="gap-1">
              Sort:{" "}
              {SORT_OPTIONS.find((o) => o.value === filters.sortBy)?.label} (
              {filters.sortOrder})
              <button
                onClick={() => {
                  onFiltersChange({
                    ...filters,
                    sortBy: "created_at",
                    sortOrder: "desc",
                  });
                }}
                className="ml-1 hover:bg-muted-foreground/20 rounded-sm p-0.5"
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {isLoading
          ? "Loading..."
          : `${totalCount} exam${totalCount !== 1 ? "s" : ""} found`}
      </div>
    </div>
  );
}
