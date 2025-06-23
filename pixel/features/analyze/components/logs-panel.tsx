import { QueryLogSkeleton } from "@/components/common/query-log-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryContext } from "../providers/query-context-provider";
import { useQueryLogs } from "../api/query-history";

export function LogsPanel() {
  const { selectedQuery } = useQueryContext();

  const {
    data: logs,
    isLoading,
    isFetching,
  } = useQueryLogs(selectedQuery?.id ?? "");

  const showSkeleton = isLoading || isFetching;

  return (
    <div className="overflow-auto flex-1">
      {!selectedQuery ? (
        <div className="text-muted-foreground p-6 text-sm text-center">
          Logs will appear here after you run a query.
        </div>
      ) : showSkeleton ? (
        <QueryLogSkeleton lines={12}></QueryLogSkeleton>
      ) : (
        <div className="bg-muted/50 text-sm font-mono p-4 max-h-[500px] overflow-auto">
          {logs && logs.map((log, i) => {
            const color =
              log.level === "ERROR"
                ? "text-red-400"
                : log.level === "WARN"
                ? "text-yellow-400"
                : "text-blue-400";

            return (
              <div key={i} className={`whitespace-pre-wrap`}>
                <span className={color}>[{log.level}]</span>{" "}
                <span>{log.message}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
