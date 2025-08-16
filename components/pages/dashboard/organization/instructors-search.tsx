import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useOrganizationInstructors,
  SortField,
  SortOrder,
} from "@/hooks/organization/use-organization-instructors";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function InstructorsSearch() {
  const searchParams = useSearchParams();
  const organizationSlug = searchParams.get("slug") as string;

  const { search, setSearch, setSortField, setSortOrder, setPageSize } =
    useOrganizationInstructors({ organizationSlug });
  const [searchInput, setSearchInput] = useState(search);
  const [showFilters, setShowFilters] = useState(false);

  // Update the input when the search changes
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    const [field, order] = value.split("-") as [SortField, SortOrder];
    setSortField(field);
    setSortOrder(order);
  };

  // Handle page size change
  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
  };

  // Clear search
  const clearSearch = () => {
    setSearchInput("");
    setSearch("");
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={"Search for instructors"}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchInput && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-10 top-0 h-full px-2 py-0 hover:bg-transparent"
            onClick={clearSearch}
          >
            <X className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Clear</span>
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-0 hover:bg-transparent"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal
            className={`h-4 w-4 transition-colors ${
              showFilters ? "text-primary" : "text-muted-foreground"
            }`}
          />
          <span className="sr-only">
            {showFilters ? "Hide filters" : "Show filters"}
          </span>
        </Button>
      </form>

      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 animate-in slide-in-from-top-2">
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 w-full sm:w-auto">
            <div>
              <Select
                onValueChange={handleSortChange}
                defaultValue="createdAt-desc"
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  <SelectItem value="email-asc">Email (A-Z)</SelectItem>
                  <SelectItem value="email-desc">Email (Z-A)</SelectItem>
                  <SelectItem value="createdAt-asc">Date (Oldest)</SelectItem>
                  <SelectItem value="createdAt-desc">Date (Newest)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select onValueChange={handlePageSizeChange} defaultValue="10">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Items per page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 per page</SelectItem>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="20">20 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
