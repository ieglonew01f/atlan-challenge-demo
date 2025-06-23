"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import HistoryPanel from "./history-panel";
import { QueryContextProvider } from "../providers/query-context-provider";
import QueryPanel from "./query-panel";
import ResultsPanel from "./results-panel";
import { useState } from "react";

export default function Analyze({ queryId }: { queryId?: string }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <QueryContextProvider>
        <div className="h-screen w-full flex bg-muted text-sm overflow-hidden">
          <HistoryPanel queryId={queryId}/>
          <main className="flex-1 flex flex-col">
            <QueryPanel />
            <ResultsPanel />
          </main>
        </div>
      </QueryContextProvider>
    </QueryClientProvider>
  );
}