import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export interface TestsPaginationProps {
  totalPages: number;
  page: number;
  setPage: (page: number) => void;
}

export function TestsPagination({
  totalPages,
  page,
  setPage,
}: TestsPaginationProps) {
  // Don't show pagination if there's only one page
  if (totalPages <= 1) return null;

  // Calculate visible page numbers
  const getPageNumbers = () => {
    // Always show current page, and at most 5 pages total
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    // Calculate the range of visible pages (excluding page 1 and totalPages which are always shown separately)
    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(totalPages - 1, page + delta);
      i++
    ) {
      range.push(i);
    }

    // Add dots or page numbers as needed
    if (range.length > 0) {
      // Add dots at the start if there's a gap
      if (range[0] > 2) {
        rangeWithDots.push("dots1");
      }

      // Add all pages in range (already excluding page 1 and totalPages)
      for (const i of range) {
        rangeWithDots.push(i);
      }

      // Add dots at the end if needed
      if (range[range.length - 1] < totalPages - 1) {
        rangeWithDots.push("dots2");
      }
    }

    return rangeWithDots;
  };

  const visiblePages = getPageNumbers();

  return (
    <Pagination className="justify-center">
      <PaginationContent>
        {/* Previous page button */}
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

        {/* First page */}
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

        {/* Visible pages */}
        {visiblePages.map((p) => {
          // Show dots
          if (p === "dots1" || p === "dots2") {
            return (
              <PaginationItem key={p.toString()}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          // Skip page 1 and last page as they're handled separately
          if (p === 1 || p === totalPages) {
            return null;
          }

          // Show page number
          return (
            <PaginationItem key={p.toString()}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(p as number);
                }}
                isActive={page === p}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* Last page (if more than 1 page) */}
        {totalPages > 1 && (
          <PaginationItem>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setPage(totalPages);
              }}
              isActive={page === totalPages}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Next page button */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (page < totalPages) setPage(page + 1);
            }}
            className={
              page >= totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
