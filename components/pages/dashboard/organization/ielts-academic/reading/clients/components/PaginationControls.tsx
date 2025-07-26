"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  return (
    <div className="flex justify-center mt-6">
      <div className="flex flex-wrap justify-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {totalPages <= 7 ? (
          // Show all page numbers if there are 7 or fewer
          Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNum)}
              className="h-8 w-8"
            >
              {pageNum}
            </Button>
          ))
        ) : (
          // Show limited page numbers with ellipsis for larger page counts
          <>
            {/* First page */}
            <Button
              variant={currentPage === 1 ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(1)}
              className="h-8 w-8"
            >
              1
            </Button>

            {/* Ellipsis or page numbers */}
            {currentPage > 3 && <span className="px-2 self-center">...</span>}

            {/* Pages around current page */}
            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
              const pageNum = currentPage > 2 ? currentPage - 1 + i : i + 2;
              return pageNum > 1 && pageNum < totalPages ? (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(pageNum)}
                  className="h-8 w-8"
                >
                  {pageNum}
                </Button>
              ) : null;
            })}

            {/* Ellipsis */}
            {currentPage < totalPages - 2 && (
              <span className="px-2 self-center">...</span>
            )}

            {/* Last page */}
            <Button
              variant={currentPage === totalPages ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(totalPages)}
              className="h-8 w-8"
            >
              {totalPages}
            </Button>
          </>
        )}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
