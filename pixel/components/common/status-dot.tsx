import { QueryStatus } from "@/types/query-history";
import React from "react";
import { cn } from "@/lib/utils";

export function StatusDot({ status }: { status: QueryStatus }) {
  const baseDot = "h-2 w-2 rounded-full";

  const colorMap: Record<QueryStatus, string> = {
    success: "bg-green-500",
    error: "bg-red-500",
    queued: "bg-yellow-500",
    running: "bg-blue-500 animate-pulse",
  };

  return <span className={cn(baseDot, colorMap[status])} />;
}
