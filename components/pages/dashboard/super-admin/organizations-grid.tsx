import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useAdminOrganizations } from "@/hooks/super-admin/use-admin-organizations";
import { Organization } from "@/types/organization";
import {
  Building,
  Users,
  MoreHorizontal,
  Edit,
  Trash2,
  ExternalLink,
  Star,
  Award,
  Briefcase,
  MessageSquare,
  Share2,
} from "lucide-react";
import { useMemo } from "react";
import { ViewMode } from "./organizations-search";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

// Custom Tag component since we don't have a Badge component
const Tag = ({
  children,
  color = "gray",
}: {
  children: React.ReactNode;
  color?: "indigo" | "purple" | "green" | "yellow" | "gray";
}) => {
  // Map colors to Tailwind classes using theme variables
  const colorClasses = {
    indigo: "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20",
    purple:
      "bg-accent/10 text-accent-foreground border-accent/20 hover:bg-accent/20",
    green: "bg-chart-1/10 text-chart-1 border-chart-1/20 hover:bg-chart-1/20",
    yellow: "bg-chart-4/10 text-chart-4 border-chart-4/20 hover:bg-chart-4/20",
    gray: "bg-muted text-muted-foreground border-muted/50 hover:bg-muted/80",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium border ${colorClasses[color]}`}
    >
      {children}
    </span>
  );
};

// Placeholder data for design purposes
const PLACEHOLDER_DATA = {
  stats: [
    { label: "Employees", value: "2.4K", icon: Users },
    { label: "Projects", value: "150+", icon: Briefcase },
    { label: "Rating", value: "4.9", icon: Star },
    { label: "Awards", value: "12", icon: Award },
  ],
  tags: [
    { label: "Cloud Computing", color: "indigo" as const },
    { label: "AI & ML", color: "purple" as const },
    { label: "SaaS", color: "green" as const },
    { label: "Enterprise", color: "yellow" as const },
  ],
  team: [
    "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
  ],
  descriptions: [
    "Leading the digital transformation with cutting-edge solutions. We specialize in cloud computing, AI integration, and scalable enterprise applications.",
    "Innovative software solutions for businesses of all sizes. Our expert team delivers high-quality products that drive growth and efficiency.",
    "Building tomorrow's technology today. We create software that transforms how businesses operate and connect with their customers.",
    "Strategic digital partner for enterprises seeking competitive advantage through technology innovation and digital transformation.",
  ],
};

interface OrganizationsGridProps {
  viewMode: ViewMode;
  onDeleteOrganization: (organization: Organization) => void;
  onEditOrganization: (organization: Organization) => void;
}

export function OrganizationsGrid({
  viewMode,
  onDeleteOrganization,
  onEditOrganization,
}: OrganizationsGridProps) {
  const { organizations, meta, setPage } = useAdminOrganizations();

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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 py-3 sm:py-4 px-1 sm:px-2 mt-4 sm:mt-6">
        <div className="text-xs sm:text-sm text-muted-foreground bg-muted/20 px-3 py-1.5 rounded-full">
          Showing{" "}
          <span className="font-medium text-foreground">
            {organizations.length}
          </span>{" "}
          of <span className="font-medium text-foreground">{meta.total}</span>{" "}
          organizations
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
  }, [meta, setPage, organizations.length]);

  // Empty state
  if (organizations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 sm:h-64 bg-card/50 rounded-lg border border-border/40 shadow-sm backdrop-blur-sm">
        <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-muted/30 flex items-center justify-center mb-4 shadow-sm">
          <div className="rounded-full bg-background/50 p-4 backdrop-blur-sm">
            <Building className="h-8 w-8 sm:h-10 sm:w-10 text-primary/50" />
          </div>
        </div>
        <h3 className="font-medium text-base sm:text-lg text-primary/90">
          No organizations found
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-2 text-center max-w-xs px-4">
          Try adjusting your search or filters to find what you&apos;re looking
          for.
        </p>
      </div>
    );
  }

  const getRandomPlaceholder = <T extends keyof typeof PLACEHOLDER_DATA>(
    key: T,
    index: number
  ): (typeof PLACEHOLDER_DATA)[T][number] => {
    return PLACEHOLDER_DATA[key][index % PLACEHOLDER_DATA[key].length];
  };

  return (
    <div>
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {organizations.map((organization, index) => (
            <Card
              key={organization.id}
              className="backdrop-blur-[16px] saturate-[180%] bg-card/75 border border-border/30 shadow-xl rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              {/* Header with logo and name */}
              <CardHeader className="pt-8 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      {organization.logo ? (
                        <Image
                          src={organization.logo}
                          alt={organization.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-lg"
                          width={80}
                          height={80}
                        />
                      ) : (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-muted/30 via-muted/50 to-muted/70 flex items-center justify-center shadow-lg">
                          <Building className="h-8 w-8 text-primary/60" />
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-chart-1 rounded-full border-2 border-card"></div>
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-2xl font-bold text-primary">
                        {organization.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {"Innovation-Driven Company"}
                      </p>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-full"
                      >
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="flex items-center cursor-pointer"
                        onClick={() => onEditOrganization(organization)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center cursor-pointer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        <span>View Details</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="flex items-center text-destructive focus:text-destructive cursor-pointer"
                        onClick={() => onDeleteOrganization(organization)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              {/* Stats section */}
              <CardContent className="px-6 py-2">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
                  {PLACEHOLDER_DATA.stats.map((stat, i) => (
                    <div
                      key={i}
                      className="text-center p-2 sm:p-3 bg-muted/50 rounded-xl shadow-sm"
                    >
                      <div className="text-base sm:text-lg font-bold text-primary flex items-center justify-center gap-1">
                        <span>{stat.value}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {organization.description ||
                    getRandomPlaceholder("descriptions", index)}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {PLACEHOLDER_DATA.tags.map((tag, i) => (
                    <Tag key={i} color={tag.color}>
                      {tag.label}
                    </Tag>
                  ))}
                </div>
              </CardContent>

              {/* Team preview */}
              <div className="px-6 py-3 border-t border-border/20">
                <h4 className="text-sm font-medium text-primary mb-3">
                  Team Leaders
                </h4>
                <div className="flex -space-x-3">
                  {PLACEHOLDER_DATA.team.map((avatar, i) => (
                    <Image
                      key={i}
                      src={avatar}
                      className="w-10 h-10 rounded-full border-2 border-card shadow-md hover:z-10 transition-all"
                      alt={`Team member ${i + 1}`}
                      width={40}
                      height={40}
                    />
                  ))}
                  <div className="w-10 h-10 rounded-full bg-muted border-2 border-card flex items-center justify-center text-xs font-medium text-muted-foreground">
                    +12
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <CardFooter className="px-6 py-4 border-t border-border/20 flex gap-2">
                <Button
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 rounded-xl shadow-md hover:shadow-lg"
                  onClick={() => onEditOrganization(organization)}
                >
                  View Organization
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-xl hover:bg-muted/30 transition-all duration-200"
                >
                  <MessageSquare className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-xl hover:bg-muted/30 transition-all duration-200"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        // List view - with updated glass morphism styling
        <div className="flex flex-col gap-2 sm:gap-3">
          {organizations.map((organization, index) => (
            <div
              key={organization.id}
              className="backdrop-blur-[16px] saturate-[180%] bg-card/75 border border-border/30 shadow-xl rounded-xl flex items-stretch p-0 gap-0 transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5 overflow-hidden"
            >
              {/* Logo/Image section */}
              <div className="w-24 sm:w-32 flex-shrink-0 relative overflow-hidden bg-gradient-to-br from-muted/30 via-muted/50 to-muted/70">
                {organization.logo ? (
                  <Image
                    src={organization.logo}
                    alt={organization.name}
                    className="h-full w-full object-cover"
                    fill
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <Building className="h-8 w-8 sm:h-10 sm:w-10 text-primary/60" />
                  </div>
                )}
                <div className="absolute bottom-2 right-2 w-4 h-4 sm:w-5 sm:h-5 bg-chart-1 rounded-full border-2 border-card"></div>
              </div>

              {/* Content section */}
              <div className="flex-grow p-3 sm:p-4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-base sm:text-lg text-primary">
                        {organization.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                        {"Innovation-Driven Company"}
                      </p>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-full"
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="flex items-center cursor-pointer"
                          onClick={() => onEditOrganization(organization)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center cursor-pointer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="flex items-center text-destructive focus:text-destructive cursor-pointer"
                          onClick={() => onDeleteOrganization(organization)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-muted-foreground my-2 line-clamp-2 leading-relaxed">
                    {organization.description ||
                      getRandomPlaceholder("descriptions", index)}
                  </p>

                  {/* Tags */}
                  <div className="hidden sm:flex flex-wrap gap-1.5 my-2">
                    {PLACEHOLDER_DATA.tags.slice(0, 2).map((tag, i) => (
                      <Tag key={i} color={tag.color}>
                        {tag.label}
                      </Tag>
                    ))}
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Team avatars */}
                    <div className="hidden sm:flex -space-x-2">
                      {PLACEHOLDER_DATA.team.slice(0, 3).map((avatar, i) => (
                        <Image
                          key={i}
                          src={avatar}
                          className="w-6 h-6 rounded-full border border-card shadow-sm"
                          alt={`Team member ${i + 1}`}
                          width={24}
                          height={24}
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center text-xs text-muted-foreground gap-1">
                        <Users className="h-3.5 w-3.5" />
                        <span>{organization.users?.length || 0} users</span>
                      </div>
                      <div className="h-1 w-1 rounded-full bg-border"></div>
                      <div className="text-xs text-muted-foreground">
                        Created recently
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs h-7 px-3 hover:bg-muted/30"
                    onClick={() => onEditOrganization(organization)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {paginationControls}
    </div>
  );
}
