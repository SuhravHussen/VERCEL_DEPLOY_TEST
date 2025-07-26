"use client";

import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  // Generate pagination items
  const generatePaginationItems = () => {
    // Always show first page, last page, current page, and pages adjacent to current
    const items: React.ReactNode[] = [];

    // Helper function to add a numbered page
    const addPageNumber = (pageNum: number) => {
      items.push(
        <PaginationItem key={`page-${pageNum}`}>
          <PaginationLink
            onClick={() => onPageChange(pageNum)}
            isActive={pageNum === currentPage}
          >
            {pageNum}
          </PaginationLink>
        </PaginationItem>
      );
    };

    // Helper function to add ellipsis
    const addEllipsis = (key: string) => {
      items.push(
        <PaginationItem key={key}>
          <PaginationEllipsis />
        </PaginationItem>
      );
    };

    // Always add page 1
    addPageNumber(1);

    // Logic for showing ellipsis and intermediate pages
    if (currentPage > 3) {
      addEllipsis("ellipsis-1");
    }

    // Pages around current page
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      // Skip if this is page 1 or the last page (we handle those separately)
      if (i === 1 || i === totalPages) continue;
      addPageNumber(i);
    }

    // Add ellipsis before last page if needed
    if (currentPage < totalPages - 2) {
      addEllipsis("ellipsis-2");
    }

    // Always add the last page if there's more than one page
    if (totalPages > 1) {
      addPageNumber(totalPages);
    }

    return items;
  };

  return (
    <Pagination className="mb-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className={
              currentPage === 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>

        {generatePaginationItems()}

        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className={
              currentPage === totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
