import React from "react";
import { Input } from "@/components/ui/input";
import { Filter, Search } from "lucide-react";

interface SearchFiltersBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  totalItems: number;
  itemName: string; // e.g., "exam", "question", "test"
  children?: React.ReactNode; // Additional filters
}

export function SearchFiltersBar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
  totalItems,
  itemName,
  children,
}: SearchFiltersBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex items-center gap-4">
        {children}

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {totalItems} {itemName}
            {totalItems !== 1 ? "s" : ""} found
          </span>
        </div>
      </div>
    </div>
  );
}
