import { Skeleton } from "@/components/ui/skeleton";

export function QueryLogSkeleton({ lines = 10 }: { lines?: number }) {
  // Random widths for message lines
  const widths = Array.from({ length: lines }, () =>
    `${Math.floor(Math.random() * 40)}%`
  );

  return (
    <div className="bg-muted/50 text-sm font-mono rounded-md p-4 space-y-2 max-h-[500px] overflow-auto">
      {widths.map((width, i) => (
        <div key={i} className="flex items-center space-x-2">
          <Skeleton className="h-4 w-[60px] rounded-sm bg-blue-700/60" />
          <Skeleton className="h-4 rounded-sm bg-white/20" style={{ width }} />
        </div>
      ))}
    </div>
  );
}