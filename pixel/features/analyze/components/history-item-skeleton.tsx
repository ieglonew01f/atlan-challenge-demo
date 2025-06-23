import { Skeleton } from "@/components/ui/skeleton";

export function HistoryItemSkeleton() {
  return (
    <div className="bg-muted/30 rounded p-3 mb-2">
      {/* Title row */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Skeleton className="h-2 w-2 rounded-full" /> 
          <Skeleton className="h-4 w-32 rounded" />
        </div>
        <Skeleton className="h-4 w-8 rounded" />
      </div>

      {/* Query preview */}
      <Skeleton className="h-3 w-[90%] mt-2 rounded" />
      <Skeleton className="h-3 w-[70%] mt-1 rounded" />

      {/* Footer (user + date) */}
      <Skeleton className="h-3 w-[50%] mt-3 rounded" />
    </div>
  );
}