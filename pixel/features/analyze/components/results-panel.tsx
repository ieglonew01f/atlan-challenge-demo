"use client";

import { Download, Maximize2, Minimize2 } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useDownloadCsv, useQueryResults } from "../api/query-history";

import { Button } from "@/components/ui/button";
import { CsvResultsTable } from "./csv-results-table";
import { CsvTableSkeleton } from "@/components/common/csv-table-skeleton";
import { LogsPanel } from "./logs-panel";
import QueryStatusPanel from "./query-status-panel";
import { useQueryContext } from "../providers/query-context-provider";
import { useState } from "react";

export default function ResultsPanel() {
  const [isMaximized, setIsMaximized] = useState(false);
  const { selectedQuery } = useQueryContext();
  const { mutate: download, isPending: isDownloading } = useDownloadCsv();

  const {
    data: csvText,
    isLoading,
    isFetching,
  } = useQueryResults(selectedQuery?.resultUUID ?? "");

  const showSkeleton = isLoading || isFetching;

  return (
    <div className={isMaximized ? "fixed inset-0 z-50 bg-background" : "h-full"}>
      <Tabs defaultValue="results" className="w-full h-full flex flex-col bg-background">
        {/* Top tab switch bar */}
        <div className="flex items-center justify-between px-4 border-b border-border">
          <TabsList className="bg-transparent p-0 space-x-8">
            <TabsTrigger
              value="results"
              className="text-sm
                font-medium
                data-[state=active]:border-b-2
                data-[state=active]:border-blue-500
                data-[state=active]:text-black rounded-none">
              Results
            </TabsTrigger>
            <TabsTrigger
              value="status"
              className="text-sm
                font-medium
                data-[state=active]:border-b-2
                data-[state=active]:border-blue-500
                data-[state=active]:text-black rounded-none">
              Status
            </TabsTrigger>
            <TabsTrigger
              value="logs"
              className="text-sm
                font-medium
                data-[state=active]:border-b-2
                data-[state=active]:border-blue-500
                data-[state=active]:text-black rounded-none">
              Logs
            </TabsTrigger>
          </TabsList>

          {/* Icon buttons */}
          <div className="flex items-center gap-3 text-muted-foreground">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Download"
              onClick={() => download(selectedQuery?.id)}
              disabled={isDownloading || !selectedQuery || showSkeleton}
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={isMaximized ? "Minimize" : "Maximize"}
              onClick={() => setIsMaximized(!isMaximized)}
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-auto flex-1">
          <TabsContent value="results">
            {!selectedQuery ? (
              <div className="text-muted-foreground p-6 text-sm text-center">
                Results will appear here after you run a query.
              </div>
            ) : showSkeleton ? (
              <CsvTableSkeleton columns={8} rows={6} />
            ) : selectedQuery.status === "running" ? (
              <div className="text-muted-foreground p-6 text-sm text-center">
                Results will appear when query execution is complete
              </div>
            ) : (
              <CsvResultsTable csvText={csvText ?? ""} pageSize={7} />
            )}
          </TabsContent>

          <TabsContent value="status">
            <QueryStatusPanel />
          </TabsContent>

          <TabsContent value="logs">
            <LogsPanel />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
