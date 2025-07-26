"use client";

import React from "react";
import {
  Search,
  Grid,
  List,
  SlidersHorizontal,
  X,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { getDifficultyLabel } from "../utils/testHelpers";

export interface SearchFiltersProps {
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
  const difficultyOptions = [
    { value: "all", label: "All Difficulties" },
    { value: "easy", label: "Easy" },
    { value: "medium", label: "Medium" },
    { value: "hard", label: "Hard" },
  ];

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden md:flex gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tests by title or description..."
            className="pl-9 h-12"
            value={search}
            onChange={onSearchChange}
          />
        </div>
        <Select value={difficulty} onValueChange={onDifficultyChange}>
          <SelectTrigger className="w-[180px] h-12">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            {difficultyOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                onClick={() => onSort("title")}
                className="flex gap-2 items-center h-12"
              >
                Title
                {sortBy === "title" && (
                  <span>
                    {sortOrder === "asc" ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )}
                  </span>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Sort by title{" "}
                {sortBy === "title" &&
                  (sortOrder === "asc" ? "ascending" : "descending")}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                onClick={() => onSort("createdAt")}
                className="flex gap-2 items-center h-12"
              >
                Date
                {sortBy === "createdAt" && (
                  <span>
                    {sortOrder === "asc" ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )}
                  </span>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Sort by creation date{" "}
                {sortBy === "createdAt" &&
                  (sortOrder === "asc" ? "ascending" : "descending")}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {hasActiveFilters && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  onClick={onClearFilters}
                  className="flex gap-2 items-center h-12"
                >
                  <X className="h-4 w-4" />
                  Clear Filters
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clear all filters and sorting</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        <div className="border-l pl-4 ml-2 flex items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-12 w-12"
                  onClick={() => onViewModeChange("grid")}
                >
                  <Grid className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Grid view</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={viewMode === "detail" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-12 w-12"
                  onClick={() => onViewModeChange("detail")}
                >
                  <List className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>List view</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Mobile Search & Filter UI */}
      <div className="md:hidden flex items-center gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tests..."
            className="pl-9 h-12"
            value={search}
            onChange={onSearchChange}
          />
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="relative h-12 w-12"
            >
              <SlidersHorizontal className="h-5 w-5" />
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px] p-4">
            <SheetHeader className="space-y-1">
              <SheetTitle className="text-2xl">Filters & Sorting</SheetTitle>
              <SheetDescription>
                Customize your view of IELTS Reading tests
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6 mt-8">
              <div className="space-y-3">
                <label className="text-sm font-medium">Difficulty Level</label>
                <Select value={difficulty} onValueChange={onDifficultyChange}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficultyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Sort Tests By</label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={sortBy === "title" ? "secondary" : "outline"}
                    className="h-12 justify-start"
                    onClick={() => onSort("title")}
                  >
                    <span className="mr-2">Title</span>
                    {sortBy === "title" && (
                      <span>
                        {sortOrder === "asc" ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        )}
                      </span>
                    )}
                  </Button>

                  <Button
                    variant={sortBy === "createdAt" ? "secondary" : "outline"}
                    className="h-12 justify-start"
                    onClick={() => onSort("createdAt")}
                  >
                    <span className="mr-2">Date</span>
                    {sortBy === "createdAt" && (
                      <span>
                        {sortOrder === "asc" ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        )}
                      </span>
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">View Options</label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    className="h-12 justify-start"
                    onClick={() => onViewModeChange("grid")}
                  >
                    <Grid className="h-4 w-4 mr-2" /> Grid
                  </Button>
                  <Button
                    variant={viewMode === "detail" ? "default" : "outline"}
                    className="h-12 justify-start"
                    onClick={() => onViewModeChange("detail")}
                  >
                    <List className="h-4 w-4 mr-2" /> List
                  </Button>
                </div>
              </div>

              {hasActiveFilters && (
                <Button
                  variant="secondary"
                  className="w-full h-12"
                  onClick={onClearFilters}
                >
                  <X className="h-4 w-4 mr-2" /> Clear All Filters
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active Filters Indicator */}
      {hasActiveFilters && (
        <div className="flex items-center gap-3 mb-6 p-4 bg-muted rounded-lg border">
          <div className="flex-1 flex flex-wrap gap-2">
            {search && (
              <Badge
                variant="secondary"
                className="h-8 px-3 flex gap-2 items-center text-sm"
              >
                Search: {search}
                <X
                  className="h-4 w-4 cursor-pointer hover:text-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSearchChange({
                      target: { value: "" },
                    } as React.ChangeEvent<HTMLInputElement>);
                  }}
                />
              </Badge>
            )}
            {difficulty !== "all" && (
              <Badge
                variant="secondary"
                className="h-8 px-3 flex gap-2 items-center text-sm"
              >
                Difficulty: {getDifficultyLabel(difficulty)}
                <X
                  className="h-4 w-4 cursor-pointer hover:text-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDifficultyChange("all");
                  }}
                />
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-8 px-3 text-sm font-medium"
          >
            Clear All
          </Button>
        </div>
      )}
    </>
  );
}
