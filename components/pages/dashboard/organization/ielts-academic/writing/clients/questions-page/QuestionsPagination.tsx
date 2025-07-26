import { Button } from "@/components/ui/button";

export interface QuestionsPaginationProps {
  totalPages: number;
  page: number;
  setPage: (page: number) => void;
}

export function QuestionsPagination({
  totalPages,
  page,
  setPage,
}: QuestionsPaginationProps) {
  return (
    <div className="flex justify-center mt-4">
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </Button>
        <div className="flex items-center gap-1 px-2">
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
