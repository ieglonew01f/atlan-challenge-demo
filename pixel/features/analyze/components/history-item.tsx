"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Badge } from "@/components/ui/badge";
import { MoreVertical } from "lucide-react";
import { QueryHistory } from "@/types/query-history";
import React from "react";
import { StatusDot } from "@/components/common/status-dot";

interface HistoryItemProps {
  item: QueryHistory;
  isActive: boolean;
  onSelect: (item: QueryHistory) => void;
  onClone: (item: QueryHistory) => void;
  onDelete: (id: string) => void;
}

export const HistoryItem = ({
  item,
  isActive,
  onSelect,
  onClone,
  onDelete,
}: HistoryItemProps) => {
  return (
    <div
      key={item.id}
      className={`
        rounded p-3 mb-2 transition cursor-pointer relative 
        hover:bg-muted/50
        ${isActive ? "border-l-2 border-blue-500 bg-muted/40" : "border-l-2 bg-muted/30"}
      `}
      onClick={() => onSelect(item)}
    >
      <div className="flex justify-between items-center text-xs font-medium">
        <div className="flex items-center gap-1">
          <StatusDot status={item.status} />
          <span title={item.name} className="text-primary truncate max-w-[150px] block">
            {item.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px]">
            {item.cluster}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hover:opacity-80">
                <MoreVertical className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={4} className="w-32">
              <DropdownMenuItem onClick={() => onClone(item)}>
                Clone
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(item.id)}
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
};
