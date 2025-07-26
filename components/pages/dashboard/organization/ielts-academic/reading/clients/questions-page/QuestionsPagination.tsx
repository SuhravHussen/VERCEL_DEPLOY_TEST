import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
  const renderPaginationItems = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <PaginationItem key={p}>
          <PaginationLink isActive={page === p} onClick={() => setPage(p)}>
            {p}
          </PaginationLink>
        </PaginationItem>
      ));
    }

    const items = [];
    items.push(
      <PaginationItem key={1}>
        <PaginationLink isActive={page === 1} onClick={() => setPage(1)}>
          1
        </PaginationLink>
      </PaginationItem>
    );

    if (page > 4) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    const startPage = Math.max(2, page - 2);
    const endPage = Math.min(totalPages - 1, page + 2);

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink isActive={page === i} onClick={() => setPage(i)}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (page < totalPages - 3) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            isActive={page === totalPages}
            onClick={() => setPage(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <Pagination className="my-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => setPage(Math.max(1, page - 1))}
            className={page === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {renderPaginationItems()}

        <PaginationItem>
          <PaginationNext
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            className={
              page === totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
