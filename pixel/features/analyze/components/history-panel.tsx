"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter, MoreVertical, PlusIcon, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAddQueryToHistory, useDeleteQueryFromHistory, useQueryHistory } from "../api/query-history";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HistoryItemSkeleton } from "./history-item-skeleton";
import { Input } from "@/components/ui/input";
import { QueryHistory } from "@/types/query-history";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StatusDot } from "@/components/common/status-dot";
import { useBreadcrumbContext } from "@/providers/breadcrumb-context-provider";
import { useQueryContext } from "../providers/query-context-provider";
import { v4 as uuidv4 } from "uuid";

export default function HistoryPanel({ queryId }: { queryId?: string }) {
  const { data: queryData, isLoading, isError } = useQueryHistory();
  const { selectedQuery, setSelectedQuery } = useQueryContext();
  const { mutate: deleteQuery } = useDeleteQueryFromHistory();
  const { mutate: addQuery } = useAddQueryToHistory();
  const { setBreadcrumbs } = useBreadcrumbContext();

  const [filters, setFilters] = useState({
    collectionId: "",
    collectionName: "",
    text: "",
  });

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  useEffect(() => {
    if (queryData?.length && queryId) {
      const queryHist = queryData.find((q) => q.id === queryId);
      setSelectedQuery(queryHist || null);
      setBreadcrumbs([
        { label: "Analyze", href: "/analyze/query" },
        { label: "Query", href: "/analyze/query" },
        { label: queryId },
      ]);
    }
  }, [queryData]);

  const filteredData = useMemo(() => {
    if (!queryData) return [];

    return queryData.filter((item) => {
      const idMatch = filters.collectionId
        ? item.id.includes(filters.collectionId)
        : true;
      const nameMatch = filters.collectionName
        ? item.name.toLowerCase().includes(filters.collectionName.toLowerCase())
        : true;
      const textMatch = filters.text
        ? item.query.toLowerCase().includes(filters.text.toLowerCase())
        : true;

      return idMatch && nameMatch && textMatch;
    });
  }, [queryData, filters]);

  const cloneQuery = (query: QueryHistory) => {
    const cloneQueryObj: QueryHistory = {
      ...query,
      id: uuidv4(),
      name: query.name + "_clone",
    }

    addQuery(cloneQueryObj);
    setSelectedQuery(cloneQueryObj);
  }
  
  return (
    <div className="w-[300px] border-r border-border bg-background h-full flex flex-col overflow-hidden">
      {/* Header area */}
      <div className="p-4 border-b border-border space-y-2">
        <Button className="w-full" variant="default" size="sm" onClick={() => setSelectedQuery(null)}>
          <PlusIcon/> New Query
        </Button>

        {/* Search + Filter Row */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search command history"
              className="pl-8 text-sm"
              onChange={(e) => setFilters((prev) => ({ ...prev, collectionName: e.target.value }))}
            />
          </div>

          {/* Filter popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs px-2 relative">
                <Filter className="w-3 h-3 mr-1" />
                {activeFilterCount > 0 && (
                  <Badge className="text-[10px] absolute -top-1 -right-1 px-1.5 py-0 bg-blue-600">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-72 p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-sm">Filter Collections</h4>
              </div>

              <div className="space-y-2 text-sm">
                <Input
                  placeholder="Collection ID"
                  value={filters.collectionId}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, collectionId: e.target.value }))
                  }
                />

                <Input
                  placeholder="Collection Name"
                  value={filters.collectionName}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, collectionName: e.target.value }))
                  }
                />

                <Input
                  placeholder="Text"
                  value={filters.text}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, text: e.target.value }))
                  }
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="text-xs"
                  onClick={() =>
                    setFilters({
                      collectionId: "",
                      collectionName: "",
                      text: "",
                    })
                  }
                >
                  Reset to default
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="text-[11px] text-muted-foreground flex justify-between items-center px-1">
          Showing { filteredData.length } results over last 30 days.
        </div>
      </div>


      <ScrollArea className="flex-1 h-full p-2 overflow-y-auto">
        {/* Loading state */}
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <HistoryItemSkeleton key={idx} />
            ))}
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="text-red-600 text-xs px-2 py-1">
            Failed to load query history. Please try again.
          </div>
        )}

        {filteredData.map((item) => {
          const isActive = selectedQuery?.id === item.id;

          return (
            <div
              key={item.id}
              className={`
                rounded p-3 mb-2 transition cursor-pointer relative 
                hover:bg-muted/50
                ${isActive ? "border-l-2 border-blue-500 bg-muted/40" : "border-l-2 bg-muted/30"}
              `}
              onClick={() => setSelectedQuery(item)}
            >
              <div className="flex justify-between items-center text-xs font-medium">
                <div className="flex items-center gap-1">
                  <StatusDot status={item.status} />
                  <span title={item.name} className="text-primary truncate max-w-[150px] block">{item.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">
                    {item.cluster}
                  </Badge>

                  {/* ... menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="hover:opacity-80">
                        <MoreVertical className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" sideOffset={4} className="w-32">
                      <DropdownMenuItem onClick={() => cloneQuery(item)}>
                        Clone
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => deleteQuery(item.id)}
                        className="text-red-600"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <p className="text-xs mt-1 text-muted-foreground line-clamp-2">{item.query}</p>

              <div className="text-[10px] mt-1 text-muted-foreground italic">
                {item.user} &bull; {item.date}
              </div>
            </div>
          );
        })}
      </ScrollArea>
    </div>
  );
}
