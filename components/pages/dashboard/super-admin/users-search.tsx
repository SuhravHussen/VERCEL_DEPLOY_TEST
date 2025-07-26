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
  useAdminUsers,
  SortField,
  SortOrder,
} from "@/hooks/super-admin/use-admin-users";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState, useEffect } from "react";

export function UsersSearch() {
  const { search, setSearch, setSortField, setSortOrder, setPageSize } =
    useAdminUsers();
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
      <div className="bg-card rounded-md">
        <form
          onSubmit={handleSearch}
          className="relative flex w-full items-center"
        >
          <Search className="absolute left-2 sm:left-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search users..."
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
          <Button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            variant="ghost"
            size="sm"
            className="absolute right-1 sm:right-2"
          >
            <SlidersHorizontal
              className={`h-4 w-4 ${
                showFilters ? "text-primary" : "text-muted-foreground"
              }`}
            />
          </Button>
        </form>
      </div>

      {showFilters && (
        <div className="bg-muted/30 rounded-md p-3 sm:p-4 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 animate-in fade-in-50 duration-300">
          <div className="space-y-1 sm:space-y-2">
            <h3 className="text-xs sm:text-sm font-medium">Sort Order</h3>
            <Select
              defaultValue="createdAt-desc"
              onValueChange={handleSortChange}
            >
              <SelectTrigger className="w-full bg-background text-xs sm:text-sm h-8 sm:h-10">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                <SelectItem value="email-asc">Email (A-Z)</SelectItem>
                <SelectItem value="email-desc">Email (Z-A)</SelectItem>
                <SelectItem value="role-asc">Role (A-Z)</SelectItem>
                <SelectItem value="role-desc">Role (Z-A)</SelectItem>
                <SelectItem value="createdAt-asc">Date (Oldest)</SelectItem>
                <SelectItem value="createdAt-desc">Date (Newest)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1 sm:space-y-2">
            <h3 className="text-xs sm:text-sm font-medium">Items per page</h3>
            <Select defaultValue="10" onValueChange={handlePageSizeChange}>
              <SelectTrigger className="w-full bg-background text-xs sm:text-sm h-8 sm:h-10">
                <SelectValue placeholder="Items per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 items</SelectItem>
                <SelectItem value="10">10 items</SelectItem>
                <SelectItem value="20">20 items</SelectItem>
                <SelectItem value="50">50 items</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
