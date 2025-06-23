"use client";

import { CheckCircle, HeartPulse } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Progress } from "@/components/ui/progress";
import { useState } from "react";

const runtimes = [
  { id: "Trino 1x", status: "healthy" },
  { id: "Spark 2x lg", status: "healthy" },
  { id: "Acme Prod 1", status: "healthy" },
  { id: "Acme Prod 2", status: "healthy" },
];

export function RuntimeSelector() {
  const [selected, setSelected] = useState("Acme Prod 1");

  return (
    <div className="flex items-center gap-4">
      <Select value={selected} onValueChange={setSelected}>
        <SelectTrigger className="w-38">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {runtimes.map((r) => (
            <SelectItem key={r.id} value={r.id}>
              <div className="flex items-center gap-2">
                <div className="bg-green-500 w-2 h-2 rounded-full" />
                <span>{r.id}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Health status hover */}
      <Popover>
        <PopoverTrigger asChild>
          <button className="rounded-full p-1 hover:bg-accent text-muted-foreground">
            <HeartPulse className="w-4 h-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="text-xs bg-green-50 text-green-800 border border-green-200 px-3 py-2 rounded">
            Everything looks good.
          </div>

          <div className="mt-3 space-y-1 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Service Status</span>

              <span className="flex gap-4 items-center text-green-600 text-sm">
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Metastore
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Runtime
                </span>
              </span>
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>CPU Usage</span> <span>17.67%</span>
              </div>
              <Progress value={17.67} className="h-1" />

              <div className="flex justify-between text-xs mt-2 mb-1">
                <span>Master Disk Usage</span> <span>60.9%</span>
              </div>
              <Progress value={60.9} className="h-1" />

              <div className="flex justify-between text-xs mt-2 mb-1">
                <span>HMS Heap</span> <span>12.09%</span>
              </div>
              <Progress value={12.09} className="h-1" />

              <div className="flex justify-between text-xs mt-2 mb-1">
                <span>Presto Heap</span> <span>3.97%</span>
              </div>
              <Progress value={3.97} className="h-1" />

              <div className="flex justify-between text-xs mt-2">
                <span>Spot Loss Count</span> <span>0</span>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
