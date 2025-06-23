"use client";

import { AlertCircle, CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { useQueryContext } from "../providers/query-context-provider";
import { useQueryStatus } from "../api/query-history";

export default function QueryStatusPanel() {
  const { selectedQuery } = useQueryContext();

  const {
    data: executionInfo,
    isLoading,
    isError,
  } = useQueryStatus(selectedQuery);

  if (!selectedQuery) {
    return (
      <div className="text-muted-foreground p-6 text-sm text-center">
        Status will appear here after you run a query.
      </div>
    )
  }

  if (isLoading) {
    return <div className="p-6 text-sm text-muted-foreground flex items-center gap-2">
      <Loader2 className="w-4 h-4 animate-spin" />Loading query status...
    </div>;
  }

  if (isError || !executionInfo) {
    return <div className="p-6 text-sm text-red-500 flex items-center gap-2">
      <XCircle className="w-4 h-4" /> Failed to load execution status.
    </div>;
  }

  const {
    submittedAt,
    completedAt,
    clusterId,
    clusterInstanceId,
    status,
    duration,
    scannedRows,
    currentStage,
    progress,
    message,
    appLinks,
    error,
  } = executionInfo;

  return (
    <div className="p-6 space-y-4 shadow-sm text-sm">
      <h2 className="text-lg font-semibold">Query Execution Timeline</h2>

      <div className="flex items-start space-x-4">
        {/* Timeline indicator */}
        <div className="flex flex-col items-center pt-1">
          <Clock className="text-muted-foreground h-4 w-4" />
          <div className="w-px h-6 bg-border my-1" />
          {status === "error" ? (
            <AlertCircle className="text-red-500 h-4 w-4" />
          ) : (
            <CheckCircle2 className="text-green-500 h-4 w-4" />
          )}
        </div>

        {/* Timeline details */}
        <div className="flex-1 space-y-6">
          {/* Submission */}
          <div>
            <div className="text-muted-foreground text-xs">{submittedAt}</div>
            <div className="font-medium">Submission</div>
          </div>

          {/* Dynamic status */}
          {status === "success" && (
            <div className="space-y-2 relative -top-[7px] mb-[10px]">
              {/* CompletedAt Timestamp */}
              {completedAt && (
                <div className="text-muted-foreground text-xs">{completedAt}</div>
              )}
              <div className="font-medium">Query Completed</div>
              <div className="space-y-1">
                <div>Duration: <strong>{duration}</strong></div>
                <div>Rows Scanned: <strong>{scannedRows?.toLocaleString()}</strong></div>
              </div>
            </div>
          )}

          {status === "running" && (
            <div className="pace-y-2 relative -top-[10px] mb-[8px]">
              <div className="font-medium">Query is Running</div>
              <div className="space-y-1">
                <div className="w-[300px] mt-2">
                  <Progress
                    className="bg-muted [&>div]:bg-blue-500"
                    value={parseFloat(executionInfo?.progress || "0")} data-state="loading"/>
                </div>
                <div>Current Stage: <strong>{currentStage}</strong></div>
              </div>
            </div>
          )}

          {status === "submitted" && (
            <div className="space-y-2 relative -top-[10px] mb-[8px]">
              <div className="font-medium">Query Submitted</div>
              <div className="text-muted-foreground">{message}</div>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-2 relative -top-[7px] mb-[10px]">
              {/* CompletedAt Timestamp */}
              {completedAt && (
                <div className="text-muted-foreground text-xs">{completedAt}</div>
              )}
              <div className="font-medium">Query Error</div>
              <div className="space-y-1">
                <div>Duration: <strong>{duration}</strong></div>
                <div>Rows Scanned: <strong>{scannedRows?.toLocaleString()}</strong></div>
              </div>
            </div>
          )}

          {/* Cluster Info */}
          <div className="space-y-2">
            <div className="font-medium">Cluster Details</div>
            <div className="space-y-1">
              <div>
                Submitted on Cluster ID:{" "}
                <span className="font-semibold text-blue-600 hover:underline cursor-pointer">
                  {clusterId}
                </span>
              </div>
              <div>
                Cluster Instance ID: <strong>{clusterInstanceId}</strong>
              </div>
              {appLinks.map((link, idx) => (
                <div key={idx}>
                  <span className="font-semibold">{link.label}:</span>{" "}
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {link.href}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Error block */}
          {status === "error" && error && (
            <div className="bg-red-100 border border-red-300 rounded p-3 text-sm text-red-700">
              <div className="font-semibold text-red-800 mb-1">ERROR</div>
              <p>{error.message}</p>
              <div className="mt-2 space-x-4 underline text-blue-700">
                {error.links.map((l, idx) => (
                  <a key={idx} href={l.href}>{l.label}</a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
