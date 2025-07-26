import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAdminOrganizations,
  SortField,
  SortOrder,
} from "@/hooks/super-admin/use-admin-organizations";
import { Search, SlidersHorizontal, X, LayoutGrid, Rows } from "lucide-react";
import { useState, useEffect } from "react";

export type ViewMode = "grid" | "list";

interface OrganizationsSearchProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export function OrganizationsSearch({
  viewMode,
  setViewMode,
}: OrganizationsSearchProps) {
  const { search, setSearch, setSortField, setSortOrder, setPageSize } =
    useAdminOrganizations();
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
    <div className="space-y-3 sm:space-y-4">
      <div className="flex gap-1 sm:gap-2 items-center">
        <div className="bg-card rounded-md flex-1">
          <form
            onSubmit={handleSearch}
            className="relative flex w-full items-center"
          >
            <Search className="absolute left-2 sm:left-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search organizations..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-7 sm:pl-9 pr-10 sm:pr-12 py-4 sm:py-6 rounded-md border-muted bg-background focus-visible:ring-1 focus-visible:ring-primary text-sm sm:text-base"
            />
            {searchInput && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-10 sm:right-16 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="absolute right-2 sm:right-3 text-muted-foreground hover:text-primary p-1 rounded-md transition-colors"
            >
              <SlidersHorizontal
                className={`h-4 w-4 ${
                  showFilters ? "text-primary" : "text-muted-foreground"
                }`}
              />
            </button>
          </form>
        </div>

        <div className="flex rounded-md overflow-hidden border border-border">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1 sm:p-2 ${
              viewMode === "grid"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutGrid className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-1 sm:p-2 ${
              viewMode === "list"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <Rows className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-muted/30 rounded-md p-3 sm:p-4 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 animate-in fade-in-50 duration-300">
          <div className="space-y-1 sm:space-y-2">
            <h3 className="text-xs sm:text-sm font-medium">Sort Order</h3>
            <Select defaultValue="name-asc" onValueChange={handleSortChange}>
              <SelectTrigger className="w-full bg-background text-xs sm:text-sm h-8 sm:h-10">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                <SelectItem value="description-asc">
                  Description (A-Z)
                </SelectItem>
                <SelectItem value="description-desc">
                  Description (Z-A)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1 sm:space-y-2">
            <h3 className="text-xs sm:text-sm font-medium">Items per page</h3>
            <Select defaultValue="6" onValueChange={handlePageSizeChange}>
              <SelectTrigger className="w-full bg-background text-xs sm:text-sm h-8 sm:h-10">
                <SelectValue placeholder="Items per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 items</SelectItem>
                <SelectItem value="6">6 items</SelectItem>
                <SelectItem value="9">9 items</SelectItem>
                <SelectItem value="12">12 items</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
