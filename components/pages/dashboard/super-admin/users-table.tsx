import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminUsers, SortField } from "@/hooks/super-admin/use-admin-users";
import { Role } from "@/types/role";
import { User } from "@/types/user";
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  ArrowUpDown,
  Shield,
  UserCog,
  Trash2,
  Eye,
  Mail,
  Calendar,
} from "lucide-react";
import { useMemo } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Image from "next/image";
interface UserTableProps {
  onDeleteUser: (user: User) => void;
  onChangeRole: (user: User) => void;
}

export function UsersTable({ onDeleteUser, onChangeRole }: UserTableProps) {
  const {
    users,
    meta,
    sortField,
    sortOrder,
    setSortField,
    setSortOrder,
    setPage,
  } = useAdminUsers();

  // Function to handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Generate sort icon based on current sort state
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortOrder === "asc" ? (
      <ChevronUp className="ml-2 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4" />
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get role display name and styles
  const getRoleDetails = (role: Role) => {
    switch (role) {
      case Role.SUPER_ADMIN:
        return {
          label: "Super Admin",
          icon: <Shield className="h-3 w-3 mr-1" />,
          className: "bg-primary/20 text-primary border border-primary/30",
        };
      case Role.ADMIN:
        return {
          label: "Admin",
          icon: <UserCog className="h-3 w-3 mr-1" />,
          className: "bg-chart-3/20 text-chart-3 border border-chart-3/30",
        };
      case Role.USER:
        return {
          label: "User",
          icon: null,
          className:
            "bg-secondary/50 text-secondary-foreground border border-secondary/30",
        };
      default:
        return {
          label: role,
          icon: null,
          className:
            "bg-secondary/50 text-secondary-foreground border border-secondary/30",
        };
    }
  };

  // Pagination controls
  const paginationControls = useMemo(() => {
    const { page, pages } = meta;

    const pageNumbers = [];
    const maxPageButtons = 5;
    const halfMaxButtons = Math.floor(maxPageButtons / 2);

    let startPage = Math.max(1, page - halfMaxButtons);
    const endPage = Math.min(pages, startPage + maxPageButtons - 1);

    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2">
        <div className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">{users.length}</span> of{" "}
          <span className="font-medium text-foreground">{meta.total}</span>{" "}
          users
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) setPage(page - 1);
                }}
                className={page <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {startPage > 1 && (
              <>
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(1);
                    }}
                    isActive={page === 1}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
                {startPage > 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
              </>
            )}

            {pageNumbers.map((pageNum) => (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(pageNum);
                  }}
                  isActive={page === pageNum}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            ))}

            {endPage < pages && (
              <>
                {endPage < pages - 1 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(pages);
                    }}
                    isActive={page === pages}
                  >
                    {pages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page < pages) setPage(page + 1);
                }}
                className={
                  page >= pages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
  }, [meta, setPage, users.length]);

  return (
    <div className="overflow-hidden rounded-lg border border-border/40 hover:border-border/60 transition-all duration-300 shadow-sm hover:shadow-md">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent">
              <TableHead
                className="cursor-pointer hover:bg-muted/50 transition-colors w-[200px] whitespace-nowrap rounded-tl-md"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  <span className="hidden sm:inline">User</span>
                  <span className="sm:hidden">User</span>
                  {getSortIcon("name")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50 transition-colors hidden md:table-cell"
                onClick={() => handleSort("email")}
              >
                <div className="flex items-center">
                  Email {getSortIcon("email")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50 transition-colors w-[80px]"
                onClick={() => handleSort("role")}
              >
                <div className="flex items-center">
                  Role {getSortIcon("role")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50 transition-colors hidden sm:table-cell w-[120px]"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center">
                  <span className="hidden lg:inline">Created At</span>
                  <span className="lg:hidden">Created At</span>
                  {getSortIcon("createdAt")}
                </div>
              </TableHead>
              <TableHead className="w-[60px] rounded-tr-md">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-32 text-center text-muted-foreground"
                >
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => {
                const roleDetails = getRoleDetails(user.role);
                return (
                  <TableRow
                    key={user.id}
                    className="group hover:bg-card/80 transition-colors"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-muted overflow-hidden flex-shrink-0 shadow-sm relative">
                          {user.avatar ? (
                            <Image
                              src={user.avatar}
                              alt={user.name}
                              className="object-cover"
                              fill
                              sizes="32px"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/20 text-primary text-xs font-medium">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .substring(0, 2)}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium group-hover:text-primary transition-colors">
                            {user.name}
                          </div>
                          <div className="text-xs text-muted-foreground md:hidden">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs ${roleDetails.className} shadow-sm`}
                      >
                        {roleDetails.icon}
                        <span className="truncate max-w-[80px]">
                          {roleDetails.label}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{formatDate(user.createdAt)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-all bg-background/80 hover:bg-background shadow-sm"
                            >
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-[160px]"
                          >
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="flex items-center cursor-pointer">
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View Details</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex items-center cursor-pointer"
                              onClick={() => onChangeRole(user)}
                            >
                              <UserCog className="mr-2 h-4 w-4" />
                              <span>Change Role</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="flex items-center text-destructive focus:text-destructive cursor-pointer"
                              onClick={() => onDeleteUser(user)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {users.length > 0 && paginationControls}
    </div>
  );
}
