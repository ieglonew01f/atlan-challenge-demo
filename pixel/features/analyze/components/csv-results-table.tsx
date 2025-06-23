"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import Papa from "papaparse";

interface CsvResultsTableProps {
  csvText: string;
  pageSize?: number;
}

export function CsvResultsTable({ csvText, pageSize = 10 }: CsvResultsTableProps) {
  const [page, setPage] = useState(0); // 0-based index

  const { headers, rows } = useMemo(() => {
    const parsed = Papa.parse<string[]>(csvText, { skipEmptyLines: true });
    const [head, ...body] = parsed.data;
    return {
      headers: head ?? [],
      rows: (body ?? []).filter((r) => r.length > 0),
    };
  }, [csvText]);

  const columns = useMemo<ColumnDef<string[]>[]>(() => {
    return headers.map((header, index) => ({
      accessorFn: (row: string[]) => row[index] ?? "",
      id: header,
      header,
      cell: (info) => info.getValue(),
    }));
  }, [headers]);

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { pagination: { pageIndex: page, pageSize } },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const next = updater({ pageIndex: page, pageSize });
        setPage(next.pageIndex);
      } else {
        setPage(updater.pageIndex);
      }
    },
    manualPagination: false,
    pageCount: Math.ceil(rows.length / pageSize),
  });

  if (headers.length === 0 || rows.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        No data available.
      </div>
    );
  }

  return (
    <div className="ml-4 mr-4 text-sm">
      <div className="border border-border rounded-md overflow-x-auto">
        <Table className="min-w-fit w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center text-sm mt-4">
        <span>
          Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, rows.length)} of {rows.length}
        </span>
        <div className="space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
