import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface UsersTableSkeletonProps {
  rowCount?: number;
}

export function UsersTableSkeleton({ rowCount = 5 }: UsersTableSkeletonProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border/40 hover:border-border/60 transition-all duration-300 shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[200px] whitespace-nowrap rounded-tl-md">
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead className="hidden md:table-cell">
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead className="w-[80px]">
                <Skeleton className="h-4 w-12" />
              </TableHead>
              <TableHead className="hidden sm:table-cell w-[120px]">
                <Skeleton className="h-4 w-24" />
              </TableHead>
              <TableHead className="w-[60px] rounded-tr-md">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rowCount }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                    <div>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-32 md:hidden" />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-4 w-40" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <Skeleton className="h-8 w-8 rounded-full ml-auto" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 border-t">
        <Skeleton className="h-5 w-40" />
        <div className="flex items-center gap-1">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
}
