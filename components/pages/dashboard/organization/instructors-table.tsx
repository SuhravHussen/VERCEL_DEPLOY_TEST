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
import {
  useOrganizationInstructors,
  SortField,
} from "@/hooks/organization/use-organization-instructors";
import { User } from "@/types/user";
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  ArrowUpDown,
  Trash2,
  Eye,
  Mail,
  Calendar,
  GraduationCap,
} from "lucide-react";
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
import { useParams } from "next/navigation";

interface InstructorTableProps {
  onDeleteInstructor: (instructor: User) => void;
}

export function InstructorsTable({ onDeleteInstructor }: InstructorTableProps) {
  const params = useParams();
  const organizationId = params.id
    ? parseInt(params.id as string, 10)
    : undefined;

  const {
    instructors,
    meta,
    sortField,
    sortOrder,
    setSortField,
    setSortOrder,
    setPage,
  } = useOrganizationInstructors({ organizationId });

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
                  <span className="hidden sm:inline">Instructor </span>
                  <span className="sm:hidden">Instructor</span>
                  {getSortIcon("name")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50 transition-colors hidden md:table-cell"
                onClick={() => handleSort("email")}
              >
                <div className="flex items-center">
                  Instructor Email {getSortIcon("email")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50 transition-colors hidden sm:table-cell w-[120px]"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center">
                  <span className="hidden lg:inline">Instructor Joined At</span>
                  <span className="lg:hidden">Instructor Joined At</span>
                  {getSortIcon("createdAt")}
                </div>
              </TableHead>
              <TableHead className="w-[60px] rounded-tr-md">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {instructors.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-32 text-center text-muted-foreground"
                >
                  No instructors found
                </TableCell>
              </TableRow>
            ) : (
              instructors.map((instructor) => (
                <TableRow
                  key={instructor.id}
                  className="group hover:bg-card/80 transition-colors"
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      {instructor.avatar ? (
                        <div className="h-8 w-8 rounded-full overflow-hidden border border-border relative">
                          <Image
                            src={instructor.avatar}
                            alt={instructor.name}
                            fill
                            className="object-cover"
                            sizes="32px"
                          />
                        </div>
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                          {instructor.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{instructor.name}</div>
                        <div className="text-xs text-muted-foreground md:hidden">
                          {instructor.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground mr-2" />
                      {instructor.email}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex items-center text-muted-foreground text-sm">
                      <Calendar className="w-3.5 h-3.5 mr-2" />
                      {formatDate(instructor.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            aria-label="Open menu"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuLabel className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" /> Instructor
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer text-destructive focus:text-destructive"
                            onClick={() => onDeleteInstructor(instructor)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {instructors.length > 0 && meta.pages > 1 && (
        <div className="flex items-center justify-center py-4 border-t border-border/50">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className={
                    meta.page <= 1 ? "pointer-events-none opacity-50" : ""
                  }
                  onClick={() => meta.page > 1 && setPage(meta.page - 1)}
                />
              </PaginationItem>

              {/* First page */}
              {meta.page > 2 && (
                <PaginationItem>
                  <PaginationLink onClick={() => setPage(1)}>1</PaginationLink>
                </PaginationItem>
              )}

              {/* Ellipsis if needed */}
              {meta.page > 3 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* Previous page if not first */}
              {meta.page > 1 && (
                <PaginationItem>
                  <PaginationLink onClick={() => setPage(meta.page - 1)}>
                    {meta.page - 1}
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* Current page */}
              <PaginationItem>
                <PaginationLink isActive>{meta.page}</PaginationLink>
              </PaginationItem>

              {/* Next page if not last */}
              {meta.page < meta.pages && (
                <PaginationItem>
                  <PaginationLink onClick={() => setPage(meta.page + 1)}>
                    {meta.page + 1}
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* Ellipsis if needed */}
              {meta.page < meta.pages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* Last page */}
              {meta.page < meta.pages - 1 && (
                <PaginationItem>
                  <PaginationLink onClick={() => setPage(meta.pages)}>
                    {meta.pages}
                  </PaginationLink>
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  className={
                    meta.page >= meta.pages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                  onClick={() =>
                    meta.page < meta.pages && setPage(meta.page + 1)
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
