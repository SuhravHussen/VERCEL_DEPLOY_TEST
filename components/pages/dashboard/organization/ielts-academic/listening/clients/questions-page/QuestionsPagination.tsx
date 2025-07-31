import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface QuestionsPaginationProps {
  totalPages: number;
  page: number;
  setPage: (page: number) => void;
}

export function QuestionsPagination({
  totalPages,
  page,
  setPage,
}: QuestionsPaginationProps) {
  const goToPreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const goToNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];

    // Always show first page
    if (totalPages > 0) {
      pages.push(1);
    }

    // Add ellipsis if needed
    if (page > 3) {
      pages.push("ellipsis1");
    }

    // Show current page and adjacent pages
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      if (i > 1 && i < totalPages) {
        pages.push(i);
      }
    }

    // Add ellipsis if needed
    if (page < totalPages - 2) {
      pages.push("ellipsis2");
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center space-x-2 py-2">
      <Button
        variant="outline"
        size="icon"
        onClick={goToPreviousPage}
        disabled={page === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous page</span>
      </Button>

      {pageNumbers.map((pageNumber, index) => {
        if (pageNumber === "ellipsis1" || pageNumber === "ellipsis2") {
          return (
            <div
              key={`ellipsis-${index}`}
              className="flex items-center justify-center h-9 w-9"
            >
              <span>...</span>
            </div>
          );
        }

        return (
          <Button
            key={`page-${pageNumber}`}
            variant={page === pageNumber ? "default" : "outline"}
            size="icon"
            onClick={() =>
              typeof pageNumber === "number" && setPage(pageNumber)
            }
            className="h-9 w-9"
          >
            {pageNumber}
          </Button>
        );
      })}

      <Button
        variant="outline"
        size="icon"
        onClick={goToNextPage}
        disabled={page === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next page</span>
      </Button>
    </div>
  );
}
