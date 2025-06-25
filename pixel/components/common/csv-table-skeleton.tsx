"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Skeleton } from "@/components/ui/skeleton";

interface CsvTableSkeletonProps {
  columns?: number;
  rows?: number;
}

export function CsvTableSkeleton({
  columns = 6,
  rows = 5,
}: CsvTableSkeletonProps) {
  return (
    <div className="w-full px-4 text-sm">
      <div className="border border-border rounded-md overflow-x-auto">
        {/* fixed layout prevents auto-expansion */}
        <Table className="w-full table-fixed">
          <TableHeader>
            <TableRow>
              {Array.from({ length: columns }).map((_, colIdx) => (
                <TableHead key={colIdx} className="break-words whitespace-normal">
                  <Skeleton className="h-4 w-full max-w-[80px]" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, rowIdx) => (
              <TableRow key={rowIdx}>
                {Array.from({ length: columns }).map((_, colIdx) => (
                  <TableCell
                    key={colIdx}
                    className="break-words whitespace-normal"
                  >
                    <Skeleton className="h-4 w-full max-w-[120px]" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
