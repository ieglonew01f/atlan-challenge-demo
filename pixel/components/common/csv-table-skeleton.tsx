"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { Skeleton } from "@/components/ui/skeleton";

interface CsvTableSkeletonProps {
  columns?: number;
  rows?: number;
}

export function CsvTableSkeleton({ columns = 6, rows = 5 }: CsvTableSkeletonProps) {
  return (
    <div className="ml-4 mr-4 text-sm">
      <div className="border border-border rounded-md overflow-x-auto">
        <Table className="min-w-fit w-full">
          <TableHeader>
            <TableRow>
              {Array.from({ length: columns }).map((_, colIdx) => (
                <TableHead key={colIdx}>
                  <Skeleton className="h-4 w-24" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, rowIdx) => (
              <TableRow key={rowIdx}>
                {Array.from({ length: columns }).map((_, colIdx) => (
                  <TableCell key={colIdx}>
                    <Skeleton className="h-4 w-full max-w-[160px]" />
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
