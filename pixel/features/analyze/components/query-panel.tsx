"use client";

import { CircleStopIcon, Loader2, Maximize2, Minimize2, PlayIcon } from "lucide-react";
import { useAddQueryToHistory, useSubmitQuery, useUpdateQueryInHistory } from "../api/query-history";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { CopyLinkButton } from "@/components/common/copy-link-button";
import { InlineEditableText } from "@/components/common/inline-editable-text";
import { QueryEditor } from "./editor";
import { QueryHistory } from "@/types/query-history";
import { RuntimeSelector } from "./run-time-selector";
import { SqlAiAnalysisPopover } from "./sql-ai-analysis-popover";
import { useQueryContext } from "../providers/query-context-provider";
import { v4 as uuidv4 } from "uuid";

export default function QueryPanel() {
  const [isMaximized, setIsMaximized] = useState(false);
  const [queryName, setQueryName] = useState("Untitled");
  const [query, setQuery] = useState("");

  const { selectedQuery, setSelectedQuery } = useQueryContext();
  const addQuery = useAddQueryToHistory();
  const { mutate: submitQuery, isPending} = useSubmitQuery();
  const updateQuery = useUpdateQueryInHistory();

  useEffect(() => {
    setQuery(selectedQuery?.query || "");
  }, [selectedQuery]);


  const updateQueryName = (name: string) => {
    setQueryName(name);

    if (selectedQuery) {
      const updatedQueryObj: QueryHistory = {
        ...selectedQuery,
        name,
      };

      updateQuery.mutate({
        id: selectedQuery.id,
        updates: updatedQueryObj,
      });

      setSelectedQuery(updatedQueryObj);
    }
  }

  const cancelQuery = () => {
    alert('query cancelled called ...')
  }

  const runQuery = (queryVal?: string) => {
    if (!queryVal && !query) return;

    if (queryVal) setQuery(queryVal);

    let queryObj = selectedQuery;

    if (!queryObj) {
      const newQueryObj: QueryHistory = {
        id: uuidv4(),
        name: queryName,
        engine: "Hive",
        user: "Alice Zhang",
        date: "23 Jan 2025 05:39",
        query: queryVal || query,
        status: "running",
        resultUUID: "",
        cluster: "Acme Prod 1",
      }

      queryObj = newQueryObj;
      addQuery.mutate(queryObj);
      
      setSelectedQuery(queryObj);
      submitQuery(queryObj);
    } else {
      const updatedQueryObj: QueryHistory = {
        ...queryObj,
        resultUUID: "",
        status: "running",
      };

      updateQuery.mutate({
        id: queryObj.id,
        updates: updatedQueryObj,
      });

      setSelectedQuery(updatedQueryObj);
      submitQuery(updatedQueryObj);
    }

    // simulating query completion
    setTimeout(() => {
      const successQueryObj: QueryHistory = {
        ...queryObj,
        resultUUID: "c1d2e3f4-5678-90ab-cdef-1234567890ab",
        status: "success",
      };

      updateQuery.mutate({
        id: queryObj.id,
        updates: successQueryObj,
      });

      setSelectedQuery(successQueryObj);
    }, 5000);
  };

  return (
    <div className={isMaximized ? "fixed inset-0 z-50 bg-background" : "p-4 border-b border-border bg-background"}>
      <div className="flex items-center justify-between mb-2">
        <InlineEditableText
          value={selectedQuery?.name || queryName}
          onChange={(value) => updateQueryName(value)}
          className="font-medium text-sm"
          inputClassName="font-medium text-sm"
        />

        {/* Right side: runtime + button */}
        <div className="flex items-center gap-2">
          <RuntimeSelector />
          <Button
            variant="ghost"
            size="icon"
            aria-label={isMaximized ? "Minimize" : "Maximize"}
            onClick={() => setIsMaximized(!isMaximized)}
          >
            {isMaximized ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </Button>
          <CopyLinkButton link={`${window.location.host}/analyze/${selectedQuery?.id}/query`} isDisabled={!selectedQuery}/>
          <SqlAiAnalysisPopover query="SELECT * FROM customers WHERE country = 'India' AND last_login > CURRENT_DATE - INTERVAL 30 DAY;" />
        </div>
      </div>

      <QueryEditor
        value={selectedQuery?.query || ""}
        onChange={setQuery}
        isMaximized={isMaximized}
        onRunShortcut={(val: string) => {
          runQuery(val);
        }}
        />
      
      <div className="flex items-center justify-between mt-4">
        {selectedQuery?.status === "running" ? (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={cancelQuery}
          >
            <CircleStopIcon className="h-4 w-4" />
            Cancel
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => runQuery()}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <PlayIcon className="h-4 w-4" />
            )}
            Run
          </Button>
        )}
      </div>
    </div>
  );
}